// README
// Cafe Finder screen for locating and viewing partner cafés on a map.
// Features:
// - Displays user's current location on a map.
// - Shows partner café markers with details.
// - Search bar for café names.
// - Filter buttons for distance and price.
// - Action buttons for viewing orders and saved cafés.
// - Sliding modal with café list that can be expanded, collapsed, or minimized.
// - Map adjusts dynamically based on modal state.
// Notes:
// - Currently uses mock café data (replaceable with Google Places API).
// - Location permission is required for full functionality.
// - Sliding modal animation values are tuned for smoothness; avoid altering unless necessary.
// -------------------- Imports --------------------
// Core React and hooks
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
// React Native UI components & APIs
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
// Safe area handling
import { SafeAreaView } from "react-native-safe-area-context";
// Custom navigation header
import Header from "../../navigation/Header";
// Map components & types
import MapView, { Marker, Region } from "react-native-maps";
// Location services
import * as Location from "expo-location";
// Icons
import { Feather, Ionicons } from "@expo/vector-icons";
// Custom cafe card component
import CafeFinderCard from "../../assets/components/home-components/cafe-finder-card";
// Cafe type definition
import { Cafe } from "../../assets/types/cafe";

// -------------------- Constants --------------------
const { width, height } = Dimensions.get("window");

