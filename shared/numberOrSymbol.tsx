import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import React from "react"; // Не забудьте импортировать React

interface INorS {
  numberOrSymbol: React.ReactNode; // ReactNode корректно обрабатывает любые типы дочерних элементов
  bgColor?: string;
  color?: string;
  onPress: () => void;
}

export default function NumberOrSymbol({ numberOrSymbol, bgColor, color, onPress }: INorS) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.numberOrSymbol,
        backgroundColor: bgColor ? bgColor : "#171717",
      }}
    >
      {typeof numberOrSymbol === "string" ? (
        <Text style={{ color: color ? color : "white", fontSize: 28 }}>
          {numberOrSymbol}
        </Text>
      ) : (
        numberOrSymbol
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  numberOrSymbol: {
    backgroundColor: "#171717",
    borderRadius: Dimensions.get("window").width / 8, // Плавный круг
    width: Dimensions.get("window").width / 4 - 20,
    height: Dimensions.get("window").width / 4 - 20,
    alignItems: "center",
    justifyContent: "center",
  },
});