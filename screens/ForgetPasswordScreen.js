import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useFonts } from 'expo-font';
import { Animated, Dimensions, Easing, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Heading from '../components/heading';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#F5F5F5', // light gray
  heading: '#1A2F23', // dark greenish-black
  inputBg: '#2E4D3A', // dark green
  inputText: '#FFFFFF',
  arrow: '#7A9B77', // light green
  link: '#7A9B77', // soft green
  buttonBg: '#2E4D3A',
  buttonText: '#FFFFFF',
};

SplashScreen.preventAutoHideAsync();

export default function ForgotPasswordScreen() {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [confirmationAnim] = useState(new Animated.Value(-100));
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    if (email.trim()) {
      setShowConfirmation(true);
      Animated.timing(confirmationAnim, {
        toValue: 50,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start(() => {
        // Hide the notification after 3 seconds
        setTimeout(() => {
          Animated.timing(confirmationAnim, {
            toValue: -100,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }).start(() => {
            setShowConfirmation(false);
          });
        }, 3000);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Heading />
      </View>
      
      <View style={styles.formSection}>
        <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Email"
            placeholderTextColor={COLORS.inputText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput('')}
          />
        </View>
      </View>

      {email && (
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>Confirm</Text>
            <View style={styles.confirmIconCircle}>
              <Ionicons name="arrow-forward" size={22} color={COLORS.arrow} />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {showConfirmation && (
        <Animated.View style={[styles.confirmationMessage, { top: confirmationAnim }]}>
          <Text style={styles.confirmationText}>Admin is notified successfully</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Math.max(width * 0.07, 16),
    width: '100%',
    height: '100%',
    minHeight: height,
    minWidth: width,
  },
  topSection: {
    marginTop: Math.max(height * 0.08, 32),
    marginBottom: Math.max(height * 0.04, 18),
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  formSection: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    marginBottom: Math.max(height * 0.04, 18),
    alignSelf: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 18,
    width: '100%',
    maxWidth: 900,
    marginBottom: Math.max(height * 0.025, 12),
    paddingHorizontal: 12,
    position: 'relative',
    height: Math.max(48, height * 0.07),
    alignSelf: 'center',
  },
  inputWrapperFocused: {
    borderWidth: 2,
    borderColor: COLORS.arrow,
    borderRadius: 18,
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 16,
    height: Math.max(48, height * 0.07),
    color: COLORS.inputText,
    fontFamily: 'Outfit',
    fontSize: Math.max(16, width * 0.045),
    alignSelf: 'center',
    textAlign: 'center',
  },
  bottomSection: {
    textAlign: 'center',
    maxWidth: 500,
    alignItems: 'center',
    position: 'relative',
    bottom: Math.max(height * 0.06, 24),
    paddingTop: "15%",
    left: 0,
    alignSelf: 'center',
    width: 350
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.buttonBg,
    borderRadius: 24,
    paddingVertical: Math.max(height * 0.018, 10),
    paddingHorizontal: Math.max(width * 0.12, 32),
    width: '80%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  confirmText: {
    fontFamily: 'Outfit-Bold',  // Use bold variant
    // Remove fontWeight property
  },
  confirmationText: {
    fontFamily: 'Outfit-Bold',
    // Remove fontWeight property
  },
    fontSize: Math.max(16, width * 0.045),
    color: COLORS.buttonText,
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#4CAF50', // Green background
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
);
