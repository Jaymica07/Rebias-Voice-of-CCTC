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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGoals } from "../../hooks/useGoals";

export default function Feedback() {
  const router = useRouter();
  const { user, feedbacks, addFeedback, updateFeedback, deleteFeedback } = useGoals();

  const [form, setForm] = useState({ name: "", message: "" });
  const [editingId, setEditingId] = useState(null);

  const handleAddOrEdit = async () => {
    const { name, message } = form;
    if (!name || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await updateFeedback(editingId, { name, message });
        setEditingId(null);
      } else {
        await addFeedback({ name, message });
      }
      setForm({ name: "", message: "" });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save feedback.");
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, message: item.message });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteFeedback(id);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to delete feedback.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.feedbackName}>{item.name}</Text>
      <Text style={styles.feedbackText}>{item.message}</Text>

      {/* ✅ Only show edit/delete if current user is owner */}
      {item.ownerId === user?.id && (
        <View style={styles.actions}>
          <Pressable style={styles.iconButton} onPress={() => handleEdit(item)}>
            <Ionicons name="pencil" size={18} color="#fff" />
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={18} color="#fff" />
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </Pressable>

      <Text style={styles.title}>💬 Student Feedback</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Your Feedback"
        value={form.message}
        multiline
        onChangeText={(text) => setForm({ ...form, message: text })}
      />

      <Pressable style={styles.addButton} onPress={handleAddOrEdit}>
        <Text style={styles.addButtonText}>
          {editingId ? "Update Feedback" : "Submit Feedback"}
        </Text>
      </Pressable>

      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20, width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 20 },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
    fontStyle: "italic",
    marginLeft: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  feedbackItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  feedbackName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  feedbackText: { fontSize: 14, marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  iconButton: { backgroundColor: "#000000ff", padding: 8, borderRadius: 6 },
  deleteButton: { backgroundColor: "#dc3545", padding: 8, borderRadius: 6 },
});
