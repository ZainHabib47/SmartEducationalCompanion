import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

export default function StudentDashboard() {
    return (
        <DashboardLayout
            headerWelcome="Welcome Back!"
            name="Jane Student"
            email="student@example.com"
            showGraph={false}
            gridItems={[
                { key: 'courses', icon: 'book', label: 'Courses' },
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
