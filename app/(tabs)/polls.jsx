import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PollsScreen() {
  const router = useRouter();

  const [polls, setPolls] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [newPoll, setNewPoll] = useState({
    question: "",
    options: [{ id: Date.now().toString(), text: "", image: null, votes: 0 }],
  });

  // Load polls from storage
  useEffect(() => {
    const loadPolls = async () => {
      const storedPolls = await AsyncStorage.getItem("polls");
      if (storedPolls) setPolls(JSON.parse(storedPolls));
    };
    loadPolls();
  }, []);

  const savePolls = async (updatedPolls) => {
    setPolls(updatedPolls);
    await AsyncStorage.setItem("polls", JSON.stringify(updatedPolls));
  };

  const handleAddOrEdit = () => {
    if (!newPoll.question.trim()) return;

    if (editingId) {
      const updatedPolls = polls.map((poll) =>
        poll.id === editingId ? { ...newPoll, id: editingId } : poll
      );
      savePolls(updatedPolls);
      setEditingId(null);
    } else {
      const updatedPolls = [
        ...polls,
        { ...newPoll, id: Date.now().toString() },
      ];
      savePolls(updatedPolls);
    }

    setNewPoll({
      question: "",
      options: [{ id: Date.now().toString(), text: "", image: null, votes: 0 }],
    });
  };

  const handleDeletePoll = (id) => {
    const updatedPolls = polls.filter((poll) => poll.id !== id);
    savePolls(updatedPolls);
  };

  const handleEdit = (poll) => {
    setNewPoll({
      question: poll.question,
      options: poll.options.map((opt) => ({ ...opt })),
    });
    setEditingId(poll.id);
  };

  const handleVote = (pollId, optionId) => {
    const updatedPolls = polls.map((poll) =>
      poll.id === pollId
        ? {
            ...poll,
            options: poll.options.map((opt) =>
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            ),
          }
        : poll
    );
    savePolls(updatedPolls);
  };

  const pickOptionImage = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const updatedOptions = [...newPoll.options];
      updatedOptions[index].image = result.assets[0].uri;
      setNewPoll({ ...newPoll, options: updatedOptions });
    }
  };

  const addOption = () => {
    const newOption = {
      id: Date.now().toString(),
      text: "",
      image: null,
      votes: 0,
    };
    setNewPoll({ ...newPoll, options: [...newPoll.options, newOption] });
  };

  const removeOption = (id) => {
    const updatedOptions = newPoll.options.filter((opt) => opt.id !== id);
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  // RENDER ITEM
  const renderItem = ({ item }) => (
    <View style={styles.pollItem}>
      <Text style={styles.pollQuestion}>{item.question}</Text>
      <View style={styles.optionsRow}>
        {item.options.map((opt) => (
          <View key={opt.id} style={styles.optionContainer}>
            {opt.image && (
              <Image source={{ uri: opt.image }} style={styles.optionImage} />
            )}
            <Pressable
              style={styles.voteButton}
              onPress={() => handleVote(item.id, opt.id)}
            >
              <Text style={styles.voteButtonText}>Vote {opt.text}</Text>
            </Pressable>
            <Text style={styles.voteCount}>{opt.votes} vote(s)</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => handleDeletePoll(item.id)}
        >
          <Ionicons name="trash" size={18} color="white" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => router.push("/home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </Pressable>

      <Text style={styles.header}>Polls & Surveys</Text>

      {/* Poll Form */}
      <ScrollView style={styles.form} nestedScrollEnabled>
        <TextInput
          style={styles.input}
          placeholder="Poll Question"
          value={newPoll.question}
          onChangeText={(text) => setNewPoll({ ...newPoll, question: text })}
        />

        {newPoll.options.map((opt, index) => (
          <View key={opt.id} style={styles.optionBlock}>
            <TextInput
              style={styles.input}
              placeholder={`Option ${index + 1}`}
              value={opt.text}
              onChangeText={(text) => {
                const updatedOptions = [...newPoll.options];
                updatedOptions[index].text = text;
                setNewPoll({ ...newPoll, options: updatedOptions });
              }}
            />

            <View style={styles.inlineRow}>
              <Pressable
                style={styles.imageButton}
                onPress={() => pickOptionImage(index)}
              >
                <Text style={styles.imageButtonText}>
                  {opt.image ? "Change Image" : "Pick Image"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => removeOption(opt.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash" size={16} color="white" />
              </Pressable>
            </View>

            {opt.image && (
              <Image source={{ uri: opt.image }} style={styles.optionImage} />
            )}
          </View>
        ))}

        <Pressable style={styles.addOptionButton} onPress={addOption}>
          <Text style={styles.addOptionButtonText}>+ Add Option</Text>
        </Pressable>

        <Pressable style={styles.addButton} onPress={handleAddOrEdit}>
          <Text style={styles.addButtonText}>
            {editingId ? "Update Poll" : "Add Poll"}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Polls List */}
      <FlatList
        style={styles.pollList}
        data={polls}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f5f5f5" },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    alignSelf: "flex-start",
  },
  backButtonText: { color: "#000", marginLeft: 6, fontWeight: "bold" },

  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  form: { marginBottom: 15, maxHeight: 350 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  optionBlock: { marginBottom: 10 },
  inlineRow: { flexDirection: "row", justifyContent: "space-between" },

  imageButton: {
    backgroundColor: "black",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  imageButtonText: { color: "white", fontWeight: "bold", fontSize: 12 },

  addOptionButton: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addOptionButtonText: { fontWeight: "bold", fontSize: 14 },

  addButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },

  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },

  pollList: { flex: 1 },
  pollItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pollQuestion: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },

  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  optionContainer: {
    alignItems: "center",
    margin: 10,
    width: 140,
  },
  optionImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  voteButton: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  voteButtonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  voteCount: { marginTop: 4, color: "#555", fontSize: 12 },

  actions: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  editButton: {
    backgroundColor: "#444",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
