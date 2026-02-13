import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabs from "./MainTabs";
import ContentDetailScreen from "../../../src/screens/App/Tutorial/ContentDetailScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ContentDetail" component={ContentDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
