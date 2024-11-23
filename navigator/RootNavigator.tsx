import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import OnboardingScreen from "../app/onboarding";

export type RootStackParamList = {
  Home: undefined;
  CustomSwitch: undefined;
  CustomCheckbox: undefined;
  ImageCarousel: undefined;
  BottomSheet: undefined;
  RangeSlider: undefined;
  BasicRevealAnimation: undefined;
  FlatlistRevealAnimation: undefined;
  OnboardingScreen: undefined;
  CustomToast: undefined;
  StackCarousel: undefined;
  Accordion: undefined;
  Fab: undefined;
  OnboardingScreen2: undefined;
  BottomTab: undefined;
  OnboardingScreen3D: undefined;
  BottomSheetScreenScroll: undefined;
  Model3D: undefined;
  Character3D: undefined;
  SharedElement: undefined;
  CustomDrawer: undefined;
  DonutChart: undefined;
  CircularProgressBar: undefined;
  MaskingOnboardingScreen: undefined;
  DarkMode: undefined;
  ShopUI3D: undefined;
  CarouselDisney: undefined;
  DarkModeSwitch: undefined;
  OnboardingScreenCuberto: undefined;
  CardSwipe: undefined;
  BarChart: undefined;
  Carousel: undefined;
  LineChart: undefined;
  CustomDrawer2: undefined;
};

const RootNavigator = () => {
  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
