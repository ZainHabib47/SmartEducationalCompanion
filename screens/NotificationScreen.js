import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../components/BottomNav';
import UploadConfirmationModal from '../components/UploadConfirmationModal';

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

export default function NotificationScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('single');
    const [singleEmail, setSingleEmail] = useState('');
    const [groupCountOpen, setGroupCountOpen] = useState(false);
    const [groupCount, setGroupCount] = useState(2);
    const [groupEmails, setGroupEmails] = useState(['', '']);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('Please fill all required fields.');
    const [refreshing, setRefreshing] = useState(false);
    const [history, setHistory] = useState([]);

    const handleBottomPress = (key) => {
        if (key === 'home') {
            router.push('/admin');
        } else if (key === 'bell') {
            router.push('/admin/notification');
        } else if (key === 'chatbot') {
            router.push('/admin/chatbot');
        } else if (key === 'settings') {
            router.push('/admin/settings');
        }
    };

    const handleSend = async () => {
        // Basic validation
        if (!message.trim()) {
            setErrorText('Message is required.');
            setShowError(true);
            return;
        }
        if (recipientType === 'single') {
            if (!singleEmail.trim()) {
                setErrorText('Student email is required.');
                setShowError(true);
                return;
            }
        } else if (recipientType === 'group') {
            const missing = groupEmails.some((e) => !e.trim());
            if (missing) {
                setErrorText('Please fill all group email fields.');
                setShowError(true);
                return;
            }
        }
        // Save to notification history
        try {
            const key = 'admin_notifications';
            const existing = await AsyncStorage.getItem(key);
            const list = existing ? JSON.parse(existing) : [];
            const entry = {
                id: Date.now().toString(),
                message: message.trim(),
                recipientType,
                recipients: recipientType === 'single' ? [singleEmail.trim()] : (recipientType === 'group' ? groupEmails.map((e)=>e.trim()) : ['class']),
                createdAt: new Date().toISOString(),
            };
            const next = [entry, ...list].slice(0, 500);
            await AsyncStorage.setItem(key, JSON.stringify(next));
            setHistory(next);
        } catch (e) {}
        setShowConfirm(true);
    };

    const closeConfirm = () => {
        setShowConfirm(false);
    };

    // Keep groupEmails array length in sync with groupCount
    useEffect(() => {
        setGroupEmails((prev) => {
            if (prev.length === groupCount) return prev;
            if (prev.length < groupCount) {
                return [...prev, ...Array(groupCount - prev.length).fill('')];
            }
            return prev.slice(0, groupCount);
        });
    }, [groupCount]);


    const loadHistory = async () => {
        try {
            const raw = await AsyncStorage.getItem('admin_notifications');
            const list = raw ? JSON.parse(raw) : [];
            setHistory(list);
        } catch (e) {}
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.inputBg} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notification</Text>
                    <View style={{ width: 44 }} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Notification Box</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Message</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Write your message to students..."
                            placeholderTextColor="#A9B8A8"
                            multiline
                            numberOfLines={6}
                            value={message}
                            onChangeText={setMessage}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Send To</Text>
                        <View style={styles.segment}>
                            {['single', 'class', 'group'].map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[styles.segmentItem, recipientType === key && styles.segmentItemActive]}
                                    onPress={() => setRecipientType(key)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={[styles.segmentText, recipientType === key && styles.segmentTextActive]}>
                                        {key === 'single' ? 'Single' : key === 'class' ? 'Class' : 'Group'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {recipientType === 'single' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Student Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. student@example.com"
                                placeholderTextColor="#A9B8A8"
                                value={singleEmail}
                                onChangeText={setSingleEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    )}

                    {recipientType === 'group' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Number of Students</Text>
                            <View>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setGroupCountOpen((o) => !o)}
                                    activeOpacity={0.85}
                                >
                                    <Text style={styles.dropdownText}>{groupCount}</Text>
                                    <Ionicons
                                        name={groupCountOpen ? 'chevron-up' : 'chevron-down'}
                                        size={18}
                                        color={COLORS.inputBg}
                                    />
                                </TouchableOpacity>
                                {groupCountOpen && (
                                    <View style={styles.dropdownList}>
                                        {Array.from({ length: 9 }, (_, i) => i + 2).map((num) => (
                                            <TouchableOpacity
                                                key={num}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setGroupCount(num);
                                                    setGroupCountOpen(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownItemText}>{num}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <View style={{ height: 12 }} />
                            <Text style={styles.label}>Enter Emails</Text>
                            {groupEmails.map((value, idx) => (
                                <View key={idx} style={{ marginBottom: 10 }}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={`Email ${idx + 1}`}
                                        placeholderTextColor="#A9B8A8"
                                        value={value}
                                        onChangeText={(text) => {
                                            setGroupEmails((prev) => {
                                                const next = [...prev];
                                                next[idx] = text;
                                                return next;
                                            });
                                        }}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} activeOpacity={0.9}>
                        <Ionicons name="send" size={18} color={COLORS.buttonText} style={{ marginRight: 8 }} />
                        <Text style={styles.sendButtonText}>Send Notification</Text>
                    </TouchableOpacity>
                </View>


                <View style={[styles.card, styles.cardSpacer]}>
                    <Text style={styles.sectionTitle}>Notification History</Text>
                    {history.length === 0 ? (
                        <Text style={styles.emptyText}>No notifications sent yet.</Text>
                    ) : (
                        <FlatList
                            data={history}
                            keyExtractor={(item) => item.id}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                            renderItem={({ item }) => (
                                <View style={styles.requestItem}>
                                    <Text style={styles.requestEmail}>{item.message}</Text>
                                    <Text style={styles.requestTime}>
                                        {item.recipientType.toUpperCase()} • {new Date(item.createdAt).toLocaleString()}
                                    </Text>
                                </View>
                            )}
                        />
                    )}
                </View>

                <View style={{ height: 140 }} />
            </ScrollView>

            <BottomNav
                onPressHome={() => handleBottomPress('home')}
                onPressNotifications={() => handleBottomPress('bell')}
                onPressChatbot={() => handleBottomPress('chatbot')}
                onPressSettings={() => handleBottomPress('settings')}
            />

            <UploadConfirmationModal
                visible={showConfirm}
                onClose={closeConfirm}
                title="Notification Sent"
                message="Your notification has been queued to be sent via email."
                operationType="notification"
            />
            <UploadConfirmationModal
                visible={showError}
                onClose={() => setShowError(false)}
                title="Action Required"
                message={errorText}
                operationType="notification"
                variant="error"
            />
        </KeyboardAvoidingView>
    );
}

const TOP_SAFE = Platform.OS === 'android' ? (StatusBar.currentHeight || 32) : 24;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: TOP_SAFE + 12,
    },
    header: {
        height: 56,
        backgroundColor: 'transparent',
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        marginTop: 0,
        marginBottom: 8,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.inputBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Griffter',
        fontSize: 20,
        color: COLORS.inputBg,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    sectionTitle: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: COLORS.inputBg,
        marginBottom: 12,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
        marginBottom: 8,
    },
    textArea: {
        minHeight: 120,
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        padding: 14,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: '#DDE8D8',
        fontFamily: 'Outfit',
        color: COLORS.heading,
    },
    input: {
        height: 48,
        backgroundColor: '#F8F9FA',
        borderRadius: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#DDE8D8',
        fontFamily: 'Outfit',
        color: COLORS.heading,
    },
    segment: {
        flexDirection: 'row',
        backgroundColor: '#F0F5EE',
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: '#DDE8D8',
    },
    segmentItem: {
        flex: 1,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentItemActive: {
        backgroundColor: COLORS.inputBg,
    },
    segmentText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.inputBg,
    },
    segmentTextActive: {
        color: COLORS.buttonText,
        fontWeight: '600',
    },
    dropdown: {
        height: 48,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DDE8D8',
        backgroundColor: '#F8F9FA',
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
    },
    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: '#DDE8D8',
        borderRadius: 12,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    dropdownItemText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.inputBg,
    },
    sendButton: {
        marginTop: 8,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.buttonBg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sendButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        fontWeight: '600',
    },
    cardSpacer: { marginTop: 16 },
    emptyText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.link,
    },
    requestItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEF2EC',
    },
    requestEmail: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
    },
    requestTime: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
        marginTop: 2,
    },
});


