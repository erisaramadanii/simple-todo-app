import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../config/api";

export default function AddTask() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setError("");
      setIsSaving(true);

      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Task could not be saved");
        return;
      }

      router.back();
    } catch (err) {
      console.log("Save task error:", err);
      setError("Could not connect to the server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: "Add Task",
          headerStyle: {
            backgroundColor: "#0f172a", 
          },
          headerTintColor: "#3b82f6", 
        }} 
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Add Task</Text>

            <TextInput
              placeholder="Title"
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              returnKeyType="next"
            />

            <TextInput
              placeholder="Description"
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.buttonText}>{isSaving ? "Saving..." : "Save"}</Text>
            </TouchableOpacity>
          </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 12,
    color: "white",
    marginBottom: 12,
  },
  textArea: {
    height: 120,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  error: {
    color: "#f87171",
    marginBottom: 12,
  },
});
