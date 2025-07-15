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
import { Video, ResizeMode } from "expo-av";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { newsletterItem } from "../assets/types/newsletter-item";

type NewsletterDetailRouteProp = RouteProp<
  RootStackParamList,
  "NewsletterDetail"
>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

const NewsletterDetailScreen = () => {
  const route = useRoute<NewsletterDetailRouteProp>();
  const { item }: { item: newsletterItem } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaHeights, setMediaHeights] = useState<number[]>([]);

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

  const handleVideoReadyForDisplay = (index: number) => {
    // This callback fires when video is ready, but we need to use onLoad for dimensions
    // We'll handle this in the onLoad callback instead
  };

  const handleVideoLoad = async (index: number, videoRef: any) => {
    try {
      if (videoRef.current) {
        const status = await videoRef.current.getStatusAsync();
        if (status.isLoaded) {
          // For expo-av, we need to get dimensions from the video element itself
          // We'll use a different approach with onReadyForDisplay
          console.log('Video loaded for index:', index);
        }
      }
    } catch (error) {
      console.log('Error getting video status:', error);
    }
  };

  const handleImageLoad = (e: any, index: number) => {
    const { width: imgW, height: imgH } = e.nativeEvent.source;
    const scaledHeight = (width / imgW) * imgH;
    setMediaHeights((prev) => {
      const updated = [...prev];
      updated[index] = scaledHeight;
      return updated;
    });
  };

  return (
    <SafeAreaView>
      <Ionicons
        name="chevron-back"
        size={24}
        color="#000"
        style={{ margin: 16 }}
        onPress={handleBack}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {item.media_urls && item.media_urls.length > 1 ? (
          <>
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
                  return (
                    <View
                      style={{ width, height, backgroundColor: "#eee" }}
                    >
                      <Video
                        source={{ uri }}
                        style={{ width, height }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay
                        isMuted={false}
                        onReadyForDisplay={(readyForDisplayStatus) => {
                          if (readyForDisplayStatus.naturalSize) {
                            const { width: videoWidth, height: videoHeight } = readyForDisplayStatus.naturalSize;
                            const scaledHeight = (width / videoWidth) * videoHeight;
                            setMediaHeights((prev) => {
                              const updated = [...prev];
                              updated[index] = scaledHeight;
                              return updated;
                            });
                          }
                        }}
                      />
                    </View>
                  );
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
          <View style={{ width: "100%", backgroundColor: "#eee" }}>
            {item.media_types?.[0] === "VIDEO" ? (
              <Video
                source={{ uri: item.media_urls?.[0] ?? "" }}
                style={{ width, height: mediaHeights[0] || 300 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isMuted={false}
                onReadyForDisplay={(readyForDisplayStatus) => {
                  if (readyForDisplayStatus.naturalSize) {
                    const { width: videoWidth, height: videoHeight } = readyForDisplayStatus.naturalSize;
                    const scaledHeight = (width / videoWidth) * videoHeight;
                    setMediaHeights([scaledHeight]);
                  }
                }}
              />
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

  {item.permalink && (
         <TouchableOpacity style={{flexDirection: "row", paddingVertical: 10, paddingHorizontal: 5,}}   onPress={() => item.permalink && Linking.openURL(item.permalink)}
            >
          <EvilIcons name="heart" size={20} color="#000"></EvilIcons>
          <Text style={{fontSize: 14, fontFamily: "cardBold", color: "#000"}}>{item.like_count}{"  "}</Text>
        <EvilIcons name="comment" size={20} color="#000"></EvilIcons>
          <Text style={{fontSize: 14, fontFamily: "cardBold", color: "#000"}}>{item.comments_count}</Text>
         </TouchableOpacity>)}

        <View style={styles.content}>
        

          {item.description && (
           
            <Text style={styles.body}><Text style={{fontFamily: "cardBold",}}>{item.createdBy}{": "}</Text>{item.description}</Text>
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