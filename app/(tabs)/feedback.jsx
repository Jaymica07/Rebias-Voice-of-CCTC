import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const STORAGE_KEY = "feedback_list";

const DEFAULT_FEEDBACKS = [
  {
    id: "1",
    name: "Ana Villanueva",
    message: "The school event last week was very organized, kudos to the team!",
  },
  {
    id: "2",
    name: "Mark Bautista",
    message: "I like how the app makes it easy to check announcements.",
  },
  {
    id: "3",
    name: "Sophia Ramos",
    message: "Please add more updates about upcoming school programs.",
  },
  {
    id: "4",
    name: "John Perez",
    message: "The app is fast and simple to use, very student-friendly.",
  },
  {
    id: "5",
    name: "Claire Santos",
    message: "I enjoyed the sports fest! Hoping for more photos in the app soon.",
  },
];

export default function Feedback() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [editingId, setEditingId] = useState(null);

  // Load feedbacks
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const storedFeedbacks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedFeedbacks && JSON.parse(storedFeedbacks).length > 0) {
          setFeedbacks(JSON.parse(storedFeedbacks));
        } else {
          setFeedbacks(DEFAULT_FEEDBACKS);
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_FEEDBACKS)
          );
        }
      } catch (error) {
        console.error("Failed to load feedbacks:", error);
      }
    };
    loadFeedbacks();
  }, []);

  // Save changes
  useEffect(() => {
    const saveFeedbacks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
      } catch (error) {
        console.error("Failed to save feedbacks:", error);
      }
    };
    if (feedbacks.length >= 0) saveFeedbacks();
  }, [feedbacks]);

  const handleAddOrEdit = () => {
    const { name, message } = form;
    if (!name || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (editingId) {
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, name, message } : item
        )
      );
      setEditingId(null);
    } else {
      const newFeedback = { id: Date.now().toString(), name, message };
      setFeedbacks((prev) => [...prev, newFeedback]);
    }
    setForm({ name: "", message: "" });
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, message: item.message });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setFeedbacks((prev) => prev.filter((item) => item.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackName}>{item.name}</Text>
      <Text style={styles.feedbackText}>{item.message}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.iconButton} onPress={() => handleEdit(item)}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </Pressable>
        <Pressable
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );

  const handleBack = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    } catch (error) {
      console.error("Failed to save feedbacks before going back:", error);
    }
    router.push("/home");
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>

      <Text style={styles.header}>Feedback</Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#aaa"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Your Feedback"
          placeholderTextColor="#aaa"
          value={form.message}
          multiline
          onChangeText={(text) => setForm({ ...form, message: text })}
        />
        <Pressable style={styles.submitButton} onPress={handleAddOrEdit}>
          <Text style={styles.submitButtonText}>
            {editingId ? "Update Feedback" : "Submit Feedback"}
          </Text>
        </Pressable>
      </View>

      {/* Feedback List */}
      <FlatList
        data={feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#000",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 15,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
  },

  form: { marginTop: 10 },
  input: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  feedbackItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  feedbackName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  iconButton: {
    backgroundColor: "#333",
    padding: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#e63946",
    padding: 6,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
