import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here
  });
  const [isRevenueCatInitialized, setIsRevenueCatInitialized] = useState(false);

  useEffect(() => {
    async function initializeRevenueCat() {
      if (Platform.OS === "ios") {
        await Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_RC_IOS as string,
        });
      }
      setIsRevenueCatInitialized(true);
    }

    initializeRevenueCat();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isRevenueCatInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isRevenueCatInitialized]);

  if (!fontsLoaded || !isRevenueCatInitialized) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
