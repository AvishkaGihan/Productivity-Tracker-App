import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { CustomTabBar } from "../components/navigation";
import AIChatScreen from "../screens/AIChatScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import ContextScreen from "../screens/ContextScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";
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

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStack}
        options={{ title: "Tasks" }}
      />
      <Tab.Screen
        name="AIChat"
        component={AIStack}
        options={{ title: "AI Chat" }}
      />
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
