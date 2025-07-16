import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import ExtracionParameterTile from '../assets/components/extracion/ExtracionParameterTile';
import ExtracionDualParameterTile from '../assets/components/extracion/ExtracionDualParameterTile';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ExtracionConfigScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  
  // State for parameter values
  const [coffeeBeans, setCoffeeBeans] = useState('18g');
  const [water, setWater] = useState('270ml');
  const [grind, setGrind] = useState('coarse');
  const [brewTime, setBrewTime] = useState('4:00');
  const [cupCount, setCupCount] = useState(1);

  // State for dropdown
  const [selectedMode, setSelectedMode] = useState('brew guide');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for grind modal
  const [isGrindModalOpen, setIsGrindModalOpen] = useState(false);

  // State for brew time modal
  const [isBrewTimeModalOpen, setIsBrewTimeModalOpen] = useState(false);

  // State for tutorial navigation
  const [tutorialStep, setTutorialStep] = useState(0);

  // Grind size options
  const grindOptions = [
    { 
      id: 'extra-coarse', 
      name: 'extra-coarse', 
      feelsLike: 'rock salt',
      icon: require('../assets/icons/extracion/grindSizeIcons/extra-coarse.png'),
    },
    { 
      id: 'coarse', 
      name: 'coarse', 
      feelsLike: 'sea salt',
      icon: require('../assets/icons/extracion/grindSizeIcons/coarse.png'),
    },
    { 
      id: 'medium-coarse', 
      name: 'medium-coarse', 
      feelsLike: 'rough sand',
      icon: require('../assets/icons/extracion/grindSizeIcons/medium-coarse.png'),
    },
    { 
      id: 'medium', 
      name: 'medium', 
      feelsLike: 'sand',
      icon: require('../assets/icons/extracion/grindSizeIcons/medium.png'),
    },
    { 
      id: 'medium-fine', 
      name: 'medium-fine', 
      feelsLike: 'table salt',
      icon: require('../assets/icons/extracion/grindSizeIcons/medium-fine.png'),
    },
    { 
      id: 'fine', 
      name: 'fine', 
      feelsLike: 'sugar',
      icon: require('../assets/icons/extracion/grindSizeIcons/fine.png'),
    },
    { 
      id: 'extra-fine', 
      name: 'extra-fine', 
      feelsLike: 'flour',
      icon: require('../assets/icons/extracion/grindSizeIcons/extra-fine.png'),
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNavigateToCoffeeBeans = () => {
    navigation.navigate('ExtracionCoffeeBeanListScreen');
  };

  const handleCoffeeBeansAndWaterPress = () => {
    // Navigate to the coffee and water adjustment screen
    navigation.navigate('ExtracionCoffeeToWaterScreen', {
      coffeeBeans,
      water,
      onUpdate: (newCoffeeBeans: string, newWater: string) => {
        setCoffeeBeans(newCoffeeBeans);
        setWater(newWater);
      }
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setIsDropdownOpen(false);
    // Reset tutorial step when switching modes
    if (mode === 'how to tutorial') {
      setTutorialStep(0);
    }
  };

  const handleNextTutorial = () => {
    // Add logic to navigate to next tutorial step
    setTutorialStep(prev => prev + 1);
    console.log('Next tutorial step:', tutorialStep + 1);
  };

  const handlePreviousTutorial = () => {
    // Add logic to navigate to previous tutorial step
    setTutorialStep(prev => Math.max(prev - 1, 0));
    console.log('Previous tutorial step:', tutorialStep - 1);
  };

  const handleTilePress = (tileType: string) => {
    if (tileType === 'grind') {
      setIsGrindModalOpen(true);
    } else if (tileType === 'brewTime') {
      setIsBrewTimeModalOpen(true);
    } else {
      // Handle other tile presses
      console.log(`Pressed ${tileType} tile`);
    }
  };

  const handleGrindSelect = (selectedGrind: string) => {
    setGrind(selectedGrind);
  };

  const handleGrindModalClose = () => {
    setIsGrindModalOpen(false);
  };

  const handleBrewTimeModalClose = () => {
    setIsBrewTimeModalOpen(false);
  };

  const handleBrewTimeChange = (minutes: number, seconds: number) => {
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    setBrewTime(formattedTime);
  };

  // Get current time values for display
  const getCurrentMinutes = () => parseInt(brewTime.split(':')[0]);
  const getCurrentSeconds = () => parseInt(brewTime.split(':')[1]);

  const handleCupCountChange = (increment: boolean) => {
    if (increment) {
      setCupCount(prev => Math.min(prev + 1, 8)); // Max 8 cups for French Press
    } else {
      setCupCount(prev => Math.max(prev - 1, 1)); // Min 1 cup
    }
  };

  const handleStart = () => {
    console.log('Starting brewing process...');
    // Navigate to brewing screen or start process
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#333333" />
      
      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.brewGuideSelector} onPress={handleDropdownToggle}>
              <Text style={styles.headerTitle}>{selectedMode}</Text>
              <View style={styles.dropdownButton}>
                <Ionicons 
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#8CDBED"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerEllipsis}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Dropdown Overlay */}
      {isDropdownOpen && (
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownCard}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleModeSelect('brew guide')}
            >
              <Text style={styles.dropdownText}>brew guide</Text>
              {selectedMode === 'brew guide' && (
                <Ionicons name="checkmark" size={21} color="#FFFFFF" style={styles.checkmark} />
              )}
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleModeSelect('how to tutorial')}
            >
              <Text style={styles.dropdownText}>how to tutorial</Text>
              {selectedMode === 'how to tutorial' && (
                <Ionicons name="checkmark" size={21} color="#FFFFFF" style={styles.checkmark} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Content - Conditional based on selected mode */}
      {selectedMode === 'brew guide' ? (
        <>
          {/* Navigation Bar - Only for brew guide mode */}
          <View style={styles.selectCoffeeBeansContainer}>
            <View style={styles.selectCoffeeBeans}>
              <TouchableOpacity style={styles.navLeft} onPress={handleNavigateToCoffeeBeans}>
                <Image 
                  source={require('../assets/icons/extracion_coffeebean.png')} 
                  style={styles.navIcon}
                />
                <Text style={styles.navText}>select coffee beans</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navRight} onPress={handleNavigateToCoffeeBeans}>
                <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Brew Guide Content */}
          <View style={styles.content}>
            {/* Cup counter icon */}
            <Image
              source={require('../assets/nonclickable-visual-elements/extracion_config_cupCountIcon.png')}
              style={styles.cupIcon}
            />
            {/* Cup Counter */}
            <View style={styles.cupCounterContainer}>
              <View style={styles.cupCounter}>
                <TouchableOpacity 
                  style={styles.cupButton}
                  onPress={() => handleCupCountChange(false)}
                >
                  <Ionicons name="remove" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.cupCountText}>{cupCount}x</Text>
                <TouchableOpacity
                  style={styles.cupButton} 
                  onPress={() => handleCupCountChange(true)}
                >
                  <Ionicons name="add" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Parameter Tiles Grid */}
            <View style={styles.parametersContainer}>
              {/* Dual Parameter Tile for Coffee Beans and Water */}
              <ExtracionDualParameterTile
                leftIcon={require('../assets/icons/extracion_coffeebean.png')}
                leftTitle="coffee beans"
                leftValue={coffeeBeans}
                rightIcon={require('../assets/icons/extracion_water.png')}
                rightTitle="water"
                rightValue={water}
                onPress={handleCoffeeBeansAndWaterPress}
              />
              
              {/* Bottom Row - Individual Tiles */}
              <View style={styles.bottomRow}>
                <ExtracionParameterTile
                  icon={require('../assets/icons/extracion_grindsize.png')}
                  title="grind"
                  value={grind}
                  onPress={() => handleTilePress('grind')}
                />
                <ExtracionParameterTile
                  icon={require('../assets/icons/extracion_timer.png')}
                  title="brew time"
                  value={brewTime}
                  onPress={() => handleTilePress('brewTime')}
                />
              </View>
            </View>

            {/* Start Button */}
            <View style={styles.startButtonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        // Tutorial Guide Content
        <View style={styles.tutorialContent}>
          {/* Back Button - Only show if not on first step */}
          {tutorialStep > 0 && (
            <View style={styles.backButtonContainer}>
              <TouchableOpacity style={styles.backTutorialButton} onPress={handlePreviousTutorial}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.tutorialCard}>
            {/* Tutorial Content based on current step */}
            {tutorialStep === 0 && (
              <>
                {/* French Press Icon */}
                <Image
                  source={require('../assets/nonclickable-visual-elements/extracion_frenchPressLogo.png')}
                  style={styles.frenchPressIcon}
                />

                {/* French Press Title */}
                <Text style={styles.frenchPressTitle}>French Press</Text>

                <Text style={styles.thingsNeededTitle}>Things you'll need</Text>
                <View style={styles.requirementsList}>
                  <Text style={styles.requirementItem}>30g - Ground coffee</Text>
                  <Text style={styles.requirementItem}>450ml - Boiled water at 94°C</Text>
                  <Text style={styles.requirementItem}>1 x Kettle</Text>
                  <Text style={styles.requirementItem}>1 x Cup</Text>
                  <Text style={styles.requirementItem}>1 x Spoon</Text>
                </View>
              </>
            )}

            {tutorialStep === 1 && (
              <>
                <Image
                  source={require('../assets/nonclickable-visual-elements/extracion_kettleIcon.png')}
                  style={styles.kettleIcon}
                />
                <Text style={styles.kettleTitle}>Boil the kettle</Text>
                <Text style={styles.kettleInstructions}>
                  We recommend boiling more water{'\n'}to keep your cup warm while you brew.
                </Text>
              </>
            )}

            {tutorialStep === 2 && (
              <>
                <Image
                  source={require('../assets/nonclickable-visual-elements/extracion_grinder.png')}
                  style={styles.kettleIcon}
                />
                <Text style={styles.kettleTitle}>Weigh out the coffee and{'\n'}grind it</Text>
                <Text style={styles.kettleInstructions}>
                  Make sure you adjust the grinder first{'\n'}to get the right grind size.
                </Text>
              </>
            )}

            {tutorialStep === 3 && (
              <>
               <Image
                  source={require('../assets/nonclickable-visual-elements/extracion_takeOutFilter.png')}
                  style={styles.takeOutFilter}
                />
                <Text style={styles.kettleTitle}>Take out the filter part of{'\n'}the vessel</Text>
              </>
            )}

            {tutorialStep === 4 && (
              <>
                <Image
                  source={require('../assets/nonclickable-visual-elements/extracion_checkMark.png')}
                  style={styles.kettleIcon}
                />
                <Text style={styles.kettleTitle}>Turn on Extracion</Text>
                <Text style={styles.kettleInstructions}>
                  Make sure your Extracion is on{'\n'}and you are all set!
                </Text>
              </>
            )}
          </View>
          
          {/* Next Button - Hide on last step */}
          {tutorialStep < 4 && (
            <View style={styles.nextButtonContainer}>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextTutorial}>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {/* Grind Size Modal */}
      <Modal
        visible={isGrindModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleGrindModalClose}
      >
        <View style={styles.grindModalOverlay}>
          <View style={styles.grindModalContent}>
            {/* Modal Header */}
            <View style={styles.grindModalHeader}>
              <View style={styles.grindModalIndicator} />
            </View>
            
            {/* Modal Content */}
            <View style={styles.grindContent}>
              {/* Header Row */}
              <View style={styles.grindHeaderRow}>
                <View style={styles.grindOptionLeft}>
                  <Text style={styles.grindColumnHeader}>Grind size</Text>
                </View>
                <View style={styles.grindOptionCenter}>
                  <Text style={styles.grindColumnHeader}>Feels like</Text>
                </View>
                <View style={styles.grindOptionRight}>
                  <Text style={styles.grindColumnHeader}>Best for</Text>
                </View>
              </View>
              
              {/* Grind Options */}
              {grindOptions.map((option) => (
                <View key={option.id} style={styles.grindOptionRow}>
                  <View style={styles.grindOptionLeft}>
                    <TouchableOpacity
                      style={[
                        styles.grindSizeButton,
                        grind === option.name && styles.grindSizeButtonSelected
                      ]}
                      onPress={() => handleGrindSelect(option.name)}
                    >
                      <Text style={[
                        styles.grindOptionName,
                        grind === option.name && styles.grindOptionNameSelected
                      ]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.grindOptionCenter}>
                    <Text style={styles.grindOptionFeels}>
                      {option.feelsLike}
                    </Text>
                  </View>
                  
                  <View style={styles.grindOptionRight}>
                    {/* Grind size icon */}
                    <Image 
                      source={option.icon} 
                      style={styles.grindSizeIcon}
                    />
                  </View>
                </View>
              ))}
            </View>
            
            {/* Save Button */}
            <View style={styles.grindSaveContainer}>
              <TouchableOpacity 
                style={styles.grindSaveButton} 
                onPress={handleGrindModalClose}
              >
                <Text style={styles.grindSaveButtonText}>save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Brew Time Modal */}
      <Modal
        visible={isBrewTimeModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={handleBrewTimeModalClose}
      >
        <View style={styles.timeModalOverlay}>
          <View style={styles.timeModalContent}>
            {/* Modal Header */}
            <View style={styles.timeModalHeader}>
              <View style={styles.timeModalIndicator} />
            </View>
            
            {/* Modal Content */}
            <View style={styles.timeModalBody}>
              {/* Time Picker */}
              <View style={styles.timePickerContainer}>
                {/* Minutes Column */}
                <View style={styles.timeColumn}>
                  <View style={styles.pickerColumn}>
                    <ScrollView 
                      style={styles.timeScrollView}
                      contentContainerStyle={styles.timeScrollContent}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={40}
                      snapToAlignment="start"
                      decelerationRate="fast"
                      contentOffset={{ x: 0, y: (getCurrentMinutes() - 1) * 40 }}
                      onMomentumScrollEnd={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        const index = Math.round(offsetY / 40);
                        const minute = Math.max(1, Math.min(8, index + 1));
                        handleBrewTimeChange(minute, getCurrentSeconds());
                      }}
                    >
                      {Array.from({ length: 8 }, (_, i) => i + 1).map((minute) => (
                        <TouchableOpacity
                          key={minute}
                          style={styles.timeOption}
                          onPress={() => handleBrewTimeChange(minute, getCurrentSeconds())}
                        >
                          <Text style={[
                            styles.timeOptionText,
                            getCurrentMinutes() === minute && styles.timeOptionTextSelected
                          ]}>
                            {minute}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    
                    {/* Selection Indicator */}
                    <View style={styles.selectionIndicator}>
                      <View style={styles.separatorLine} />
                      <View style={styles.selectionArea}>
                        <Text style={styles.selectionLabel}>min</Text>
                      </View>
                      <View style={styles.separatorLine} />
                    </View>
                  </View>
                </View>
                
                {/* Seconds Column */}
                <View style={styles.timeColumn}>
                  <View style={styles.pickerColumn}>
                    <ScrollView 
                      style={styles.timeScrollView}
                      contentContainerStyle={styles.timeScrollContent}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={40}
                      snapToAlignment="start"
                      decelerationRate="fast"
                      contentOffset={{ x: 0, y: (getCurrentSeconds() / 5) * 40 }}
                      onMomentumScrollEnd={(event) => {
                        const offsetY = event.nativeEvent.contentOffset.y;
                        const index = Math.round(offsetY / 40);
                        const second = Math.max(0, Math.min(55, index * 5));
                        handleBrewTimeChange(getCurrentMinutes(), second);
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i * 5).map((second) => (
                        <TouchableOpacity
                          key={second}
                          style={styles.timeOption}
                          onPress={() => handleBrewTimeChange(getCurrentMinutes(), second)}
                        >
                          <Text style={[
                            styles.timeOptionText,
                            getCurrentSeconds() === second && styles.timeOptionTextSelected
                          ]}>
                            {second.toString().padStart(2, '0')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    
                    {/* Selection Indicator */}
                    <View style={styles.selectionIndicator}>
                      <View style={styles.separatorLine} />
                      <View style={styles.selectionArea}>
                        <Text style={styles.selectionLabel}>sec</Text>
                      </View>
                      <View style={styles.separatorLine} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Save Button */}
            <View style={styles.timeSaveContainer}>
              <TouchableOpacity 
                style={styles.timeSaveButton} 
                onPress={handleBrewTimeModalClose}
              >
                <Text style={styles.timeSaveButtonText}>save changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#333333',
  },
  headerContent: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brewGuideSelector: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: "#fff",
    flex: 1,
    justifyContent: "center"
   
  },
  headerTitle: {
    textAlign: "center",
 
    fontSize: 18,
    fontWeight: '600',
    color: '#8CDBED',
    // marginLeft: 90,
  },
  headerEllipsis: {
    width: 40
  },
  dropdownButton: {
    marginTop: 3,
    width: 18,
    height: 18,
    marginLeft: 10,
    borderRadius: 10,
    backgroundColor: "#8CDBED80",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 92, // Position below the header
  },
  dropdownCard: {
    backgroundColor: '#58595B',
    borderRadius: 10,
    width: '60%', // Takes up at most half the screen width
    maxWidth: 200, // Maximum width constraint
    minWidth: 160, // Minimum width to ensure readability
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 44, // Position below the header
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 10,
  },
  dropdown: {
    backgroundColor: '#58595B',
    borderRadius: 8,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedDropdownItem: {
    backgroundColor: '#58595B',
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  checkmark: {

  },
  dropdownDivider: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 15,
  },
  selectCoffeeBeans: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#58595B',
    borderRadius: 50,
  },
  selectCoffeeBeansContainer: {
    paddingTop: 40,
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
    marginRight: 8,
    resizeMode: "contain",
  },
  navText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  navRight: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'flex-start', // Changed from default to start from top
  },
  cupIcon: {
    width: "100%",
    height: 30,
    marginLeft: 7,
    resizeMode: 'contain',
  },
  cupCounterContainer: {
    marginBottom: 32,
  },
  cupCounterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cupCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cupButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#58595B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cupCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#078CC9',
    marginHorizontal: 16,
  },
  parametersContainer: {
    width: '85%',
    alignSelf: 'center',
    marginBottom: 40,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  startButtonContainer: {
    marginTop: 'auto', // Push to bottom
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  startButton: {
    backgroundColor: '#8CDBED', // Theme blue color
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000', // Black text
  },
  // Tutorial Mode Styles
  tutorialContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 90,
    backgroundColor: '#FFFFFF',
  },
  tutorialCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 40,
    flex: 1,
  },
  frenchPressIcon: {
    width: 60,
    height: 60,
    tintColor: '#078CC9',
    marginBottom: 10,
    resizeMode: 'contain',
  },
  frenchPressTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#078CC9',
    marginBottom: 55,
    textAlign: 'center',
  },
  thingsNeededTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#58595B',
    marginBottom: 32,
    textAlign: 'center',
  },
  kettleIcon: {
    width: 120,
    height: 120,
    marginBottom: 30,
    resizeMode: 'contain',
    marginTop: 50,
  },
  takeOutFilter: {
    width: 120,
    height: 170,
    marginBottom: 30,
    resizeMode: 'contain',
    marginTop: 0
  },
  kettleTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#58595B',
    marginBottom: 20,
    textAlign: 'center',
  },
  kettleInstructions: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  requirementsList: {
    width: '100%',
    alignItems: 'flex-start',
  },
  requirementItem: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 16,
    lineHeight: 24,
    paddingLeft: 26,
  },
  nextButtonContainer: {
    position: 'absolute',
    bottom: 50,
    right: 40,
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 40,
  },
  backTutorialButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#8CDBED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  nextButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#8CDBED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  
  // Grind Modal Styles
  grindModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  grindModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
  },
  grindModalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  grindModalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
  },
  grindContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  grindScrollView: {
    flex: 1,
  },
  grindScrollContent: {
    paddingBottom: 20,
  },
  grindHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  grindColumnHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    textAlign: 'center',
  },
  grindOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 3,
  },
  grindOptionSelected: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  grindOptionLeft: {
    width: '50%',
    alignItems: 'center',
  },
  grindSizeButton: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    minWidth: 150,
    maxWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grindSizeButtonSelected: {
    backgroundColor: '#8CDBED',
    borderColor: '#8CDBED',
  },
  grindOptionName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333333',
  },
  grindOptionNameSelected: {
    fontWeight: '400',
    color: '#333333',
  },
  grindOptionCenter: {
    width: '28%',
    alignItems: 'center',
  },
  grindOptionFeels: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  grindOptionRight: {
    width: '22%',
    alignItems: 'center',
  },
  grindIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grindSizeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  grindIconText: {
    fontSize: 12,
  },
  grindSaveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  grindSaveButton: {
    backgroundColor: '#8CDBED',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  grindSaveButtonText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333333',
  },
  
  // Brew Time Modal Styles
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
  },
  timeColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timeColumnHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 15,
    textAlign: 'center',
  },
  pickerColumn: {
    position: 'relative',
    height: 150,
    width: '100%',
  },
  timeScrollView: {
    height: 150,
    width: '100%',
  },
  timeScrollContent: {
    paddingVertical: 55, // Center the first and last items
    alignItems: 'center',
  },
  timeOption: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  timeOptionSelected: {
    backgroundColor: 'transparent',
  },
  timeOptionText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 24,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    transform: [{ translateY: -20 }],
    height: 40,
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  selectionArea: {
    height: 38,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  selectionLabel: {
    fontSize: 20,
    fontWeight: '400',
    color: '#333333',
  },
  selectedTimeOverlay: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    transform: [{ translateY: -12 }],
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  selectedTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#C7C7CC',
    width: '100%',
    marginVertical: 0,
  },
  selectedTimeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    flex: 1,
  },
  selectedTimeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginVertical: 0,
  },

  // Brew Time Modal Specific Styles
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timeModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '35%',
  },
  timeModalHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  timeModalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
  },
  timeModalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  timeSaveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  timeSaveButton: {
    backgroundColor: '#8CDBED',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  timeSaveButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333333',
  },
});

export default ExtracionConfigScreen;
