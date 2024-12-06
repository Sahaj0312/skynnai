import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  eachWeekOfInterval,
  addDays,
  subDays,
  eachDayOfInterval,
  format,
} from "date-fns";
import PagerView from "react-native-pager-view";
const dates = eachWeekOfInterval(
  {
    start: subDays(new Date(), 14),
    end: addDays(new Date(), 14),
  },
  { weekStartsOn: 1 }
).reduce((acc: Date[][], cur) => {
  const allDays = eachDayOfInterval({
    start: cur,
    end: addDays(cur, 6),
  });
  acc.push(allDays);
  return acc;
}, []);

const DateSlider = () => {
  return (
    <PagerView style={styles.container}>
      {dates.map((week, index) => {
        return (
          <View key={index}>
            <View style={styles.row}>
              {week.map((day) => {
                const txt = format(day, "EEEEE");

                return (
                  <View style={styles.day}>
                    <Text>{txt}</Text>
                    <Text>{day.getDate()}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </PagerView>
  );
};

export default DateSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  day: {
    flex: 1,
    alignItems: "center",
  },
});
