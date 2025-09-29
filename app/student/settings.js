import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    border: '#DDE8D8',
};

export default function StudentSettingsScreen() {
    const router = useRouter();
    const [name, setName] = useState('Jane Student');
    const [email, setEmail] = useState('student@example.com');
    const [studentId, setStudentId] = useState('STU2024001');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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

    const handleSaveProfile = () => {
        // TODO: Implement profile save logic
        console.log('Saving profile...');
    };

    const handleLogout = () => {
        // TODO: clear auth state and navigate
        router.replace('/');
    };

    const handleChangePassword = () => {
        // TODO: Implement password change logic
        console.log('Changing password...');
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />
            
            <CustomHeader title="Settings" />

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                {/* Profile Information Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Profile Information</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.inputText}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.inputText}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Student ID</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={studentId}
                            editable={false}
                            placeholderTextColor={COLORS.inputText}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>

                {/* Change Password Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Change Password</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <TextInput
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter current password"
                            placeholderTextColor={COLORS.inputText}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Enter new password"
                            placeholderTextColor={COLORS.inputText}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            placeholderTextColor={COLORS.inputText}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                        <Text style={styles.saveButtonText}>Change Password</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.9}>
                         <Ionicons name="log-out" size={18} color={COLORS.buttonBg} style={{ marginRight: 8 }} />
                         <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav
                onPressHome={() => handleBottomPress('home')}
                onPressNotifications={() => handleBottomPress('bell')}
                onPressChatbot={() => handleBottomPress('chat')}
                onPressSettings={() => handleBottomPress('settings')}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
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
    logoutBtn: {
        marginTop: 8,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: COLORS.inputBg,
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
    container: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontFamily: 'Outfit',
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.heading,
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Outfit',
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.heading,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.inputText,
    },
    disabledInput: {
        backgroundColor: '#E0E0E0',
        color: '#666666',
    },
    saveButton: {
        backgroundColor: COLORS.buttonBg,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.buttonText,
    },
});