import { StyleSheet, View, FlatList, ViewToken } from "react-native";
import React, { useCallback } from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";
import data, { OnboardingData } from "../data/data";
import Pagination from "../components/Pagination";
import CustomButton from "../components/CustomButton";
import RenderItem from "../components/RenderItem";
import { useRouter } from "expo-router";

const OnboardingScreen = () => {
  const router = useRouter();
  const [answers, setAnswers] = React.useState<Record<string, any>>({});

  const handleAnswer = useCallback((key: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleComplete = useCallback(() => {
    console.log("Form answers:", answers);
    router.push("/");
  }, [answers]);

  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (
        viewableItems &&
        viewableItems.length > 0 &&
        viewableItems[0].index !== null
      ) {
        flatListIndex.value = viewableItems[0].index;
      }
    },
    []
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: "#FCFBF4" }]}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <RenderItem
              item={item}
              index={index}
              x={x}
              onAnswer={handleAnswer}
              currentAnswer={answers[item.key]}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 100,
          viewAreaCoveragePercentThreshold: 50,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
          onComplete={handleComplete}
          isValid={Object.keys(answers).length === data.length}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
