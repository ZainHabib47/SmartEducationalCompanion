import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import BottomNav from '../../components/BottomNav';
import CustomHeader from '../../components/CustomHeader';

const COLORS = {
    bg: '#F5F5F5',
    heading: '#03045e',
    inputBg: '#03045e',
    inputText: '#FFFFFF',
    buttonBg: '#03045e',
    buttonText: '#FFFFFF',
    link: '#023e8a',
    success: '#4CAF50',
    danger: '#F44336',
};

const { height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = height * 0.16;

const sampleTopics = {
    Physics: ['Kinematics', 'Dynamics', 'Work & Energy', 'Waves'],
    Chemistry: ['Atomic Structure', 'Periodic Table', 'Chemical Bonds', 'Thermodynamics'],
    Maths: ['Limits', 'Derivatives', 'Integrals', 'Matrices'],
};

function TimerDonut({ totalSeconds = 600, running, onComplete }) {
    const size = 160;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (running) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setSecondsLeft((s) => {
                    if (s <= 1) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        onComplete && onComplete();
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running, onComplete]);

    const progress = secondsLeft / totalSeconds;
    const dashoffset = circumference * (1 - progress);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <View style={styles.timerContainer}>
            <Svg width={size} height={size}>
                <Circle cx={size/2} cy={size/2} r={radius} stroke="#E6E6E6" strokeWidth={strokeWidth} fill="transparent" />
                <Circle
                    cx={size/2}
                    cy={size/2}
                    r={radius}
                    stroke={progress > 0.33 ? COLORS.success : COLORS.danger}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size/2} ${size/2})`}
                />
            </Svg>
            <View style={styles.timerCenter}>
                <Text style={styles.timerLabel}>Time Left</Text>
                <Text style={styles.timerText}>{`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}</Text>
            </View>
        </View>
    );
}

