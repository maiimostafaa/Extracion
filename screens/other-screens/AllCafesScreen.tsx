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

const mockCafes = [
  { id: "1", name: "Coffee Lab", location: "Downtown", rating: 4.5 },
  { id: "2", name: "Brew House", location: "Westside", rating: 4.8 },
  { id: "3", name: "Bean Scene", location: "Eastside", rating: 4.2 },
];

export default function AllCafesScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: (typeof mockCafes)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("CafeDetail", { cafeId: item.id })}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemLocation}>Location: {item.location}</Text>
      <Text style={styles.itemRating}>Rating: {item.rating} ⭐</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>All Cafes</Text>
        <FlatList
          data={mockCafes}
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
  itemLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  itemRating: {
    fontSize: 14,
    color: "#666",
  },
});
