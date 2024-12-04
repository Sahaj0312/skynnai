import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import Report from "@/components/Report";
import useRevenueCat from "@/hooks/useRevenueCat";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface StoredReport {
  id: string;
  timestamp: string;
  reportData: any;
  photoUri: string;
  name: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { isProMember } = useRevenueCat();

  function generateMaxPotential(score: number): number {
    const min = Math.max(87, score + 1);
    const max = 97;

    // Ensure min does not exceed max
    if (min > max) {
      return max;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // AsyncStorage.clear();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const storedReports = await AsyncStorage.getItem("userReports");

      if (storedReports) {
        const parsedReports = JSON.parse(storedReports);
        setReports(
          parsedReports.sort(
            (a: StoredReport, b: StoredReport) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          )
        );
      } else if (!isProMember) {
        router.push("/camera");
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNewReport = () => {
    router.push("/camera");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#005b4f" />
        </View>
      </SafeAreaView>
    );
  }

  if (reports.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reports found</Text>
          <TouchableOpacity style={styles.button} onPress={handleNewReport}>
            <Text style={styles.buttonText}>Generate Your First Report</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {reports.map((report, index) => (
          <View key={report.id} style={styles.slideContainer}>
            <Report
              name={report.name}
              photoUri={report.photoUri}
              skinScore={{
                value: report.reportData.overall_skin_health_score ?? 0,
                status: getSkinScoreStatus(
                  report.reportData.overall_skin_health_score ?? 0
                ),
              }}
              hydration={{
                value: report.reportData.hydration ?? 0,
                status: getSkinScoreStatus(report.reportData.hydration ?? 0),
              }}
              oilBalance={{
                value: report.reportData.oil_balance ?? 0,
                status: getSkinScoreStatus(report.reportData.oil_balance ?? 0),
              }}
              smoothness={{
                value: report.reportData.smoothness ?? 0,
                status: getSkinScoreStatus(report.reportData.smoothness ?? 0),
              }}
              poreClarity={{
                value: report.reportData.pore_clarity ?? 0,
                status: getSkinScoreStatus(report.reportData.pore_clarity ?? 0),
              }}
              acne={{
                value: report.reportData.acne_severity ?? 0,
                status: getSkinScoreStatus(
                  report.reportData.acne_severity ?? 0
                ),
              }}
              elasticity={{
                value: report.reportData.elasticity ?? 0,
                status: getSkinScoreStatus(report.reportData.elasticity ?? 0),
              }}
              maxPotential={generateMaxPotential(
                report.reportData.overall_skin_health_score ?? 0
              )}
              date={new Date(report.timestamp).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
          </View>
        ))}
        <View style={styles.slideContainer}>
          <View style={styles.newReportContainer}>
            <Animated.View entering={FadeIn.duration(500)}>
              <TouchableOpacity
                style={styles.newReportButton}
                onPress={handleNewReport}
              >
                <MaterialIcons name="add-a-photo" size={48} color="#005b4f" />
                <Text style={styles.newReportText}>Generate New Report</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.pagination}>
        {reports.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
        <View
          style={[
            styles.paginationDot,
            currentIndex === reports.length && styles.paginationDotActive,
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

function getSkinScoreStatus(score: number) {
  if (score >= 80) return "Good";
  if (score >= 60) return "Fair";
  return "Poor";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
  },
  slideContainer: {
    width: SCREEN_WIDTH,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#005b4f",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  newReportContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  newReportButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  newReportText: {
    fontSize: 18,
    color: "#005b4f",
    fontWeight: "600",
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#005b4f",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
