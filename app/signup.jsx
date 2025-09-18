import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !course || !year || !email || !password || !confirmPassword) {
      Alert.alert("⚠️ Missing Fields", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("⚠️ Password Error", "Passwords do not match.");
      return;
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const existingUser = await AsyncStorage.getItem(`user_${trimmedEmail}`);

      if (existingUser !== null) {
        Alert.alert("⚠️ Account Exists", "User already exists. Please log in.");
        return;
      }

      const userData = {
        name,
        course,
        year,
        email: trimmedEmail,
        password,
        profilePic: "https://randomuser.me/api/portraits/women/44.jpg", 
      };

      await AsyncStorage.setItem(`user_${trimmedEmail}`, JSON.stringify(userData));

      Alert.alert("Success", "Signup successful! Please login.");
      router.replace("/login");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Course (e.g. BSIT)"
        value={course}
        onChangeText={setCourse}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Year Level (e.g. 3rd Year)"
        value={year}
        onChangeText={setYear}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#666"
      />

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
    fontStyle: "italic",
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: "#ffffff",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#000000",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    width: 260,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
  },
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    color: "#000000",
    fontSize: 16,
    fontStyle: "italic",
  },
  loginLink: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 16,
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
