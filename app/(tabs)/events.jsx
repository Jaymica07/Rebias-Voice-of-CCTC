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

const DEFAULT_EVENTS = [
  {
    id: "1",
    title: "Orientation Day",
    date: "Sept 25, 2025",
    description: "Welcome program for all freshmen students.",
  },
  {
    id: "2",
    title: "Intramurals 2025",
    date: "Oct 10-15, 2025",
    description: "Sports fest and cultural activities for all departments.",
  },
  {
    id: "3",
    title: "General Assembly",
    date: "Nov 5, 2025",
    description: "Meeting for all students regarding school updates.",
  },
];

export default function Events() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", date: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Load events from AsyncStorage or set defaults
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const storedEvents = await AsyncStorage.getItem("events");
        if (storedEvents) {
          const parsed = JSON.parse(storedEvents);
          if (parsed.length === 0) {
            setEvents(DEFAULT_EVENTS);
            await AsyncStorage.setItem("events", JSON.stringify(DEFAULT_EVENTS));
          } else {
            setEvents(parsed);
          }
        } else {
          setEvents(DEFAULT_EVENTS);
          await AsyncStorage.setItem("events", JSON.stringify(DEFAULT_EVENTS));
        }
      } catch (error) {
        console.error("Failed to load events", error);
      }
    };
    loadEvents();
  }, []);

  // Save events
  const saveEvents = async (newEvents) => {
    try {
      await AsyncStorage.setItem("events", JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error("Failed to save events", error);
    }
  };

  const handleAddOrEdit = () => {
    const { title, date, description } = form;
    if (!title || !date || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    let newEvents;
    if (editingId) {
      newEvents = events.map((item) =>
        item.id === editingId ? { ...item, title, date, description } : item
      );
      setEditingId(null);
    } else {
      newEvents = [
        ...events,
        { id: Date.now().toString(), title, date, description },
      ];
    }

    saveEvents(newEvents);
    setForm({ title: "", date: "", description: "" });
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      date: item.date,
      description: item.description,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    const newEvents = events.filter((item) => item.id !== id);
    saveEvents(newEvents);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDate}>{item.date}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <View style={styles.cardButtons}>
        <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
          <Ionicons name="pencil" size={20} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back to Home Button */}
      <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backText}>Back to Home</Text>
      </Pressable>

      <Text style={styles.header}>Events</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g., Sept 22, 2025)"
          value={form.date}
          onChangeText={(text) => setForm({ ...form, date: text })}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          placeholderTextColor="#888"
        />
        <Pressable style={styles.addButton} onPress={handleAddOrEdit}>
          <Text style={styles.addButtonText}>
            {editingId ? "Update Event" : "Add Event"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={events}
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
    backgroundColor: "#fff",
    color: "#000",
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
  },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
    fontStyle: "italic",
  },
  cardDate: { fontSize: 14, color: "#555", marginBottom: 8, fontStyle: "italic" },
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
    gap: 10,
  },
  editButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 8,
    borderRadius: 8,
  },
});
