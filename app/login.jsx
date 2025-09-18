import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      Alert.alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const existingUser = await AsyncStorage.getItem(`user_${trimmedEmail}`);

      if (!existingUser) {
        setError("User does not exist. Please sign up.");
        Alert.alert("User does not exist", "Please sign up first.");
        return;
      }

      const user = JSON.parse(existingUser);

      if (user.password !== password) {
        setError("Your Password is Incorrect");
        Alert.alert("Your Password is Incorrect");
        return;
      }

      await AsyncStorage.setItem("loggedInUser", trimmedEmail);
      setEmail("");
      setPassword("");
      setError("");
      router.replace("/read");
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
        secureTextEntry
        placeholderTextColor="#666"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      
      <Pressable onPress={() => router.push("/signup")}>
        <Text style={styles.link}>
          Don't have an account?{" "}
          <Text style={styles.linkHighlight}>Sign Up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    fontStyle: "italic",
  },
  input: {
    width: 260,
    height: 48,
    backgroundColor: "#fff",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#000",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    width: 260,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "italic",
  },
  error: {
    color: "#b00020",
    marginBottom: 8,
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "center",
  },
  link: {
    color: "#000",
    fontStyle: "italic",
    fontSize: 16,
    textAlign: "center",
  },
  linkHighlight: {
    fontWeight: "bold",
    textDecorationLine: "underline", // ✅ underline Sign Up
    fontStyle: "italic",
    color: "#000",
  },
});
