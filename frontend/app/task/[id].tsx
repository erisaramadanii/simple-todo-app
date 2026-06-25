import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../config/api";
import { normalizeTask, type Task } from "../../components/TaskCard";

const formatDate = (date?: string) => {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${API_URL}/tasks/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Task not found");
          return;
        }

        setTask(normalizeTask(data));
      } catch (err) {
        console.log("Task details error:", err);
        setError("Could not load task details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Task Details",
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#3b82f6",
        }}
      />

      {isLoading ? (
        <ActivityIndicator color="#3b82f6" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : task ? (
        <View style={styles.card}>
          <Text style={styles.label}>Title</Text>
          <Text style={styles.title}>{task.title}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>
            {task.description || "No description"}
          </Text>

          <Text style={styles.label}>Status</Text>
          <Text style={styles.text}>
            {task.status === "completed" ? "Completed" : "Not completed"}
          </Text>

          <Text style={styles.label}>Created date</Text>
          <Text style={styles.text}>{formatDate(task.createdAt)}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 8,
  },
  label: {
    color: "#3b82f6",
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 5,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  text: {
    color: "#cbd5e1",
    fontSize: 16,
  },
  error: {
    color: "#f87171",
  },
});
