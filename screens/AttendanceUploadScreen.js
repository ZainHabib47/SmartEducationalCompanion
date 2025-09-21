import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import UploadConfirmationModal from '../components/UploadConfirmationModal';

const { width, height } = Dimensions.get('window');

const COLORS = {
	bg: '#F5F5F5',
	heading: '#1A2F23',
	inputBg: '#2E4D3A',
	inputText: '#FFFFFF',
	arrow: '#7A9B77',
	link: '#7A9B77',
	buttonBg: '#2E4D3A',
	buttonText: '#FFFFFF',
	success: '#4CAF50',
	danger: '#F44336',
};

// Sample student data - replace with MongoDB API call
const sampleStudents = [
	{
		id: 1,
		registrationNumber: '2021-CS-001',
		fullName: 'Ahmed Ali Khan',
		fatherName: 'Muhammad Ali Khan',
		attendancePercentage: 85,
	},
	{
		id: 2,
		registrationNumber: '2021-CS-002',
		fullName: 'Fatima Zahra',
		fatherName: 'Hassan Ali',
		attendancePercentage: 92,
	},
	{
		id: 3,
		registrationNumber: '2021-CS-003',
		fullName: 'Muhammad Usman',
		fatherName: 'Abdul Rahman',
		attendancePercentage: 78,
	},
	{
		id: 4,
		registrationNumber: '2021-CS-004',
		fullName: 'Ayesha Siddiqua',
		fatherName: 'Muhammad Siddique',
		attendancePercentage: 95,
	},
	{
		id: 5,
		registrationNumber: '2021-CS-005',
		fullName: 'Hassan Raza',
		fatherName: 'Raza Ali',
		attendancePercentage: 88,
	},
];

