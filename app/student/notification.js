import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../../components/BottomNav';

const { width, height } = Dimensions.get('window');

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    arrow: '#03045e',
    link: '#023e8a',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
};

export default function StudentNotificationScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [expandedItems, setExpandedItems] = useState(new Set());

    // Sample notification data - replace with API call later
    const sampleNotifications = [
        {
            id: 1,
            title: "New Assignment Posted",
            content: "Mathematics Assignment 3 has been posted. Please submit your solutions by Friday, 5:00 PM. The assignment covers chapters 5-7 and includes both theoretical and practical problems.",
            date: "2 hours ago",
            isRead: false,
            priority: "high"
        },
        {
            id: 2,
            title: "Class Schedule Update",
            content: "Physics class on Wednesday has been moved to Room 205 instead of Room 101. Please update your schedule accordingly.",
            date: "5 hours ago",
            isRead: true,
            priority: "medium"
        },
        {
            id: 3,
            title: "Quiz Results Available",
            content: "Your Chemistry quiz results are now available. You can view them in the Quiz section. Great job on the recent test!",
            date: "1 day ago",
            isRead: true,
            priority: "low"
        },
        {
            id: 4,
            title: "Library Book Due Soon",
            content: "Your borrowed book 'Advanced Mathematics' is due in 2 days. Please return it to the library or renew it online.",
            date: "2 days ago",
            isRead: false,
            priority: "medium"
        },
        {
            id: 5,
            title: "Campus Event Reminder",
            content: "Don't forget about the Science Fair next week! Registration is still open. This is a great opportunity to showcase your projects and learn from others.",
            date: "3 days ago",
            isRead: true,
            priority: "low"
        }
    ];

    useEffect(() => {
        setNotifications(sampleNotifications);
    }, []);

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

    const toggleExpanded = (id) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedItems(newExpanded);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#F44336';
            case 'medium': return '#FF9800';
            case 'low': return '#4CAF50';
            default: return COLORS.link;
        }
    };

    const renderNotification = ({ item }) => {
        const isExpanded = expandedItems.has(item.id);
        
        return (
            <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
                <TouchableOpacity
                    style={styles.notificationHeader}
                    onPress={() => toggleExpanded(item.id)}
                    activeOpacity={0.7}
                >
                    <View style={styles.notificationTitleRow}>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
                                {item.title}
                            </Text>
                            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
                        </View>
                        <Ionicons 
                            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                            size={20} 
                            color={COLORS.arrow} 
                        />
                    </View>
                    <Text style={styles.notificationDate}>{item.date}</Text>
                </TouchableOpacity>
                
                {isExpanded && (
                    <View style={styles.notificationContent}>
                        <Text style={styles.notificationText}>{item.content}</Text>
                        <TouchableOpacity style={styles.readMoreButton}>
                            <Text style={styles.readMoreText}>Read More</Text>
                            <Ionicons name="arrow-forward" size={16} color={COLORS.arrow} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />
            
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.inputText} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Scrollable Notifications List */}
            <View style={styles.contentContainer}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNotification}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[COLORS.inputBg]}
                            tintColor={COLORS.inputBg}
                        />
                    }
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
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
        paddingTop: Math.max(20, height * 0.03),
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
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    listContainer: {
        paddingVertical: 10,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginBottom: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.link,
    },
    unreadCard: {
        borderLeftColor: COLORS.inputBg,
        backgroundColor: '#F8F9FA',
    },
    notificationHeader: {
        padding: 12,
    },
    notificationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    notificationTitle: {
        fontFamily: 'Outfit',
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.heading,
        flex: 1,
        marginRight: 8,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    notificationDate: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
    },
    notificationContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    notificationText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
        lineHeight: 20,
        marginBottom: 8,
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    readMoreText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.arrow,
        fontWeight: '500',
        marginRight: 4,
    },
});
