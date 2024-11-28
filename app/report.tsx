import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import ReportCard from "../components/Report";
import { generateReport } from "@/services/ai";
import { storage } from "@/services/storage";
import * as FileSystem from "expo-file-system";

export default function ReportScreen() {
  const [name, setName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string>("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadUserDataAndAi();
  }, []);

  const getSkinScoreStatus = (score: number) => {
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const loadUserDataAndAi = async () => {
    try {
      setLoading(true);
      setError("");

      const userData = await storage.getUserData();
      if (!userData) {
        setError("No user data found");
        setLoading(false);
        return;
      }

      const { name, photoUri } = userData;
      setName(name || "");
      setPhotoUri(photoUri || "");

      if (!photoUri) {
        setError("No photo found");
        setLoading(false);
        return;
      }

      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const reportData = await generateReport(base64);
      console.log("Report data:", reportData);

      if (!reportData) {
        setError("Failed to generate report");
        setLoading(false);
        return;
      }

      setReport(JSON.parse(reportData));
      setLoading(false);
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("An error occurred while loading your report");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#005b4f" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !report ? (
        <Text style={styles.errorText}>No report data available</Text>
      ) : (
        <ReportCard
          name={name}
          photoUri={photoUri}
          skinScore={{
            value: report.overall_skin_health_score ?? 0,
            status: getSkinScoreStatus(report.overall_skin_health_score ?? 0),
          }}
          hydration={{
            value: report.hydration ?? 0,
            status: getSkinScoreStatus(report.hydration ?? 0),
          }}
          oilBalance={{
            value: report.oil_balance ?? 0,
            status: getSkinScoreStatus(report.oil_balance ?? 0),
          }}
          smoothness={{
            value: report.smoothness ?? 0,
            status: getSkinScoreStatus(report.smoothness ?? 0),
          }}
          poreClarity={{
            value: report.pore_clarity ?? 0,
            status: getSkinScoreStatus(report.pore_clarity ?? 0),
          }}
          acne={{
            value: report.acne_severity ?? 0,
            status: getSkinScoreStatus(report.acne_severity ?? 0),
          }}
          elasticity={{
            value: report.elasticity ?? 0,
            status: getSkinScoreStatus(report.elasticity ?? 0),
          }}
          maxPotential={93}
          date={new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
    padding: 20,
  },
  errorText: {
    color: "#FF0000",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});