// Circular Progress Component
const CircularProgress = ({ percentage, size = 60, strokeWidth = 10 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (percentage / 100) * circumference;
	
	const getColor = (percentage) => {
		if (percentage >= 80) return COLORS.success; // Green for good attendance
		return COLORS.danger; // Red for poor attendance
	};

	return (
		<View style={styles.circularProgressContainer}>
			<Svg width={size} height={size} style={styles.circularProgressSvg}>
				{/* Background circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke="#E0E0E0"
					strokeWidth={strokeWidth}
					fill="transparent"
				/>
				{/* Progress circle */}
				<Circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={getColor(percentage)}
					strokeWidth={strokeWidth}
					fill="transparent"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
			</Svg>
			<Text style={styles.circularProgressText}>{percentage}%</Text>
		</View>
	);
};

export default function AttendanceUploadScreen() {
	const router = useRouter();
	const [students, setStudents] = useState(sampleStudents);
	const [attendanceStatus, setAttendanceStatus] = useState({});
	const [showConfirmation, setShowConfirmation] = useState(false);

	// Initialize attendance status for all students
	useEffect(() => {
		const initialStatus = {};
		students.forEach(student => {
			initialStatus[student.id] = null; // null = not marked, true = present, false = absent
		});
		setAttendanceStatus(initialStatus);
	}, [students]);

	const handleAttendanceChange = (studentId, isPresent) => {
		setAttendanceStatus(prev => ({
			...prev,
			[studentId]: isPresent
		}));
	};

	const handleBack = () => {
		router.back();
	};

	const handleUploadAttendance = () => {
		const unmarkedStudents = students.filter(student => attendanceStatus[student.id] === null);
		
		if (unmarkedStudents.length > 0) {
			Alert.alert(
				'Incomplete Attendance',
				`Please mark attendance for ${unmarkedStudents.length} student(s) before uploading.`,
				[{ text: 'OK' }]
			);
			return;
		}

		Alert.alert(
			'Upload Attendance',
			'Are you sure you want to upload the attendance?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Upload',
					onPress: () => {
						// Here you would send data to MongoDB
						console.log('Attendance data:', attendanceStatus);
						// Show confirmation modal
						setShowConfirmation(true);
					}
				}
			]
		);
	};

	const handleConfirmationClose = () => {
		setShowConfirmation(false);
		router.back();
	};

	const isAllMarked = students.every(student => attendanceStatus[student.id] !== null);

	return (
		<View style={styles.container}>
			{/* Header with Back Button */}
			<TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
				<Ionicons name="arrow-back" size={24} color={COLORS.inputBg} />
				<Text style={styles.backText}>Back</Text>
			</TouchableOpacity>

			{/* Title */}
			<Text style={styles.title}>Attendance</Text>

			{/* Upload Button */}
			<TouchableOpacity 
				style={[
					styles.uploadButton, 
					!isAllMarked && styles.uploadButtonDisabled
				]} 
				onPress={handleUploadAttendance} 
				activeOpacity={0.8}
				disabled={!isAllMarked}
			>
				<Ionicons name="cloud-upload" size={20} color={isAllMarked ? COLORS.buttonText : '#999'} />
				<Text style={[
					styles.uploadText,
					!isAllMarked && styles.uploadTextDisabled
				]}>
					Upload Attendance
				</Text>
			</TouchableOpacity>

			{/* Students List */}
			<ScrollView 
				style={styles.studentsContainer}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.studentsContent}
			>
				{students.map((student) => (
					<View key={student.id} style={styles.studentCard}>
						{/* Student Info */}
						<View style={styles.studentInfo}>
							<View style={styles.studentInfoLeft}>
								<Text style={styles.registrationNumber}>{student.registrationNumber}</Text>
								<Text style={styles.fullName}>{student.fullName}</Text>
								<Text style={styles.fatherName}>Father: {student.fatherName}</Text>
							</View>
							{/* Circular Progress at right middle */}
							<View style={styles.studentInfoRight}>
								<CircularProgress percentage={student.attendancePercentage} />
							</View>
						</View>

						{/* Attendance Radio Buttons */}
						<View style={styles.radioGroup}>
							<TouchableOpacity 
								style={styles.radioRow} 
								onPress={() => handleAttendanceChange(student.id, true)}
								activeOpacity={0.7}
							>
								<View style={[
									styles.radioOuter,
									attendanceStatus[student.id] === true && styles.radioOuterActive
								]}>
									{attendanceStatus[student.id] === true && <View style={styles.radioInner} />}
								</View>
								<Text style={[
									styles.radioLabel,
									attendanceStatus[student.id] === true && styles.radioLabelActive
								]}>
									Present
								</Text>
							</TouchableOpacity>

							<TouchableOpacity 
								style={styles.radioRow} 
								onPress={() => handleAttendanceChange(student.id, false)}
								activeOpacity={0.7}
							>
								<View style={[
									styles.radioOuter,
									attendanceStatus[student.id] === false && styles.radioOuterActive
								]}>
									{attendanceStatus[student.id] === false && <View style={styles.radioInner} />}
								</View>
								<Text style={[
									styles.radioLabel,
									attendanceStatus[student.id] === false && styles.radioLabelActive
								]}>
									Absent
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				))}
			</ScrollView>

			{/* Confirmation Modal */}
			<UploadConfirmationModal
				visible={showConfirmation}
				onClose={handleConfirmationClose}
				title="Attendance Uploaded Successfully"
				message="Student attendance has been recorded and uploaded successfully!"
				operationType="attendance"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.bg,
		padding: 20,
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		paddingVertical: 8,
		paddingHorizontal: 12,
		marginTop: Platform.select({ ios: 50, android: 20 }),
		marginBottom: 10,
		backgroundColor: '#fff',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: COLORS.inputBg,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 2,
		elevation: 2,
	},
	backText: {
		fontFamily: 'Outfit',
		fontSize: 16,
		color: COLORS.inputBg,
		marginLeft: 6,
	},
	title: {
		fontFamily: 'Griffter',
		fontSize: 28,
		color: COLORS.inputBg,
		textAlign: 'center',
		marginBottom: 20,
	},
	uploadButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: COLORS.buttonBg,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 25,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	uploadButtonDisabled: {
		backgroundColor: '#E0E0E0',
	},
	uploadText: {
		fontFamily: 'Outfit',
		fontSize: 16,
		color: COLORS.buttonText,
		marginLeft: 8,
		fontWeight: '600',
	},
	uploadTextDisabled: {
		color: '#999',
	},
	studentsContainer: {
		flex: 1,
	},
	studentsContent: {
		paddingBottom: 20,
	},
	studentCard: {
		backgroundColor: 'rgba(255, 255, 255, 0.9)',
		borderRadius: 20,
		padding: 20,
		marginBottom: 16,
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
	},
	studentInfo: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 16,
	},
	studentInfoLeft: {
		flex: 1,
		paddingRight: 20,
	},
	studentInfoRight: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 20,
		paddingRight: 10,
	},
	registrationNumber: {
		fontFamily: 'Griffter',
		fontSize: 16,
		color: COLORS.inputBg,
		fontWeight: 'bold',
		marginBottom: 4,
	},
	fullName: {
		fontFamily: 'Outfit',
		fontSize: 18,
		color: COLORS.inputBg,
		fontWeight: '600',
		marginBottom: 4,
	},
	fatherName: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: COLORS.link,
		marginBottom: 8,
	},
	circularProgressContainer: {
		position: 'relative',
		alignItems: 'center',
		justifyContent: 'center',
	},
	circularProgressSvg: {
		position: 'absolute',
	},
	circularProgressText: {
		fontFamily: 'Griffter',
		fontSize: 12,
		fontWeight: 'bold',
		color: COLORS.inputBg,
		textAlign: 'center',
	},
	radioGroup: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	radioRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 8,
	},
	radioOuterActive: {
		borderColor: COLORS.inputBg,
		backgroundColor: COLORS.inputBg,
	},
	radioInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: '#fff',
	},
	radioLabel: {
		fontFamily: 'Outfit',
		fontSize: 16,
		color: COLORS.inputBg,
	},
	radioLabelActive: {
		fontWeight: '600',
	},
});


