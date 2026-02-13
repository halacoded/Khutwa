import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigation from "./AuthNavigation/AuthNavigation";
import AppNavigator from "./AppNavigation/AppNavigator"; // Import AppNavigator instead of MainTabs
import UserContext from "../context/UserContext";

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Use AppNavigator which contains both MainTabs and ContentDetail
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigation} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
