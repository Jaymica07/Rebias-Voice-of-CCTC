import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useGoals } from "../hooks/useGoals";

export default function Login() {
  const router = useRouter();
  const { login } = useGoals();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      setEmail("");
      setPassword("");
      router.replace("/read");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
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

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/signup")}>
        <Text style={styles.link}>
          Don’t have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20, fontStyle: "italic" },
  input: { width: 260, height: 48, borderColor: "#000", borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, color: "#000", fontStyle: "italic" },
  button: { backgroundColor: "#000", paddingVertical: 14, width: 260, borderRadius: 14, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600", fontStyle: "italic" },
  link: { color: "#000", fontStyle: "italic", fontSize: 16, textAlign: "center" },
  linkHighlight: { fontWeight: "bold", textDecorationLine: "underline", fontStyle: "italic", color: "#000" },
});
