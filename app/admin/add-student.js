import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import OTPModal from '../../components/OTPModal';
import UploadConfirmationModal from '../../components/UploadConfirmationModal';
import { COLORS } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

export default function AddStudentScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        fatherName: '',
        address: '',
        pastSchool: '',
        phoneNumber: '',
        email: '',
        password: '',
        achievements: '',
        rank: '',
        registrationNumber: ''
    });
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [confirmationVariant, setConfirmationVariant] = useState('success'); // 'success' | 'error'
    const [confirmationTitle, setConfirmationTitle] = useState('Student Added Successfully');
    const [confirmationMessage, setConfirmationMessage] = useState('The new student has been added to the system successfully!');
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const slideAnim = useRef(new Animated.Value(-100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateRegistrationNumber = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `STU-${year}-${randomNum}`;
    };

    const handleSave = () => {
        // Validate required fields
        if (!formData.fullName.trim() || !formData.fatherName.trim() || !formData.email.trim()) {
            setConfirmationVariant('error');
            setConfirmationTitle('Submission Rejected');
            setConfirmationMessage('Please fill in all required fields (Full Name, Father Name, Email).');
            setShowConfirmationModal(true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setConfirmationVariant('error');
            setConfirmationTitle('Submission Rejected');
            setConfirmationMessage('Please enter a valid email address.');
            setShowConfirmationModal(true);
            return;
        }

        // Validate phone number format
        const phoneRegex = /^\+92-\d{3}-\d{7}$/;
        if (!phoneRegex.test(formData.phoneNumber)) {
            setConfirmationVariant('error');
            setConfirmationTitle('Submission Rejected');
            setConfirmationMessage('Please enter phone number in format: +92-XXX-XXXXXXX');
            setShowConfirmationModal(true);
            return;
        }

        // Generate registration number if not provided
        if (!formData.registrationNumber.trim()) {
            formData.registrationNumber = generateRegistrationNumber();
        }

        // Step 1: Ask for OTP before finalizing
        setShowOTPModal(true);
    };

    const handleCancel = () => {
        Alert.alert(
            'Discard Form',
            'Are you sure you want to discard this form? All entered data will be lost.',
            [
                { text: 'Keep Editing', style: 'cancel' },
                { text: 'Discard', style: 'destructive', onPress: () => router.back() }
            ]
        );
    };

    const handleConfirmationClose = () => {
        setShowConfirmationModal(false);
        if (confirmationVariant === 'success') {
            router.back();
        }
    };

    const sendOtp = async () => {
        // TODO: call backend to send OTP
        Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your phone.');
    };

    const verifyOtpAndSubmit = async (otp) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            // TODO: verify OTP with backend
            const valid = otp === '123456';
            if (!valid) {
                setShowOTPModal(false);
                setConfirmationVariant('error');
                setConfirmationTitle('Invalid OTP');
                setConfirmationMessage('The OTP you entered is incorrect. Please try again.');
                setShowConfirmationModal(true);
                return;
            }
            // TODO: submit student to backend & get acceptance/rejection
            // Placeholder validation to simulate backend decision
            const serverAccepts = (
                formData.fullName.trim().length >= 3 &&
                formData.fatherName.trim().length >= 3 &&
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
                /^\+92-\d{3}-\d{7}$/.test(formData.phoneNumber.trim())
            );

            setShowOTPModal(false);
            if (serverAccepts) {
                setConfirmationVariant('success');
                setConfirmationTitle('Student Added Successfully');
                setConfirmationMessage('The new student has been added to the system successfully!');
            } else {
                setConfirmationVariant('error');
                setConfirmationTitle('Submission Rejected');
                setConfirmationMessage('The provided information did not pass verification. Please review the fields and try again.');
            }
            setShowConfirmationModal(true);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                
                <Text style={styles.headerTitle}>Add New Student</Text>

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
                            style={styles.input}
                            value={formData.fullName}
                            onChangeText={(value) => handleInputChange('fullName', value)}
                            placeholder="Enter full name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Father Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Father Name *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.fatherName}
                            onChangeText={(value) => handleInputChange('fatherName', value)}
                            placeholder="Enter father's name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Address */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Address</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address}
                            onChangeText={(value) => handleInputChange('address', value)}
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
                            style={styles.input}
                            value={formData.pastSchool}
                            onChangeText={(value) => handleInputChange('pastSchool', value)}
                            placeholder="Enter previous school name"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phoneNumber}
                            onChangeText={(value) => handleInputChange('phoneNumber', value)}
                            placeholder="+92-XXX-XXXXXXX"
                            placeholderTextColor={COLORS.link}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(value) => handleInputChange('email', value)}
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
                            style={styles.input}
                            value={formData.password}
                            onChangeText={(value) => handleInputChange('password', value)}
                            placeholder="Enter password"
                            placeholderTextColor={COLORS.link}
                            secureTextEntry
                        />
                    </View>

                    {/* Achievements */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Achievements</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.achievements}
                            onChangeText={(value) => handleInputChange('achievements', value)}
                            placeholder="Enter achievements"
                            placeholderTextColor={COLORS.link}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    {/* Rank */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Rank</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.rank}
                            onChangeText={(value) => handleInputChange('rank', value)}
                            placeholder="Enter rank (e.g., 1st, 2nd, 3rd)"
                            placeholderTextColor={COLORS.link}
                        />
                    </View>

                    {/* Registration Number */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Registration Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.registrationNumber}
                            onChangeText={(value) => handleInputChange('registrationNumber', value)}
                            placeholder="Leave empty to auto-generate"
                            placeholderTextColor={COLORS.link}
                        />
                        <Text style={styles.helpText}>* Leave empty to auto-generate registration number</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={handleSave}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.saveButtonText}>Add Student</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Confirmation Modal */}
            <UploadConfirmationModal
                visible={showConfirmationModal}
                onClose={handleConfirmationClose}
                title={confirmationTitle}
                message={confirmationMessage}
                operationType="add"
                variant={confirmationVariant}
            />

            {/* OTP Modal */}
            <OTPModal
                visible={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={verifyOtpAndSubmit}
                onResend={sendOtp}
                type="add"
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
    helpText: {
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
    cancelButton: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        flex: 0.45,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    saveButton: {
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
    saveButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        fontWeight: '600',
    },
});
