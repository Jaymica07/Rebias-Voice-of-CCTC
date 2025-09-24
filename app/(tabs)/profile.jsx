import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView, 
  Image, 
  Alert 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGoals } from "../../hooks/useGoals";

export default function Profile() {
  const [profilePic, setProfilePic] = useState(null);
  const { user, logout } = useGoals();

  // Change profile picture
  const handleChangeProfilePic = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const newPic = result.assets[0].uri;
        setProfilePic(newPic);
        Alert.alert("✅ Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Error", "Failed to update profile picture.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout(); // clear user in context
    router.replace("/"); // redirect to login
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back to Home button */}
      <Pressable style={styles.backButton} onPress={() => router.push("../home")}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </Pressable>

      <View style={styles.profileSection}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <Ionicons name="person-circle" size={140} color="#000" />
        )}

        <Pressable style={styles.changePicButton} onPress={handleChangeProfilePic}>
          <Text style={styles.changePicText}>
            {profilePic ? "Change Picture" : "Add Picture"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.title}>👤 My Profile</Text>

      {/* Display user info from Firestore */}
      {user ? (
        <>
          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Course</Text>
            <Text style={styles.value}>{user.course}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Year Level</Text>
            <Text style={styles.value}>{user.year}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </>
      ) : (
        <Text style={{ marginTop: 20, fontSize: 16, fontStyle: "italic", color: "gray" }}>
          No user logged in.
        </Text>
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    paddingBottom: 40,
  },
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
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#000",
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  changePicButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  changePicText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontStyle: "italic",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 8,
    width: "90%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#444",
    fontStyle: "italic",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    fontStyle: "italic",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    marginLeft: 8,
  },
});
