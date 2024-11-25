import { View, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import the Report component from the existing report page
import Report from "../report";

export default function ReportsPage() {
  React.useEffect(() => {
    checkReportExists();
  }, []);

  const checkReportExists = async () => {
    try {
      const reportMetrics = await AsyncStorage.getItem("reportMetrics");
      if (!reportMetrics) {
        // If no report exists, redirect to the camera
        router.push("/camera");
      }
    } catch (error) {
      console.error("Error checking report:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Report />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
  },
});
