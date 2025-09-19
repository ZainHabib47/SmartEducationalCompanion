import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [confirmationAnim] = useState(new Animated.Value(-100));
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState('');

  // Role options for dropdown
  const roleOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Admin', value: 'admin' },
  ];

  // Admin flow state: email -> otp -> reset
  const [adminStep, setAdminStep] = useState(null); // null | 'email' | 'otp' | 'reset'
  const [adminEmail, setAdminEmail] = useState('');
  const [adminOtp, setAdminOtp] = useState(['', '', '', '', '']);
  const [resendTimeout, setResendTimeout] = useState(60);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const otpRefs = useRef(Array(5).fill(null).map(() => React.createRef()));

  const handleForgetPassword = () => {
    if (role === 'student') {
      setShowForgotPassword(true);
    } else if (role === 'admin') {
      setAdminStep('email');
    }
  };

  const showConfirmationBanner = (text) => {
    setBannerText(text);
    setShowBanner(true);
    Animated.timing(confirmationAnim, {
      toValue: 50,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(confirmationAnim, {
          toValue: -100,
          duration: 500,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }).start(() => setShowBanner(false));
      }, 3000);
    });
  };

  // Admin OTP handling
  const handleAdminOtpChange = (text, index) => {
    const sanitized = text.replace(/\D/g, '');
    const next = [...adminOtp];
    next[index] = sanitized.slice(-1);
    setAdminOtp(next);
    if (sanitized && index < 4) {
      const nextRef = otpRefs.current[index + 1]?.current;
      nextRef && nextRef.focus();
    }
  };

  // Resend timer
  useEffect(() => {
    if (adminStep === 'otp' && resendTimeout > 0) {
      const timer = setTimeout(() => setResendTimeout((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [adminStep, resendTimeout]);

  // Add to existing render return
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
                onPress={handleForgetPassword}
              >
                <Text style={styles.forgot}>Forget Password ?</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {!dropdownOpen && role && email && password && (
        <View style={styles.bottomSection}>
          <View style={styles.loginButton}>
            <Text style={styles.loginText}>LOG-IN</Text>
            <TouchableOpacity
              onPress={() => {
                if (role === 'admin') {
                  router.push('/admin');
                } else if (role === 'student') {
                  router.push('/student');
                }
              }}
              activeOpacity={0.8}
              style={styles.loginIconCircle}
            >
              <Ionicons name="arrow-forward" size={22} color={COLORS.arrow} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Student forgot password modal (email only, then banner) */}
      {showForgotPassword && (
        <Modal visible={showForgotPassword} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeading}>Forgot Password? Don't Worry</Text>
            <View style={styles.modalInputWrapper}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter Your Email"
                placeholderTextColor={COLORS.inputText}
                value={forgotPasswordEmail}
                onChangeText={setForgotPasswordEmail}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowForgotPassword(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, !forgotPasswordEmail && { opacity: 0.5 }]}
                disabled={!forgotPasswordEmail}
                onPress={() => {
                  setShowForgotPassword(false);
                  showConfirmationBanner('Admin is informed successfully.');
                }}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Admin forgot password flow: Email -> OTP -> Reset Password */}
      {adminStep && (
        <Modal visible transparent animationType="slide">
          <View style={styles.modalContainer}>
            {adminStep === 'email' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.modalHeading}>Forgot Password (Admin)</Text>
                <View style={styles.modalInputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter Your Email"
                    placeholderTextColor={COLORS.inputText}
                    value={adminEmail}
                    onChangeText={setAdminEmail}
                    keyboardType="email-address"
                  />
                </View>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setAdminStep(null)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, !adminEmail && { opacity: 0.5 }]}
                    disabled={!adminEmail}
                    onPress={() => {
                      setResendTimeout(60);
                      setAdminOtp(['', '', '', '', '']);
                      setAdminStep('otp');
                    }}
                  >
                    <Text style={styles.modalButtonText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {adminStep === 'otp' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.modalHeading}>Enter 5-digit OTP</Text>
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <TextInput
                      key={i}
                      ref={otpRefs.current[i]}
                      style={styles.otpInput}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={adminOtp[i]}
                      onChangeText={(t) => handleAdminOtpChange(t, i)}
                    />
                  ))}
                </View>
                <TouchableOpacity 
                  style={[styles.resendButton, resendTimeout > 0 && styles.disabledButton]}
                  disabled={resendTimeout > 0}
                  onPress={() => setResendTimeout(60)}
                >
                  <Text style={styles.resendText}>
                    {resendTimeout > 0 ? `Resend OTP in ${resendTimeout}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setAdminStep(null)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, adminOtp.join('').length !== 5 && { opacity: 0.5 }]}
                    disabled={adminOtp.join('').length !== 5}
                    onPress={() => setAdminStep('reset')}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {adminStep === 'reset' && (
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={styles.modalHeading}>Set New Password</Text>
                <View style={styles.modalInputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="New Password"
                    placeholderTextColor={COLORS.inputText}
                    secureTextEntry
                    value={newAdminPassword}
                    onChangeText={setNewAdminPassword}
                  />
                </View>
                <View style={styles.modalInputWrapper}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Confirm New Password"
                    placeholderTextColor={COLORS.inputText}
                    secureTextEntry
                    value={confirmAdminPassword}
                    onChangeText={setConfirmAdminPassword}
                  />
                </View>
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setAdminStep(null)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, (!newAdminPassword || newAdminPassword !== confirmAdminPassword) && { opacity: 0.5 }]}
                    disabled={!newAdminPassword || newAdminPassword !== confirmAdminPassword}
                    onPress={() => {
                      setAdminStep(null);
                      showConfirmationBanner('PASSWORD CHANGED SUCCESSFULLY');
                    }}
                  >
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Modal>
      )}

      {showBanner && (
        <Animated.View style={[styles.confirmationMessage, { top: confirmationAnim }]}> 
          <Text style={styles.confirmationText}>{bannerText}</Text>
        </Animated.View>
      )}
    </View>
  );
}

// Add to LoginScreen styles
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
  // removed button-based role selection; using dropdown above inputs instead
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
    fontSize: 22,
    color: COLORS.buttonText,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputWrapper: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 18,
    width: '90%',
    maxWidth: 400,
    paddingHorizontal: 16,
    height: 48,
    color: COLORS.inputText,
    fontFamily: 'Outfit',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 400,
  },
  modalButton: {
    backgroundColor: COLORS.buttonBg,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flex: 0.45,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  modalButtonText: {
    fontFamily: 'Outfit',
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
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.link,
    borderRadius: 18,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    marginHorizontal: 5,
    textAlign: 'center',
    color: COLORS.inputText,
    fontFamily: 'Outfit',
    fontSize: 20,
  },
  resendButton: {
    marginBottom: 20,
  },
  resendText: {
    fontFamily: 'Outfit',
    color: COLORS.link,
    fontSize: 14,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  }});