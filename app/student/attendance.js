import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
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
};

const { height } = Dimensions.get('window');
const BOTTOM_NAV_HEIGHT = height * 0.16;

// Sample attendance summary and history data
const attendanceSummary = { present: 18, absent: 2 };
const attendanceHistory = [
    { date: '2025-09-25', status: 'Present', physics: 'Kinematics', chemistry: 'Atomic Structure', maths: 'Derivatives' },
    { date: '2025-09-24', status: 'Absent', physics: 'Dynamics', chemistry: 'Periodic Table', maths: 'Integrals' },
    { date: '2025-09-23', status: 'Present', physics: 'Work & Energy', chemistry: 'Bonds', maths: 'Limits' },
    { date: '2025-09-22', status: 'Present', physics: 'Momentum', chemistry: 'Thermo', maths: 'Series' },
    { date: '2025-09-21', status: 'Present', physics: 'Waves', chemistry: 'Solutions', maths: 'Matrices' },
];

function AttendanceDonut({ present, absent, size = 200, strokeWidth = 22 }) {
    const total = Math.max(present + absent, 1);
    const presentPct = present / total;
    const absentPct = absent / total;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const presentLength = circumference * presentPct;
    const absentLength = circumference * absentPct;

    // 90% indicator position
    const indicatorPct = 0.9;
    const theta = -Math.PI / 2 + indicatorPct * 2 * Math.PI; // start at top, clockwise
    const indicatorR = radius;
    const indicatorX = size / 2 + indicatorR * Math.cos(theta);
    const indicatorY = size / 2 + indicatorR * Math.sin(theta);

    return (
        <View style={styles.chartContainer}>
            <View>
                <Svg width={size} height={size}>
                    {/* Background ring */}
                    <Circle cx={size/2} cy={size/2} r={radius} stroke="#E6E6E6" strokeWidth={strokeWidth} fill="transparent" />
                    {/* Present arc */}
                    <Circle
                        cx={size/2}
                        cy={size/2}
                        r={radius}
                        stroke="#4CAF50"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${presentLength} ${circumference}`}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size/2} ${size/2})`}
                    />
                    {/* Absent arc (starts after present) */}
                    <Circle
                        cx={size/2}
                        cy={size/2}
                        r={radius}
                        stroke="#F44336"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={`${absentLength} ${circumference}`}
                        strokeDashoffset={-presentLength}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size/2} ${size/2})`}
                    />
                    {/* 90% marker */}
                    <Circle cx={indicatorX} cy={indicatorY} r={5} fill="#FFC107" stroke="#FFFFFF" strokeWidth={2} />
                </Svg>
                <View style={styles.chartCenter}>
                    <Text style={styles.chartCenterTitle}>Attendance</Text>
                    <Text style={styles.chartCenterText}>{(presentPct * 100).toFixed(1)}%</Text>
                </View>
            </View>
            {/* Indicators with arrows */}
            <View style={styles.chartIndicators}>
                <View style={styles.indicatorRow}>
                    <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
                    <Text style={styles.indicatorText}>Present</Text>
                </View>
                <View style={styles.indicatorRow}>
                    <Ionicons name="arrow-forward" size={16} color="#F44336" />
                    <Text style={styles.indicatorText}>Absent</Text>
                </View>
            </View>
        </View>
    );
}

export default function StudentAttendanceScreen() {
    const router = useRouter();

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
            <CustomHeader title="Attendance" />

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Donut Chart */}
                <AttendanceDonut present={attendanceSummary.present} absent={attendanceSummary.absent} />

                {/* History Box */}
                <View style={styles.historyBox}>
                    <View style={styles.historyHeader}>
                        <Text style={styles.historyHeaderText}>History</Text>
                    </View>
                    <View style={styles.historyBody}>
                        {/* Make table horizontally scrollable for readability */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ minWidth: 700 }}>
                                {/* Table header */}
                                <View style={styles.tableHeaderRow}>
                                    <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>Date</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 1.1 }]}>Status</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Physics</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Chemistry</Text>
                                    <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Maths</Text>
                                </View>
                                {/* Rows */}
                                <ScrollView showsVerticalScrollIndicator={true}>
                                    {attendanceHistory.map((item, idx) => (
                                        <View key={idx} style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}>
                                            <Text style={[styles.tableCell, { flex: 1.4 }]}>{item.date}</Text>
                                            <Text style={[styles.tableCell, { flex: 1.1, color: item.status === 'Present' ? '#2E7D32' : '#C62828', fontWeight: '700' }]}>{item.status}</Text>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.physics}</Text>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.chemistry}</Text>
                                            <Text style={[styles.tableCell, { flex: 2 }]}>{item.maths}</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>

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
    content: {
        flex: 1,
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 20 + BOTTOM_NAV_HEIGHT,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    chartCenter: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartCenterTitle: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
    },
    chartCenterText: {
        fontFamily: 'Griffter',
        fontSize: 28,
        color: COLORS.inputBg,
    },
    chartCenterSub: {
        fontFamily: 'Outfit',
        fontSize: 12,
        color: COLORS.link,
    },
    chartIndicators: {
        marginTop: 12,
        flexDirection: 'row',
        gap: 16,
    },
    indicatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    indicatorText: {
        fontFamily: 'Outfit',
        fontSize: 14,
        color: COLORS.heading,
    },
    historyBox: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#e6e6e6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    historyHeader: {
        height: 56,
        backgroundColor: COLORS.link,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyHeaderText: {
        fontFamily: 'Griffter',
        fontSize: 20,
        color: '#FFFFFF',
    },
    historyBody: {
        maxHeight: 320,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
        marginBottom: 10,
    },
    tableHeaderCell: {
        fontFamily: 'Outfit',
        fontSize: 13,
        color: COLORS.heading,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    tableRowAlt: {
        backgroundColor: '#FAFAFA',
    },
    tableCell: {
        fontFamily: 'Outfit',
        fontSize: 13,
        color: COLORS.heading,
    },
});