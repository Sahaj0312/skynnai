import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { generateReport } from "@/services/ai";
import useRevenueCat from "@/hooks/useRevenueCat";

export default function Confirmation() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isProMember } = useRevenueCat();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { name } = JSON.parse(userData);
        setName(name);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleRetake = () => {
    if (isProcessing) return; // Prevent retake while processing
    router.back();
  };

  const handleContinue = async () => {
    if (isProcessing) return; // Prevent multiple submissions

    try {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) return;

      const parsedData = JSON.parse(userData);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          ...parsedData,
          photoUri,
        })
      );

      if (isProMember) {
        setIsProcessing(true);

        const base64 = await FileSystem.readAsStringAsync(photoUri as string, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const reportData = await generateReport(base64);
        if (!reportData) {
          throw new Error("Failed to generate report");
        }

        const parsedReportData = JSON.parse(reportData);
        if (parsedReportData.face_detected === false) {
          Alert.alert(
            "No face detected",
            "Please ensure your face is clearly visible in the photo."
          );
          setIsProcessing(false);
          return;
        }

        // Save the new report
        const newReport = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          reportData: parsedReportData,
          photoUri,
          name: parsedData.name,
        };

        // Get existing reports
        const existingReports = await AsyncStorage.getItem("userReports");
        const reports = existingReports ? JSON.parse(existingReports) : [];

        // Add new report
        reports.unshift(newReport);

        // Save updated reports
        await AsyncStorage.setItem("userReports", JSON.stringify(reports));

        // Navigate to dashboard reports
        router.replace("/(dashboard)/reports");
      } else {
        // For non-pro members, show blur page
        router.push("/blur");
      }
    } catch (error) {
      console.error("Error processing photo:", error);
      setError("Failed to process photo");
      Alert.alert("Error", "Failed to process your photo. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View entering={FadeIn.duration(1000).delay(200)}>
          <Text style={styles.greeting}>Looking great {name} :)</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(1000).delay(200)}>
          <Text style={styles.subheading}>
            For best results, please ensure your face is clearly visible.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photoUri as string }}
            style={styles.preview}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {isProcessing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#005b4f" />
            <Text style={styles.loadingText}>Analyzing your skin...</Text>
          </View>
        ) : (
          <>
            <Pressable
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={handleRetake}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </Pressable>
            <Pressable
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const PHOTO_SIZE = Dimensions.get("window").width * 0.8;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    paddingTop: SCREEN_HEIGHT * 0.05,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderColor: "#005b4f",
    borderWidth: 2,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  button: {
    backgroundColor: "#005b4f",
    height: SCREEN_HEIGHT * 0.066,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buttonText: {
    color: "white",
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: SCREEN_HEIGHT * 0.035,
    fontWeight: "600",
    color: "#005b4f",
    marginBottom: 20,
  },
  subheading: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: "500",
    color: "#005b4f",
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: SCREEN_HEIGHT * 0.02,
    color: "#005b4f",
    fontWeight: "500",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
