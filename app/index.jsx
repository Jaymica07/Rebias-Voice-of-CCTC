import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice of CCTC</Text>
      <Text style={styles.subtitle}>Your voice matters. Be heard.</Text>

      <Pressable style={styles.loginButton} onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>Login</Text>
      </Pressable>

      <Pressable
        style={styles.signupButton}
        onPress={() => router.push("/signup")}
      >
        <Text style={styles.signupText}>Signup</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    padding: 30, 
    backgroundColor: "#fff", 
  },
  title: { 
    fontSize: 34, 
    fontWeight: "800", 
    color: "#000", 
    marginBottom: 6,
    letterSpacing: 1,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 60,
    textAlign: "center",
  },
  loginButton: { 
    width: "85%", 
    paddingVertical: 16, 
    borderRadius: 20, 
    alignItems: "center", 
    marginVertical: 10,
    backgroundColor: "#000", 
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  loginText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600",
  },
  signupButton: { 
    width: "85%", 
    paddingVertical: 16, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: "#000", 
    alignItems: "center", 
    marginVertical: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  signupText: { 
    color: "#000", 
    fontSize: 18, 
    fontWeight: "600",
  },
});
