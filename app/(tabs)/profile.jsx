import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const loggedInEmail = await AsyncStorage.getItem("loggedInUser");

        if (!loggedInEmail) {
          Alert.alert("Not logged in", "Please log in first.");
          router.replace("/login");
          return;
        }

        const userData = await AsyncStorage.getItem(`user_${loggedInEmail}`);
        if (userData) {
          const parsedUser = JSON.parse(userData);

          setStudent({
            name: parsedUser.name || "Student",
            course: parsedUser.course || "BSIT",
            year: parsedUser.year || "3rd Year",
            email: parsedUser.email || loggedInEmail,
            profilePic: parsedUser.profilePic || null, // no default female photo
          });
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load profile.");
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("loggedInUser");
    router.replace("/login");
  };

  const goToHome = () => {
    router.push("/home");
  };

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

        const loggedInEmail = await AsyncStorage.getItem("loggedInUser");
        if (!loggedInEmail) return;

        const userData = await AsyncStorage.getItem(`user_${loggedInEmail}`);
        let parsedUser = userData ? JSON.parse(userData) : {};

        parsedUser.profilePic = newPic;

        await AsyncStorage.setItem(
          `user_${loggedInEmail}`,
          JSON.stringify(parsedUser)
        );

        setStudent((prev) => ({
          ...prev,
          profilePic: newPic,
        }));

        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile picture.");
    }
  };

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back to Home button */}
      <Pressable style={styles.backButton} onPress={goToHome}>
        <Ionicons name="home" size={20} color="#000" />
        <Text style={styles.backButtonText}>Back to Home</Text>
      </Pressable>

      <View style={styles.profileSection}>
        {student.profilePic ? (
          <Image source={{ uri: student.profilePic }} style={styles.profilePic} />
        ) : (
          <Ionicons name="person-circle" size={140} color="#000" />
        )}

        <Pressable style={styles.changePicButton} onPress={handleChangeProfilePic}>
          <Text style={styles.changePicText}>
            {student.profilePic ? "Change Picture" : "Add Picture"}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.title}>👤 My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{student.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Course</Text>
        <Text style={styles.value}>{student.course}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Year Level</Text>
        <Text style={styles.value}>{student.year}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{student.email}</Text>
      </View>

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
