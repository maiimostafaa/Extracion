import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
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
  const [grind, setGrind] = useState('Medium');
  const [brewTime, setBrewTime] = useState('4:00');
  const [cupCount, setCupCount] = useState(1);

  // State for dropdown
  const [selectedMode, setSelectedMode] = useState('brew guide');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State for tutorial navigation
  const [tutorialStep, setTutorialStep] = useState(0);

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
    // Handle tile press - for now just log
    console.log(`Pressed ${tileType} tile`);
  };

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
                <Text style={styles.thingsNeededTitle}>Step 2: Brew</Text>
                <View style={styles.requirementsList}>
                  <Text style={styles.requirementItem}>• Add ground coffee to French Press</Text>
                  <Text style={styles.requirementItem}>• Pour hot water slowly over coffee</Text>
                  <Text style={styles.requirementItem}>• Stir gently with spoon</Text>
                  <Text style={styles.requirementItem}>• Place lid on top, don't press yet</Text>
                </View>
              </>
            )}

            {tutorialStep === 3 && (
              <>
                <Text style={styles.thingsNeededTitle}>Step 3: Wait & Serve</Text>
                <View style={styles.requirementsList}>
                  <Text style={styles.requirementItem}>• Let coffee steep for 4 minutes</Text>
                  <Text style={styles.requirementItem}>• Slowly press the plunger down</Text>
                  <Text style={styles.requirementItem}>• Pour immediately into your cup</Text>
                  <Text style={styles.requirementItem}>• Enjoy your French Press coffee!</Text>
                </View>
              </>
            )}
          </View>
          
          {/* Next Button - Hide on last step */}
          {tutorialStep < 3 && (
            <View style={styles.nextButtonContainer}>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextTutorial}>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
});

export default ExtracionConfigScreen;
