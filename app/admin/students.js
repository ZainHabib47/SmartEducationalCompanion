import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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

// Sample student data - replace with API call later
const sampleStudents = [
    {
        id: 1,
        fullName: 'Zain Habib',
        fatherName: 'Noor Habib Shah',
        address: '123 Main Street, Karachi',
        pastSchool: 'ABC High School',
        phoneNumber: '+923189043757',
        email: 'zainhabib@google.com',
        password: 'password123',
        achievements: 'First Position in Science Fair 2023',
        rank: '1st',
        registrationNumber: 'STU-2024-001'
    },
    {
        id: 2,
        fullName: 'Fatima Ali',
        fatherName: 'Ali Ahmed',
        address: '456 Park Avenue, Lahore',
        pastSchool: 'XYZ School',
        phoneNumber: '+92-301-2345678',
        email: 'fatima.ali@email.com',
        password: 'password456',
        achievements: 'Best Student Award 2023',
        rank: '2nd',
        registrationNumber: 'STU-2024-002'
    },
    {
        id: 3,
        fullName: 'Muhammad Usman',
        fatherName: 'Usman Khan',
        address: '789 Garden Road, Islamabad',
        pastSchool: 'DEF Academy',
        phoneNumber: '+92-302-3456789',
        email: 'muhammad.usman@email.com',
        password: 'password789',
        achievements: 'Sports Champion 2023',
        rank: '3rd',
        registrationNumber: 'STU-2024-003'
    }
];

export default function StudentsListScreen() {
    const router = useRouter();
    const [students, setStudents] = useState(sampleStudents);
    const [filteredStudents, setFilteredStudents] = useState(sampleStudents);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpModalType, setOtpModalType] = useState('delete'); // currently used for delete only
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [confirmVariant, setConfirmVariant] = useState('success');
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student => 
                student.fullName.toLowerCase().includes(query.toLowerCase()) ||
                student.registrationNumber.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };

    const handleExpandStudent = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    const handleEditStudent = (student) => {
        router.push({
            pathname: '/admin/edit-student',
            params: { studentData: JSON.stringify(student) }
        });
    };

    const handleDeleteStudent = (student) => {
        setStudentToDelete(student);
        setOtpModalType('delete');
        setShowOTPModal(true);
    };

    const handleAddStudent = () => {
        // Directly navigate to add-student; OTP will be requested at the end of the add flow
        router.push('/admin/add-student');
    };

    const requestAddStudentOtp = async () => {
        // TODO: replace with backend API call
        setConfirmVariant('success');
        setConfirmTitle('OTP Sent');
        setConfirmMessage('A 6-digit OTP has been sent to your phone.');
        setConfirmVisible(true);
    };

    const handleOTPVerification = async (otp) => {
        // TODO: replace with backend verification
        const valid = otp === '123456';
        if (valid) {
            if (otpModalType === 'delete' && studentToDelete) {
                // Delete student
                const updatedStudents = students.filter(s => s.id !== studentToDelete.id);
                setStudents(updatedStudents);
                setFilteredStudents(updatedStudents.filter(student => 
                    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
                ));
                setStudentToDelete(null);
                setConfirmVariant('success');
                setConfirmTitle('Deleted');
                setConfirmMessage('Student deleted successfully.');
                setConfirmVisible(true);
            }
            setShowOTPModal(false);
        } else {
            setConfirmVariant('error');
            setConfirmTitle('Invalid OTP');
            setConfirmMessage('The OTP you entered is incorrect. Please try again.');
            setConfirmVisible(true);
        }
    };

    const StudentCard = ({ student, isExpanded }) => (
        <View style={styles.studentCard}>
            <View style={styles.studentCardHeader}>
                <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.fullName}</Text>
                    <Text style={styles.fatherName}>{student.fatherName}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.expandButton}
                    onPress={() => handleExpandStudent(student.id)}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={24} 
                        color={COLORS.inputBg} 
                    />
                </TouchableOpacity>
            </View>
            
            {isExpanded && (
                <Animated.View style={styles.expandedContent}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Address:</Text>
                        <Text style={styles.detailValue}>{student.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Past School:</Text>
                        <Text style={styles.detailValue}>{student.pastSchool}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phone:</Text>
                        <Text style={styles.detailValue}>{student.phoneNumber}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Email:</Text>
                        <Text style={styles.detailValue}>{student.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Password:</Text>
                        <Text style={styles.detailValue}>{student.password}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Achievements:</Text>
                        <Text style={styles.detailValue}>{student.achievements}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Rank:</Text>
                        <Text style={styles.detailValue}>{student.rank}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Registration No:</Text>
                        <Text style={styles.detailValue}>{student.registrationNumber}</Text>
                    </View>
                    
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => handleEditStudent(student)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="create" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Edit Information</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteStudent(student)}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="trash" size={20} color="#fff" />
                            <Text style={styles.actionButtonText}>Delete Student</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );

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
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.buttonText} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Students Management</Text>
                
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddStudent}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={24} color={COLORS.buttonText} />
                </TouchableOpacity>
            </Animated.View>

            {/* Search Section */}
            <Animated.View 
                style={[
                    styles.searchSection,
                    {
                        opacity: fadeAnim,
                    }
                ]}
            >
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={COLORS.link} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by name or registration number..."
                        placeholderTextColor={COLORS.link}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
                
                <TouchableOpacity 
                    style={styles.searchButton}
                    onPress={() => handleSearch(searchQuery)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Students List */}
            <ScrollView 
                style={styles.studentsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.studentsListContent}
            >
                {filteredStudents.map((student) => (
                    <StudentCard 
                        key={student.id} 
                        student={student} 
                        isExpanded={expandedStudent === student.id}
                    />
                ))}
                
                {filteredStudents.length === 0 && (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="people-outline" size={64} color={COLORS.link} />
                        <Text style={styles.noResultsText}>No students found</Text>
                        <Text style={styles.noResultsSubtext}>Try adjusting your search criteria</Text>
                    </View>
                )}
            </ScrollView>

            {/* OTP Modal */}
            <OTPModal
                visible={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={handleOTPVerification}
                onResend={requestAddStudentOtp}
                type={otpModalType}
                studentName={studentToDelete?.fullName}
            />

            {/* Confirmation Modal */}
            <UploadConfirmationModal
                visible={confirmVisible}
                onClose={() => setConfirmVisible(false)}
                title={confirmTitle}
                message={confirmMessage}
                variant={confirmVariant}
                operationType={otpModalType === 'delete' ? 'delete' : 'otp'}
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
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchSection: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.inputBg,
    },
    searchButton: {
        backgroundColor: COLORS.inputBg,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchButtonText: {
        fontFamily: 'Griffter',
        fontSize: 16,
        color: COLORS.buttonText,
    },
    studentsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    studentsListContent: {
        paddingBottom: 20,
    },
    studentCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
    },
    studentCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: COLORS.inputBg,
        marginBottom: 4,
    },
    fatherName: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.link,
    },
    expandButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expandedContent: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    detailLabel: {
        fontFamily: 'Griffter',
        fontSize: 14,
        color: COLORS.inputBg,
        width: 120,
        marginRight: 10,
    },
    detailValue: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.link,
        flex: 1,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 15,
        flex: 0.48,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
    },
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    noResultsText: {
        fontFamily: 'Griffter',
        fontSize: 20,
        color: COLORS.inputBg,
        marginTop: 20,
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.link,
    },
});
