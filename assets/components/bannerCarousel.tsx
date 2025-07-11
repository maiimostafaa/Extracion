import React, { useState, useEffect } from "react";
import { FlatList, Animated, View } from "react-native";
import { bannerItem } from "../types/banner-item";
import { mockBannerItems } from "../mock_data/mock-banners";
import BannerCard from "./banner";

const BannerCarousel = ({
  banners = mockBannerItems,
}: {
  banners?: bannerItem[];
}) => {
  const activeBanners = banners.filter((b) => b.is_active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    if (activeBanners.length === 0) return;

    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeBanners, fadeAnim]);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <BannerCard item={activeBanners[currentIndex]} />
    </Animated.View>
  );
};

export default BannerCarousel;
