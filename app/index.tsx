import { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import WelcomePage from "./welcome";
import useRevenueCat from "@/hooks/useRevenueCat";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import storage from "@/services/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { isProMember, customerInfo } = useRevenueCat();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        //await AsyncStorage.clear();
        // Wait for customerInfo to be loaded
        if (customerInfo === null) {
          console.log("CustomerInfo is null, waiting...");
          return;
        }

        console.log("CustomerInfo loaded:", customerInfo);
        console.log("Is Pro Member:", isProMember);

        // Check if user has completed onboarding
        const userData = await storage.getUserData();
        console.log("User data:", userData);

        if (isProMember && userData) {
          console.log("Redirecting to dashboard...");
          // If pro member and has completed onboarding, redirect to dashboard
          router.replace("/(dashboard)/reports");
        } else {
          console.log("Not redirecting because:", {
            isProMember,
            hasUserData: !!userData,
          });
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      }
    };

    checkUserStatus();
  }, [isProMember, customerInfo]);

  // Show loading while checking subscription status
  if (customerInfo === null) {
    return <LoadingOverlay message="Loading your profile..." />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WelcomePage />
    </View>
  );
}
