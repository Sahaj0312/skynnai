import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const theme = {
  colors: {
    primary: "#005b4f",
    background: "#FCFBF4",
    text: "#000000",
    white: "#FFFFFF",
    // Add more colors
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    sizes: {
      h1: SCREEN_HEIGHT * 0.035,
      h2: SCREEN_HEIGHT * 0.025,
      body: SCREEN_HEIGHT * 0.016,
    },
    weights: {
      regular: "400",
      medium: "500",
      bold: "600",
      heavy: "700",
    },
  },
  layout: {
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
  },
} as const;

export type Theme = typeof theme;
