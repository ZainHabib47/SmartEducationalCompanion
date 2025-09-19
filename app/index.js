import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import LoginScreen from '../screens/LoginScreen';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Griffter': require('../assets/fonts/grifterbold.otf'),
    'Outfit': require('../assets/fonts/Outfit-Regular.ttf'),
  });

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
    };
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <LoginScreen />
    </View>
  );
}