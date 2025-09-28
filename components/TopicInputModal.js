import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    arrow: '#03045e',
    link: '#023e8a',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    success: '#4CAF50',
    danger: '#F44336',
};

export default function TopicInputModal({
    visible,
    onClose,
    onSave,
}) {
    const [physicsTopic, setPhysicsTopic] = useState('');
    const [mathsTopic, setMathsTopic] = useState('');
    const [chemistryTopic, setChemistryTopic] = useState('');

    const handleSave = () => {
        onSave({ physicsTopic, mathsTopic, chemistryTopic });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Enter Today's Topics</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Physics Topic"
                        placeholderTextColor="#ccc"
                        value={physicsTopic}
                        onChangeText={setPhysicsTopic}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Maths Topic"
                        placeholderTextColor="#ccc"
                        value={mathsTopic}
                        onChangeText={setMathsTopic}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Chemistry Topic"
                        placeholderTextColor="#ccc"
                        value={chemistryTopic}
                        onChangeText={setChemistryTopic}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save Topics</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: width * 0.9,
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontFamily: 'Griffter',
        fontSize: 22,
        color: COLORS.heading,
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 16,
        color: COLORS.inputText,
        marginBottom: 15,
        fontFamily: 'Outfit',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 12,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 12,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        fontWeight: '600',
    },
});