import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import AIChatScreen from "../screens/AIChatScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import ContextScreen from "../screens/ContextScreen";
import DashboardScreen from "../screens/DashboardScreen";
import TaskListScreen from "../screens/TaskListScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="DashboardHome"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
    </Stack.Navigator>
  );
}

function TaskStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="TaskHome"
        component={TaskListScreen}
        options={{ title: "Tasks" }}
      />
    </Stack.Navigator>
  );
}

function AIStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="AIHome"
        component={AIChatScreen}
        options={{ title: "AI Assistant" }}
      />
    </Stack.Navigator>
  );
}

function AnalyticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="AnalyticsHome"
        component={AnalyticsScreen}
        options={{ title: "Analytics" }}
      />
    </Stack.Navigator>
  );
}

function ContextStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="ContextHome"
        component={ContextScreen}
        options={{ title: "Goals & Notes" }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.primary,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = "home";
          if (route.name === "Dashboard") iconName = "home";
          else if (route.name === "Tasks") iconName = "checkbox-marked-outline";
          else if (route.name === "AI") iconName = "robot";
          else if (route.name === "Analytics") iconName = "chart-line";
          else if (route.name === "Context") iconName = "target";

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={{ title: "Tasks" }}
      />
      <Tab.Screen name="AI" component={AIStack} options={{ title: "AI" }} />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsStack}
        options={{ title: "Analytics" }}
      />
      <Tab.Screen
        name="Context"
        component={ContextStack}
        options={{ title: "Context" }}
      />
    </Tab.Navigator>
  );
}
