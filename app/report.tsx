import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { LoadingOverlay } from "../components/LoadingOverlay";
import ReportCard from "../components/Report";
import { generateReport } from "@/services/ai";
import { storage } from "@/services/storage";
import * as FileSystem from "expo-file-system";

interface ReportScreenProps {
  isStatic?: boolean;
  reportData?: any;
  name?: string;
  photoUri?: string;
  date?: string;
}

export default function ReportScreen({
  isStatic,
  reportData,
  name: initialName,
  photoUri: initialPhotoUri,
  date: initialDate,
}: ReportScreenProps) {
  const [name, setName] = useState<string>(initialName || "");
  const [photoUri, setPhotoUri] = useState<string>(initialPhotoUri || "");
  const [report, setReport] = useState<any>(reportData || null);
  const [loading, setLoading] = useState<boolean>(!isStatic);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isStatic) {
      loadUserDataAndAi();
    }
  }, [isStatic]);

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
        <LoadingOverlay />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !report ? (
        <Text style={styles.errorText}>No report data available</Text>
      ) : report.face_detected === false ? (
        <Text style={styles.errorText}>
          No face detected. Please ensure your face is clearly visible in the
          photo.
        </Text>
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
          issues={report.issues ?? ["hello", "world", "this is a test"]}
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
