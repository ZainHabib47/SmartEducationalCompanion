import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

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

    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setExpandedItems((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    };

    const handleMarkRead = (id) => {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
    };

    const renderNotification = ({ item }) => {
        const isExpanded = expandedItems.has(item.id);

        return (
            <View style={[styles.notificationCard, !item.isRead && styles.unreadCard]}>
                {!item.isRead && <View style={styles.unreadDot} />}
                <View style={styles.headerRow}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </View>
                    <View style={styles.actionsInline}>
                        {!item.isRead && (
                            <TouchableOpacity
                                style={styles.iconOnlyButton}
                                onPress={() => handleMarkRead(item.id)}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="checkmark-done" size={18} color="#2196F3" />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[styles.iconOnlyButton, styles.readIconButton]}
                            onPress={() => toggleExpanded(item.id)}
                            activeOpacity={0.85}
                        >
                            <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#4CAF50" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconOnlyButton, styles.deleteIconButton]}
                            onPress={() => handleDelete(item.id)}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="trash" size={18} color="#E53935" />
                        </TouchableOpacity>
                    </View>
                </View>

                {isExpanded && (
                    <View style={styles.notificationContent}>
                        <Text style={styles.notificationDate}>{item.date}</Text>
                        <Text style={styles.notificationText}>{item.content}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />
            
            <CustomHeader title="Notifications" />

            {/* Counts Bar */}
            <View style={styles.countsBar}>
                <View style={styles.countItem}>
                    <Text style={styles.countLabel}>Unread</Text>
                    <Text style={styles.countValue}>{notifications.filter((n) => !n.isRead).length}</Text>
                </View>
                <View style={styles.countDivider} />
                <View style={styles.countItem}>
                    <Text style={styles.countLabel}>Read</Text>
                    <Text style={styles.countValue}>{notifications.filter((n) => n.isRead).length}</Text>
                </View>
                <View style={styles.countDivider} />
                <View style={styles.countItem}>
                    <Text style={styles.countLabel}>Total</Text>
                    <Text style={styles.countValue}>{notifications.length}</Text>
                </View>
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
                    showsVerticalScrollIndicator={true}
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
        paddingVertical: 15,
        paddingBottom: 140,
    },
    countsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 8,
        marginHorizontal: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    countItem: {
        flex: 1,
        alignItems: 'center',
    },
    countLabel: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.heading,
        marginBottom: 2,
    },
    countValue: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: COLORS.heading,
    },
    countDivider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.inputBg,
        opacity: 0.5,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        position: 'relative',
    },
    unreadCard: {},
    unreadDot: {
        position: 'absolute',
        top: -8,
        left: -8,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FFC107',
        zIndex: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 14,
        minHeight: 68,
    },
    titleContainer: {
        flex: 1,
        paddingRight: 10,
    },
    notificationTitle: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: COLORS.heading,
        flex: 1,
        marginRight: 8,
        lineHeight: 22,
    },
    unreadTitle: {
        fontWeight: '600',
    },
    actionsInline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconOnlyButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    readIconButton: {
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    deleteIconButton: {
        borderWidth: 2,
        borderColor: '#E53935',
    },
    actionButton: {},
    readButton: {},
    deleteButton: {},
    actionText: {},
    notificationDate: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
    },
    notificationContent: {
        paddingHorizontal: 12,
        paddingBottom: 12,
        paddingTop: 8,
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