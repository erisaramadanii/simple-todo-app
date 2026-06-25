import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

export type TaskStatus = "completed" | "not_completed";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status?: TaskStatus;
  completed?: boolean;
  createdAt?: string;
};

type TaskCardProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (id: string) => void;
};

const getStatus = (task: Task): TaskStatus => {
  if (task.status === "completed" || task.completed) {
    return "completed";
  }

  return "not_completed";
};

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

export function normalizeTask(task: Task): Task {
  const status = getStatus(task);

  return {
    ...task,
    status,
    completed: status === "completed",
  };
}

export function TaskCard({
  task,
  onToggle,
  onDelete,
  onOpenDetails,
}: TaskCardProps) {
  const status = getStatus(task);
  const isCompleted = status === "completed";

  return (
    <View style={styles.card}>
      <Pressable onPress={() => onToggle(task)} style={styles.row}>
        <View style={styles.circleButton}>
          <View style={[styles.circle, isCompleted && styles.circleDone]}>
            {isCompleted && <Text style={styles.check}>OK</Text>}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, isCompleted && styles.titleDone]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.desc}>{task.description}</Text>
          ) : null}
          <Text style={styles.date}>Created: {formatDate(task.createdAt)}</Text>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onOpenDetails(task._id)}>
          <Text style={styles.details}>Details</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(task._id)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  circleButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -8,
    marginLeft: -10,
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  circleDone: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  check: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#cbd5e1",
  },
  desc: {
    color: "#94a3b8",
    marginTop: 5,
  },
  date: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
    marginTop: 12,
  },
  details: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  delete: {
    color: "#f87171",
    fontWeight: "600",
  },
});
