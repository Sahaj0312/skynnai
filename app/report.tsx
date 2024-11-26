import React from "react";
import { SafeAreaView, StyleSheet, Dimensions } from "react-native";
import ReportCard from "../components/Report";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ReportScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ReportCard
        name={"Johnny"}
        photoUri={"../assets/images/splash-icon.png"}
        skinScore={{ value: 73, status: "Fair" }}
        hydration={{ value: 27, status: "Fair" }}
        oilBalance={{ value: 34, status: "Fair" }}
        skinTone={{ value: 45, status: "Fair" }}
        poreClarity={{ value: 56, status: "Fair" }}
        acne={{ value: 67, status: "Fair" }}
        elasticity={{ value: 78, status: "Fair" }}
        maxPotential={93}
        date={new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFBF4",
    padding: 20,
  },
});
