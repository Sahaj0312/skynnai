import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Confirmation() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { name } = JSON.parse(userData);
        setName(name);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleRetake = () => {
    router.back();
  };

  const handleContinue = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({
            ...parsedData,
            photoUri,
          })
        );
      }
      router.push("/welcome");
    } catch (error) {
      console.error("Error saving photo:", error);
      router.push("/welcome");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Animated.View entering={FadeIn.duration(1000).delay(200)}>
          <Text style={styles.greeting}>Looking great {name} :)</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.duration(2500).delay(600)}>
          <Text style={styles.subheading}>
            For best results, please ensure your face is clearly visible.
          </Text>
        </Animated.View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photoUri as string }}
            style={styles.preview}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleRetake}>
          <Text style={styles.buttonText}>Retake</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const PHOTO_SIZE = Dimensions.get("window").width * 0.8;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
  },
  headerContainer: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    paddingTop: SCREEN_HEIGHT * 0.05,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    borderColor: "#005b4f",
    borderWidth: 2,
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 10,
  },
  button: {
    backgroundColor: "#005b4f",
    height: SCREEN_HEIGHT * 0.066,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buttonText: {
    color: "white",
    fontSize: SCREEN_HEIGHT * 0.025,
    fontWeight: "bold",
  },
  greeting: {
    fontSize: SCREEN_HEIGHT * 0.035,
    fontWeight: "600",
    color: "#005b4f",
    marginBottom: 20,
  },
  subheading: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: "500",
    color: "#005b4f",
    opacity: 0.8,
  },
});
