import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from "react-native";
import type { ImageSourcePropType } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import Header from "../navigation/Header";
import BrewingMethodCard from "../assets/components/extracion/BrewingMethodCard";

// Import images for each brewing method
const frenchPressImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const pourOverImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const coldDripImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");
const brewBarImage = require("../assets/nonclickable-visual-elements/extracion_coffeeMachine.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BrewingMethod {
  id: string;
  name: string;
  icon: string;
  image: ImageSourcePropType;
}

const brewingMethods: BrewingMethod[] = [
  {
    id: "french_press",
    name: "french press",
    icon: "cafe",
    image: frenchPressImage,
  },
  {
    id: "pour_over",
    name: "pour over",
    icon: "water",
    image: pourOverImage,
  },
  {
    id: "cold_drip",
    name: "cold drip",
    icon: "snow",
    image: coldDripImage,
  },
  {
    id: "brew_bar",
    name: "brew bar",
    icon: "flask",
    image: brewBarImage,
  },
];

export default function ExtractionScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleMethodSelect = (method: BrewingMethod) => {
    // Navigate to ExtracionConfigScreen when any brewing method is selected
    navigation.navigate('ExtracionConfigScreen');
  };

  const renderBrewingMethodCard = (method: BrewingMethod, index: number) => (
    <View key={method.id} style={styles.cardContainer}>
      <BrewingMethodCard
        title={method.name}
        image={method.image}
        onPress={() => handleMethodSelect(method)}
        isSelected={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header tintColor="#333" />
      </View>

      <View style={styles.content}>
        <View style={styles.methodsContainer}>
          <Text style={styles.sectionTitle}>choose your brewing method</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {brewingMethods.map(renderBrewingMethodCard)}
          </ScrollView>
          
          {/* Page indicators */}
          {/* <View style={styles.pageIndicators}>
            {brewingMethods.map((_, index) => (
              <View
                key={index}
                style={styles.pageIndicator}
              />
            ))}
          </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    color: "#333",
    marginBottom: 24,
  },
  methodsContainer: {
    flex: 1,
    alignItems: "center",
  },
  carousel: {
    marginVertical: 20,
    height: 400, // Make carousel taller
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  cardContainer: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width * 0.8,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  pageIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 6,
  },
  activePageIndicator: {
    backgroundColor: '#333',
  },
});
