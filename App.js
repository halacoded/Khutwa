import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigation from "./src/navigations/RootNavigation";
import { StatusBar } from "expo-status-bar";
import UserContext from "./src/context/UserContext";
import { getToken } from "./src/apis/storage";
import { getMe } from "./src/apis/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export default function App() {
  const [user, setUser] = useState(false);
  const queryClient = new QueryClient();
  const checkToken = async () => {
    const token = await getToken();

    if (token) {
      try {
        const profile = await getMe();
        setUser(profile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error.message);
        setUser(false);
      }
    } else {
      setUser(false);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);
  console.log(user);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryClientProvider>
    </UserContext.Provider>
  );
}
