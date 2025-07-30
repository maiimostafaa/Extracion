import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { brewLogEntry } from "../../types/BrewLog/brewLogEntry"
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import StarRating from '../StarRating';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface brewLogEntryCardProps {
    brewLogEntry: brewLogEntry;
}

const BrewLogEntryCard: React.FC<brewLogEntryCardProps> = ({ brewLogEntry }) => {
    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const navigation = useNavigation<NavigationProp>();

    const handleCardPress = () => {
        console.log('Card pressed for:', brewLogEntry.name);
        navigation.navigate('BrewLogDetailScreen', { brewLogEntry })
    };

    const handleEditPress = () => {
        console.log('Edit pressed for:', brewLogEntry.name);
        navigation.navigate('BrewLogEditScreen', { brewLogEntry })
    };

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={handleCardPress}
            activeOpacity={0.95}
        >
            <Image 
                source={{ uri: brewLogEntry.image }}
                style={styles.image}
                resizeMode="cover"
            />
            
            <View style={styles.contentContainer}>
                <View style={styles.textSection}>
                    <Text style={styles.nameText} numberOfLines={1}>
                        {brewLogEntry.name}
                    </Text>
                    <Text style={styles.brewMethodText} numberOfLines={1}>
                        {brewLogEntry.brewMethod}
                    </Text>
                    
                    <View style={styles.ratingContainer}>
                        <StarRating 
                            rating={brewLogEntry.rating} 
                            size={12}
                            color="#FFD700"
                            outlineColor="#E0E0E0"
                        />
                        <Text style={styles.ratingText}>{brewLogEntry.rating}</Text>
                    </View>
                    
                    <Text style={styles.dateText}>
                        {formatDate(new Date(brewLogEntry.date))}
                    </Text>
                </View>
            </View>
            
            <View style={styles.editButtonWrapper}>
                <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={handleEditPress}
                    activeOpacity={0.7}
                >
                    <Image 
                        source={require('./icons/editIcon.png')} 
                        style={styles.editIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Allow flex growth
        aspectRatio: 190/300, // Maintain Figma proportions
        borderRadius: 10,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
        position: 'relative',
        // Removed margin as grid handles spacing
    },
    image: {
        width: '84.21%', // Responsive width based on container
        aspectRatio: 1, // Maintain square aspect ratio
        top: '4.67%', // Percentage positioning
        left: '7.89%', // Percentage positioning
        borderRadius: 10,
        position: 'absolute',
        overflow: 'hidden',
    },
    contentContainer: {
        height: '35%', // Percentage height for text content area
        width: '75%', // Increased width to give more space for text
        top: '61.33%', // Position below image using percentage
        left: '7.89%', // Same left margin as image
        position: 'absolute',
    },
    textSection: {
        height: '100%',
        position: 'relative',
    },
    nameText: {
        width: '100%', // Use full width of content container instead of fixed 77px
        fontSize: 16,
        letterSpacing: 0.3,
        color: '#078cc9', // Blue color like Figma
        lineHeight: 22,
        fontFamily: 'cardRegular',
        textAlign: 'left',
        position: 'absolute',
        top: '0%', // Percentage positioning
        left: '0%',
    },
    brewMethodText: {
        width: '100%', // Use full width of content container instead of fixed 55px
        fontSize: 12,
        color: '#58595b', // Gray color like Figma
        lineHeight: 22,
        fontFamily: 'cardRegular',
        textAlign: 'left',
        position: 'absolute',
        top: '21.9%', // Percentage positioning
        left: '0%',
    },
    ratingContainer: {
        position: 'absolute',
        top: 46, // Fixed positioning
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        lineHeight: 22,
        fontFamily: 'cardRegular',
        color: '#58595b',
        textAlign: 'left',
        marginLeft: 8, // Spacing between stars and number
    },
    bottomRow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    dateText: {
        width: '100%', // Use full width of content container instead of fixed 78px
        fontSize: 12,
        color: '#58595b', // Match Figma gray
        lineHeight: 22,
        fontFamily: 'cardRegular',
        textAlign: 'left',
        position: 'absolute',
        top: '79.05%', // Percentage positioning
        left: '0%',
    },
    editButtonWrapper: {
        position: 'absolute',
        height: '12%', // Increased percentage height
        width: '18%', // Increased percentage width
        top: '83%', // Adjusted positioning slightly higher
        right: '7.89%', // Match Figma positioning
        zIndex: 1,
    },
    iconButton: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // Removed border, background, and shadow styling
    },
    editIcon: {
        width: 20,
        height: 20,
        tintColor: '#8CDBED', // Light blue accent color
    },
    iconText: {
        fontSize: 18,
    },
});

export default BrewLogEntryCard;