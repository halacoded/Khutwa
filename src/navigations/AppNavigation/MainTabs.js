import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View } from "react-native";

// Screens
import HomeScreen from "../../../src/screens/App/Home/HomeScreen";
import ReportScreen from "../../../src/screens/App/Report/ReportScreen";
import CameraScreen from "../../../src/screens/App/Camera/CameraScreen";
import TutorialScreen from "../../../src/screens/App/Tutorial/TutorialScreen";
import SettingsScreen from "../../../src/screens/App/Settings/SettingsScreen";

// Icons
import homeIcon from "../../../assets/Nav-icons/homeIcon.png";
import chartIcon from "../../../assets/Nav-icons/chartIcon.png";
import settingIcon from "../../../assets/Nav-icons/settingIcon.png";
import bookIcon from "../../../assets/Nav-icons/bookIcon.png";
import Camera from "../../../assets/Nav-icons/Camera.png";

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          display: route.name === "Camera" ? "none" : "flex", // Hide tab bar on Camera screen
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
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
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#007AFF",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Image
                source={Camera}
                style={{
                  width: 28,
                  height: 28,
                  tintColor: "#FFFFFF",
                }}
                resizeMode="contain"
              />
            </View>
          ),
          tabBarLabel: () => null,
          headerShown: false,
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
