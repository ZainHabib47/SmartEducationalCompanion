import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import SplashScreenComponent from '../screens/splashScreen';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Griffter: require('../assets/fonts/grifterbold.otf'),
    Outfit: require('../assets/fonts/Outfit-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000); // Ensure splash screen hides after 5 seconds

    if (!fontsLoaded) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
      setShowSplash(false); // Ensure splash screen hides when fonts are loaded
    }

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [fontsLoaded]);

  if (!fontsLoaded || showSplash) {
    return <SplashScreenComponent />; // Show splash screen while loading or during the 5-second delay
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}