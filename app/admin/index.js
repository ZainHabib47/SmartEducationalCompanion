import { useRouter } from 'expo-router';
import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminDashboard() {
    const router = useRouter();
    // Sample news data - replace with API call later
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
            title: "Remote Learning Best Practices for Teachers",
            url: "https://example.com/remote-learning-practices",
            source: "Teacher's Guide",
            publishedAt: "1 day ago"
        }
    ];

    const handlePressCard = (key) => {
        if (key === 'students') {
            router.push('/admin/students');
        } else if (key === 'attendance') {
            router.push('/admin/attendance');
        } else if (key === 'timetable') {
            router.push('/admin/timetable');
        } else if (key === 'schedules') {
            router.push('/admin/schedule');
        }
    };

    const handleBottomPress = (key) => {
        if (key === 'home') {
            router.push('/admin');
        } else if (key === 'bell') {
            router.push('/admin/notification');
        } else if (key === 'calendar') {
            // Placeholder for chatbot route
        } else if (key === 'settings') {
            // Placeholder for settings route
        }
    };

    return (
        <DashboardLayout
            headerWelcome="Welcome Back!"
            name="Zain Habib"
            email="admin@example.com"
            extraTopInfo="Total Students: 256"
            showNews
            newsTitle="Educational News"
            newsData={sampleNewsData}
            onPressCard={handlePressCard}
            gridItems={[
                { key: 'students', icon: 'people', label: 'Students' },
                { key: 'attendance', icon: 'checkbox-outline', label: 'Attendance' },
                { key: 'timetable', icon: 'calendar', label: 'Timetable' },
                { key: 'schedules', icon: 'time', label: 'Schedules' },
            ]}
            bottomIcons={[
                { key: 'home', icon: 'home', onPress: () => handleBottomPress('home') },
                { key: 'bell', icon: 'notifications', onPress: () => handleBottomPress('bell') },
                { key: 'calendar', icon: 'chatbubbles', onPress: () => handleBottomPress('calendar') },
                { key: 'settings', icon: 'settings', onPress: () => handleBottomPress('settings') },
            ]}
        />
    );
}

// styles removed in favor of reusable DashboardLayout
