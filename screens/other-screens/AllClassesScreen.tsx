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

const mockClasses = [
  {
    id: "1",
    name: "Espresso Basics",
    instructor: "John Doe",
    date: "2024-03-20",
  },
  { id: "2", name: "Latte Art", instructor: "Jane Smith", date: "2024-03-21" },
  {
    id: "3",
    name: "Coffee Tasting",
    instructor: "Mike Johnson",
    date: "2024-03-22",
  },
];

export default function AllClassesScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: (typeof mockClasses)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ClassDetail", { classId: item.id })}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemInstructor}>Instructor: {item.instructor}</Text>
      <Text style={styles.itemDate}>Date: {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>All Classes</Text>
        <FlatList
          data={mockClasses}
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
  itemInstructor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
  },
});
