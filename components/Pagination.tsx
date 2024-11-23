import { StyleSheet, View, useWindowDimensions } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withSpring,
} from "react-native-reanimated";

type Props = {
  data: any;
  x: SharedValue<number>;
};
const Pagination = ({ data, x }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <View style={styles.paginationContainer}>
      {data.map((_: any, i: number) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const widthAnimation = interpolate(
            x.value,
            [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
            [10, 20, 10],
            Extrapolate.CLAMP
          );

          return {
            width: widthAnimation,
            backgroundColor: "#005b4f",
            opacity: withSpring(x.value === i * SCREEN_WIDTH ? 1 : 0.5),
          };
        });

        return (
          <Animated.View key={i} style={[styles.dots, animatedDotStyle]} />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    height: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
});
