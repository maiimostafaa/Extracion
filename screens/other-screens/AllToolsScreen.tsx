import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const mockTools = [
  { id: "1", name: "Espresso Machine", brand: "Breville", price: "$699" },
  { id: "2", name: "Coffee Grinder", brand: "Baratza", price: "$199" },
  { id: "3", name: "Pour Over Set", brand: "Hario", price: "$49" },
];

export default function AllToolsScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: (typeof mockTools)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ToolDetail", { toolId: item.id })}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemBrand}>Brand: {item.brand}</Text>
      <Text style={styles.itemPrice}>Price: {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>All Tools</Text>
        <FlatList
          data={mockTools}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    gap: 10,
  },
  item: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  itemBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
  },
});
