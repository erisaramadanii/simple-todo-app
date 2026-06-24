import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
          height: 65,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#64748b",
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home",
          // 2. Shto funksionin e ikonës këtu:
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}