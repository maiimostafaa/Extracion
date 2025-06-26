import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'food';
  image: string;
}

interface Cafe {
  id: number;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  image: string;
  address: string;
  openingHours: string;
  phone: string;
  menu: MenuItem[];
}

interface Festival {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
  tickets: number;
}

// Add mock menu items
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Espresso',
    description: 'Rich and bold single shot espresso',
    price: 3.50,
    category: 'coffee',
    image: 'https://picsum.photos/400/300?random=20',
  },
  {
    id: 2,
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 4.50,
    category: 'coffee',
    image: 'https://picsum.photos/400/300?random=21',
  },
  {
    id: 3,
    name: 'Avocado Toast',
    description: 'Fresh avocado on sourdough with poached egg',
    price: 8.50,
    category: 'food',
    image: 'https://picsum.photos/400/300?random=22',
  },
  {
    id: 4,
    name: 'Croissant',
    description: 'Buttery, flaky French pastry',
    price: 4.00,
    category: 'food',
    image: 'https://picsum.photos/400/300?random=23',
  },
];

// Mock data for cafes
const mockCafes: Cafe[] = [
  {
    id: 1,
    name: 'Urban Coffee Lab',
    coordinate: { latitude: 37.7749, longitude: -122.4194 },
    rating: 4.5,
    image: 'https://picsum.photos/400/300?random=1',
    address: '123 Coffee Street, San Francisco',
    openingHours: 'Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-9PM',
    phone: '(555) 123-4567',
    menu: mockMenuItems,
  },
  {
    id: 2,
    name: 'Brew & Co',
    coordinate: { latitude: 37.7833, longitude: -122.4167 },
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=2',
    address: '456 Brew Avenue, San Francisco',
    openingHours: 'Mon-Sun: 6AM-10PM',
    phone: '(555) 234-5678',
    menu: mockMenuItems,
  },
  {
    id: 3,
    name: 'Coffee House',
    coordinate: { latitude: 37.7850, longitude: -122.4067 },
    rating: 4.3,
    image: 'https://picsum.photos/400/300?random=3',
    address: '789 Bean Road, San Francisco',
    openingHours: 'Mon-Fri: 6:30AM-7PM, Sat-Sun: 7AM-8PM',
    phone: '(555) 345-6789',
    menu: mockMenuItems,
  },
  {
    id: 4,
    name: 'Café de Flore',
    coordinate: { latitude: 48.8534, longitude: 2.3347 },
    rating: 4.7,
    image: 'https://picsum.photos/400/300?random=4',
    address: '172 Boulevard Saint-Germain, Paris',
    openingHours: 'Mon-Sun: 7AM-1AM',
    phone: '+33 1 45 48 55 26',
    menu: mockMenuItems,
  },
  {
    id: 5,
    name: 'Blue Bottle Coffee',
    coordinate: { latitude: 35.6895, longitude: 139.7637 },
    rating: 4.6,
    image: 'https://picsum.photos/400/300?random=5',
    address: '1-4-1 Kojimachi, Chiyoda City, Tokyo',
    openingHours: 'Mon-Sun: 8AM-8PM',
    phone: '+81 3 6261 5383',
    menu: mockMenuItems,
  },
  {
    id: 6,
    name: 'Café Central',
    coordinate: { latitude: 48.2082, longitude: 16.3719 },
    rating: 4.9,
    image: 'https://picsum.photos/400/300?random=6',
    address: 'Herrengasse 14, Vienna',
    openingHours: 'Mon-Sat: 7:30AM-10PM, Sun: 10AM-10PM',
    phone: '+43 1 533 37 63',
    menu: mockMenuItems,
  },
  {
    id: 7,
    name: 'Café Tortoni',
    coordinate: { latitude: -34.6037, longitude: -58.3816 },
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=7',
    address: 'Av. de Mayo 825, Buenos Aires',
    openingHours: 'Mon-Sun: 8AM-1AM',
    phone: '+54 11 4342 4328',
    menu: mockMenuItems,
  },
  {
    id: 8,
    name: 'Café de la Paix',
    coordinate: { latitude: 48.8719, longitude: 2.3317 },
    rating: 4.7,
    image: 'https://picsum.photos/400/300?random=8',
    address: '5 Place de l\'Opéra, Paris',
    openingHours: 'Mon-Sun: 7AM-11PM',
    phone: '+33 1 40 07 36 36',
    menu: mockMenuItems,
  }
];

