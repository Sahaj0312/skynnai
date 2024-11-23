import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { router } from "expo-router";

const WelcomePage = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const opacity = useSharedValue(0);

  // Define welcome content separately from onboarding data
  const welcomeContent = {
    animation: require("../assets/animations/hi1.json"),
    text: 'Hi friend! I\'m {"Skynn" bold} {"AI" bold}, \n Your guide to a {"glowing" bold} you.',
    textColor: "#005b4f",
    backgroundColor: "#FCFBF4",
  };

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 2500 });
  }, []);

  const animationStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleGetStarted = () => {
    router.push("/onboarding");
  };

  // Helper function to parse formatted text
  const parseFormattedText = (text: string) => {
    const regex = /{([^}]+)}/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.includes('" ')) {
        const [content, ...styles] = part.replace(/"/g, "").split(" ");
        const styleObj: any = {};

        styles.forEach((style) => {
          // Each style will be in format "key=value" or just "key"
          if (style === "bold") {
            styleObj.fontWeight = "bold";
          } else {
            const [styleKey, styleValue] = style.split("=");
            if (styleKey === "color") {
              styleObj.color = styleValue.replace(/"/g, "");
            }
          }
        });

        return (
          <Text key={index} style={styleObj}>
            {content}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <View style={[styles.container, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              borderRadius: SCREEN_WIDTH / 2,
              backgroundColor: welcomeContent.backgroundColor,
              transform: [{ scale: 4 }],
            },
          ]}
        />
      </View>
      <Animated.View style={animationStyle}>
        <LottieView
          source={welcomeContent.animation}
          style={{
            width: SCREEN_WIDTH * 1.1,
            height: SCREEN_WIDTH * 1.1,
          }}
          autoPlay
          loop
        />
      </Animated.View>
      <Text style={[styles.text, { color: welcomeContent.textColor }]}>
        {parseFormattedText(welcomeContent.text)}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  text: {
    fontSize: (Dimensions.get("window").height * 4) / 100,
    fontWeight: "500",
    textAlign: "center",
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: "#005b4f",
    height: (Dimensions.get("window").height * 6.6) / 100,
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginTop: 20,
    width: Dimensions.get("window").width - 40,
  },
  buttonText: {
    color: "white",
    fontSize: (Dimensions.get("window").height * 2.5) / 100,
    fontWeight: "bold",
  },
});
