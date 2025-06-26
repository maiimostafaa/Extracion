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

const mockBeans = [
  {
    id: "1",
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    roast: "Light",
  },
  { id: "2", name: "Colombian Supremo", origin: "Colombia", roast: "Medium" },
  { id: "3", name: "Sumatra Mandheling", origin: "Indonesia", roast: "Dark" },
];

export default function AllBeansScreen() {
  const navigation = useNavigation<NavigationProp>();

  const renderItem = ({ item }: { item: (typeof mockBeans)[0] }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("BeanDetail", { beanId: item.id })}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemOrigin}>Origin: {item.origin}</Text>
      <Text style={styles.itemRoast}>Roast: {item.roast}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>All Beans</Text>
        <FlatList
          data={mockBeans}
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
  itemOrigin: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  itemRoast: {
    fontSize: 14,
    color: "#666",
  },
});
