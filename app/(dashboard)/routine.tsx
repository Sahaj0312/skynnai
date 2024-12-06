import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSlider from "@/components/DateSlider";

const routineSteps = {
  morning: {
    time: "Morning",
    steps: [
      "Cleanse with gentle cleanser",
      "Apply vitamin C serum",
      "Moisturize",
      "Apply sunscreen",
    ],
  },
  evening: {
    time: "Evening",
    steps: [
      "Double cleanse",
      "Apply retinol",
      "Apply night cream",
      "Use eye cream",
    ],
  },
};

type TimeOfDay = "morning" | "evening";

export default function RoutinePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("morning");

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedRoutine = routineSteps[selectedTime];

  return (
    <SafeAreaView style={styles.container}>
      <DateSlider selectedDate={selectedDate} onDateSelect={handleDateSelect} />

      <View style={styles.timeToggle}>
        <TouchableOpacity
          style={[
            styles.timeToggleButton,
            selectedTime === "morning" && styles.timeToggleButtonActive,
          ]}
          onPress={() => setSelectedTime("morning")}
        >
          <Text
            style={[
              styles.timeToggleText,
              selectedTime === "morning" && styles.timeToggleTextActive,
            ]}
          >
            Morning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeToggleButton,
            selectedTime === "evening" && styles.timeToggleButtonActive,
          ]}
          onPress={() => setSelectedTime("evening")}
        >
          <Text
            style={[
              styles.timeToggleText,
              selectedTime === "evening" && styles.timeToggleTextActive,
            ]}
          >
            Evening
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.routineSection}>
          <Text style={styles.timeHeader}>{selectedRoutine.time}</Text>
          {selectedRoutine.steps.map((step, stepIndex) => (
            <View key={stepIndex} style={styles.stepContainer}>
              <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
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
  timeToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  timeToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  timeToggleButtonActive: {
    backgroundColor: "#005b4f",
  },
  timeToggleText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  timeToggleTextActive: {
    color: "white",
  },
});
