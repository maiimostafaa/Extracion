import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator"; // adjust path if needed
import { newsletterItem } from "../assets/types/newsletter-item"; // adjust path if needed
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useRef } from "react";
import { FlatList, ViewToken } from "react-native";

type NewsletterDetailRouteProp = RouteProp<
  RootStackParamList,
  "NewsletterDetail"
>;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const NewsletterDetailScreen = () => {
  const route = useRoute<NewsletterDetailRouteProp>();
  const { item }: { item: newsletterItem } = route.params;
  const navigation = useNavigation<NavigationProp>();
  const isVideo = item.media_type === "VIDEO";
  const mediaUrl = isVideo ? item.media_url : item.thumbnail;
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <Ionicons
        name="chevron-back"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={() => handleBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {item.media_urls && item.media_urls.length > 1 ? (
          <>
            <View style={styles.carouselContainer}>
              <FlatList
                data={item.media_urls}
                keyExtractor={(uri, index) => uri + index}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item: uri, index }) => {
                  const mediaType = item.media_types?.[index] || "IMAGE";
                  return (
                    <View style={styles.mediaItem}>
                      {mediaType === "VIDEO" ? (
                        <Video
                          source={{ uri }}
                          style={styles.media}
                          useNativeControls
                          resizeMode={ResizeMode.COVER}
                          shouldPlay
                          isMuted={false}
                        />
                      ) : (
                        <Image source={{ uri }} style={styles.media} />
                      )}
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.dotsContainer}>
              {item.media_urls.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    currentIndex === i ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.carouselContainer}>
            {item.media_types?.[0] === "VIDEO" ? (
              <Video
                source={{ uri: item.media_urls?.[0] ?? "" }}
                style={styles.media}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isMuted={false}
              />
            ) : (
              <Image
                source={{ uri: item.media_urls?.[0] ?? "" }}
                style={styles.media}
              />
            )}
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>

          {item.description && (
            <Text style={styles.body}>{item.description}</Text>
          )}

          {item.permalink && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => item.permalink && Linking.openURL(item.permalink)}
            >
              <Text style={styles.buttonText}>See on Instagram</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsletterDetailScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  mediaContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#eee",
  },
  media: {
    width: width,
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: "cardMedium",
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: "cardRegular",
  },
  button: {
    backgroundColor: "#8CDBED",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "main",
  },
  carouselContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#eee",
  },
  mediaItem: {
    width: width,
    height: 300,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    backgroundColor: "#fff",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#8CDBED",
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: "#000",
  },
});
