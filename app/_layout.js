import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  useEffect(() => {
    // This ensures the splash screen is shown until fonts are loaded
    SplashScreen.preventAutoHideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ForgotPassword" />
    </Stack>
  );
}