import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
).reduce<Date[][]>((acc, cur) => {
  const allDays = eachDayOfInterval({
    start: cur,
    end: addDays(cur, 6),
  });
  acc.push(allDays);
  return acc;
}, []);

interface DayProps {
  day: Date;
}

const Day: React.FC<DayProps> = ({ day }) => {
  const txt = format(day, "EEEEE");
  const dayKey = day.toISOString();

  return (
    <View style={styles.day} key={dayKey}>
      <Text>{txt}</Text>
      <Text>{day.getDate()}</Text>
    </View>
  );
};

const DateSlider: React.FC = () => {
  return (
    <PagerView style={styles.container}>
      {dates.map((week, index) => (
        <View key={index}>
          <View style={styles.row}>
            {week.map((day) => (
              <Day key={day.toISOString()} day={day} />
            ))}
          </View>
        </View>
      ))}
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
