import {
  StyleSheet,
  View,
  useWindowDimensions,
  Text,
  Dimensions,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const LoadingPage = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 1000 });

    // Redirect to report after 15 seconds
    const timeout = setTimeout(() => {
      router.push("/report");
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  const animationStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: "#FCFBF4",
              transform: [{ scale: 4 }],
            },
          ]}
        />
      </View>
      <Animated.View style={animationStyle}>
        <LottieView
          source={require("../assets/animations/loading.json")}
          style={{
            width: SCREEN_WIDTH * 0.4,
            height: SCREEN_WIDTH * 0.4,
          }}
          autoPlay
          loop
        />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Loading...</Text>
        <Text style={styles.textSub}>
          Please wait on this page while I work my magic!
        </Text>
      </View>
    </View>
  );
};

export default LoadingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.3,
    gap: 10,
  },
  text: {
    fontSize: Dimensions.get("window").width * 0.07,
    fontWeight: "bold",
    color: "#005b4f",
    textAlign: "center",
  },
  textSub: {
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#005b4f",
    fontWeight: "400",
  },
});
