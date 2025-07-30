import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface InstructionBannerProps {
  text: string;
}

const ExtracionCoffeeToWaterInstructionBanner: React.FC<
  InstructionBannerProps
> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5E5E5",
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 6,
    alignItems: "center",
    width: "90%",
  },
  text: {
    fontSize: 16,
    color: "#58595B",
    textAlign: "center",
    fontFamily: "cardRegular",
  },
});

export default ExtracionCoffeeToWaterInstructionBanner;