// Mock data for festivals
const mockFestivals: Festival[] = [
  {
    id: 1,
    name: 'San Francisco Coffee Festival',
    date: '2024-11-15',
    location: 'San Francisco, CA',
    description: 'Annual celebration of coffee culture featuring local roasters, baristas, and coffee enthusiasts.',
    image: 'https://picsum.photos/400/300?random=10',
    tickets: 25,
  },
  {
    id: 2,
    name: 'World of Coffee',
    date: '2024-06-27',
    location: 'Copenhagen, Denmark',
    description: 'Europe\'s largest specialty coffee event featuring competitions, workshops, and networking opportunities.',
    image: 'https://picsum.photos/400/300?random=11',
    tickets: 45,
  },
  {
    id: 3,
    name: 'Melbourne International Coffee Expo',
    date: '2024-05-17',
    location: 'Melbourne, Australia',
    description: 'Australia\'s premier coffee trade show featuring the latest innovations and trends in coffee.',
    image: 'https://picsum.photos/400/300?random=12',
    tickets: 35,
  },
  {
    id: 4,
    name: 'Tokyo Coffee Festival',
    date: '2024-09-21',
    location: 'Tokyo, Japan',
    description: 'Celebration of Japanese coffee culture with traditional and modern brewing methods.',
    image: 'https://picsum.photos/400/300?random=13',
    tickets: 30,
  },
  {
    id: 5,
    name: 'London Coffee Festival',
    date: '2024-04-11',
    location: 'London, UK',
    description: 'The UK\'s largest coffee and artisan food festival featuring live music and workshops.',
    image: 'https://picsum.photos/400/300?random=14',
    tickets: 40,
  },
  {
    id: 6,
    name: 'Seoul Coffee Expo',
    date: '2024-08-15',
    location: 'Seoul, South Korea',
    description: 'South Korea\'s premier coffee event showcasing local and international coffee culture.',
    image: 'https://picsum.photos/400/300?random=15',
    tickets: 35,
  },
  {
    id: 7,
    name: 'Berlin Coffee Festival',
    date: '2024-07-20',
    location: 'Berlin, Germany',
    description: 'Celebration of Berlin\'s vibrant coffee scene with specialty roasters and baristas.',
    image: 'https://picsum.photos/400/300?random=16',
    tickets: 30,
  },
  {
    id: 8,
    name: 'São Paulo Coffee Week',
    date: '2024-10-05',
    location: 'São Paulo, Brazil',
    description: 'Brazil\'s largest coffee event featuring local producers and international experts.',
    image: 'https://picsum.photos/400/300?random=17',
    tickets: 40,
  }
];

// Mock data for events
const mockEvents = [
  {
    id: '1',
    title: 'Coffee Brewing Workshop',
    image: 'https://picsum.photos/400/300?random=1',
    date: '2024-03-25',
    time: '10:00 AM - 12:00 PM',
    location: 'Central Coffee Lab',
    description: 'Learn the art of pour-over coffee brewing from our expert baristas.',
    capacity: 10,
    registered: 0,
  },
  {
    id: '2',
    title: 'Bean Tasting Session',
    image: 'https://picsum.photos/400/300?random=2',
    date: '2024-03-28',
    time: '2:00 PM - 4:00 PM',
    location: 'Coffee Tasting Room',
    description: 'Experience different coffee beans from around the world.',
    capacity: 8,
    registered: 0,
  },
  {
    id: '3',
    title: 'Latte Art Masterclass',
    image: 'https://picsum.photos/400/300?random=3',
    date: '2024-04-01',
    time: '11:00 AM - 1:00 PM',
    location: 'Barista Training Center',
    description: 'Master the techniques of creating beautiful latte art.',
    capacity: 6,
    registered: 0,
  },
];

