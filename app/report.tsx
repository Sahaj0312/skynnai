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
import Animated, { FadeIn } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CircularProgress from "react-native-circular-progress-indicator";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type MetricData = {
  value: number;
  status: "Good" | "Fair" | "Poor";
};

const getRandomPercentage = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Report() {
  const [name, setName] = React.useState<string>("");
  const [photoUri, setPhotoUri] = React.useState<string>("");
  const [isReady, setIsReady] = React.useState(false);
  const [metrics, setMetrics] = React.useState<{ [key: string]: MetricData }>(
    {}
  );
  const [maxPotential, setMaxPotential] = React.useState(0);
  const [overallHealth, setOverallHealth] = React.useState(0);

  React.useEffect(() => {
    loadUserData();
    const newMetrics: { [key: string]: MetricData } = {
      Hydration: {
        value: getRandomPercentage(50, 55),
        status: "Fair" as const,
      },
      XXXXXXXX: {
        value: getRandomPercentage(70, 80),
        status: "Fair" as const,
      },
      XXXXXXX: {
        value: getRandomPercentage(20, 75),
        status: "Poor" as const,
      },
      XXXXXXXXX: {
        value: getRandomPercentage(50, 70),
        status: "Good" as const,
      },
      XXXXX: {
        value: getRandomPercentage(20, 40),
        status: "Fair" as const,
      },
      XXXXXXXXXX: {
        value: getRandomPercentage(20, 90),
        status: "Poor" as const,
      },
    };

    Object.keys(newMetrics).forEach((key) => {
      const value = newMetrics[key].value;
      newMetrics[key].status =
        value >= 70 ? "Good" : value >= 50 ? "Fair" : "Poor";
    });

    setMetrics(newMetrics);
    setMaxPotential(getRandomPercentage(89, 97));
    setOverallHealth(getRandomPercentage(40, 60));
    setIsReady(true);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { name, photoUri } = JSON.parse(userData);
        setName(name);
        setPhotoUri(photoUri);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
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

  const renderMetric = (
    title: string,
    value: number,
    status: MetricData["status"]
  ) => (
    <View style={styles.metricRow}>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricContent}>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${value}%`,
                backgroundColor: getStatusColor(status),
              },
            ]}
          />
        </View>
        <View style={styles.metricInfo}>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {status}
          </Text>
          <Text style={styles.percentageText}>XX%</Text>
        </View>
      </View>
    </View>
  );

  const [currentDate] = React.useState(
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  );

  const calculateOverallHealth = () => {
    return 58;
  };

  const getOverallStatusColor = (value: number) => {
    if (value >= 70) return "#4CAF50"; // Good - Green
    if (value >= 50) return "#FFC107"; // Fair - Yellow
    return "#FF5252"; // Poor - Red
  };

  const calculateDifference = () => {
    return "XX";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>
          {name ? `${name}'s Skin Report` : "Skin Report"}
        </Text>

        <Text style={styles.date}>{currentDate}</Text>
      </View>

      <View style={styles.topSection}>
        <View style={styles.profileSection}>
          <View style={{ height: 34 }} />
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
            value={overallHealth}
            radius={80}
            duration={0}
            progressValueColor={"transparent"}
            maxValue={100}
            activeStrokeColor={getOverallStatusColor(overallHealth)}
            inActiveStrokeColor={"#E0E0E0"}
            inActiveStrokeOpacity={0.5}
            inActiveStrokeWidth={8}
            activeStrokeWidth={16}
            title={"XX%"}
            titleStyle={{
              fontSize: SCREEN_HEIGHT * 0.045,
              fontWeight: "bold",
              color: "#000",
              textAlign: "center",
              position: "absolute",
              width: "100%",
              height: "100%",
              lineHeight: 160,
              padding: 0,
              margin: 0,
            }}
            titleColor={"#000"}
            progressValueStyle={{ fontSize: 0 }}
            initialValue={overallHealth}
          />
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(1000)} style={styles.card}>
        <View style={styles.metricsContainer}>
          {Object.entries(metrics).map(([key, data]) =>
            renderMetric(key, data.value, data.status)
          )}
        </View>
      </Animated.View>

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
              <Text style={styles.improvementText}>+XX%</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Unlock Report pressed");
        }}
      >
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
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
  name: {
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
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
