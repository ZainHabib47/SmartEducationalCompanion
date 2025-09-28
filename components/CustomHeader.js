import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    link: '#023e8a',
};

export default function CustomHeader({ title, showBackButton = true }) {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.headerContainer}>
            {showBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.inputBg} />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        padding: 20,
        paddingTop: Platform.select({ ios: 50, android: 20 }),
        backgroundColor: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.inputBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        position: 'absolute',
        left: 20,
        top: Platform.select({ ios: 50, android: 20 }),
    },
    backText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.inputBg,
        marginLeft: 6,
    },
    title: {
        fontFamily: 'Griffter',
        fontSize: 28,
        color: COLORS.inputBg,
        textAlign: 'center',
    },
});
