import { useRouter } from 'expo-router';
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentDashboard() {
    const router = useRouter();

    // Sample educational news data
    const sampleNewsData = [
        {
            id: 1,
            title: "New AI Tools Transforming Education in 2024",
            url: "https://example.com/ai-education-2024",
            source: "EduTech News",
            publishedAt: "2 hours ago"
        },
        {
            id: 2,
            title: "Digital Learning Platforms See 300% Growth",
            url: "https://example.com/digital-learning-growth",
            source: "Education Weekly",
            publishedAt: "5 hours ago"
        },
        {
            id: 3,
            title: "Remote Learning Best Practices for Students",
            url: "https://example.com/remote-learning-practices",
            source: "Student's Guide",
            publishedAt: "1 day ago"
        },
        {
            id: 4,
            title: "Interactive Learning Methods Boost Engagement",
            url: "https://example.com/interactive-learning",
            source: "Learning Today",
            publishedAt: "2 days ago"
        }
    ];

    const handleCardPress = (key) => {
        switch (key) {
            case 'timetable':
                router.push('/student/timetable');
                break;
            case 'curriculum':
                router.push('/student/curriculum');
                break;
            case 'attendance':
                router.push('/student/attendance');
                break;
            case 'quiz':
                router.push('/student/quiz');
                break;
            default:
                console.log(`Pressed ${key}`);
        }
    };

    const handleBottomPress = (key) => {
        switch (key) {
            case 'home':
                router.push('/student');
                break;
            case 'bell':
                router.push('/student/notifications');
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
        <DashboardLayout
            headerWelcome="Welcome Back!"
            name="Jane Student"
            email="student@example.com"
            showNews={true}
            newsTitle="Educational News"
            newsData={sampleNewsData}
            onPressCard={handleCardPress}
            gridItems={[
                { key: 'timetable', icon: 'calendar', label: 'Timetable' },
                { key: 'curriculum', icon: 'book', label: 'Curriculum' },
                { key: 'attendance', icon: 'checkbox-outline', label: 'Attendance' },
                { key: 'quiz', icon: 'help-circle', label: 'Quiz' },
            ]}
            bottomIcons={[
                { key: 'home', icon: 'home', onPress: () => handleBottomPress('home') },
                { key: 'bell', icon: 'notifications', onPress: () => handleBottomPress('bell') },
                { key: 'chat', icon: 'chatbubbles', onPress: () => handleBottomPress('chat') },
                { key: 'settings', icon: 'settings', onPress: () => handleBottomPress('settings') },
            ]}
            footerButton={{ icon: 'trophy', label: 'Achemivment', onPress: () => router.push('/student/achievements') }}
        />
    );
}
