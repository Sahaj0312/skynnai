import { useEffect, useState } from "react";
import { UserData } from "@/types";
import storage from "@/services/storage";

export function useUserData() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await storage.getUserData();
      setUserData(data);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: Partial<UserData>) => {
    try {
      await storage.updateUserData(updates);
      setUserData((prev) => (prev ? { ...prev, ...updates } : updates));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return { userData, loading, updateUserData };
}
