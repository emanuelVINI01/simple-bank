import { Tabs } from "expo-router";
import { Bell, Home, KeyRound, List, Send, User } from "lucide-react-native";
import { AuthenticatedShell } from "@/components/app/AuthenticatedShell";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/tokens";
import { useNotificationPreference } from "@/hooks/use-notification-preference";

export default function TabsLayout() {
  const notifications = useNotificationPreference();

  return (
    <AuthenticatedShell notificationsEnabled={notifications.enabled}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surfaceDeep,
            borderTopColor: colors.card,
            borderTopWidth: 1,
            height: spacing.tabBarHeight,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.purple,
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="transfer"
          options={{
            title: "Transferir",
            tabBarIcon: ({ color, size }) => <Send size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Extrato",
            tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="keys"
          options={{
            title: "Chaves",
            tabBarIcon: ({ color, size }) => <KeyRound size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            title: "Notificacoes",
            tabBarIcon: ({ color, size }) => <Bell size={size} color={color} />,
          }}
        />
      </Tabs>
    </AuthenticatedShell>
  );
}
