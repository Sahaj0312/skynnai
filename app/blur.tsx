import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BlurReport from "@/components/BlurReport";
import storage from "@/services/storage";

const blur = () => {
  const [name, setName] = useState<string>("");
  const [photoUri, setPhotoUri] = useState<string>("");
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storage.getUserData();
      if (userData) {
        const { name, photoUri } = userData;
        setName(name || "");
        setPhotoUri(photoUri || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };
  return (
    <BlurReport
      name={name}
      photoUri={photoUri}
      date={new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    />
  );
};

export default blur;

const styles = StyleSheet.create({});
