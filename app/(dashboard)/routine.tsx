import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  routineStorage,
  RoutineStep,
  RoutineData,
  defaultRoutine,
} from "@/services/storage";
import { MaterialIcons } from "@expo/vector-icons";

type TimeOfDay = "morning" | "evening";
type RoutineCompletion = Record<string, boolean>;

const initialRoutineData: RoutineData = {
  routine: defaultRoutine,
  completions: {
    morning: {},
    evening: {},
  },
  streak: 0,
};

const getCompletionStatus = (
  steps: RoutineStep[],
  completions: RoutineCompletion
) => {
  const totalSteps = steps.length;
  const completedSteps = Object.values(completions || {}).filter(
    Boolean
  ).length;
  return `${completedSteps}/${totalSteps} steps`;
};

export default function RoutinePage() {
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>("morning");
  const [routineData, setRoutineData] =
    useState<RoutineData>(initialRoutineData);
  const [newStep, setNewStep] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoutineData();
  }, []);

  const loadRoutineData = async () => {
    try {
      setIsLoading(true);
      const data = await routineStorage.getRoutineData();
      setRoutineData(data);
    } catch (error) {
      console.error("Error loading routine data:", error);
      setRoutineData(initialRoutineData);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentRoutine = () => {
    const routine = routineData.routine?.[selectedTime] || [];
    return routine.map((step) => ({
      ...step,
      completed: isStepCompleted(step.id),
    }));
  };

  const isStepCompleted = (stepId: string): boolean => {
    return !!routineData.completions?.[selectedTime]?.[stepId];
  };

  const toggleStep = async (stepId: string) => {
    try {
      const newData: RoutineData = {
        ...routineData,
        completions: {
          morning: { ...routineData.completions?.morning } || {},
          evening: { ...routineData.completions?.evening } || {},
        },
        streak: routineData.streak || 0,
      };

      // Toggle the completion status
      newData.completions[selectedTime][stepId] =
        !newData.completions[selectedTime][stepId];

      await routineStorage.saveRoutineData(newData);
      setRoutineData(newData);
    } catch (error) {
      console.error("Error saving step toggle:", error);
      Alert.alert("Error", "Failed to save your progress. Please try again.");
    }
  };

  const addNewStep = async () => {
    if (!newStep.trim()) return;

    const newData = { ...routineData };
    // Ensure routine structure exists
    if (!newData.routine) newData.routine = { ...defaultRoutine };
    if (!newData.routine[selectedTime]) newData.routine[selectedTime] = [];

    const newId = `${selectedTime[0]}${Date.now()}`;
    newData.routine[selectedTime].push({
      id: newId,
      text: newStep.trim(),
    });

    try {
      await routineStorage.saveRoutineData(newData);
      setRoutineData(newData);
      setNewStep("");
    } catch (error) {
      console.error("Error saving new step:", error);
    }
  };

  const deleteStep = (stepId: string) => {
    Alert.alert("Delete Step", "Are you sure you want to delete this step?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const newData = { ...routineData };

          // Ensure routine structure exists
          if (!newData.routine || !newData.routine[selectedTime]) return;

          // Remove step from routine
          newData.routine[selectedTime] = newData.routine[selectedTime].filter(
            (step) => step.id !== stepId
          );

          // Remove completion for this step
          if (newData.completions && newData.completions[selectedTime]) {
            delete newData.completions[selectedTime][stepId];
          }

          try {
            await routineStorage.saveRoutineData(newData);
            setRoutineData(newData);
          } catch (error) {
            console.error("Error deleting step:", error);
          }
        },
      },
    ]);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{today}</Text>
        <Text style={styles.streakText}>
          🔥 Daily streak: {routineData.streak || 0}
        </Text>
      </View>

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
            Morning 🌞
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
            Evening 🌚
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.routineSection}>
          <View style={styles.headerRow}>
            <View style={styles.headerContent}>
              {/* <Text style={styles.timeHeader}>
                {selectedTime === "morning" ? "Morning" : "Evening"}
              </Text> */}
              <Text style={styles.timeHeader}>
                Completed{" "}
                {getCompletionStatus(
                  routineData.routine?.[selectedTime] || [],
                  routineData.completions?.[selectedTime] || {}
                )}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <MaterialIcons
                name={isEditing ? "check" : "edit"}
                size={24}
                color="#005b4f"
              />
            </TouchableOpacity>
          </View>

          {getCurrentRoutine().map((step) => (
            <View key={step.id} style={styles.stepContainer}>
              <TouchableOpacity
                style={styles.stepCheckbox}
                onPress={() => toggleStep(step.id)}
              >
                <MaterialIcons
                  name={
                    step.completed ? "check-box" : "check-box-outline-blank"
                  }
                  size={24}
                  color="#005b4f"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.stepText,
                  step.completed && styles.completedStep,
                ]}
              >
                {step.text}
              </Text>
              {isEditing && (
                <TouchableOpacity
                  onPress={() => deleteStep(step.id)}
                  style={styles.deleteButton}
                >
                  <MaterialIcons name="delete" size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {isEditing && (
            <View style={styles.addStepContainer}>
              <TextInput
                style={styles.addStepInput}
                value={newStep}
                onChangeText={setNewStep}
                placeholder="Add new step..."
                onSubmitEditing={addNewStep}
              />
              <TouchableOpacity style={styles.addButton} onPress={addNewStep}>
                <MaterialIcons name="add" size={24} color="#005b4f" />
              </TouchableOpacity>
            </View>
          )}
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
    fontSize: 20,
    fontWeight: "600",
    color: "#005b4f",
    marginBottom: 4,
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
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    padding: 4,
  },
  timeToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 40,
  },
  timeToggleButtonActive: {
    backgroundColor: "#005b4f",
  },
  timeToggleText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "500",
  },
  timeToggleTextActive: {
    color: "white",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerContent: {
    flex: 1,
  },
  stepCheckbox: {
    marginRight: 10,
  },
  completedStep: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  addStepContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  addStepInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dateText: {
    fontSize: 18,
    color: "#005b4f",
    fontWeight: "500",
  },
  streakText: {
    fontSize: 16,
    color: "#005b4f",
    fontWeight: "500",
  },
});
