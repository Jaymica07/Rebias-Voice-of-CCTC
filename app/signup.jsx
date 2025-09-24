import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useGoals } from "../hooks/useGoals"

export default function Signup() {
  const router = useRouter();
  const { signup } = useGoals()

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    const success = await signup({ name, course, year, email, password, confirmPassword });
    if (success) {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Course (e.g. BSIT)" value={course} onChangeText={setCourse} placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Year Level (e.g. 3rd Year)" value={year} onChangeText={setYear} placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#666" />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholderTextColor="#666" />

      <Pressable style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 20, fontStyle: "italic" },
  input: { width: 260, height: 48, borderColor: "#000", borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, color: "#000", fontStyle: "italic" },
  button: { backgroundColor: "#000", paddingVertical: 14, width: 260, borderRadius: 14, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600", fontStyle: "italic" },
  loginContainer: { flexDirection: "row" },
  loginText: { color: "#000", fontSize: 16, fontStyle: "italic" },
  loginLink: { color: "#000", fontWeight: "bold", fontSize: 16, fontStyle: "italic", textDecorationLine: "underline" },
});
