import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import UploadConfirmationModal from '../../components/UploadConfirmationModal';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export default function EditStudentScreen() {
    const router = useRouter();
    const { studentData } = useLocalSearchParams();
    const [student, setStudent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (studentData) {
            try {
                const parsedStudent = JSON.parse(studentData);
                setStudent(parsedStudent);
            } catch (error) {
                console.error('Error parsing student data:', error);
                Alert.alert('Error', 'Invalid student data');
                router.back();
            }
        }

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleInputChange = (field, value) => {
        setStudent(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Validate required fields
        if (!student.fullName.trim() || !student.fatherName.trim() || !student.email.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(student.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Validate phone number format
        const phoneRegex = /^\+92-\d{3}-\d{7}$/;
        if (!phoneRegex.test(student.phoneNumber)) {
            Alert.alert('Error', 'Please enter phone number in format: +92-XXX-XXXXXXX');
            return;
        }

        setIsEditing(false);
        setShowConfirmationModal(true);
    };

    const handleCancel = () => {
        if (isEditing) {
            Alert.alert(
                'Discard Changes',
                'Are you sure you want to discard your changes?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => router.back() }
                ]
            );
        } else {
            router.back();
        }
    };

    const handleConfirmationClose = () => {
        setShowConfirmationModal(false);
        router.back();
    };

    if (!student) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading student data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Animated.View 
                style={[
                    styles.header,
                    {
                        transform: [{ translateY: slideAnim }],
                        opacity: fadeAnim,
                    }
                ]}
            >
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={handleCancel}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.buttonText} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Edit Student</Text>
                
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => setIsEditing(!isEditing)}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={isEditing ? "close" : "create"} 
                        size={24} 
                        color={COLORS.buttonText} 
                    />
                </TouchableOpacity>
            </Animated.View>

            {/* Form */}
            <ScrollView 
                style={styles.formContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
            >
                <Animated.View 
                    style={[
                        styles.formCard,
                        {
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name *</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.fullName}
                            onChangeText={(value) => handleInputChange('fullName', value)}
                            editable={isEditing}
                            placeholder="Enter full name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Father Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Father Name *</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.fatherName}
                            onChangeText={(value) => handleInputChange('fatherName', value)}
                            editable={isEditing}
                            placeholder="Enter father's name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Address</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.address}
                            onChangeText={(value) => handleInputChange('address', value)}
                            editable={isEditing}
                            placeholder="Enter address"
                            placeholderTextColor={COLORS.link}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Past School */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Past School</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.pastSchool}
                            onChangeText={(value) => handleInputChange('pastSchool', value)}
                            editable={isEditing}
                            placeholder="Enter previous school name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number *</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.phoneNumber}
                            onChangeText={(value) => handleInputChange('phoneNumber', value)}
                            editable={isEditing}
                            placeholder="+92-XXX-XXXXXXX"
                            placeholderTextColor={COLORS.link}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.email}
                            onChangeText={(value) => handleInputChange('email', value)}
                            editable={isEditing}
                            placeholder="Enter email address"
                            placeholderTextColor={COLORS.link}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={[styles.input, !isEditing && styles.inputDisabled]}
                            value={student.password}
                            onChangeText={(value) => handleInputChange('password', value)}
                            editable={isEditing}
                            placeholder="Enter password"
                            placeholderTextColor={COLORS.link}
                            secureTextEntry
                        />
                    </View>

                    {/* Achievements (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Achievements</Text>
                        <TextInput
                            style={[styles.input, styles.inputDisabled]}
                            value={student.achievements}
                            editable={false}
                            placeholder="Achievements are managed by admin"
                            placeholderTextColor={COLORS.link}
                            multiline
                            numberOfLines={3}
                        />
                        <Text style={styles.readOnlyNote}>* Achievements cannot be edited</Text>
                    </View>

                    {/* Rank (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Rank</Text>
                        <TextInput
                            style={[styles.input, styles.inputDisabled]}
                            value={student.rank}
                            editable={false}
                            placeholder="Rank is managed by admin"
                            placeholderTextColor={COLORS.link}
                        />
                        <Text style={styles.readOnlyNote}>* Rank cannot be edited</Text>
                    </View>

                    {/* Registration Number (Read-only) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Registration Number</Text>
                        <TextInput
                            style={[styles.input, styles.inputDisabled]}
                            value={student.registrationNumber}
                            editable={false}
                            placeholder="Registration number"
                            placeholderTextColor={COLORS.link}
                        />
                        <Text style={styles.readOnlyNote}>* Registration number cannot be edited</Text>
                    </View>

                    {/* Action Buttons */}
                    {isEditing && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity 
                                style={styles.cancelEditButton}
                                onPress={() => setIsEditing(false)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.cancelEditButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.saveEditButton}
                                onPress={handleSave}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.saveEditButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Confirmation Modal */}
            <UploadConfirmationModal
                visible={showConfirmationModal}
                onClose={handleConfirmationClose}
                title="Student Updated Successfully"
                message="The student information has been updated successfully!"
                operationType="update"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.bg,
    },
    loadingText: {
        fontFamily: 'Outfit',
        fontSize: 18,
        color: COLORS.inputBg,
    },
    header: {
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 20,
        paddingTop: Math.max(20, height * 0.03),
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: 'Griffter',
        fontSize: 24,
        color: COLORS.buttonText,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    saveButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        flex: 1,
        padding: 20,
    },
    formContent: {
        paddingBottom: 20,
    },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontFamily: 'Griffter',
        fontSize: 16,
        color: COLORS.inputBg,
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.inputBg,
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        textAlignVertical: 'top',
    },
    inputDisabled: {
        backgroundColor: '#F0F0F0',
        color: '#999',
        borderColor: '#E0E0E0',
    },
    readOnlyNote: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
        fontStyle: 'italic',
        marginTop: 5,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    cancelEditButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flex: 0.45,
        alignItems: 'center',
    },
    cancelEditButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    saveEditButton: {
        backgroundColor: COLORS.inputBg,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flex: 0.45,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveEditButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        fontWeight: '600',
    },
});
