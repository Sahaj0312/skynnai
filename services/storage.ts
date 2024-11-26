import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from "@/types";

export const StorageKeys = {
  USER_DATA: "userData",
  REPORT_METRICS: "reportMetrics",
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

export default storage;
