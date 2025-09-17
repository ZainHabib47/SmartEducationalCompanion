import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Dimensions, Easing, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

export default function LoginScreen() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmationAnim] = useState(new Animated.Value(-100));

  const roleOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Admin', value: 'admin' },
  ];

  const handleConfirm = () => {
    setShowModal(false);
    Animated.timing(confirmationAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.notificationWrap}>
        <Text style={styles.notificationText}>Input all fields to make the login button visible</Text>
      </View>
      <View style={styles.topSection}>
        <Text style={styles.heading}>Smart Educational Companion</Text>
      </View>
      <View style={styles.formSection}>
        <TouchableOpacity
          style={[styles.inputWrapper, dropdownOpen ? styles.inputWrapperFocused : null, role ? styles.selectedRole : null]}
          activeOpacity={0.8}
          onPress={() => setDropdownOpen(!dropdownOpen)}
        >
          <Text style={[styles.roleText, role ? styles.selectedRoleText : null]}>
            {role ? roleOptions.find(r => r.value === role)?.label : 'Select Your Role'}
          </Text>
          <View style={styles.dropdownIconCircle}>
            <Ionicons name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={28} color={COLORS.arrow} style={styles.arrowButton}/>
          </View>
        </TouchableOpacity>
        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {roleOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.dropdownItem}
                onPress={() => {
                  setRole(option.value);
                  setDropdownOpen(false);
                  if (option.value === 'student') {
                    setShowModal(true);
                  }
                }}
              >
                <Text style={styles.dropdownItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {!dropdownOpen && (
          <>
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
            <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Enter your Password"
                placeholderTextColor={COLORS.inputText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={COLORS.inputText}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.forgotWrapper}>
              <TouchableOpacity
                onPress={() => {
                  if (role === 'student') {
                    router.push("ForgotPassword");
                  }
                }}
              >
                <Text style={styles.forgot}>Forget Password ?</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {!dropdownOpen && role && email && password && (
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginText}>LOG-IN</Text>
            <View style={styles.loginIconCircle}>
              <Ionicons name="arrow-forward" size={22} color={COLORS.arrow} />
            </View>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Forgot Password? Don't Worry</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter Your Email"
            placeholderTextColor={COLORS.inputText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={handleConfirm}
          >
            <Text style={styles.modalButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Animated.View style={[styles.confirmationMessage, { top: confirmationAnim }]}> 
        <Text style={styles.confirmationText}>Admin is informed successfully.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginTop: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eyeIcon: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowButton: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center"
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  dropdownItemText: {
    fontFamily: 'Outfit',
    fontSize: Math.max(16, width * 0.045),
    color: COLORS.inputBg,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  roleText: {
    fontFamily: 'Outfit',
    fontSize: Math.max(16, width * 0.045),
    color: COLORS.inputText,
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
  },
  selectedRole: {
    backgroundColor: COLORS.inputBg,
  },
  selectedRoleText: {
    color: COLORS.link,
    fontWeight: 'bold',
  },
  inputWrapperFocused: {
    borderWidth: 2,
    borderColor: COLORS.arrow,
    borderRadius: 18,
  },
  dropdownIconCircle: {
    position: 'absolute',
    right: "2%",
    top: "20%",
    bottom: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: "1.5%",
    paddingRight: "-11%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
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
  heading: {
    fontFamily: 'Griffter',
    fontWeight: 'bold',
    fontSize: Math.max(28, Math.min(width * 0.08, height * 0.08)),
    color: COLORS.heading,
    textAlign: 'center',
    width: '90%',
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
    maxWidth: 400,
    marginBottom: Math.max(height * 0.025, 12),
    paddingHorizontal: 12,
    position: 'relative',
    height: Math.max(48, height * 0.07),
    alignSelf: 'center',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    bottom: 5,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
  },
  notificationWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: Math.max(height * 0.02, 10),
    marginBottom: Math.max(height * 0.01, 6),
  },
  notificationText: {
    color: COLORS.heading,
    fontFamily: 'Outfit',
    fontSize: Math.max(14, width * 0.04),
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
    height: Math.max(48, height * 0.07),
    color: COLORS.inputText,
    fontFamily: 'Outfit',
    fontSize: Math.max(16, width * 0.045),
        alignSelf: 'center',
        textAlign: 'center',
  },
  forgotWrapper: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: Math.max(height * 0.04, 18),
  },
  forgot: {
    fontFamily: 'Outfit',
    fontSize: Math.max(14, width * 0.04),
    color: COLORS.link,
    fontWeight: '500',
    textDecorationLine: 'underline',
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
  loginButton: {
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
  loginText: {
    fontFamily: 'Outfit',
    fontWeight: 'bold',
    fontSize: Math.max(18, width * 0.05),
    color: COLORS.buttonText,
    marginRight: 12,
  },
  loginIconCircle: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  modalHeading: {
    fontFamily: 'Griffter',
    fontWeight: 'bold',
    fontSize: 22,
    color: COLORS.buttonText,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 18,
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 16,
    height: 48,
    color: COLORS.inputText,
    fontFamily: 'Outfit',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '80%',
    maxWidth: 350,
    alignSelf: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Outfit',
    fontWeight: 'bold',
    fontSize: 18,
    color: COLORS.buttonText,
  },
  confirmationMessage: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  confirmationText: {
    fontFamily: 'Outfit',
    fontSize: Math.max(16, width * 0.045),
    color: COLORS.buttonText,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.link,
    borderRadius: 18,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});