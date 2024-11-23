import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { OnboardingData } from "../data/data";

type Props = {
  index: number;
  x: SharedValue<number>;
  item: OnboardingData;
  onAnswer: (key: string, value: any) => void;
  currentAnswer?: any;
};

const RenderItem = ({ index, x, item, onAnswer, currentAnswer }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const opacity = useSharedValue(0);
  const [textInput, setTextInput] = useState(currentAnswer?.toString() || "");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : []
  );

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  // Restore the animations
  const imageAnimationStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [250, 0, -250],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }, { scale }],
      opacity,
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [250, 0, -250],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
      opacity,
    };
  });

  const renderInput = () => {
    switch (item.type) {
      case "text":
      case "number":
        return (
          <TextInput
            style={styles.input}
            placeholder={item.placeholder}
            placeholderTextColor="#808080"
            value={textInput}
            keyboardType={item.type === "number" ? "numeric" : "default"}
            onChangeText={(text) => {
              setTextInput(text);
              onAnswer(item.key, text);
            }}
          />
        );

      case "select":
      case "multiselect":
        return (
          <View style={styles.optionsContainer}>
            {item.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  item.type === "select"
                    ? currentAnswer === option && styles.selectedOption
                    : selectedOptions.includes(option) && styles.selectedOption,
                ]}
                onPress={() => {
                  if (item.type === "select") {
                    onAnswer(item.key, option);
                  } else {
                    const newSelection = selectedOptions.includes(option)
                      ? selectedOptions.filter((item) => item !== option)
                      : [...selectedOptions, option];
                    setSelectedOptions(newSelection);
                    onAnswer(item.key, newSelection);
                  }
                }}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
    }
  };

  return (
    <View
      style={[
        styles.itemContainer,
        { width: SCREEN_WIDTH, backgroundColor: "#FCFBF4" },
      ]}
    >
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.questionContainer, textAnimationStyle]}>
          <Text style={[styles.itemText, { color: item.textColor }]}>
            {item.question}
          </Text>
        </Animated.View>
        <Animated.View style={[styles.inputContainer, imageAnimationStyle]}>
          {renderInput()}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    paddingTop: Dimensions.get("window").height * 0.1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    width: "100%",
    marginBottom: Dimensions.get("window").height * 0.05,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  itemText: {
    fontSize: Dimensions.get("window").height * 0.035,
    fontWeight: "500",
    textAlign: "left",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionsContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 30,
    width: "100%",
    height: Dimensions.get("window").height * 0.09,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
  },
  selectedOption: {
    backgroundColor: "#e0e0e0",
    borderWidth: 2,
    borderColor: "#005b4f",
  },
  optionText: {
    fontSize: Dimensions.get("window").height * 0.025,
    fontWeight: "400",
    textAlign: "center",
    color: "#005b4f",
  },
});

export default RenderItem;
