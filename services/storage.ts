import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "@/types";

export interface RoutineStep {
  id: string;
  text: string;
}

export interface DailyRoutine {
  morning: RoutineStep[];
  evening: RoutineStep[];
}

export interface RoutineCompletion {
  [stepId: string]: boolean;
}

export interface RoutineData {
  routine: DailyRoutine;
  completions: {
    morning: RoutineCompletion;
    evening: RoutineCompletion;
  };
  streak: number;
  lastCompletedDate?: string; // ISO string
}

export const StorageKeys = {
  USER_DATA: "userData",
  REPORT_METRICS: "reportMetrics",
  ROUTINE_DATA: "routineData",
} as const;

export const storage = {
  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem(StorageKeys.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  },

  async setUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        StorageKeys.USER_DATA,
        JSON.stringify(userData)
      );
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  },

  async updateUserData(updates: Partial<UserData>): Promise<void> {
    try {
      const currentData = await this.getUserData();
      await this.setUserData({ ...currentData, ...updates });
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  },
};

export const routineStorage = {
  async getRoutineData(): Promise<RoutineData> {
    try {
      const stored = await AsyncStorage.getItem(StorageKeys.ROUTINE_DATA);
      if (!stored)
        return {
          routine: defaultRoutine,
          completions: { morning: {}, evening: {} },
          streak: 0,
        };

      const parsedData = JSON.parse(stored);
      return typeof parsedData === "object" && parsedData !== null
        ? parsedData
        : {
            routine: defaultRoutine,
            completions: { morning: {}, evening: {} },
            streak: 0,
          };
    } catch (error) {
      console.error("Error loading routine data:", error);
      return {
        routine: defaultRoutine,
        completions: { morning: {}, evening: {} },
        streak: 0,
      };
    }
  },

  async saveRoutineData(routineData: RoutineData): Promise<void> {
    try {
      if (!routineData || typeof routineData !== "object") {
        console.error("Invalid routine data format");
        return;
      }

      // Ensure completions object exists with proper structure
      const safeRoutineData: RoutineData = {
        ...routineData,
        completions: {
          morning: routineData.completions?.morning || {},
          evening: routineData.completions?.evening || {},
        },
        streak: routineData.streak || 0,
        lastCompletedDate: routineData.lastCompletedDate,
      };

      const today = new Date().toISOString().split("T")[0];

      // Only reset completions if it's a new day AND we haven't already completed anything today
      if (
        safeRoutineData.lastCompletedDate !== today &&
        Object.keys(safeRoutineData.completions.morning).length === 0 &&
        Object.keys(safeRoutineData.completions.evening).length === 0
      ) {
        // Reset completions only if we're starting a new day
        safeRoutineData.completions = {
          morning: {},
          evening: {},
        };

        // Reset streak if a day was missed
        if (safeRoutineData.lastCompletedDate) {
          const lastDate = new Date(safeRoutineData.lastCompletedDate);
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (
            lastDate.toISOString().split("T")[0] !==
            yesterday.toISOString().split("T")[0]
          ) {
            safeRoutineData.streak = 0;
          }
        }
      }

      // Check if all steps for both morning and evening are completed
      const morningSteps = safeRoutineData.routine.morning.length;
      const eveningSteps = safeRoutineData.routine.evening.length;

      const morningCompleted = Object.values(
        safeRoutineData.completions.morning
      ).filter(Boolean).length;
      const eveningCompleted = Object.values(
        safeRoutineData.completions.evening
      ).filter(Boolean).length;

      // Only consider routine complete if BOTH morning and evening are done
      const isFullyCompleted =
        morningCompleted === morningSteps && eveningCompleted === eveningSteps;

      // Update streak and lastCompletedDate only when both routines are completed
      // and we haven't already marked completion for today
      if (isFullyCompleted && safeRoutineData.lastCompletedDate !== today) {
        safeRoutineData.streak += 1;
        safeRoutineData.lastCompletedDate = today;
      }

      await AsyncStorage.setItem(
        StorageKeys.ROUTINE_DATA,
        JSON.stringify(safeRoutineData)
      );
    } catch (error) {
      console.error("Error saving routine data:", error);
      throw error;
    }
  },
};

export const defaultRoutine: DailyRoutine = {
  morning: [
    { id: "m1", text: "Cleanse with gentle cleanser" },
    { id: "m2", text: "Apply vitamin C serum" },
    { id: "m3", text: "Moisturize" },
    { id: "m4", text: "Apply sunscreen" },
  ],
  evening: [
    { id: "e1", text: "Double cleanse" },
    { id: "e2", text: "Apply retinol" },
    { id: "e3", text: "Apply night cream" },
    { id: "e4", text: "Use eye cream" },
  ],
};

export default storage;
