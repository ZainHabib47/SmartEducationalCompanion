import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UploadConfirmationModal from '../components/UploadConfirmationModal';

const COLORS = {
	bg: '#F5F5F5',
	heading: '#1A2F23',
	inputBg: '#2E4D3A',
	inputText: '#FFFFFF',
	link: '#7A9B77',
	buttonBg: '#2E4D3A',
	buttonText: '#FFFFFF',
};

export default function UploadBaseScreen() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [storeInDataCenter, setStoreInDataCenter] = useState(true);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const isAttendance = pathname?.toLowerCase().includes('attendance');
	const isTimetable = pathname?.toLowerCase().includes('timetable');
	const isSchedule = pathname?.toLowerCase().includes('schedule');
	
	let title = 'Upload Document';
	if (isAttendance) {
		title = 'Upload Attendance';
	} else if (isTimetable) {
		title = 'Upload Timetable';
	} else if (isSchedule) {
		title = 'Upload Schedule';
	}

	const handlePickPdf = async () => {
		const res = await DocumentPicker.getDocumentAsync({ type: 'application/pdf', multiple: false });
		if (res?.assets?.[0]) {
			setSelectedFile(res.assets[0]);
		}
	};

	const handlePickImage = async () => {
		const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
		if (!res.canceled && res.assets?.[0]) {
			setSelectedFile(res.assets[0]);
		}
	};

	const handleConfirmUpload = () => {
		if (!selectedFile) {
			Alert.alert('No file selected', 'Please select a PDF or Picture to upload.');
			return;
		}

		// Show confirmation modal
		setShowConfirmation(true);
	};

	const handleConfirmationClose = () => {
		setShowConfirmation(false);
		router.back();
	};

	const handleCancel = () => {
		if (selectedFile) {
			// If file is selected, show cancel confirmation
			Alert.alert(
				'Cancel Upload',
				'Are you sure you want to cancel? Your selected file will be lost.',
				[
					{ text: 'Keep File', style: 'cancel' },
					{ 
						text: 'Cancel Upload', 
						style: 'destructive',
						onPress: () => {
							setSelectedFile(null);
							router.back();
						}
					}
				]
			);
		} else {
			// If no file selected, just go back
			router.back();
		}
	};

	return (
		<View style={styles.container}>
			{/* Cancel/Back Button */}
			<TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
				<Ionicons name="arrow-back" size={24} color={COLORS.inputBg} />
				<Text style={styles.cancelText}>
					{selectedFile ? 'Cancel' : 'Back'}
				</Text>
			</TouchableOpacity>
			
			<Text style={styles.title}>{title}</Text>
			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Choose file type</Text>
				<View style={styles.row}>
					<TouchableOpacity style={styles.option} onPress={handlePickPdf} activeOpacity={0.85}>
						<Ionicons name="document-text" size={22} color={COLORS.inputBg} />
						<Text style={styles.optionText}>Upload PDF</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.option} onPress={handlePickImage} activeOpacity={0.85}>
						<Ionicons name="image" size={22} color={COLORS.inputBg} />
						<Text style={styles.optionText}>Upload Picture</Text>
					</TouchableOpacity>
				</View>

				<Text style={[styles.sectionTitle, { marginTop: 18 }]}>Storage preference</Text>
				<View style={styles.radioGroup}>
					<TouchableOpacity style={styles.radioRow} onPress={() => setStoreInDataCenter(true)}>
						<View style={[styles.radioOuter, storeInDataCenter && styles.radioOuterActive]}>
							{storeInDataCenter && <View style={styles.radioInner} />}
						</View>
						<Text style={styles.radioLabel}>Store in Data Center</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.radioRow} onPress={() => setStoreInDataCenter(false)}>
						<View style={[styles.radioOuter, !storeInDataCenter && styles.radioOuterActive]}>
							{!storeInDataCenter && <View style={styles.radioInner} />}
						</View>
						<Text style={styles.radioLabel}>Do not store</Text>
					</TouchableOpacity>
				</View>

				{selectedFile && (
					<View style={styles.filePreview}>
						<Ionicons name="checkmark-circle" size={20} color={COLORS.inputBg} />
						<Text style={styles.fileName} numberOfLines={1}>{selectedFile.name || selectedFile.uri}</Text>
					</View>
				)}

				<TouchableOpacity style={styles.confirmButton} onPress={handleConfirmUpload} activeOpacity={0.9}>
					<Text style={styles.confirmText}>Confirm Upload</Text>
				</TouchableOpacity>
			</View>

			{/* Confirmation Modal */}
			<UploadConfirmationModal
				visible={showConfirmation}
				onClose={handleConfirmationClose}
				title={`${isTimetable ? 'Timetable' : isSchedule ? 'Schedule' : 'Document'} Uploaded Successfully`}
				message={`Your ${isTimetable ? 'timetable' : isSchedule ? 'schedule' : 'document'} has been uploaded successfully! Transaction ID: ${Math.floor(Math.random() * 1e6)}`}
				operationType="upload"
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
	cancelButton: {
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
	cancelText: {
		fontFamily: 'Outfit',
		fontSize: 16,
		color: COLORS.inputBg,
		marginLeft: 6,
	},
	title: {
		fontFamily: 'Griffter',
		fontSize: 22,
		color: COLORS.inputBg,
		textAlign: 'center',
		marginTop: Platform.select({ ios: 50, android: 20 }),
		marginBottom: 16,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 16,
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
	},
	sectionTitle: {
		fontFamily: 'Outfit',
		fontSize: 16,
		color: COLORS.inputBg,
		marginBottom: 10,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderLeftWidth: 4,
		borderLeftColor: COLORS.inputBg,
		width: '48%',
	},
	optionText: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: COLORS.inputBg,
		marginLeft: 8,
	},
	radioGroup: {
		marginTop: 8,
		marginBottom: 12,
	},
	radioRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	radioOuter: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},
	radioOuterActive: {
		borderColor: COLORS.inputBg,
		backgroundColor: '#E7EFE7',
	},
	radioInner: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: COLORS.inputBg,
	},
	radioLabel: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: COLORS.inputBg,
	},
	filePreview: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 8,
		marginBottom: 12,
	},
	fileName: {
		flex: 1,
		fontFamily: 'Outfit',
		fontSize: 12,
		color: COLORS.link,
		marginLeft: 8,
	},
	confirmButton: {
		marginTop: 8,
		backgroundColor: COLORS.inputBg,
		borderRadius: 12,
		paddingVertical: 14,
		alignItems: 'center',
	},
	confirmText: {
		fontFamily: 'Outfit',
		fontSize: 15,
		color: COLORS.buttonText,
	},
});


