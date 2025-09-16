
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/splashScreen';

export default function AppLayout() {
  const [fontsLoaded] = useFonts({
    Griffter: require('../assets/fonts/grifterbold.otf'),
    Outfit: require('../assets/fonts/Outfit-Regular.ttf'),
  });
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7A9B77" />
      </View>
    );
  }

  return showSplash ? <SplashScreen /> : <LoginScreen />;
}
