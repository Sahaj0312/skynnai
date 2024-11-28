import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import ReportCard from "../components/Report";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
import { generateReport } from "@/services/ai";
import { storage } from "@/services/storage";
import * as FileSystem from "expo-file-system";
export default function ReportScreen() {
  const [name, setName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<any>("");
  useEffect(() => {
    loadUserDataAndAi();
  }, []);

  const loadUserDataAndAi = async () => {
    try {
      const userData = await storage.getUserData();
      if (userData) {
        const { name, photoUri } = userData;
        setName(name || "");
        setPhotoUri(photoUri || "");
        if (photoUri) {
          const base64 = await FileSystem.readAsStringAsync(photoUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const report = await generateReport(base64);
          console.log(report);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ReportCard
        name={name}
        photoUri={photoUri}
        skinScore={{ value: 73, status: "Fair" }}
        hydration={{ value: 27, status: "Fair" }}
        oilBalance={{ value: 34, status: "Fair" }}
        skinTone={{ value: 45, status: "Fair" }}
        poreClarity={{ value: 56, status: "Fair" }}
        acne={{ value: 67, status: "Fair" }}
        elasticity={{ value: 78, status: "Fair" }}
        maxPotential={93}
        date={new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
    padding: 20,
  },
});
