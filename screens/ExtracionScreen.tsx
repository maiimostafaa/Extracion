import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import type { ImageSourcePropType } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import Header from "../navigation/Header";
import BrewingMethodCard from "../assets/components/extracion/BrewingMethodCard";
import { Ionicons } from '@expo/vector-icons';

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
  const [showBLEModal, setShowBLEModal] = useState(true);

  const handleMethodSelect = (method: BrewingMethod) => {
    // Navigate to ExtracionConfigScreen when any brewing method is selected
    navigation.navigate('ExtracionConfigScreen');
  };

  const handleBLEModalClose = () => {
    setShowBLEModal(false);
  };

  const handleContinue = () => {
    // Here you would typically handle BLE connection
    setShowBLEModal(false);
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

      {/* BLE Connection Modal */}
      <Modal
        visible={showBLEModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleBLEModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleBLEModalClose}
            >
              <Ionicons name="close" size={28} color="#666666" />
            </TouchableOpacity>

            {/* Status Bar */}
            <View style={styles.statusBar} />

            {/* French Press Icon */}
            <Image
              source={require('../assets/nonclickable-visual-elements/extracion_coffeeMachine.png')}
              style={styles.frenchPressModalIcon}
            />

            {/* Title */}
            <Text style={styles.modalTitle}>Turn on your Extracion</Text>

            {/* Subtitle */}
            <Text style={styles.modalSubtitle}>Continue when it's on.</Text>

            {/* Continue Button */}
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: 'center',
    position: 'relative',
    maxHeight: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    left: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    width: 60,
    height: 6,
    backgroundColor: '#D1D1D1',
    borderRadius: 3,
    marginBottom: 40,
    position: 'absolute',
    top: 15,
  },
  frenchPressModalIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  continueButton: {
    backgroundColor: '#8CDBED',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});
