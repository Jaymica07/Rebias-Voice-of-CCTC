import { useState } from "react";
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
import { useGoals } from "../../hooks/useGoals";

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { announcements, saveAnnouncement, deleteAnnouncement, user } = useGoals();

  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const handleAddOrEdit = async () => {
    const { title, date, description } = form;
    if (!title || !date || !description) {
      Alert.alert("⚠️ Error", "Please fill all fields");
      return;
    }

    await saveAnnouncement(
      {
        title,
        date,
        description,
      },
      editingId
    );

    setForm({ title: "", date: "", description: "" });
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      date: item.date,
      description: item.description,
    });
    setEditingId(item.id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>

      {/* Show edit/delete only if current user is the owner */}
      {item.ownerId === user?.id && (
        <View style={styles.cardButtons}>
          <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
            <Ionicons name="pencil" size={20} color="#fff" />
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => deleteAnnouncement(item.id)}
          >
            <Ionicons name="trash" size={20} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back to Home */}
      <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>

      <Text style={styles.header}>Announcements</Text>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g., Sept 24, 2025)"
          value={form.date}
          onChangeText={(text) => setForm({ ...form, date: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
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
  backText: { color: "#000", marginLeft: 8, fontWeight: "bold", fontSize: 16 },

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
    backgroundColor: "#fff",
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
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 4, color: "#000" },
  cardDate: { fontSize: 14, color: "#555", marginBottom: 8 },
  cardDescription: { fontSize: 16, color: "#333", lineHeight: 22 },

  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },
  editButton: { backgroundColor: "#333", padding: 8, borderRadius: 8 },
  deleteButton: { backgroundColor: "#d9534f", padding: 8, borderRadius: 8 },
});
