import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
};

export default function StudentTimetableScreen() {
    const router = useRouter();

    const handleBottomPress = (key) => {
        switch (key) {
            case 'home':
                router.push('/student');
                break;
            case 'bell':
                router.push('/student/notification');
                break;
            case 'chat':
                router.push('/student/chatbot');
                break;
            case 'settings':
                router.push('/student/settings');
                break;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />
            
            <CustomHeader title="Timetable" />

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.placeholder}>
                    <Ionicons name="calendar" size={64} color={COLORS.link} />
                    <Text style={styles.placeholderTitle}>Timetable</Text>
                    <Text style={styles.placeholderText}>Your class schedule will appear here</Text>
                </View>
            </View>

            {/* Bottom Navigation */}
            <BottomNav
                onPressHome={() => handleBottomPress('home')}
                onPressNotifications={() => handleBottomPress('bell')}
                onPressChatbot={() => handleBottomPress('chat')}
                onPressSettings={() => handleBottomPress('settings')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 20,
        paddingTop: Math.max(20, 50),
        paddingBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 10,
    },
    headerTitle: {
        fontFamily: 'Outfit',
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.inputText,
        flex: 1,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderTitle: {
        fontFamily: 'Outfit',
        fontSize: 24,
        fontWeight: '600',
        color: COLORS.heading,
        marginTop: 16,
        marginBottom: 8,
    },
    placeholderText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.link,
        textAlign: 'center',
    },
});