export default function StudentQuizScreen() {
    const router = useRouter();
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [difficulty, setDifficulty] = useState('easy');
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizModalVisible, setQuizModalVisible] = useState(false);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [remarks, setRemarks] = useState('');

    const canGenerate = selectedSubject && selectedTopic && difficulty && !isGenerating;

    const mockGenerateQuiz = async () => {
        // Replace with backend call to LLM service
        setIsGenerating(true);
        await new Promise((r) => setTimeout(r, 800));
        const sampleQs = Array.from({ length: 10 }).map((_, i) => ({
            id: i + 1,
            q: `${selectedSubject} - ${selectedTopic} Q${i + 1}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: i % 4,
        }));
        setQuestions(sampleQs);
        setAnswers({});
        setIsGenerating(false);
        setQuizModalVisible(true);
    };

    const submitQuiz = () => {
        const s = questions.reduce((acc, q) => acc + ((answers[q.id] ?? -1) === q.correctIndex ? 1 : 0), 0);
        setScore(s);
        setRemarks(s >= 8 ? 'Excellent' : s >= 5 ? 'Good' : 'Needs Improvement');
        setQuizModalVisible(false);
        setResultModalVisible(true);
        // TODO: send result to backend
    };

    const onTimeUp = () => {
        submitQuiz();
    };

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.inputBg} />

            <CustomHeader title="Quiz" />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Subjects and topics */}
                {Object.entries(sampleTopics).map(([subject, topics]) => {
                    const isSelectedSubject = selectedSubject === subject;
                    return (
                        <View key={subject} style={styles.subjectCard}>
                            <View style={styles.subjectHeader}> 
                                <Text style={styles.subjectTitle}>{subject}</Text>
                            </View>
                            <View style={styles.topicsWrap}>
                                {topics.map((topic) => {
                                    const active = isSelectedSubject && selectedTopic === topic;
                                    const disabled = !active && selectedSubject && !isSelectedSubject;
                                    return (
                                        <TouchableOpacity
                                            key={topic}
                                            style={[styles.topicPill, active && styles.topicPillActive, disabled && styles.topicPillDisabled]}
                                            activeOpacity={0.8}
                                            disabled={disabled}
                                            onPress={() => {
                                                if (active) {
                                                    setSelectedSubject(null);
                                                    setSelectedTopic(null);
                                                } else {
                                                    setSelectedSubject(subject);
                                                    setSelectedTopic(topic);
                                                }
                                            }}
                                        >
                                            <Text style={[styles.topicPillText, active && styles.topicPillTextActive, disabled && styles.topicPillTextDisabled]}>
                                                {topic}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    );
                })}

                {/* Difficulty selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Difficulty</Text>
                    <View style={styles.diffRow}>
                        {['easy','medium','hard'].map((lvl) => (
                            <TouchableOpacity
                                key={lvl}
                                style={[styles.diffPill, difficulty === lvl && styles.diffPillActive]}
                                onPress={() => setDifficulty(lvl)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.diffText, difficulty === lvl && styles.diffTextActive]}>
                                    {lvl[0].toUpperCase() + lvl.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Generate quiz */}
                <TouchableOpacity
                    style={[styles.generateBtn, !canGenerate && styles.generateBtnDisabled]}
                    onPress={mockGenerateQuiz}
                    disabled={!canGenerate}
                    activeOpacity={0.85}
                >
                    <Ionicons name="flash" size={20} color={canGenerate ? COLORS.buttonText : '#999'} />
                    <Text style={[styles.generateBtnText, !canGenerate && styles.generateBtnTextDisabled]}>Generate Quiz</Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />
            </ScrollView>

            <BottomNav
                onPressHome={() => handleBottomPress('home')}
                onPressNotifications={() => handleBottomPress('bell')}
                onPressChatbot={() => handleBottomPress('chat')}
                onPressSettings={() => handleBottomPress('settings')}
            />

            {/* Quiz modal */}
            <Modal visible={quizModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedSubject} • {selectedTopic} • {difficulty.toUpperCase()}</Text>
                            <Pressable onPress={() => setQuizModalVisible(false)}>
                                <Ionicons name="close" size={22} color={COLORS.inputBg} />
                            </Pressable>
                        </View>
                        <View style={styles.modalTimerRow}>
                            <TimerDonut totalSeconds={600} running={quizModalVisible} onComplete={onTimeUp} />
                        </View>
                        <ScrollView style={styles.modalBody} contentContainerStyle={{ paddingBottom: 12 }}>
                            {questions.map((q) => (
                                <View key={q.id} style={styles.questionBlock}>
                                    <Text style={styles.questionText}>{q.id}. {q.q}</Text>
                                    {q.options.map((opt, idx) => {
                                        const selected = answers[q.id] === idx;
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                style={[styles.optionRow, selected && styles.optionRowSelected]}
                                                activeOpacity={0.8}
                                                onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                                            >
                                                <View style={[styles.optionDot, selected && styles.optionDotSelected]} />
                                                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.uploadBtn} onPress={submitQuiz} activeOpacity={0.85}>
                            <Ionicons name="cloud-upload" size={20} color={COLORS.buttonText} />
                            <Text style={styles.uploadBtnText}>Upload Quiz</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Result modal */}
            <Modal visible={resultModalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Result</Text>
                        <Text style={styles.resultScore}>{score}/10</Text>
                        <Text style={styles.resultRemarks}>{remarks}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setResultModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    content: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 20 + BOTTOM_NAV_HEIGHT,
    },
    subjectCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 16,
    },
    subjectHeader: {
        backgroundColor: COLORS.link,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    subjectTitle: {
        fontFamily: 'Griffter',
        fontSize: 20,
        color: '#FFFFFF',
    },
    topicsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        padding: 12,
    },
    topicPill: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.inputBg,
        backgroundColor: '#fff',
    },
    topicPillActive: {
        backgroundColor: COLORS.inputBg,
    },
    topicPillDisabled: {
        opacity: 0.35,
    },
    topicPillText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.inputBg,
    },
    topicPillTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    topicPillTextDisabled: {
        color: COLORS.inputBg,
    },
    section: {
        marginTop: 6,
        marginBottom: 10,
    },
    sectionTitle: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.heading,
        marginBottom: 8,
    },
    diffRow: {
        flexDirection: 'row',
        gap: 10,
    },
    diffPill: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.inputBg,
        backgroundColor: '#fff',
    },
    diffPillActive: {
        backgroundColor: COLORS.inputBg,
    },
    diffText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.inputBg,
    },
    diffTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    generateBtn: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    generateBtnDisabled: {
        backgroundColor: '#E0E0E0',
    },
    generateBtnText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        marginLeft: 8,
    },
    generateBtnTextDisabled: {
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    modalCard: {
        width: '100%',
        maxHeight: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e6e6e6',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontFamily: 'Griffter',
        fontSize: 18,
        color: COLORS.inputBg,
    },
    modalTimerRow: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    modalBody: {
        paddingHorizontal: 14,
    },
    questionBlock: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    questionText: {
        fontFamily: 'Outfit',
        fontSize: 15,
        color: COLORS.heading,
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    optionRowSelected: {
        backgroundColor: '#F1F5F9',
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    optionDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.inputBg,
        marginRight: 8,
    },
    optionDotSelected: {
        backgroundColor: COLORS.inputBg,
    },
    optionText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
    },
    optionTextSelected: {
        fontWeight: '600',
    },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 12,
        margin: 14,
        borderRadius: 12,
        gap: 8,
    },
    uploadBtnText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.buttonText,
        marginLeft: 8,
    },
    resultCard: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e6e6e6',
    },
    resultTitle: {
        fontFamily: 'Griffter',
        fontSize: 22,
        color: COLORS.inputBg,
        marginBottom: 10,
    },
    resultScore: {
        fontFamily: 'Griffter',
        fontSize: 28,
        color: COLORS.heading,
        marginBottom: 6,
    },
    resultRemarks: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: COLORS.link,
        marginBottom: 16,
    },
    closeBtn: {
        backgroundColor: COLORS.inputBg,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 10,
    },
    closeBtnText: {
        fontFamily: 'Outfit',
        fontSize: 16,
        color: '#fff',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerCenter: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerLabel: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
    },
    timerText: {
        fontFamily: 'Griffter',
        fontSize: 24,
        color: COLORS.inputBg,
    },
});