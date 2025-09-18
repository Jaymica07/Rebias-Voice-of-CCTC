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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "announcements";

export default function Announcements() {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    date: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Load announcements when component mounts
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.length > 0) {
            setAnnouncements(parsed);
            return;
          }
        }

        // Default announcements if no stored or empty data
        const defaults = [
          {
            id: "1",
            title: "Class Suspension",
            date: "Sept 21, 2025",
            description: "All classes are suspended due to weather conditions.",
          },
          {
            id: "2",
            title: "Upcoming Exams",
            date: "Sept 28, 2025",
            description: "Midterm examinations will start next week.",
          },
          {
            id: "3",
            title: "Meetings",
            date: "Sept 25, 2025",
            description: "Faculty meeting will be held in the auditorium.",
          },
        ];

        setAnnouncements(defaults);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      }
    };

    loadAnnouncements();
  }, []);

  // Save announcements whenever it changes
  useEffect(() => {
    const saveAnnouncements = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
      } catch (error) {
        console.error("Failed to save announcements:", error);
      }
    };
    saveAnnouncements();
  }, [announcements]);

  // Add or Edit
  const handleAddOrEdit = () => {
    const { title, date, description } = newAnnouncement;
    if (!title || !date || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (editingId) {
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, title, date, description } : item
        )
      );
      setEditingId(null);
    } else {
      const id = Date.now().toString();
      setAnnouncements((prev) => [...prev, { id, ...newAnnouncement }]);
    }

    setNewAnnouncement({ title: "", date: "", description: "" });
  };

  // Edit
  const handleEdit = (item) => {
    setNewAnnouncement({
      title: item.title,
      date: item.date,
      description: item.description,
    });
    setEditingId(item.id);
  };

  // Delete
  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
  };

  // Render each announcement
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <View style={styles.cardButtons}>
        <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
          <Ionicons name="pencil" size={20} color="white" />
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>

      {/* Header */}
      <Text style={styles.header}>Announcements</Text>

      {/* Add/Edit Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={newAnnouncement.title}
          onChangeText={(text) =>
            setNewAnnouncement({ ...newAnnouncement, title: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g., Sept 20, 2025)"
          value={newAnnouncement.date}
          onChangeText={(text) =>
            setNewAnnouncement({ ...newAnnouncement, date: text })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newAnnouncement.description}
          onChangeText={(text) =>
            setNewAnnouncement({ ...newAnnouncement, description: text })
          }
        />
        <Pressable style={styles.addButton} onPress={handleAddOrEdit}>
          <Text style={styles.addButtonText}>
            {editingId ? "Update Announcement" : "Add Announcement"}
          </Text>
        </Pressable>
      </View>

      {/* Announcements List */}
      <FlatList
        data={announcements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
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
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "flex-start",
  },
  backText: {
    color: "#000",
    marginLeft: 8,
    fontWeight: "bold",
    fontSize: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginTop: 10,
    fontStyle: "italic",
  },

  form: { marginTop: 20 },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000",
    fontStyle: "italic",
  },
  addButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#000",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
    color: "#000",
    fontStyle: "italic",
  },
  cardDate: { fontSize: 14, color: "#555", marginBottom: 10, fontStyle: "italic" },
  cardDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    fontStyle: "italic",
  },

  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#444",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: { backgroundColor: "#d9534f", padding: 8, borderRadius: 8 },
});
