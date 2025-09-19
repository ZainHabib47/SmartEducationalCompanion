import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function AdminDashboard() {
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

    return (
        <DashboardLayout
            headerWelcome="Welcome Back!"
            name="Zain Habib"
            email="admin@example.com"
            extraTopInfo="Total Students: 256"
            showNews
            newsTitle="Educational News"
            newsData={sampleNewsData}
            gridItems={[
                { key: 'students', icon: 'people', label: 'Students' },
                { key: 'attendance', icon: 'checkbox-outline', label: 'Attendance' },
                { key: 'timetable', icon: 'calendar', label: 'Timetable' },
                { key: 'schedules', icon: 'time', label: 'Schedules' },
            ]}
            bottomIcons={[
                { key: 'home', icon: 'home' },
                { key: 'bell', icon: 'notifications' },
                { key: 'calendar', icon: 'calendar' },
                { key: 'settings', icon: 'settings' },
            ]}
        />
    );
}

// styles removed in favor of reusable DashboardLayout
