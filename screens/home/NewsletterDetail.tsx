// README
// Screen for displaying details of a newsletter or Instagram post.
// - Shows one or more media items (images/videos) in a carousel or single view.
// - Displays post likes/comments if available.
// - Shows description text and a button to view on Instagram if a permalink exists.

// -------------------- Imports --------------------
import React, { useRef, useState } from "react";
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
  FlatList,
  ViewToken,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { newsletterItem } from "../../assets/types/newsletter-item";

// -------------------- Navigation Types --------------------
type NewsletterDetailRouteProp = RouteProp<
  RootStackParamList,
  "NewsletterDetail"
>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// -------------------- Constants --------------------
const { width } = Dimensions.get("window"); // device screen width

// -------------------- Component --------------------
const NewsletterDetailScreen = () => {
  const route = useRoute<NewsletterDetailRouteProp>();
  const { item }: { item: newsletterItem } = route.params; // newsletter item data
  const navigation = useNavigation<NavigationProp>();

  const [currentIndex, setCurrentIndex] = useState(0); // current index in media carousel
  const [mediaHeights, setMediaHeights] = useState<number[]>([]); // track heights for each media item

  // Viewability configuration for FlatList to track visible media
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Update index when visible media item changes
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  // Navigate back to previous screen
  const handleBack = () => {
    navigation.goBack();
  };

  // Calculate and store image height to maintain aspect ratio
  const handleImageLoad = (e: any, index: number) => {
    const { width: imgW, height: imgH } = e.nativeEvent.source;
    const scaledHeight = (width / imgW) * imgH;
    setMediaHeights((prev) => {
      const updated = [...prev];
      updated[index] = scaledHeight;
      return updated;
    });
  };

  // -------------------- Video Item (for FlatList carousel) --------------------
  const VideoItem = ({ uri, index }: { uri: string; index: number }) => {
    const player = useVideoPlayer(uri, (player) => {
      player.muted = false;
      player.play();
    });

    const height = 700; // fixed height for videos

    return (
      <View style={{ width, height, backgroundColor: "#eee" }}>
        <VideoView
          style={{ width, height }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="cover"
        />
      </View>
    );
  };

  // -------------------- Single Video (non-carousel) --------------------
  const SingleVideo = ({ uri }: { uri: string }) => {
    const player = useVideoPlayer(uri, (player) => {
      player.muted = false;
      player.play();
    });

    const height = 700; // fixed height for videos

    return (
      <VideoView
        style={{ width, height }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="cover"
      />
    );
  };

  return (
    <SafeAreaView style={{ marginTop: "10%" }}>
      {/* Back button */}
      <Ionicons
        name="chevron-back"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={handleBack}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- Media Section ---------- */}
        {item.media_urls && item.media_urls.length > 1 ? (
          <>
            {/* Horizontal carousel for multiple media items */}
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
                const height = mediaHeights[index] || 300;

                if (mediaType === "VIDEO") {
                  return <VideoItem uri={uri} index={index} />;
                } else {
                  return (
                    <View style={{ width, height, backgroundColor: "#eee" }}>
                      <Image
                        source={{ uri }}
                        style={{ width, height }}
                        resizeMode="contain"
                        onLoad={(e) => handleImageLoad(e, index)}
                      />
                    </View>
                  );
                }
              }}
            />
            {/* Dots indicator for carousel position */}
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
          // Single media item
          <View style={{ width: "100%", backgroundColor: "#eee" }}>
            {item.media_types?.[0] === "VIDEO" ? (
              <SingleVideo uri={item.media_urls?.[0] ?? ""} />
            ) : (
              <Image
                source={{ uri: item.media_urls?.[0] ?? "" }}
                style={{ width, height: mediaHeights[0] || 300 }}
                resizeMode="contain"
                onLoad={(e) => handleImageLoad(e, 0)}
              />
            )}
          </View>
        )}

        {/* ---------- Likes & Comments Section (if permalink exists) ---------- */}
        {item.permalink && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              paddingVertical: 10,
              paddingHorizontal: 5,
            }}
            onPress={() => item.permalink && Linking.openURL(item.permalink)}
          >
            <EvilIcons name="heart" size={20} color="#000" />
            <Text
              style={{ fontSize: 14, fontFamily: "cardBold", color: "#000" }}
            >
              {item.like_count}
              {"  "}
            </Text>
            <EvilIcons name="comment" size={20} color="#000" />
            <Text
              style={{ fontSize: 14, fontFamily: "cardBold", color: "#000" }}
            >
              {item.comments_count}
            </Text>
          </TouchableOpacity>
        )}

        {/* ---------- Description & Instagram Link ---------- */}
        <View style={styles.content}>
          {item.description && (
            <Text style={styles.body}>
              <Text style={{ fontFamily: "cardBold" }}>
                {item.createdBy}
                {": "}
              </Text>
              {item.description}
            </Text>
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

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 60,
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: "cardMedium",
  },
  body: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: "cardRegular",
  },
  button: {
    backgroundColor: "#8CDBED",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    fontFamily: "cardRegular",
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
    backgroundColor: "#8CDBED",
  },
  inactiveDot: {
    backgroundColor: "#000",
  },
});
