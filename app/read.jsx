import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import Checkbox from "expo-checkbox";

export default function Read() {
  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.introCard}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/cctc_logo.png")} 
            style={styles.logo}
          />
        </View>
        <Text style={styles.appTitle}>VOICE OF CCTC</Text>
        <Text style={styles.appDescription}>
          Welcome to <Text style={{ fontWeight: "bold" }}>VOICE OF CCTC</Text>, a
          student-centered platform where you can{" "}
          <Text style={{ fontStyle: "italic" }}>stay updated</Text> with the
          latest announcements, join polls & surveys, share feedback, and be
          part of our growing CCTC community. 🏫
        </Text>
      </View>

      
      <View style={styles.termsCard}>
        <Text style={styles.termsHeader}>📜 Terms & Privacy Policy</Text>
        <Text style={styles.termsText}>
          By continuing, you agree that you have read and understood our{" "}
          <Text style={{ fontWeight: "bold" }}>Terms of Service</Text> and{" "}
          <Text style={{ fontWeight: "bold" }}>Privacy Policy</Text>.
        </Text>

        <View style={styles.checkboxRow}>
          <Checkbox
            value={isAgreed}
            onValueChange={setIsAgreed}
            color={isAgreed ? "#181818ff" : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.checkboxLabel}>I Agree</Text>
        </View>
      </View>

      
      <Pressable
        style={[
          styles.continueButton,
          { backgroundColor: isAgreed ? "#000000ff" : "#ccc" },
        ]}
        onPress={() => {
          if (isAgreed) router.replace("/home");
        }}
        disabled={!isAgreed}
      >
        <Text style={styles.continueText}>Continue to Home</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f1f3f6",
    padding: 20,
    justifyContent: "center",
  },
  introCard: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoContainer: {
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 50,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 1,
  },
  appDescription: {
    fontSize: 15,
    color: "#ddd",
    textAlign: "center",
    lineHeight: 22,
  },

  termsCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  termsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  termsText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },

  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  continueText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    fontStyle: "italic",
  },
});
