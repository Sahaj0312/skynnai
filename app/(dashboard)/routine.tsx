import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const routineSteps = [
  {
    time: "Morning",
    steps: [
      "Cleanse with gentle cleanser",
      "Apply vitamin C serum",
      "Moisturize",
      "Apply sunscreen",
    ],
  },
  {
    time: "Evening",
    steps: [
      "Double cleanse",
      "Apply retinol",
      "Apply night cream",
      "Use eye cream",
    ],
  },
];

export default function RoutinePage() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {routineSteps.map((routine, index) => (
          <View key={routine.time} style={styles.routineSection}>
            <Text style={styles.timeHeader}>{routine.time}</Text>
            {routine.steps.map((step, stepIndex) => (
              <View key={stepIndex} style={styles.stepContainer}>
                <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
  },
  scrollContent: {
    padding: 20,
  },
  routineSection: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeHeader: {
    fontSize: 24,
    fontWeight: "600",
    color: "#005b4f",
    marginBottom: 15,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#005b4f",
    color: "white",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 10,
    fontSize: 14,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
});