export default function CafeFinderScreen() {
  // -------------------- State --------------------
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Error messages for location issues
  const [searchText, setSearchText] = useState(""); // Search bar text
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null); // User's coordinates
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // -------------------- Refs --------------------
  const mapRef = useRef<MapView>(null); // MapView reference for controlling the map
  const slideAnim = useRef(new Animated.Value(height * 0.65)).current; // Modal Y position animation value

  // -------------------- Layout Constants --------------------
  const UI_ELEMENTS_HEIGHT = 160; // Combined height of header, search, and filter UI
  const MODAL_TOP_POSITION = UI_ELEMENTS_HEIGHT; // Fully expanded modal position
  const MODAL_COLLAPSED_POSITION = height * 0.65; // Half-expanded modal position
  const MODAL_MINIMIZED_POSITION = height * 0.95; // Almost hidden modal position

  // -------------------- Mock Data --------------------
  // Partner cafes list - to be replaced with Google Places API results
  const partnerCafes: Cafe[] = [
    {
      id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      name: "Brewed Awakenings Café",
      coordinate: { latitude: 37.78825, longitude: -122.4324 },
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop",
      saved: false,
      website: "https://brewedawakenings.com",
    },
    {
      id: "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
      name: "Morning Roast",
      coordinate: { latitude: 37.79825, longitude: -122.4224 },
      rating: 4.1,
      image:
        "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop",
      saved: true,
    },
    {
      id: "ChIJrTLr-GyuEmsRBfy61i59si0",
      name: "Artisan Coffee Co.",
      coordinate: { latitude: 37.78025, longitude: -122.4424 },
      rating: 4.5,
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
      saved: false,
      website: "https://artisancoffee.co",
    },
  ];

  // -------------------- Effects --------------------
  // Request location permission & fetch user location
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
        ...userCoords,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  // -------------------- Event Handlers --------------------
  // Tap on a cafe marker
  const handleMarkerPress = useCallback((cafe: Cafe) => {
    Alert.alert(
      cafe.name,
      `Rating: ${cafe.rating}/5\nSaved: ${cafe.saved ? "Yes" : "No"}`,
      [{ text: "OK" }]
    );
  }, []);

  // Tap on a cafe card
  const handleCafeCardPress = useCallback((cafe: Cafe) => {
    console.log("Cafe selected:", cafe.name);
  }, []);

  // Recenter map to user location
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
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch {
      Alert.alert(
        "Error",
        "Unable to get your current location. Please try again."
      );
    }
  }, []);

  // -------------------- Modal State --------------------
  type ModalState = "expanded" | "collapsed" | "minimized";
  const [modalState, setModalState] = useState<ModalState>("collapsed");
  const dragStartPosition = useRef(0); // Start position when dragging begins
  const lastKnownPosition = useRef(height * 0.65); // Position of modal after last animation

  // Adjust map region based on modal state
  const adjustMapForModalState = useCallback(
    (modalState: ModalState) => {
      if (!userLocation || !mapRef.current) return;
      let visibleMapHeight: number;
      let verticalOffset: number;

      switch (modalState) {
        case "expanded":
          visibleMapHeight = MODAL_TOP_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = -((height - MODAL_TOP_POSITION) / 4);
          break;
        case "collapsed":
          visibleMapHeight = MODAL_COLLAPSED_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = -((height - MODAL_COLLAPSED_POSITION) / 6);
          break;
        case "minimized":
          visibleMapHeight = MODAL_MINIMIZED_POSITION - UI_ELEMENTS_HEIGHT;
          verticalOffset = 0;
          break;
        default:
          visibleMapHeight = height - UI_ELEMENTS_HEIGHT;
          verticalOffset = 0;
      }

      const baseLatitudeDelta = 0.0922;
      const baseVisibleHeight = height * 0.6;
      const heightRatio = visibleMapHeight / baseVisibleHeight;
      const adjustedLatitudeDelta = Math.max(
        baseLatitudeDelta * (1 / Math.sqrt(heightRatio)),
        0.005
      );

      const adjustedLatitude =
        userLocation.latitude + verticalOffset * adjustedLatitudeDelta * 0.0001;

      mapRef.current.animateToRegion(
        {
          latitude: adjustedLatitude,
          longitude: userLocation.longitude,
          latitudeDelta: adjustedLatitudeDelta,
          longitudeDelta: 0.0421 * (1 / Math.sqrt(heightRatio)),
        },
        800
      );
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

  // Cycle modal through states
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
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      lastKnownPosition.current = targetValue;
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

  // Modal title text
  const modalStateText = useMemo(
    () => (modalState === "minimized" ? "" : "Partner Cafés"),
    [modalState]
  );

  // Initialize modal position
  useEffect(() => {
    lastKnownPosition.current = MODAL_COLLAPSED_POSITION;
  }, [MODAL_COLLAPSED_POSITION]);

  // -------------------- PanResponder --------------------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dy) > Math.abs(g.dx) && Math.abs(g.dy) > 10,
      onPanResponderGrant: () => {
        dragStartPosition.current = lastKnownPosition.current;
      },
      onPanResponderMove: (_, g) => {
        const newValue = dragStartPosition.current + g.dy;
        slideAnim.setValue(
          Math.max(
            MODAL_TOP_POSITION - 20,
            Math.min(newValue, MODAL_MINIMIZED_POSITION + 50)
          )
        );
      },
      onPanResponderRelease: (_, g) => {
        const threshold = 80;
        const currentPosition = dragStartPosition.current + g.dy;
        const dist = {
          expanded: Math.abs(currentPosition - MODAL_TOP_POSITION),
          collapsed: Math.abs(currentPosition - MODAL_COLLAPSED_POSITION),
          minimized: Math.abs(currentPosition - MODAL_MINIMIZED_POSITION),
        };
        let targetValue: number;
        let newState: ModalState;
        if (Math.abs(g.dy) > threshold) {
          if (g.dy < 0) {
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
          const minKey = Object.entries(dist).reduce((a, b) =>
            b[1] < a[1] ? b : a
          )[0] as ModalState;
          targetValue = {
            expanded: MODAL_TOP_POSITION,
            collapsed: MODAL_COLLAPSED_POSITION,
            minimized: MODAL_MINIMIZED_POSITION,
          }[minKey];
          newState = minKey;
        }
        Animated.spring(slideAnim, {
          toValue: targetValue,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start(() => {
          lastKnownPosition.current = targetValue;
          adjustMapForModalState(newState);
        });
        setModalState(newState);
        lastKnownPosition.current = targetValue;
      },
    })
  ).current;

  // Sync map region with modal state changes
  useEffect(() => {
    if (userLocation) adjustMapForModalState(modalState);
  }, [userLocation, modalState, adjustMapForModalState]);

  // -------------------- Render --------------------
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header tintColor="#000" />
      </View>

      {/* Search bar */}
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

      {/* Filter & action buttons */}
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

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation
          showsMyLocationButton={false}
          ref={mapRef}
        >
          {partnerCafes.map((cafe) => (
            <Marker
              key={cafe.id}
              coordinate={cafe.coordinate}
              title={cafe.name}
              description={`Rating: ${cafe.rating}/5`}
              onPress={() => handleMarkerPress(cafe)}
              pinColor="#1E9BD6"
            />
          ))}
        </MapView>
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleRecenterMap}
        >
          <Ionicons name="locate" size={24} color="#1E9BD6" />
        </TouchableOpacity>
      </View>

      {/* Sliding modal */}
      <Animated.View
        style={[
          styles.slidingModal,
          { transform: [{ translateY: slideAnim }] },
        ]}
        needsOffscreenAlphaCompositing={false}
      >
        {/* Handle */}
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
          <View style={styles.modalStateIndicator}>
            <Text style={styles.modalStateText}>{modalStateText}</Text>
            {modalState !== "minimized" && (
              <Text style={styles.cafeCountText}>
                {partnerCafes.length} cafés nearby
              </Text>
            )}
          </View>
        </View>

        {/* Cafe list */}
        {modalState !== "minimized" && (
          <ScrollView
            style={styles.cafeList}
            contentContainerStyle={styles.cafeListContent}
            showsVerticalScrollIndicator={false}
            bounces
            scrollEventThrottle={16}
            removeClippedSubviews
          >
            {partnerCafes.map((cafe) => (
              <CafeFinderCard
                key={cafe.id}
                name={cafe.name}
                location="Central, Hong Kong"
                rating={cafe.rating}
                image={{ uri: cafe.image }}
                onPress={() => handleCafeCardPress(cafe)}
              />
            ))}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}
      </Animated.View>

      {/* Error message */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: { flex: 1, width, backgroundColor: "#F5F5F5" },
  header: { paddingHorizontal: 16, paddingBottom: 0 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5E5",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#333", fontFamily: "main" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButtons: { flexDirection: "row", gap: 8 },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#666",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  filterButtonText: { color: "#fff", fontSize: 14, fontFamily: "main" },
  actionButtons: { flexDirection: "row", gap: 16 },
  actionButton: { alignItems: "center", gap: 2 },
  actionButtonText: { fontSize: 12, color: "#666", fontFamily: "main" },
  mapContainer: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  slidingModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
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
  modalHandleExpanded: { backgroundColor: "#1E9BD6" },
  modalHandleMinimized: { backgroundColor: "#999" },
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
  cafeList: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  cafeListContent: { paddingBottom: 100 },
  bottomSpacer: { height: 120 },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FF6B6B",
    margin: 16,
    borderRadius: 8,
  },
  errorText: { color: "#FFF", textAlign: "center", fontFamily: "main" },
});
