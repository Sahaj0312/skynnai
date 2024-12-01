import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
import useRevenueCat from "../hooks/useRevenueCat";

interface BlurReportProps {
  name: string;
  photoUri: string;
  date: string;
}

export default function BlurReport(props: BlurReportProps) {
  const { name, photoUri, date } = props;
  const { isProMember } = useRevenueCat();
  console.log(isProMember);
  const handleUnlockReport = async () => {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "pro",
      });
    console.log(paywallResult);
    console.log(isProMember);
    //router.push("/(dashboard)/reports");
  };

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
