import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    link: '#023e8a',
};

const { height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = height * 0.16;

export default function StudentCurriculumScreen() {
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
            
            <CustomHeader title="Curriculum" />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Physics */}
                <View style={styles.card}>
                    <View style={styles.cardImageContainer}>
                        <Image
                            source={require('../../assets/images/lightGreenLogo.png')}
                            resizeMode="contain"
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardFooterRow}>
                        <Text style={styles.footerDate}>29 Sep 2025</Text>
                        <Text style={styles.subjectTitle}>Physics</Text>
                        <Text style={styles.footerTime}>10:30 AM</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.85}>
                    <Ionicons name="download" size={20} color={COLORS.buttonText} />
                    <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>

                {/* Chemistry */}
                <View style={styles.card}>
                    <View style={styles.cardImageContainer}>
                        <Image
                            source={require('../../assets/images/lightGreenLogo.png')}
                            resizeMode="contain"
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardFooterRow}>
                        <Text style={styles.footerDate}>29 Sep 2025</Text>
                        <Text style={styles.subjectTitle}>Chemistry</Text>
                        <Text style={styles.footerTime}>10:30 AM</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.85}>
                    <Ionicons name="download" size={20} color={COLORS.buttonText} />
                    <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>

                {/* Maths */}
                <View style={styles.card}>
                    <View style={styles.cardImageContainer}>
                        <Image
                            source={require('../../assets/images/lightGreenLogo.png')}
                            resizeMode="contain"
                            style={styles.cardImage}
                        />
                    </View>
                    <View style={styles.cardFooterRow}>
                        <Text style={styles.footerDate}>29 Sep 2025</Text>
                        <Text style={styles.subjectTitle}>Maths</Text>
                        <Text style={styles.footerTime}>10:30 AM</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.downloadButton} activeOpacity={0.85}>
                    <Ionicons name="download" size={20} color={COLORS.buttonText} />
                    <Text style={styles.downloadButtonText}>Download PDF</Text>
                </TouchableOpacity>
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
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 20 + BOTTOM_NAV_HEIGHT,
    },
    card: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 12,
    },
    cardImageContainer: {
        flex: 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#f8fafc',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    cardFooterRow: {
        flex: 0,
        backgroundColor: COLORS.link,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 3,
    },
    subjectTitle: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: '#FFFFFF',
    },
    footerDate: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: '#FFFFFF',
    },
    footerTime: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: '#FFFFFF',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        marginBottom: 16,
    },
    downloadButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        marginLeft: 8,
    },
});