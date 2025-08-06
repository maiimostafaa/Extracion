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
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { brewLogEntry } from "../../assets/types/BrewLog/brewLogEntry";
import TastingWheel from "../../assets/components/brewLogComponents/TastingWheel";
import BrewLogBrewDataBlock from "../../assets/components/brewLogComponents/brewLogBrewDataBlock";
import BrewLogRatingStars from "../../assets/components/brewLogComponents/BrewLogRatingStars";
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
  const [showBrewMethodPicker, setShowBrewMethodPicker] = useState(false);
  const [showRoasterDatePicker, setShowRoasterDatePicker] = useState(false);
  
  // Brew method options
  const brewMethods = ['Pour Over', 'French Press', 'Cold Brew', 'Cold Drip', 'Brew Bar'];
  
  // Get brewing method icon
  const getBrewMethodIcon = (brewMethod: string) => {
    switch (brewMethod) {
      case 'French Press':
        return require('../../assets/components/brewLogComponents/icons/french_press.png');
      case 'Pour Over':
        return require('../../assets/components/brewLogComponents/icons/pour_over.png');
      case 'Cold Brew':
      case 'Cold Drip':
        return require('../../assets/components/brewLogComponents/icons/cold_brew.png');
      case 'Brew Bar':
        return require('../../assets/components/brewLogComponents/icons/brew_bar.png');
      default:
        return require('../../assets/components/brewLogComponents/icons/pour_over.png');
    }
  };
  
  // Helper function to safely parse date
  const parseRoasterDate = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // Try to parse the date string directly first
    const parsedDate = new Date(dateString);
    
    // If valid date, return it (this handles both ISO strings and formatted dates)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
    
    // If invalid date, try parsing with Date.parse which handles more formats
    const alternativeParse = Date.parse(dateString);
    if (!isNaN(alternativeParse)) {
      return new Date(alternativeParse);
    }
    
    // Try parsing common date formats manually
    // Handle "DD Month YYYY" format (e.g., "6 August 2025")
    const dateRegex = /^(\d{1,2})\s+(\w+)\s+(\d{4})$/;
    const match = dateString.match(dateRegex);
    if (match) {
      const [, day, monthName, year] = match;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
      if (monthIndex !== -1) {
        const constructedDate = new Date(parseInt(year), monthIndex, parseInt(day));
        if (!isNaN(constructedDate.getTime())) {
          return constructedDate;
        }
      }
    }
    
    // If all parsing fails, return current date as fallback
    console.warn(`Could not parse roaster date: ${dateString}, using current date`);
    return new Date();
  };

  // Editable state values
  const [editableData, setEditableData] = useState({
    name: brewLogEntry.name,
    date: brewLogEntry.date,
    image: brewLogEntry.image, // Add image to editable data
    brewMethod: brewLogEntry.brewMethod, // Add brew method to editable data
    coffeeName: brewLogEntry.coffeeBeanDetail.coffeeName,
    origin: brewLogEntry.coffeeBeanDetail.origin,
    roasterDate: parseRoasterDate(brewLogEntry.coffeeBeanDetail.roasterDate || ''), // Use helper function with fallback
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

  const formatBrewTime = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    }
    return `${seconds}s`;
  };

  const handleBack = () => {
    navigation.goBack();
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
        brewMethod: editableData.brewMethod, // Include updated brew method
        coffeeBeanDetail: {
          ...brewLogEntry.coffeeBeanDetail,
          coffeeName: editableData.coffeeName,
          origin: editableData.origin,
          roasterDate: formatDate(editableData.roasterDate), // Keep the original formatted date format
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
              
              // Navigate back to the main BrewLog screen while preserving tab navigation
              // Use popToTop to go back to the first screen in the stack, preserving tab context
              navigation.popToTop();
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

  const showRoasterDatePickerModal = () => {
    setShowRoasterDatePicker(true);
  };

  const hideRoasterDatePicker = () => {
    setShowRoasterDatePicker(false);
  };

  const handleRoasterDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowRoasterDatePicker(false);
    }
    
    if (selectedDate) {
      setEditableData(prev => ({
        ...prev,
        roasterDate: selectedDate
      }));
    }
  };

  // Handler for taste rating changes
  const handleTasteRatingChange = (taste: string, rating: number) => {
    setTasteRating(prev => ({
      ...prev,
      [taste]: rating
    }));
  };

  // Handler for star rating changes
  const handleStarRatingChange = (newRating: number) => {
    setEditableData(prev => ({
      ...prev,
      rating: newRating.toString()
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
        
        {/* Date and Brew Method with Icon */}
        <View style={styles.dateBrewMethodContainer}>
          <View style={styles.dateBrewMethodContent}>
            <TouchableOpacity style={styles.dateContainer} onPress={showDatePickerModal}>
              <Text style={styles.dateText}>{formatDate(editableData.date)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drinkNameContainer} onPress={() => setShowBrewMethodPicker(true)}>
              <Image 
                source={getBrewMethodIcon(editableData.brewMethod)}
                style={styles.brewMethodIcon}
                resizeMode="contain"
              />
              <Text style={styles.drinkNameText}>{editableData.brewMethod}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Brew Log Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={showImagePickerOptions} activeOpacity={0.8}>
            <Image
              source={
                editableData.image.startsWith('http') 
                  ? { uri: editableData.image }
                  : editableData.image.includes('BrewLogEditScreenPlaceholderInstruction.png')
                  ? require('../../assets/nonclickable-visual-elements/brewLog/BrewLogEditScreenPlaceholderInstruction.png')
                  : { uri: editableData.image }
              }
              style={styles.brewImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageOverlayText}>Tap to change photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* GENERAL SECTION - Coffee bean information */}
        <Text style={styles.sectionTitle}>General</Text>
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
          <Text style={styles.label}>Region:</Text>
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
          <TouchableOpacity onPress={showRoasterDatePickerModal}>
            <Text style={styles.editableValue}>
              {editableData.roasterDate instanceof Date && !isNaN(editableData.roasterDate.getTime()) 
                ? formatDate(editableData.roasterDate)
                : 'Select Date'
              }
            </Text>
          </TouchableOpacity>
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
        <Text style={styles.sectionTitle}>Brew Data</Text>
        <View style={styles.brewDataGrid}>
          <View style={styles.gridRow}>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/coffee_bean.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Grind Size</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.grindSize}
                onChangeText={(text) => updateField('grindSize', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/coffee_bean.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Weight (g)</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.beanWeight}
                onChangeText={(text) => updateField('beanWeight', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/water-drop.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Water (ml)</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.waterAmount}
                onChangeText={(text) => updateField('waterAmount', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/scale.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Ratio</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.ratio}
                onChangeText={(text) => updateField('ratio', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/clock.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Brew Time</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.brewTime}
                onChangeText={(text) => updateField('brewTime', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
            <View style={styles.editableBrewDataBlock}>
              <View style={styles.iconContainer}>
                <Image source={require("../../assets/icons/brewLog/thermometer.png")} style={styles.brewDataIcon} resizeMode="contain" />
              </View>
              <Text style={styles.brewDataTitle}>Temperature</Text>
              <TextInput
                style={styles.brewDataValueInput}
                value={editableData.temperature}
                onChangeText={(text) => updateField('temperature', text)}
                placeholder="enter value"
                placeholderTextColor="#8CDBED"
                keyboardType="numeric"
                textAlign="center"
              />
            </View>
          </View>
        </View>

        {/* TASTING WHEEL SECTION - Interactive */}
        <Text style={styles.sectionTitle}>Tasting Wheel</Text>
        <TastingWheel 
          tasteRating={tasteRating}
          onTasteRatingChange={handleTasteRatingChange}
        />

        {/* OVERALL RATING SECTION - Interactive star rating */}
        <Text style={styles.sectionTitle}>Overall Rating</Text>
        <View style={styles.ratingContainer}>
          <BrewLogRatingStars 
            rating={parseFloat(editableData.rating) || 0} 
            onRatingChange={handleStarRatingChange}
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

      {/* Roaster Date Picker Modal */}
      {showRoasterDatePicker && (
        <>
          {Platform.OS === 'ios' ? (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showRoasterDatePicker}
              onRequestClose={hideRoasterDatePicker}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={hideRoasterDatePicker}>
                      <Text style={styles.datePickerButton}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={hideRoasterDatePicker}>
                      <Text style={styles.datePickerButton}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={isNaN(editableData.roasterDate.getTime()) ? new Date() : editableData.roasterDate}
                    mode="date"
                    display="spinner"
                    onChange={handleRoasterDateChange}
                    style={styles.datePicker}
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={isNaN(editableData.roasterDate.getTime()) ? new Date() : editableData.roasterDate}
              mode="date"
              display="default"
              onChange={handleRoasterDateChange}
            />
          )}
        </>
      )}

      {/* Brew Method Picker Modal */}
      {showBrewMethodPicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showBrewMethodPicker}
          onRequestClose={() => setShowBrewMethodPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowBrewMethodPicker(false)}>
                  <Text style={styles.pickerButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Select Brew Method</Text>
                <TouchableOpacity onPress={() => setShowBrewMethodPicker(false)}>
                  <Text style={styles.pickerButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.pickerContent}>
                {brewMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.pickerOption,
                      editableData.brewMethod === method && styles.pickerOptionSelected
                    ]}
                    onPress={() => {
                      updateField('brewMethod', method);
                      setShowBrewMethodPicker(false);
                    }}
                  >
                    <Image 
                      source={getBrewMethodIcon(method)}
                      style={styles.pickerOptionIcon}
                      resizeMode="contain"
                    />
                    <Text style={[
                      styles.pickerOptionText,
                      editableData.brewMethod === method && styles.pickerOptionTextSelected
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333", // Match header background to extend to top
    ...Platform.select({
      android: {
        marginTop: "10%",
      },
      // iOS doesn't get the marginTop
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#333333",
    borderBottomWidth: 0.5,
    borderBottomColor: "#444444",
    height: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "#333333",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
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
    color: "#8CDBED",
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  scrollView: {
    flex: 1,
    padding: 22,
    backgroundColor: "#58595B",
  },
  dateBrewMethodContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dateBrewMethodContent: {
    alignItems: "center",
  },
  dateContainer: {
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  drinkNameContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  brewMethodIcon: {
    width: 20,
    height: 20,
    tintColor: "#8CDBED",
    resizeMode: "contain",
    marginRight: 8,
  },
  drinkNameText: {
    fontSize: 20,
    color: "#8CDBED",
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 22,
    marginBottom: 20,
  },
  brewImage: {
    width: 216,
    height: 216,
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
    fontSize: 16,
    fontWeight: "400",
    color: "#8CDBED",
    marginBottom: 16,
    marginTop: 28,
    letterSpacing: 1.0,
    textAlign: "left",
    fontFamily: 'cardRegular',
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
  },
  label: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
    flex: 1,
    fontFamily: 'cardRegular',
  },
  editableValue: {
    fontSize: 14,
    color: "#8CDBED",
    fontWeight: "400",
    flex: 1,
    textAlign: "right",
    paddingHorizontal: 4,
    fontFamily: 'cardRegular',
  },
  brewDataGrid: {
    marginBottom: 0,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
    gap: 0,
  },
  editableBrewDataBlock: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    margin: 2,
    minWidth: 100,
  },
  iconContainer: {
    marginBottom: 10,
  },
  brewDataIcon: {
    width: 36,
    height: 36,
    tintColor: "#FFFFFF",
  },
  brewDataTitle: {
    fontSize: 14,
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    fontFamily: 'cardRegular',
  },
  brewDataValueInput: {
    fontSize: 14,
    color: "#8CDBED", // Light blue for edit screen
    fontWeight: "500",
    textAlign: "center",
    fontFamily: 'cardRegular',
    minWidth: 60,
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderBottomWidth: 0,
  },
  ratingContainer: {
    alignItems: "center",
  },
  ratingInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  ratingInputLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
    fontFamily: 'cardRegular',
    marginRight: 12,
  },
  ratingInput: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "400",
    fontFamily: 'cardRegular',
    textAlign: "center",
    minWidth: 60,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#666666",
  },
  deleteButtonContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ed5858ff",
    borderWidth: 0,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    minWidth: 280,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "400",
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
    paddingBottom: 34,
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
    color: "#8CDBED",
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  datePicker: {
    backgroundColor: "white",
    width: "100%",
    alignSelf: "center",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    width: "100%",
    maxHeight: "50%",
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    fontFamily: 'cardRegular',
  },
  pickerButton: {
    fontSize: 16,
    color: "#8CDBED",
    fontWeight: "600",
    fontFamily: 'cardRegular',
  },
  pickerContent: {
    maxHeight: 300,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  pickerOptionSelected: {
    backgroundColor: "#F0F8FF",
  },
  pickerOptionIcon: {
    width: 24,
    height: 24,
    tintColor: "#333",
    resizeMode: "contain",
    marginRight: 12,
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "400",
    fontFamily: 'cardRegular',
  },
  pickerOptionTextSelected: {
    color: "#8CDBED",
    fontWeight: "600",
  },
});

export default BrewLogEditScreen;