export default function ExploreScreen() {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [events, setEvents] = useState(mockEvents);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showFestivalDetails, setShowFestivalDetails] = useState(false);
  const [showCafeDetails, setShowCafeDetails] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadEventRegistrations();
  }, []);

  const loadEventRegistrations = async () => {
    try {
      const registrations = await AsyncStorage.getItem('workshopRegistrations');
      if (registrations) {
        const registeredEvents = JSON.parse(registrations);
        setEvents(prevEvents =>
          prevEvents.map(event => {
            const registered = registeredEvents.find((r: any) => r.id === event.id);
            return registered ? { ...event, registered: registered.registered } : event;
          })
        );
      }
    } catch (error) {
      console.error('Error loading event registrations:', error);
    }
  };

  const handleRegister = async (event: typeof mockEvents[0]) => {
    if (event.registered >= event.capacity) {
      Alert.alert('Full', 'This event is already full.');
      return;
    }

    // Check if user is already registered
    const isRegistered = event.registered > 0;

    Alert.alert(
      isRegistered ? 'Unregister from Event' : 'Confirm Registration',
      isRegistered 
        ? `Would you like to unregister from ${event.title}?`
        : `Would you like to register for ${event.title}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: isRegistered ? 'Unregister' : 'Register',
          style: isRegistered ? 'destructive' : 'default',
          onPress: async () => {
            try {
              // Update event registration
              const registrations = await AsyncStorage.getItem('workshopRegistrations');
              const registeredEvents = registrations ? JSON.parse(registrations) : [];
              const updatedEvents = registeredEvents.find((r: any) => r.id === event.id)
                ? registeredEvents.map((r: any) =>
                    r.id === event.id 
                      ? { ...r, registered: isRegistered ? r.registered - 1 : r.registered + 1 } 
                      : r
                  )
                : [...registeredEvents, { ...event, registered: 1 }];
              await AsyncStorage.setItem('workshopRegistrations', JSON.stringify(updatedEvents));

              // Create notification
              const notification = {
                id: Date.now(),
                type: 'workshop',
                title: isRegistered ? 'Event Unregistration Confirmed' : 'Event Registration Confirmed',
                message: isRegistered
                  ? `You have successfully unregistered from ${event.title}`
                  : `You have successfully registered for ${event.title} on ${event.date} at ${event.time}`,
                timestamp: 'Just now',
                read: false,
                eventDetails: {
                  title: event.title,
                  date: event.date,
                  time: event.time,
                  location: event.location,
                },
              };

              const existingNotifications = await AsyncStorage.getItem('notifications');
              const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
              await AsyncStorage.setItem('notifications', JSON.stringify([notification, ...notifications]));

              // Update local state
              setEvents(prevEvents =>
                prevEvents.map(e =>
                  e.id === event.id 
                    ? { ...e, registered: isRegistered ? e.registered - 1 : e.registered + 1 } 
                    : e
                )
              );

              Alert.alert(
                'Success', 
                isRegistered 
                  ? 'You have successfully unregistered from the event!'
                  : 'You have successfully registered for the event!'
              );
            } catch (error) {
              console.error('Error updating event registration:', error);
              Alert.alert('Error', 'Failed to update event registration. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleFestivalPress = (festival: Festival) => {
    setSelectedFestival(festival);
    setShowFestivalDetails(true);
  };

  const handleCafePress = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setShowCafeDetails(true);
    // Center map on selected cafe
    setMapRegion({
      ...mapRegion,
      latitude: cafe.coordinate.latitude,
      longitude: cafe.coordinate.longitude,
    });
  };

  const handleReservation = (cafe: Cafe) => {
    Alert.alert(
      'Make Reservation',
      `Would you like to make a reservation at ${cafe.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reserve',
          onPress: () => {
            // Add reservation logic here
            Alert.alert('Success', 'Reservation request sent! We will confirm shortly.');
          },
        },
      ]
    );
  };

  const renderFestivalDetails = () => {
    if (!selectedFestival) return null;

    return (
      <View style={styles.festivalDetails}>
        <View style={styles.festivalHeader}>
          <Text style={styles.festivalTitle}>{selectedFestival.name}</Text>
          <TouchableOpacity
            onPress={() => setShowFestivalDetails(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.festivalContent}>
          <Image
            source={{ uri: selectedFestival.image }}
            style={styles.festivalModalImage}
          />
          <View style={styles.festivalInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#666" />
              <Text style={styles.infoText}>{selectedFestival.date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.infoText}>{selectedFestival.location}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => {
                  Alert.alert(
                    'Registration',
                    'Would you like to register for this festival?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Register',
                        onPress: () => {
                          Alert.alert('Success', 'Registration successful!');
                        },
                      },
                    ]
                  );
                }}
              >
                <Text style={styles.registerButtonText}>Register Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => {
                  Alert.alert('Share', 'Share this festival with friends!');
                }}
              >
                <Ionicons name="share-outline" size={20} color="#007AFF" />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderCafeDetails = () => {
    if (!selectedCafe) return null;

    return (
      <View style={styles.cafeDetails}>
        <View style={styles.cafeHeader}>
          <Text style={styles.cafeTitle}>{selectedCafe.name}</Text>
          <TouchableOpacity
            onPress={() => setShowCafeDetails(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.cafeContent}>
          <Image
            source={{ uri: selectedCafe.image }}
            style={styles.cafeModalImage}
          />
          <View style={styles.cafeInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.infoText}>{selectedCafe.rating} Rating</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color="#666" />
              <Text style={styles.infoText}>{selectedCafe.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#666" />
              <Text style={styles.infoText}>{selectedCafe.openingHours}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call" size={20} color="#666" />
              <Text style={styles.infoText}>{selectedCafe.phone}</Text>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
              <Text style={styles.menuTitle}>Menu</Text>
              
              {/* Coffee Section */}
              <Text style={styles.menuCategory}>Coffee</Text>
              {selectedCafe.menu
                .filter(item => item.category === 'coffee')
                .map(item => (
                  <View key={item.id} style={styles.menuItem}>
                    <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}

              {/* Food Section */}
              <Text style={styles.menuCategory}>Food</Text>
              {selectedCafe.menu
                .filter(item => item.category === 'food')
                .map(item => (
                  <View key={item.id} style={styles.menuItem}>
                    <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                  </View>
                ))}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.reserveButton}
                onPress={() => handleReservation(selectedCafe)}
              >
                <Text style={styles.reserveButtonText}>Make Reservation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => {
                  Alert.alert('Directions', 'Opening in Maps...');
                }}
              >
                <Ionicons name="navigate" size={20} color="#007AFF" />
                <Text style={styles.directionsButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderFestival = ({ item }: { item: Festival }) => (
    <TouchableOpacity style={styles.festivalCard} onPress={() => handleFestivalPress(item)}>
      <Image source={{ uri: item.image }} style={styles.festivalImage} />
      <View style={styles.festivalInfo}>
        <Text style={styles.festivalTitle}>{item.name}</Text>
        <Text style={styles.festivalDate}>{item.date}</Text>
        <Text style={styles.festivalLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEvent = (event: typeof mockEvents[0]) => (
    <View key={event.id} style={styles.eventCard}>
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Ionicons name="calendar" size={16} color="#666" />
            <Text style={styles.eventDetailText}>{event.date}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.eventDetailText}>{event.time}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
        </View>
        <Text style={styles.eventDescription}>{event.description}</Text>
        <View style={styles.eventFooter}>
          <Text style={styles.capacityText}>
            Capacity: {event.registered}/{event.capacity}
          </Text>
          <TouchableOpacity
            style={[
              styles.registerButton,
              event.registered >= event.capacity && styles.registerButtonDisabled,
              event.registered > 0 && styles.registeredButton,
            ]}
            onPress={() => handleRegister(event)}
            disabled={event.registered >= event.capacity}
          >
            <Text style={styles.registerButtonText}>
              {event.registered >= event.capacity 
                ? 'Full' 
                : event.registered > 0 
                  ? 'Registered' 
                  : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
          >
            {mockCafes.map((cafe) => (
              <Marker
                key={cafe.id}
                coordinate={cafe.coordinate}
                title={cafe.name}
                description={`Rating: ${cafe.rating}`}
                onPress={() => handleCafePress(cafe)}
              />
            ))}
          </MapView>
        </View>

        {/* Cafes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Cafes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cafesContainer}
          >
            {mockCafes.map((cafe) => (
              <TouchableOpacity
                key={cafe.id}
                style={styles.cafeCard}
                onPress={() => handleCafePress(cafe)}
              >
                <Image
                  source={{ uri: cafe.image }}
                  style={styles.cafeImage}
                />
                <View style={styles.cafeInfo}>
                  <Text style={styles.cafeName}>{cafe.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{cafe.rating}</Text>
                  </View>
                  <Text style={styles.cafeAddress}>{cafe.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Festivals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Festivals</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.festivalsContainer}
          >
            {mockFestivals.map((festival) => (
              <TouchableOpacity
                key={festival.id}
                style={styles.festivalCard}
                onPress={() => handleFestivalPress(festival)}
              >
                <Image
                  source={{ uri: festival.image }}
                  style={styles.festivalImage}
                />
                <View style={styles.festivalInfo}>
                  <Text style={styles.festivalTitle}>{festival.name}</Text>
                  <Text style={styles.festivalDate}>{festival.date}</Text>
                  <Text style={styles.festivalLocation}>{festival.location}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {events.map(renderEvent)}
        </View>
      </ScrollView>

      {/* Cafe Details Modal */}
      <Modal
        visible={showCafeDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCafeDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderCafeDetails()}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFestivalDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFestivalDetails(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderFestivalDetails()}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  festivalsContainer: {
    paddingHorizontal: 16,
  },
  festivalCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  festivalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  festivalModalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  festivalInfo: {
    flex: 1,
  },
  festivalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  festivalDate: {
    fontSize: 14,
    color: '#666',
  },
  festivalLocation: {
    fontSize: 14,
    color: '#666',
  },
  cafesContainer: {
    paddingHorizontal: 16,
  },
  cafeCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cafeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cafeInfo: {
    padding: 12,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  cafeAddress: {
    fontSize: 14,
    color: '#666',
  },
  cafeDetails: {
    width: '100%',
    height: '100%',
  },
  cafeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cafeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  cafeContent: {
    flex: 1,
  },
  cafeModalImage: {
    width: '100%',
    height: width * 0.4, // 40% of screen width
    borderRadius: 12,
    marginBottom: 16,
  },
  reserveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  directionsButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  capacityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 100,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registeredButton: {
    backgroundColor: '#4CAF50',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    width: width * 0.9, // 90% of screen width
    height: width * 1.2, // 120% of screen width for height
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  festivalDetails: {
    width: '100%',
    height: '100%',
  },
  festivalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  closeButton: {
    padding: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    gap: 8,
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  festivalContent: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menuSection: {
    flex: 1,
    marginTop: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
}); 