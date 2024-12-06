import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
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
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

const Day: React.FC<DayProps> = ({ day, isSelected, onSelect }) => {
  const txt = format(day, "EEEEE");
  const dayKey = day.toISOString();

  return (
    <TouchableOpacity
      style={[styles.day, isSelected && styles.selectedDay]}
      onPress={() => onSelect(day)}
      key={dayKey}
    >
      <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
        {txt}
      </Text>
      <Text style={[styles.dateText, isSelected && styles.selectedDayText]}>
        {day.getDate()}
      </Text>
    </TouchableOpacity>
  );
};

interface DateSliderProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

const DateSlider: React.FC<DateSliderProps> = ({
  onDateSelect,
  selectedDate,
}) => {
  return (
    <View style={styles.sliderContainer}>
      <PagerView style={styles.container}>
        {dates.map((week, index) => (
          <View key={index}>
            <View style={styles.row}>
              {week.map((day) => (
                <Day
                  key={day.toISOString()}
                  day={day}
                  isSelected={
                    format(day, "yyyy-MM-dd") ===
                    format(selectedDate, "yyyy-MM-dd")
                  }
                  onSelect={onDateSelect}
                />
              ))}
            </View>
          </View>
        ))}
      </PagerView>
    </View>
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
  sliderContainer: {
    height: 80,
  },
  selectedDay: {
    backgroundColor: "#005b4f",
    borderRadius: 8,
    padding: 4,
  },
  dayText: {
    fontSize: 12,
    color: "#666",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  selectedDayText: {
    color: "white",
  },
});
