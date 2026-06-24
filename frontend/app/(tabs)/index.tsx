import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL } from "../../config/api";

type Task = {
  _id: string;
  title: string;
  description: string;
};

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<Task[]>([]);

  const deleteTask = async (id: string) => {
  try {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    // refresh listën pas fshirjes
    setTasks((prev) => prev.filter((task) => task._id !== id));
  } catch (err) {
    console.log("Delete error:", err);
  }
};

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
       renderItem={({ item }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.desc}>{item.description}</Text>

    <TouchableOpacity
      onPress={() => deleteTask(item._id)}
    >
      <Text style={{ color: "red", marginTop: 10 }}>
        Delete
      </Text>
    </TouchableOpacity>
  </View>
)}
      />

      <TouchableOpacity
        style={[styles.button, { bottom: Math.max(insets.bottom, 20) }]}
        onPress={() => router.push("/add-task")}
      >
        <Text style={styles.buttonText}>+ Add Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  desc: {
    color: "#94a3b8",
    marginTop: 5,
  },
  button: {
    position: "absolute",
    right: 20,
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});
