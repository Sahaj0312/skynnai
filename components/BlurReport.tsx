import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
import useRevenueCat from "../hooks/useRevenueCat";
import { generateReport } from "@/services/ai";
import Purchases from "react-native-purchases";

interface BlurReportProps {
  name: string;
  photoUri: string;
  date: string;
}

export default function BlurReport(props: BlurReportProps) {
  const { name, photoUri, date } = props;
  const { isProMember } = useRevenueCat();

  const generateAndSaveReport = async () => {
    try {
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
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
        return;
      }

      // Save the new report
      const newReport = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        reportData: parsedReportData,
        photoUri,
        name,
      };

      // Get existing reports
      const existingReports = await AsyncStorage.getItem("userReports");
      const reports = existingReports ? JSON.parse(existingReports) : [];

      // Add new report
      reports.unshift(newReport);

      // Save updated reports
      await AsyncStorage.setItem("userReports", JSON.stringify(reports));

      router.push("/(dashboard)/reports");
    } catch (error) {
      console.error("Error generating report:", error);
      // Handle error appropriately
    }
  };

  const handleUnlockReport = async () => {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "pro",
      });

    const restorePurchases = async () => {
      const purchaserInfo = await Purchases.restorePurchases();
      if (purchaserInfo.activeSubscriptions.length > 0) {
        Alert.alert("Success", "Your purchase has been restored.");
      } else {
        Alert.alert("Error", "Failed to restore purchase.");
      }
    };

    switch (paywallResult) {
      case PAYWALL_RESULT.PURCHASED:
        await generateAndSaveReport();
        break;
      case PAYWALL_RESULT.RESTORED:
        console.log("RESTORED");
        await restorePurchases();
        break;
      case PAYWALL_RESULT.NOT_PRESENTED:
        console.log("NOT PRESENTED");
        break;
      case PAYWALL_RESULT.ERROR:
        console.log("ERROR");
        break;
      case PAYWALL_RESULT.CANCELLED:
        console.log("CANCELLED");
        break;
      default:
        return;
    }
  };

  // If user is already a pro member, generate report immediately
  useEffect(() => {
    if (isProMember) {
      generateAndSaveReport();
    }
  }, [isProMember]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>{`${name}'s Skin Report`}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>
        </View>
        <View style={styles.overallHealthSection}>
          <Image
            source={require("../assets/images/blur-overall-health.png")}
            style={styles.overallHealthImage}
            resizeMode="stretch"
          />
        </View>
      </View>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/blur-metrics.png")}
          style={styles.metricsImage}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.bottomCardsContainer}>
        <View style={styles.bottomCard}>
          <Text style={[styles.bottomCardTitle, { color: "red" }]}>
            3 Critical Issues:
          </Text>
          <Image
            source={require("../assets/images/blur-critical-issues.png")}
            style={styles.criticalIssuesImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.bottomCard, styles.rightBottomCard]}>
          <Text style={styles.bottomCardTitle}>Max Potential</Text>
          <View style={styles.potentialContainer}>
            <Text style={styles.potentialScore}>93%</Text>
            <View style={styles.improvementContainer}>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
              <Text style={styles.improvementText}>+XX%</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUnlockReport}>
        <Text style={styles.buttonText}>Unlock Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overallHealthSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  // ... keeping all existing styles from Report.tsx ...
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
    padding: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: SCREEN_HEIGHT * 0.032,
    fontWeight: "bold",
    color: "#005b4f",
    marginBottom: 5,
    textAlign: "center",
  },
  date: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: "#666",
    textAlign: "center",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderColor: "#005b4f",
    borderWidth: 3,
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E1E1E1",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  // New styles for blur images
  overallHealthImage: {
    width: 160,
    height: 160,
  },
  metricsImage: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.3, // Adjust based on your metrics section height
  },
  criticalIssuesImage: {
    width: "93%",
    height: "93%",
    aspectRatio: 1.5,
    resizeMode: "contain",
    alignSelf: "center",
  },
  potentialImage: {
    width: "100%",
    height: "100%",
  },
  // Keeping remaining styles from Report.tsx
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  bottomCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginHorizontal: 10,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    height: SCREEN_HEIGHT * 0.2, // Adjust based on your bottom cards height
  },
  rightBottomCard: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#005b4f",
    height: (SCREEN_HEIGHT * 6.6) / 100,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 30,
    marginBottom: 20,
    width: SCREEN_WIDTH - 40,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: (SCREEN_HEIGHT * 2.5) / 100,
    fontWeight: "bold",
  },
  bottomCardTitle: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  potentialContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  potentialScore: {
    fontSize: SCREEN_HEIGHT * 0.045,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  improvementContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  improvementText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: "600",
    color: "#4CAF50",
    marginLeft: 2,
  },
});
