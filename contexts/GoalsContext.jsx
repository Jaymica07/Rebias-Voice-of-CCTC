import { createContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { Alert } from "react-native";

export const GoalsContext = createContext();

export function GoalsProvider({ children }) {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // ---------- AUTH ----------
  async function signup({ name, course, year, email, password, confirmPassword }) {
    if (!name || !course || !year || !email || !password || !confirmPassword) {
      Alert.alert("⚠️ Missing Fields", "Please fill all fields.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("⚠️ Password Error", "Passwords do not match.");
      return false;
    }

    try {
      const newUser = {
        name,
        course,
        year,
        email: email.trim().toLowerCase(),
        password, // ⚠️ Plaintext only for demo
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, "users"), newUser);
      setUser({ id: docRef.id, ...newUser });
      Alert.alert("✅ Success", "Signup successful! Please login.");
      return true;
    } catch (error) {
      console.error("Firestore Signup Error:", error);
      Alert.alert("❌ Error", error.message);
      return false;
    }
  }

  async function login(email, password) {
    if (!email || !password) {
      Alert.alert("⚠️ Missing Fields", "Please enter email and password.");
      return false;
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", trimmedEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert("❌ Error", "User does not exist. Please sign up first.");
        return false;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      if (userData.password !== password) {
        Alert.alert("❌ Error", "Incorrect password.");
        return false;
      }

      setUser({ id: userDoc.id, ...userData });
      return true;
    } catch (error) {
      console.error("Firestore Login Error:", error);
      Alert.alert("❌ Error", error.message);
      return false;
    }
  }

  function logout() {
    setUser(null);
    Alert.alert("👋 Logged out", "You have been logged out successfully.");
    return true;
  }

  // ---------- POLLS ----------
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "polls"), (snapshot) => {
      setPolls(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  async function savePoll(newPoll, editingId) {
    try {
      if (!user) {
        Alert.alert("⚠️ Login Required", "You must be logged in to create a poll.");
        return;
      }

      if (editingId) {
        const pollRef = doc(db, "polls", editingId);
        const snap = await getDocs(
          query(collection(db, "polls"), where("__name__", "==", editingId))
        );

        if (!snap.empty && snap.docs[0].data().ownerId !== user.id) {
          Alert.alert("🚫 Not Allowed", "You can only edit your own polls.");
          return;
        }

        await updateDoc(pollRef, newPoll);
        Alert.alert("✅ Success", "Poll updated!");
      } else {
        await addDoc(collection(db, "polls"), {
          ...newPoll,
          ownerId: user.id, // store poll owner
          voters: [],
          createdAt: new Date(),
        });
        Alert.alert("✅ Success", "Poll added!");
      }
    } catch (err) {
      console.error("Poll Save Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  async function deletePoll(id) {
    try {
      if (!user) {
        Alert.alert("⚠️ Login Required", "You must be logged in.");
        return;
      }

      const snap = await getDocs(query(collection(db, "polls"), where("__name__", "==", id)));
      if (snap.empty) {
        Alert.alert("❌ Error", "Poll not found.");
        return;
      }

      const pollData = snap.docs[0].data();
      if (pollData.ownerId !== user.id) {
        Alert.alert("🚫 Not Allowed", "You can only delete your own polls.");
        return;
      }

      await deleteDoc(doc(db, "polls", id));
      Alert.alert("🗑️ Deleted", "Poll removed successfully.");
    } catch (err) {
      console.error("Poll Delete Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  async function votePoll(pollId, optionId) {
    try {
      if (!user) {
        Alert.alert("⚠️ Login Required", "You must be logged in to vote.");
        return;
      }

      const poll = polls.find((p) => p.id === pollId);
      if (!poll) return;

      const voters = poll.voters || [];
      const existingVote = voters.find((v) => v.userId === user.id);

      let updatedOptions = [...poll.options];
      let updatedVoters = [...voters];

      if (existingVote) {
        if (existingVote.optionId === optionId) {
          updatedOptions = updatedOptions.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes - 1 } : opt
          );
          updatedVoters = updatedVoters.filter((v) => v.userId !== user.id);
          Alert.alert("🗑️ Vote Removed", "You have removed your vote.");
        } else {
          updatedOptions = updatedOptions.map((opt) => {
            if (opt.id === existingVote.optionId)
              return { ...opt, votes: opt.votes - 1 };
            if (opt.id === optionId) return { ...opt, votes: opt.votes + 1 };
            return opt;
          });
          updatedVoters = updatedVoters.map((v) =>
            v.userId === user.id ? { userId: user.id, optionId } : v
          );
          Alert.alert("✅ Vote Updated", "Your vote has been changed!");
        }
      } else {
        updatedOptions = updatedOptions.map((opt) =>
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        );
        updatedVoters.push({ userId: user.id, optionId });
        Alert.alert("✅ Vote Submitted", "Your vote has been recorded!");
      }

      const pollRef = doc(db, "polls", pollId);
      await updateDoc(pollRef, { options: updatedOptions, voters: updatedVoters });
    } catch (err) {
      console.error("Poll Vote Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  // ---------- FEEDBACKS ----------
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "feedbacks"), (snapshot) => {
      setFeedbacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  async function addFeedback(newFeedback) {
    try {
      if (!user) {
        Alert.alert("⚠️ Login Required", "You must be logged in to submit feedback.");
        return;
      }

      await addDoc(collection(db, "feedbacks"), {
        ...newFeedback,
        ownerId: user.id, // ✅ store feedback ownerId
        createdAt: new Date(),
      });
      Alert.alert("✅ Success", "Feedback submitted!");
    } catch (err) {
      console.error("Feedback Add Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  async function updateFeedback(id, updatedData) {
    try {
      const feedbackRef = doc(db, "feedbacks", id);
      const snap = await getDocs(query(collection(db, "feedbacks"), where("__name__", "==", id)));

      if (snap.empty) {
        Alert.alert("❌ Error", "Feedback not found.");
        return;
      }

      const feedbackData = snap.docs[0].data();
      if (feedbackData.ownerId !== user?.id) {
        Alert.alert("🚫 Not Allowed", "You can only update your own feedback.");
        return;
      }

      await updateDoc(feedbackRef, updatedData);
      Alert.alert("✅ Success", "Feedback updated!");
    } catch (err) {
      console.error("Feedback Update Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  async function deleteFeedback(id) {
    try {
      const feedbackRef = doc(db, "feedbacks", id);
      const snap = await getDocs(query(collection(db, "feedbacks"), where("__name__", "==", id)));

      if (snap.empty) {
        Alert.alert("❌ Error", "Feedback not found.");
        return;
      }

      const feedbackData = snap.docs[0].data();
      if (feedbackData.ownerId !== user?.id) {
        Alert.alert("🚫 Not Allowed", "You can only delete your own feedback.");
        return;
      }

      await deleteDoc(feedbackRef);
      Alert.alert("🗑️ Deleted", "Feedback removed successfully.");
    } catch (err) {
      console.error("Feedback Delete Error:", err);
      Alert.alert("❌ Error", err.message);
    }
  }

  useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
    setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
  return unsubscribe;
}, []);

async function saveEvent(eventData, editingId) {
  try {
    if (!user) {
      Alert.alert("⚠️ Login Required", "You must be logged in to create an event.");
      return;
    }

    if (editingId) {
      const eventRef = doc(db, "events", editingId);
      const snap = await getDocs(
        query(collection(db, "events"), where("__name__", "==", editingId))
      );

      if (!snap.empty && snap.docs[0].data().ownerId !== user.id) {
        Alert.alert("🚫 Not Allowed", "You can only edit your own events.");
        return;
      }

      await updateDoc(eventRef, eventData);
      Alert.alert("✅ Success", "Event updated!");
    } else {
      await addDoc(collection(db, "events"), {
        ...eventData,
        ownerId: user.id, // store event owner
        createdAt: new Date(),
      });
      Alert.alert("✅ Success", "Event added!");
    }
  } catch (err) {
    console.error("Event Save Error:", err);
    Alert.alert("❌ Error", err.message);
  }
}

async function deleteEvent(id) {
  try {
    if (!user) {
      Alert.alert("⚠️ Login Required", "You must be logged in.");
      return;
    }

    const snap = await getDocs(query(collection(db, "events"), where("__name__", "==", id)));
    if (snap.empty) {
      Alert.alert("❌ Error", "Event not found.");
      return;
    }

    const eventData = snap.docs[0].data();
    if (eventData.ownerId !== user.id) {
      Alert.alert("🚫 Not Allowed", "You can only delete your own events.");
      return;
    }

    await deleteDoc(doc(db, "events", id));
    Alert.alert("🗑️ Deleted", "Event removed successfully.");
  } catch (err) {
    console.error("Event Delete Error:", err);
    Alert.alert("❌ Error", err.message);
  }
}

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "announcements"), (snapshot) => {
    setAnnouncements(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
  return unsubscribe;
}, []);

async function saveAnnouncement(data, editingId) {
  try {
    if (!user) {
      Alert.alert("⚠️ Login Required", "You must be logged in to post an announcement.");
      return;
    }

    if (editingId) {
      const ref = doc(db, "announcements", editingId);
      const snap = await getDocs(
        query(collection(db, "announcements"), where("__name__", "==", editingId))
      );

      if (!snap.empty && snap.docs[0].data().ownerId !== user.id) {
        Alert.alert("🚫 Not Allowed", "You can only edit your own announcements.");
        return;
      }

      await updateDoc(ref, data);
      Alert.alert("✅ Success", "Announcement updated!");
    } else {
      await addDoc(collection(db, "announcements"), {
        ...data,
        ownerId: user.id,
        createdAt: new Date(),
      });
      Alert.alert("✅ Success", "Announcement added!");
    }
  } catch (err) {
    console.error("Announcement Save Error:", err);
    Alert.alert("❌ Error", err.message);
  }
}

async function deleteAnnouncement(id) {
  try {
    if (!user) {
      Alert.alert("⚠️ Login Required", "You must be logged in.");
      return;
    }

    const snap = await getDocs(query(collection(db, "announcements"), where("__name__", "==", id)));
    if (snap.empty) {
      Alert.alert("❌ Error", "Announcement not found.");
      return;
    }

    const data = snap.docs[0].data();
    if (data.ownerId !== user.id) {
      Alert.alert("🚫 Not Allowed", "You can only delete your own announcements.");
      return;
    }

    await deleteDoc(doc(db, "announcements", id));
    Alert.alert("🗑️ Deleted", "Announcement removed successfully.");
  } catch (err) {
    console.error("Announcement Delete Error:", err);
    Alert.alert("❌ Error", err.message);
  }
}

  return (
    <GoalsContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        // polls
        polls,
        savePoll,
        deletePoll,
        votePoll,
        // feedbacks
        feedbacks,
        addFeedback,
        updateFeedback,
        deleteFeedback,
        //events
        events,       // ✅ add this
      saveEvent,    // ✅ add this
      deleteEvent, 
        //announce
      announcements,         // ✅ add this
    saveAnnouncement,      // ✅ add this
    deleteAnnouncement, 
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}
