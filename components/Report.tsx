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
import CircularProgress from "react-native-circular-progress-indicator";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type MetricData = {
  value: number;
  status: "Good" | "Fair" | "Poor";
};

interface ReportProps {
  name: string;
  photoUri: string;
  skinScore: {
    value: number;
    status: string;
  };
  hydration?: MetricData;
  oilBalance?: MetricData;
  smoothness?: MetricData;
  poreClarity?: MetricData;
  acne?: MetricData;
  elasticity?: MetricData;
  maxPotential: number;
  date: string;
}

export default function Report(props: ReportProps) {
  const {
    name,
    photoUri,
    skinScore,
    hydration,
    oilBalance,
    smoothness,
    poreClarity,
    acne,
    elasticity,
    maxPotential,
    date,
  } = props;

  const handleUnlockReport = () => {
    router.push("/(dashboard)/reports");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good":
        return "#4CAF50";
      case "Fair":
        return "#FFC107";
      case "Poor":
        return "#FF5252";
      default:
        return "#000000";
    }
  };

  const metricsData = {
    Hydration: hydration,
    "Oil Balance": oilBalance,
    Smoothness: smoothness,
    "Pore Clarity": poreClarity,
    Acne: acne,
    Elasticity: elasticity,
  };

  const renderMetrics = () =>
    Object.entries(metricsData)
      .filter(([_, data]) => data !== undefined)
      .map(([key, data]) => (
        <View key={key} style={styles.metricRow}>
          <Text style={styles.metricTitle}>{key}</Text>
          <View style={styles.metricContent}>
            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: data?.value ? `${data.value}%` : "0%",
                    backgroundColor: getStatusColor(data?.status || "Unknown"),
                  },
                ]}
              />
            </View>
            <View style={styles.metricInfo}>
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(data?.status || "Unknown") },
                ]}
              >
                {data?.status || "Unknown"}
              </Text>
              <Text style={styles.percentageText}>{data?.value}%</Text>
            </View>
          </View>
        </View>
      ));

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
          <Text style={styles.overallTitle}>Overall Skin Health</Text>
          <CircularProgress
            value={skinScore.value}
            radius={80}
            maxValue={100}
            activeStrokeColor={getStatusColor(skinScore.status)}
            inActiveStrokeColor={"#E0E0E0"}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={8}
            activeStrokeWidth={16}
            initialValue={skinScore.value}
            progressValueStyle={{ fontSize: 0 }}
          />
        </View>
      </View>
      <View style={styles.card}>
        <View style={styles.metricsContainer}>{renderMetrics()}</View>
      </View>
      <View style={styles.bottomCardsContainer}>
        <View style={styles.bottomCard}>
          <Text style={[styles.bottomCardTitle, { color: "red" }]}>
            Critical Issues
          </Text>
          <View style={styles.issuesList}>
            <Text style={styles.issueItem}>• XXX XXX XXXXXXX</Text>
            <Text style={styles.issueItem}>• XXXX XXXXXXX</Text>
            <Text style={styles.issueItem}>• XXXX XXXXXX</Text>
          </View>
        </View>

        <View style={[styles.bottomCard, styles.rightBottomCard]}>
          <Text style={styles.bottomCardTitle}>Max Potential</Text>
          <View style={styles.potentialContainer}>
            <Text style={styles.potentialScore}>{maxPotential}%</Text>
            <View style={styles.improvementContainer}>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
              <Text style={styles.improvementText}>
                +{maxPotential - skinScore.value}%
              </Text>
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
  overallHealthSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  overallTitle: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
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
    marginLeft: 10,
    marginRight: 10,
  },
  metricsContainer: {
    gap: 10,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricTitle: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: "500",
    color: "#000",
    width: "30%",
  },
  metricContent: {
    flex: 1,
    marginLeft: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  metricInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  statusText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: "500",
  },
  percentageText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    fontWeight: "600",
    color: "#000",
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
  },
  rightBottomCard: {
    marginLeft: 10,
  },
  bottomCardTitle: {
    fontSize: SCREEN_HEIGHT * 0.02,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  issuesList: {
    gap: 4,
  },
  issueItem: {
    fontSize: SCREEN_HEIGHT * 0.016,
    fontWeight: "500",
    color: "#000",
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
});
