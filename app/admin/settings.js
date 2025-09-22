import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomNav from '../../components/BottomNav';

export default function SettingsPlaceholder() {
    const router = useRouter();

    const go = (key) => {
        if (key === 'home') router.push('/admin');
        if (key === 'bell') router.push('/admin/notification');
        if (key === 'chatbot') router.push('/admin/chatbot');
        if (key === 'settings') router.push('/admin/settings');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}><Text>Settings screen placeholder</Text></View>
            <BottomNav
                onPressHome={() => go('home')}
                onPressNotifications={() => go('bell')}
                onPressChatbot={() => go('chatbot')}
                onPressSettings={() => go('settings')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


