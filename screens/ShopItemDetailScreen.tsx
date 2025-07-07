import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/AppNavigator";
import type { ShopItem } from "../assets/types/shop-item";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ShopItemDetailRouteProp = RouteProp<RootStackParamList, "ShopItemDetail">;

const { width, height } = Dimensions.get("window");

export default function ShopItemDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ShopItemDetailRouteProp>();
  const { item } = route.params as ShopItemDetailRouteProp["params"];

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [1.2, 1, 0.8],
    extrapolate: "clamp",
  });

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      Alert.alert(
        "Added to Cart",
        `${item.name} has been added to your cart!`,
        [{ text: "Continue Shopping", style: "cancel" }, { text: "View Cart" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    // Handle share functionality
    console.log("Share item:", item.name);
  };

  const renderQuantitySelector = () => (
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Quantity</Text>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
        >
          <Ionicons name="remove" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{selectedQuantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setSelectedQuantity(selectedQuantity + 1)}
        >
          <Ionicons name="add" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSpecifications = () => {
    if (!item.specifications) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        {Object.entries(item.specifications).map(([key, value]) => (
          <View key={key} style={styles.specRow}>
            <Text style={styles.specKey}>{key}:</Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderFeatures = () => {
    if (!item.features || item.features.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Floating Action Buttons */}
      <SafeAreaView style={styles.floatingActions}>
        <TouchableOpacity onPress={handleBack} style={styles.floatingButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.floatingButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.ScrollView
        style={styles.scrollView}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Animated.Image
            source={{ uri: item.image }}
            style={[styles.heroImage, { transform: [{ scale: imageScale }] }]}
          />
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorite && styles.favoriteActive]}
            onPress={handleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#fff" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Basic Info */}
          <View style={styles.basicInfo}>
            <Text style={styles.brand}>{item.brand || "Get the Pong"}</Text>
            <Text style={styles.name}>{item.name}</Text>

            {/* Rating */}
            {item.rating && (
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={16}
                      color={
                        i < Math.floor(item.rating!) ? "#FFD700" : "#E0E0E0"
                      }
                    />
                  ))}
                </View>
                <Text style={styles.ratingText}>
                  {item.rating} {item.reviews && `(${item.reviews} reviews)`}
                </Text>
              </View>
            )}

            {/* Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.price}</Text>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>${item.originalPrice}</Text>
              )}
            </View>

            {/* Stock Status */}
            <View style={styles.stockContainer}>
              <Ionicons
                name={item.inStock ? "checkmark-circle" : "close-circle"}
                size={16}
                color={item.inStock ? "#4CAF50" : "#FF5252"}
              />
              <Text
                style={[styles.stockText, !item.inStock && styles.outOfStock]}
              >
                {item.inStock ? "In Stock" : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {/* Features */}
          {renderFeatures()}

          {/* Specifications */}
          {renderSpecifications()}

          {/* Quantity Selector */}
          {renderQuantitySelector()}
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Bar */}
      <SafeAreaView style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>
              ${(item.price * selectedQuantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              !item.inStock && styles.disabledButton,
              isAddingToCart && styles.loadingButton,
            ]}
            onPress={handleAddToCart}
            disabled={!item.inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <Text style={styles.addToCartText}>Adding...</Text>
            ) : (
              <Text style={styles.addToCartText}>
                {item.inStock ? "Add to Cart" : "Out of Stock"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  headerSafeArea: {
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginHorizontal: 16,
    fontFamily: "main",
  },
  floatingActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    paddingTop: (StatusBar.currentHeight || 0) + 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: height * 0.5,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteActive: {
    backgroundColor: "#FF6B6B",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  basicInfo: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 14,
    color: "#666",
    fontFamily: "main",
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "main",
    lineHeight: 30,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "main",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    fontFamily: "main",
  },
  originalPrice: {
    fontSize: 20,
    color: "#999",
    textDecorationLine: "line-through",
    marginLeft: 12,
    fontFamily: "main",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginLeft: 4,
    fontFamily: "main",
  },
  outOfStock: {
    color: "#FF5252",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    fontFamily: "main",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    fontFamily: "main",
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    fontFamily: "main",
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  specKey: {
    fontSize: 14,
    color: "#666",
    fontFamily: "main",
  },
  specValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    fontFamily: "main",
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
    fontFamily: "main",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginHorizontal: 20,
    fontFamily: "main",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  totalContainer: {
    flex: 1,
    marginRight: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "main",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    fontFamily: "main",
  },
  addToCartButton: {
    backgroundColor: "#8CDBED",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    minWidth: 140,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loadingButton: {
    backgroundColor: "#7BC4D1",
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    fontFamily: "main",
  },
});
