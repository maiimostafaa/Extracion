import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InstructionBannerProps {
    text: string;
}

const ExtracionCoffeeToWaterInstructionBanner: React.FC<InstructionBannerProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 12,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3, // Android Shadow?!
        alignItems: 'center',
        width: '100%',
    },
    text: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
})

export default ExtracionCoffeeToWaterInstructionBanner