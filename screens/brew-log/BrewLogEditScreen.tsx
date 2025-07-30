import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { brewLogEntry } from "../../assets/types/BrewLog/brewLogEntry";
import TastingWheel from "../../assets/components/brewLogComponents/TastingWheel";
import { addBrewLog, loadBrewLogs, saveBrewLogs, deleteBrewLog, storeImagePermanently } from "../../brewLogStorage";

type EditScreenRouteProp = RouteProp<RootStackParamList, "BrewLogEditScreen">;
type EditScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "BrewLogEditScreen">;

const BrewLogEditScreen: React.FC = () => {
  const route = useRoute<EditScreenRouteProp>();
  const navigation = useNavigation<EditScreenNavigationProp>();
  
  // Get brewLogEntry from route params - it's always required
  const brewLogEntry = route.params.brewLogEntry;
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Editable state values
  const [editableData, setEditableData] = useState({
    name: brewLogEntry.name,
    date: brewLogEntry.date,
    image: brewLogEntry.image, // Add image to editable data
    coffeeName: brewLogEntry.coffeeBeanDetail.coffeeName,
    origin: brewLogEntry.coffeeBeanDetail.origin,
    roasterDate: brewLogEntry.coffeeBeanDetail.roasterDate,
    roasterLevel: brewLogEntry.coffeeBeanDetail.roasterLevel,
    bagWeight: brewLogEntry.coffeeBeanDetail.bagWeight.toString(),
    grindSize: brewLogEntry.brewDetail.grindSize.toString(),
    beanWeight: brewLogEntry.brewDetail.beanWeight.toString(),
    waterAmount: brewLogEntry.brewDetail.waterAmount.toString(),
    ratio: brewLogEntry.brewDetail.ratio.toString(),
    brewTime: brewLogEntry.brewDetail.brewTime.toString(),
    temperature: brewLogEntry.brewDetail.temperature.toString(),
    rating: brewLogEntry.rating.toString(),
  });

  // Separate state for taste ratings
  const [tasteRating, setTasteRating] = useState(brewLogEntry.tasteRating);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    try {
      // Create updated brew log entry from editable data
      const updatedEntry: brewLogEntry = {
        ...brewLogEntry,
        name: editableData.name,
        date: editableData.date,
        image: editableData.image, // Include updated image
        coffeeBeanDetail: {
          ...brewLogEntry.coffeeBeanDetail,
          coffeeName: editableData.coffeeName,
          origin: editableData.origin,
          roasterDate: editableData.roasterDate,
          roasterLevel: editableData.roasterLevel,
          bagWeight: parseInt(editableData.bagWeight) || 0,
        },
        brewDetail: {
          ...brewLogEntry.brewDetail,
          grindSize: parseInt(editableData.grindSize) || 0,
          beanWeight: parseInt(editableData.beanWeight) || 0,
          waterAmount: parseInt(editableData.waterAmount) || 0,
          ratio: parseInt(editableData.ratio) || 0,
          brewTime: parseInt(editableData.brewTime) || 0,
          temperature: parseInt(editableData.temperature) || 0,
        },
        tasteRating: tasteRating, // Include updated taste ratings
        rating: parseFloat(editableData.rating) || 0,
      };

      // Check if this is a new entry (by checking if ID exists in storage)
      const existingLogs = await loadBrewLogs();
      const isNewEntry = !existingLogs.some(log => log.id === brewLogEntry.id);
      
      if (isNewEntry) {
        // Generate a proper ID for new entry
        updatedEntry.id = Date.now();
        await addBrewLog(updatedEntry);
      } else {
        // Update existing entry
        const updatedLogs = existingLogs.map(log => 
          log.id === brewLogEntry.id ? updatedEntry : log
        );
        await saveBrewLogs(updatedLogs);
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Error saving brew log:', error);
      // TODO: Show error alert to user
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Brew Log',
      'Are you sure you want to delete this brew log? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the entry first
              await deleteBrewLog(brewLogEntry.id);
              
              // Navigate back to the main BrewLog screen properly
              // Reset navigation stack to ensure we go back to the main list, not a modal
              navigation.reset({
                index: 0,
                routes: [{ name: 'BrewLogScreen' }],
              });
            } catch (error) {
              console.error('Error deleting brew log:', error);
              Alert.alert('Error', 'Failed to delete brew log');
            }
          },
        },
      ]
    );
  };

  const updateField = (field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateDate = (newDate: Date) => {
    setEditableData(prev => ({
      ...prev,
      date: newDate
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      updateDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  // Handler for taste rating changes
  const handleTasteRatingChange = (taste: string, rating: number) => {
    setTasteRating(prev => ({
      ...prev,
      [taste]: rating
    }));
  };

  // Camera and Image picker functions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Camera permission is required to take photos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Photo Library',
          onPress: openImageLibrary,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const openCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Store image using the enhanced storage function
        const permanentUri = await storeImagePermanently(result.assets[0].uri, brewLogEntry.id);
        
        setEditableData(prev => ({
          ...prev,
          image: permanentUri
        }));
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Store image using the enhanced storage function
        const permanentUri = await storeImagePermanently(result.assets[0].uri, brewLogEntry.id);
        
        setEditableData(prev => ({
          ...prev,
          image: permanentUri
        }));
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Error', 'Failed to open photo library');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Modal Header with Cancel and Save buttons */}
      <View style={styles.modalHeader}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={styles.modalTitle}>Edit Brew Log</Text>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        
        {/* Date */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={showDatePickerModal}>
            <Text style={styles.editableDateText}>
              {formatDate(editableData.date)}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Drink Name */}
        <View style={styles.drinkNameContainer}>
          <TextInput
            style={styles.editableDrinkNameText}
            value={editableData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Drink Name"
            placeholderTextColor="#666"
          />
        </View>
        
        {/* Brew Log Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={showImagePickerOptions} activeOpacity={0.8}>
            <Image
              source={{ uri: editableData.image }}
              style={styles.brewImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>Tap to change photo</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Header Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>#{brewLogEntry.id}</Text>
        </View>

        {/* GENERAL SECTION - Coffee bean information */}
        <Text style={styles.sectionTitle}>general</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coffee Name:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.coffeeName}
            onChangeText={(text) => updateField('coffeeName', text)}
            placeholder="Coffee Name"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Origin:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.origin}
            onChangeText={(text) => updateField('origin', text)}
            placeholder="Origin"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roaster Date:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.roasterDate}
            onChangeText={(text) => updateField('roasterDate', text)}
            placeholder="Roaster Date"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Roaster Level:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.roasterLevel}
            onChangeText={(text) => updateField('roasterLevel', text)}
            placeholder="Roaster Level"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Bag Weight:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.bagWeight}
            onChangeText={(text) => updateField('bagWeight', text)}
            placeholder="Bag Weight"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {/* BREW DATA SECTION - Brewing parameters */}
        <Text style={styles.sectionTitle}>brew data</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Grind Size:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.grindSize}
            onChangeText={(text) => updateField('grindSize', text)}
            placeholder="Grind Size"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Coffee (Weight):</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.beanWeight}
            onChangeText={(text) => updateField('beanWeight', text)}
            placeholder="Coffee Weight"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Water (Weight):</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.waterAmount}
            onChangeText={(text) => updateField('waterAmount', text)}
            placeholder="Water Amount"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Ratio:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.ratio}
            onChangeText={(text) => updateField('ratio', text)}
            placeholder="Ratio"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.brewTime}
            onChangeText={(text) => updateField('brewTime', text)}
            placeholder="Brew Time (seconds)"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Temperature:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.temperature}
            onChangeText={(text) => updateField('temperature', text)}
            placeholder="Temperature"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {/* TASTING WHEEL SECTION - Interactive */}
        <Text style={styles.sectionTitle}>tasting wheel</Text>
        <TastingWheel 
          tasteRating={tasteRating}
          onTasteRatingChange={handleTasteRatingChange}
        />

        {/* OVERALL RATING SECTION - Final rating */}
        <Text style={styles.sectionTitle}>overall rating</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Rating:</Text>
          <TextInput
            style={styles.editableValue}
            value={editableData.rating}
            onChangeText={(text) => updateField('rating', text)}
            placeholder="Rating (0-5)"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        {/* DELETE BUTTON SECTION */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete Brew Log</Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={hideDatePicker}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={hideDatePicker}>
                      <Text style={styles.datePickerButton}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={hideDatePicker}>
                      <Text style={styles.datePickerButton}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={editableData.date}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={editableData.date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#58595B",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#333333",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    fontFamily: 'cardRegular',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#8CDBED", // App's accent color instead of iOS blue
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  dateContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  drinkNameContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  editableDateText: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    textAlign: "center",
    fontFamily: 'cardRegular',
  },
  editableDrinkNameText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    minWidth: 200,
    fontFamily: 'cardRegular',
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  brewImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'cardRegular',
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#8CDBED",
    marginBottom: 16,
    marginTop: 24,
    letterSpacing: 1.2,
    textAlign: "left",
    fontFamily: 'cardRegular',
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
  },
  label: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    flex: 1,
    fontFamily: 'cardRegular',
  },
  editableValue: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
    paddingHorizontal: 4,
    fontFamily: 'cardRegular',
  },
  tasteGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tasteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "48%",
    marginBottom: 8,
    paddingVertical: 4,
  },
  tasteLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  tasteValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    fontFamily: 'cardRegular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding for iOS
    width: "100%",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  datePickerButton: {
    fontSize: 16,
    color: "#8CDBED", // App's accent color instead of iOS blue
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  datePicker: {
    backgroundColor: "white",
    width: "100%",
    alignSelf: "center",
  },
  deleteButtonContainer: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FF3B30",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 200,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FF3B30",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
});

export default BrewLogEditScreen;
