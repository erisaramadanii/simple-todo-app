import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL } from "../../config/api";
import { TaskCard, normalizeTask, type Task } from "../../components/TaskCard";

type Filter = "all" | "completed" | "not_completed";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("not_completed");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();

      setTasks(data.map(normalizeTask));
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const toggleTask = async (task: Task) => {
    const isCompleted = task.status === "completed" || task.completed;
    const newStatus = isCompleted ? "not_completed" : "completed";
    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id
          ? { ...t, status: newStatus, completed: newStatus === "completed" }
          : t
      )
    );

    try {
      const res = await fetch(`${API_URL}/tasks/${task._id}/toggle`, {
        method: "PATCH",
      });
      const updated = await res.json();

      if (!res.ok) {
        setTasks(previousTasks);
        console.log("Toggle error:", updated.message);
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? normalizeTask(updated) : t))
      );
    } catch (err) {
      setTasks(previousTasks);
      console.log("Toggle error:", err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const status = task.status ?? "not_completed";
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "all") return true;

    return status === filter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <TextInput
        placeholder="Search by title"
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilter("not_completed")}>
          <Text
            style={[
              styles.filterText,
              filter === "not_completed" && styles.active,
            ]}
          >
            To Do
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("completed")}>
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.active,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={[styles.filterText, filter === "all" && styles.active]}>
            All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptyText}>
              Add a task or change the search/filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleTask} onDelete={deleteTask} />
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
  searchInput: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    color: "white",
    marginBottom: 14,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 90,
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
  filterRow: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 15,
  },
  filterText: {
    color: "white",
    fontSize: 16,
  },
  active: {
    color: "#3b82f6",
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 90,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "#94a3b8",
    marginTop: 6,
  },
});
