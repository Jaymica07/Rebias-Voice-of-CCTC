import { useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>V O I C E  O F  C C T C</Text>

      <View style={styles.grid}>
        
        <Pressable style={styles.card} onPress={() => router.push("/announcements")}>
          <Ionicons name="megaphone-outline" size={32} color="#131213ff" />
          <Text style={styles.cardText}>Announcements</Text>
        </Pressable>

       
        <Pressable style={styles.card} onPress={() => router.push("/feedback")}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#040404ff" />
          <Text style={styles.cardText}>Feedback</Text>
        </Pressable>

        
        <Pressable style={styles.card} onPress={() => router.push("/events")}>
          <Ionicons name="calendar-outline" size={32} color="#000000ff" />
          <Text style={styles.cardText}>Events</Text>
        </Pressable>

       
        <Pressable style={styles.card} onPress={() => router.push("/polls")}>
          <Ionicons name="bar-chart-outline" size={32} color="#000000ff" />
          <Text style={styles.cardText}>Polls & Surveys</Text>
        </Pressable>

        
        <Pressable style={styles.card} onPress={() => router.push("/profile")}>
          <Ionicons name="person-circle-outline" size={32} color="#000000ff" />
          <Text style={styles.cardText}>Profile</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    alignItems: "center", 
    paddingVertical: 40, 
    backgroundColor: "#fff",
  },
  title: { 
    fontSize: 26, 
    fontWeight: "600", 
    marginBottom: 30, 
    textAlign: "center", 
    color: "#000000ff", 
    fontStyle: "italic",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  card: {
  width: "40%",
  backgroundColor: "#ffffffff",
  padding: 20,
  borderRadius: 16,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  borderWidth: 1,  
  borderColor: "black",  
},
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000ff",
    fontStyle: "italic",
  },
});
