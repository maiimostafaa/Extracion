import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../navigation/Header";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Feather, Ionicons } from "@expo/vector-icons";
import CafeFinderCard from "../../assets/components/home-components/cafe-finder-card";
import { Cafe } from "../../assets/types/cafe";

const { width, height } = Dimensions.get("window");

export default function CafeFinderScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Map reference for programmatic control
  const mapRef = useRef<MapView>(null);

  // Animation for sliding modal - start lower on screen
  const slideAnim = useRef(new Animated.Value(height * 0.65)).current; // Start lower (65% from top)

  // Calculate the top position based on UI elements
  // Header (padding 8 + content ~44) + Search (padding 12 + content ~44) + Filter (padding 12 + content ~40) ≈ 160px
  const UI_ELEMENTS_HEIGHT = 160;
  const MODAL_TOP_POSITION = UI_ELEMENTS_HEIGHT; // Position right under filter buttons
  const MODAL_COLLAPSED_POSITION = height * 0.65; // Middle position (65% from top)
  const MODAL_MINIMIZED_POSITION = height * 0.95; // Minimized position (95% from top, thinner)

  // Mock partner cafés data - replace with actual Google Places API call
  const partnerCafes: Cafe[] = [
    {
      id: "ChIJN1t_tDeuEmsRUsoyG83frY4", // Google Place ID format
      name: "Brewed Awakenings Café",
      coordinate: {
        latitude: 37.78825,
        longitude: -122.4324,
      },
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
      saved: false,
      website: "https://brewedawakenings.com",
    },
    {
      id: "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
      name: "Morning Roast",
      coordinate: {
        latitude: 37.79825,
        longitude: -122.4224,
      },
      rating: 4.1,
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
      saved: true,
    },
    {
      id: "ChIJrTLr-GyuEmsRBfy61i59si0",
      name: "Artisan Coffee Co.",
      coordinate: {
        latitude: 37.78025,
        longitude: -122.4424,
      },
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
      saved: false,
      website: "https://artisancoffee.co",
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(userCoords);
      setRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleMarkerPress = useCallback((cafe: Cafe) => {
    Alert.alert(
      cafe.name,
      `Rating: ${cafe.rating}/5\nSaved: ${cafe.saved ? "Yes" : "No"}`,
      [{ text: "OK" }]
    );
  }, []);

  const handleCafeCardPress = useCallback((cafe: Cafe) => {
    console.log("Cafe selected:", cafe.name);
  }, []);

  // Handle re-centering map to user's current location
  const handleRecenterMap = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is needed to center the map on your location."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newUserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(newUserLocation);
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to get your current location. Please try again."
      );
    }
  }, []);

  // Handle pan gesture for sliding modal using PanResponder
  type ModalState = "expanded" | "collapsed" | "minimized";
  const [modalState, setModalState] = useState<ModalState>("collapsed");
  const dragStartPosition = useRef(0);
  const lastKnownPosition = useRef(height * 0.65); // Track the actual position

  // Adjust map region based on modal state to keep user location centered in visible area
  const adjustMapForModalState = useCallback(
    (modalState: ModalState) => {
      if (!userLocation || !mapRef.current) return;

      // Calculate the visible height of the map based on modal state
      let visibleMapHeight: number;
      let verticalOffset: number;

      switch (modalState) {
        case "expanded":
          // Modal covers most of the map, only top portion visible
          visibleMapHeight = MODAL_TOP_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = -((height - MODAL_TOP_POSITION) / 4); // Shift up to center in visible area
          break;
        case "collapsed":
          // Modal covers lower half, upper half visible
          visibleMapHeight = MODAL_COLLAPSED_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = -((height - MODAL_COLLAPSED_POSITION) / 6); // Shift up slightly
          break;
        case "minimized":
          // Most of map visible, slight shift
          visibleMapHeight = MODAL_MINIMIZED_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = 0; // No shift needed
          break;
        default:
          visibleMapHeight = height - UI_ELEMENTS_HEIGHT;
          verticalOffset = 0;
      }

      // Calculate appropriate delta values based on visible height
      const baseLatitudeDelta = 0.0922;
      const baseVisibleHeight = height * 0.6; // Reference height
      const heightRatio = visibleMapHeight / baseVisibleHeight;
      const adjustedLatitudeDelta = Math.max(
        baseLatitudeDelta * (1 / Math.sqrt(heightRatio)),
        0.005
      );

      // Apply vertical offset to center user location in visible area
      const adjustedLatitude =
        userLocation.latitude + verticalOffset * adjustedLatitudeDelta * 0.0001;

      const newRegion = {
        latitude: adjustedLatitude,
        longitude: userLocation.longitude,
        latitudeDelta: adjustedLatitudeDelta,
        longitudeDelta: 0.0421 * (1 / Math.sqrt(heightRatio)),
      };

      // Animate to new region
      mapRef.current.animateToRegion(newRegion, 800);
    },
    [
      userLocation,
      UI_ELEMENTS_HEIGHT,
      MODAL_TOP_POSITION,
      MODAL_COLLAPSED_POSITION,
      MODAL_MINIMIZED_POSITION,
      height,
    ]
  );

  // Handle modal toggle - cycles through the three states
  const toggleModal = useCallback(() => {
    let targetValue: number;
    let newState: ModalState;

    switch (modalState) {
      case "minimized":
        targetValue = MODAL_COLLAPSED_POSITION;
        newState = "collapsed";
        break;
      case "collapsed":
        targetValue = MODAL_TOP_POSITION;
        newState = "expanded";
        break;
      case "expanded":
        targetValue = MODAL_COLLAPSED_POSITION;
        newState = "collapsed";
        break;
    }

    Animated.spring(slideAnim, {
      toValue: targetValue,
      useNativeDriver: true, // Use native driver for better performance
      tension: 100,
      friction: 8,
    }).start(() => {
      // Ensure position is synced when animation completes
      lastKnownPosition.current = targetValue;
      // Adjust map region after animation completes
      adjustMapForModalState(newState);
    });
    setModalState(newState);
    lastKnownPosition.current = targetValue;
  }, [
    modalState,
    MODAL_COLLAPSED_POSITION,
    MODAL_TOP_POSITION,
    slideAnim,
    adjustMapForModalState,
  ]);

  // Memoize modal state text to reduce re-renders
  const modalStateText = useMemo(() => {
    switch (modalState) {
      case "expanded":
        return "Partner Cafés";
      case "collapsed":
        return "Partner Cafés";
      case "minimized":
        return "";
      default:
        return "Partner Cafés";
    }
  }, [modalState]);

  // Initialize the current modal position when the component mounts
  useEffect(() => {
    lastKnownPosition.current = MODAL_COLLAPSED_POSITION;
  }, [MODAL_COLLAPSED_POSITION]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical gestures with significant movement
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 10
        );
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Use the last known position as the starting point for the drag
        dragStartPosition.current = lastKnownPosition.current;
        // Don't update state during drag to reduce re-renders
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = dragStartPosition.current + gestureState.dy;
        // Allow the modal to follow finger more naturally with softer constraints
        const constrainedValue = Math.max(
          MODAL_TOP_POSITION - 20, // Allow slight over-scroll at top
          Math.min(newValue, MODAL_MINIMIZED_POSITION + 50) // Allow slight over-scroll at bottom
        );
        slideAnim.setValue(constrainedValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const threshold = 80; // Increased threshold for more deliberate gestures
        const currentPosition = dragStartPosition.current + gestureState.dy;

        // Determine the closest state based on final position, not gesture direction
        const distanceToExpanded = Math.abs(
          currentPosition - MODAL_TOP_POSITION
        );
        const distanceToCollapsed = Math.abs(
          currentPosition - MODAL_COLLAPSED_POSITION
        );
        const distanceToMinimized = Math.abs(
          currentPosition - MODAL_MINIMIZED_POSITION
        );

        let targetValue: number;
        let newState: ModalState;

        // If it's a strong gesture in one direction, respect that
        if (Math.abs(gestureState.dy) > threshold) {
          if (gestureState.dy < 0) {
            // Strong upward gesture - prefer higher states
            if (
              currentPosition <=
              (MODAL_TOP_POSITION + MODAL_COLLAPSED_POSITION) / 2
            ) {
              targetValue = MODAL_TOP_POSITION;
              newState = "expanded";
            } else {
              targetValue = MODAL_COLLAPSED_POSITION;
              newState = "collapsed";
            }
          } else {
            // Strong downward gesture - prefer lower states
            if (
              currentPosition >=
              (MODAL_COLLAPSED_POSITION + MODAL_MINIMIZED_POSITION) / 2
            ) {
              targetValue = MODAL_MINIMIZED_POSITION;
              newState = "minimized";
            } else {
              targetValue = MODAL_COLLAPSED_POSITION;
              newState = "collapsed";
            }
          }
        } else {
          // Small movement - snap to the nearest state
          const minDistance = Math.min(
            distanceToExpanded,
            distanceToCollapsed,
            distanceToMinimized
          );

          if (minDistance === distanceToExpanded) {
            targetValue = MODAL_TOP_POSITION;
            newState = "expanded";
          } else if (minDistance === distanceToCollapsed) {
            targetValue = MODAL_COLLAPSED_POSITION;
            newState = "collapsed";
          } else {
            targetValue = MODAL_MINIMIZED_POSITION;
            newState = "minimized";
          }
        }

        Animated.spring(slideAnim, {
          toValue: targetValue,
          useNativeDriver: true, // Use native driver for better performance
          tension: 100,
          friction: 8,
        }).start(() => {
          // Ensure position is synced when animation completes
          lastKnownPosition.current = targetValue;
          // Adjust map region after animation completes
          adjustMapForModalState(newState);
        });
        setModalState(newState);
        lastKnownPosition.current = targetValue;
      },
    })
  ).current;

  // Sync map region with user location and modal state
  useEffect(() => {
    if (userLocation) {
      adjustMapForModalState(modalState);
    }
  }, [userLocation, modalState, adjustMapForModalState]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header tintColor="#000" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cafes..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filter and Action Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>distance</Text>
            <Feather name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>price</Text>
            <Feather name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="receipt-outline" size={20} color="#666" />
            <Text style={styles.actionButtonText}>orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="bookmark-outline" size={20} color="#666" />
            <Text style={styles.actionButtonText}>saved</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={false} // Disable default button, we'll use our custom one
          ref={mapRef} // Attach ref to MapView
        >
          {partnerCafes.map((cafe) => (
            <Marker
              key={cafe.id}
              coordinate={{
                latitude: cafe.coordinate.latitude,
                longitude: cafe.coordinate.longitude,
              }}
              title={cafe.name}
              description={`Rating: ${cafe.rating}/5`}
              onPress={() => handleMarkerPress(cafe)}
              pinColor="#1E9BD6"
            />
          ))}
        </MapView>

        {/* Custom My Location Button */}
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleRecenterMap}
          activeOpacity={0.8}
        >
          <Ionicons name="locate" size={24} color="#1E9BD6" />
        </TouchableOpacity>
      </View>

      {/* Sliding Modal for Cafe List */}
      <Animated.View
        style={[
          styles.slidingModal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
        needsOffscreenAlphaCompositing={false} // Performance optimization
      >
        {/* Draggable Handle Area */}
        <View style={styles.modalHandleArea} {...panResponder.panHandlers}>
          <TouchableOpacity
            onPress={toggleModal}
            activeOpacity={0.7}
            style={[
              styles.handleTouchArea,
              modalState === "minimized" && styles.minimizedModalTouchArea,
            ]}
          >
            <View
              style={[
                styles.modalHandle,
                modalState === "expanded" && styles.modalHandleExpanded,
                modalState === "minimized" && styles.modalHandleMinimized,
              ]}
            />
          </TouchableOpacity>

          {/* Modal State Indicator */}
          <View style={styles.modalStateIndicator}>
            <Text style={styles.modalStateText}>{modalStateText}</Text>
            {modalState !== "minimized" && (
              <Text style={styles.cafeCountText}>
                {partnerCafes.length} cafés nearby
              </Text>
            )}
          </View>
        </View>

        {/* Scrollable Content - This should scroll independently and be hidden when minimized */}
        {modalState !== "minimized" && (
          <ScrollView
            style={styles.cafeList}
            contentContainerStyle={styles.cafeListContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEventThrottle={16}
            removeClippedSubviews={true} // Performance optimization
          >
            {partnerCafes.map((cafe) => (
              <CafeFinderCard
                key={cafe.id}
                name={cafe.name}
                location="Central, Hong Kong" // Placeholder for now - will come from Google Places API
                rating={cafe.rating}
                image={{ uri: cafe.image }}
                onPress={() => handleCafeCardPress(cafe)}
              />
            ))}
            {/* Spacer to ensure last card is fully visible */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </Animated.View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: "main",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "main",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    alignItems: "center",
    gap: 2,
  },
  actionButtonText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "main",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  myLocationButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  slidingModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height, // Full height to allow proper positioning
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // Simplified shadow for better performance during animations
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15, // Reduced opacity
    shadowRadius: 4, // Reduced radius
    elevation: 8, // Reduced elevation
  },
  modalHandleArea: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleTouchArea: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  minimizedModalTouchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D0D0D0",
    borderRadius: 2,
  },
  modalHandleExpanded: {
    backgroundColor: "#1E9BD6",
  },
  modalHandleMinimized: {
    backgroundColor: "#999",
  },
  modalStateIndicator: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  modalStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    fontFamily: "main",
  },
  cafeCountText: {
    fontSize: 12,
    color: "#666",
    fontFamily: "main",
    marginTop: 2,
  },
  cafeList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  cafeListContent: {
    paddingBottom: 100, // Extra padding for tab bar and safe area
  },
  bottomSpacer: {
    height: 120, // Generous spacer to ensure last card is fully visible above tab bar
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FF6B6B",
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "main",
  },
});
