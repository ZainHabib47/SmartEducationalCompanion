import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

const { width, height } = Dimensions.get('window');

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    link: '#023e8a',
};

export default function StudentAchievementsScreen() {
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

    const dummyAchievements = [1, 2, 3, 4, 5];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />
            <CustomHeader title="Achievements" />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <View style={styles.grid}> 
                    {dummyAchievements.map((id) => (
                        <View key={id} style={styles.card}>
                            <View style={styles.cardInner}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name="trophy" size={28} color={COLORS.inputBg} />
                                </View>
                                <Text style={styles.cardTitle}>Achievement {id}</Text>
                                <Text style={styles.cardSubtitle}>Coming soon</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View style={{ height: 24 }} />
            </ScrollView>

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
    content: {
        flex: 1,
        padding: 16,
    },
    contentContainer: {
        paddingBottom: height * 0.16 + 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 4,
    },
    cardInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    iconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F0F8F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontFamily: 'Griffter',
        fontSize: 16,
        color: COLORS.inputBg,
    },
    cardSubtitle: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
        marginTop: 4,
    },
});


