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

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function LoadingOverlay({
  message = "Loading...",
  submessage = "Please wait while I work my magic!",
}: LoadingOverlayProps) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
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
        <Text style={styles.text}>{message}</Text>
        <Text style={styles.textSub}>{submessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
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
