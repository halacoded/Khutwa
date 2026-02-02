import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

// Screens
import HomeScreen from "../../../src/screens/App/Home/HomeScreen";
import ReportScreen from "../../../src/screens/App/Report/ReportScreen";
import CameraScreen from "../../../src/screens/App/Camera/CameraScreen";
import TutorialScreen from "../../../src/screens/App/Tutorial/TutorialScreen";
import SettingsScreen from "../../../src/screens/App/Settings/SettingsScreen";

// Icons
import homeIcon from "../../../assets/Nav-icons/homeIcon.png";
import chartIcon from "../../../assets/Nav-icons/chartIcon.png"; // Health Report
import settingIcon from "../../../assets/Nav-icons/settingIcon.png"; // Reused for Camera + Settings
import bookIcon from "../../../assets/Nav-icons/bookIcon.png"; // Tutorial

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={homeIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007AFF" : "#8E8E93",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Health Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={chartIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007AFF" : "#8E8E93",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={settingIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007AFF" : "#8E8E93",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tutorial"
        component={TutorialScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={bookIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007AFF" : "#8E8E93",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={settingIcon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#007AFF" : "#8E8E93",
              }}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
