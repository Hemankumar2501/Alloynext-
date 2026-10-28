import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useApp } from './context';
import { theme } from './theme';

export const AuthScreen = () => {
  const { login, register, requestPasswordReset, resetPassword, sessionExpiredNotice } = useApp();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  // 'register' | 'login' | 'forgot' | 'reset'
  const [mode, setMode] = useState('register');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Forgot / Reset Password state
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [codeSentMessage, setCodeSentMessage] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setCodeSentMessage('');
  };

  const switchMode = (newMode) => {
    clearMessages();
    setMode(newMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowNewPassword(false);
  };

  const handleSubmit = async () => {
    clearMessages();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!password || password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }

      setLoading(true);
      try {
        await register(cleanEmail, password, fullName.trim());
      } catch (err) {
        setErrorMsg(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (mode === 'login') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setLoading(true);
      try {
        await login(cleanEmail, password);
      } catch (err) {
        setErrorMsg(err.message || 'Invalid email or password.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSendResetCode = async () => {
    clearMessages();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please provide a valid email to receive the verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(cleanEmail);
      setCodeSentMessage(res.message || `Verification code sent to ${cleanEmail}`);
      setMode('reset');
    } catch (err) {
      setErrorMsg(err.message || 'Could not send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordReset = async () => {
    clearMessages();
    if (!resetCode.trim()) {
      setErrorMsg('Please enter the verification code sent to your email.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email.trim(), resetCode.trim(), newPassword);
      setSuccessMsg(res.message || 'Password reset successful! You can now sign in.');
      setPassword(newPassword);
      setMode('login');
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollRoot}>
      <View style={[styles.container, isDesktop && styles.containerDesktop]}>
        
        {/* Left Hero Card (Executive Features Showcase) */}
        {isDesktop && (
          <View style={styles.heroSide}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Text style={styles.brandIconText}>A</Text>
              </View>
              <View>
                <Text style={styles.brandTitle}>AlloyNext</Text>
                <Text style={styles.brandTagline}>EXECUTIVE CAREER & APPLICATION SUITE</Text>
              </View>
            </View>

            <View style={styles.heroPitch}>
              <Text style={styles.heroHeadline}>
                Accelerate your next executive & tech milestone.
              </Text>
              <Text style={styles.heroSubheadline}>
                A private, database-backed career cockpit featuring AI ATS resume tailoring, real-time application tracking, and automated 30-day session security.
              </Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#e1dfff' }]}>
                  <MaterialIcons name="security" size={18} color={theme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>30-Day Persistent Executive Session</Text>
                  <Text style={styles.featureDesc}>
                    Stay securely authenticated for 1 month with Argon2id encrypted credentials and automatic session renewal.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#e5deff' }]}>
                  <MaterialIcons name="storage" size={18} color={theme.colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>Database-Backed Workspace</Text>
                  <Text style={styles.featureDesc}>
                    All registered accounts and job applications are securely committed to your database engine.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#d1f4e7' }]}>
                  <MaterialIcons name="auto-awesome" size={18} color="#168568" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>AI ATS Analysis & Resume Studio</Text>
                  <Text style={styles.featureDesc}>
                    Instant keyword matching, recruiter-ready PDF generator, and interview rehearsal assistant.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.heroFooter}>
              <Text style={styles.heroFooterText}>
                Trusted by engineering leaders & executives worldwide • 100% Free
              </Text>
            </View>
          </View>
        )}

        {/* Right Form Card */}
        <View style={[styles.formSide, !isDesktop && styles.formSideFull]}>
          <View style={styles.card}>
            {/* Header / Brand for Mobile */}
            {!isDesktop && (
              <View style={styles.mobileBrandHeader}>
                <View style={styles.brandIconSm}>
                  <Text style={styles.brandIconTextSm}>A</Text>
                </View>
                <Text style={styles.mobileBrandTitle}>AlloyNext</Text>
                <Text style={styles.mobileBrandSub}>Executive Career Management</Text>
              </View>
            )}

            {/* Inactivity Alert if session expired after 1 month */}
            {sessionExpiredNotice && (
              <View style={styles.warningBanner}>
                <MaterialIcons name="schedule" size={18} color="#b25e00" />
                <Text style={styles.warningBannerText}>{sessionExpiredNotice}</Text>
              </View>
            )}

            {/* Success Message Banner */}
            {successMsg ? (
              <View style={styles.successBanner}>
                <MaterialIcons name="check-circle" size={18} color={theme.colors.success} />
                <Text style={styles.successBannerText}>{successMsg}</Text>
              </View>
            ) : null}

            {/* Error Message Banner */}
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <MaterialIcons name="error-outline" size={18} color={theme.colors.error} />
                <Text style={styles.errorBannerText}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* Code Sent Notice */}
            {codeSentMessage ? (
              <View style={styles.infoBanner}>
                <MaterialIcons name="mark-email-read" size={18} color={theme.colors.primary} />
                <Text style={styles.infoBannerText}>{codeSentMessage}</Text>
              </View>
            ) : null}

            {/* Mode Switcher Tabs (Create Account vs Sign In) */}
            {mode !== 'forgot' && mode !== 'reset' && (
              <View style={styles.tabSwitcher}>
                <TouchableOpacity
                  style={[styles.tabBtn, mode === 'register' && styles.tabBtnActive]}
                  onPress={() => switchMode('register')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name="person-add"
                    size={16}
                    color={mode === 'register' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.tabBtnText, mode === 'register' && styles.tabBtnTextActive]}>
                    Create Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabBtn, mode === 'login' && styles.tabBtnActive]}
                  onPress={() => switchMode('login')}
                  activeOpacity={0.8}
                >
                  <MaterialIcons
                    name="login"
                    size={16}
                    color={mode === 'login' ? theme.colors.primary : theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.tabBtnText, mode === 'login' && styles.tabBtnTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ============================================================= */}
            {/* REGISTER & LOGIN FORMS */}
            {/* ============================================================= */}
            {mode === 'register' || mode === 'login' ? (
              <View style={styles.formBody}>
                <View style={styles.titleSection}>
                  <Text style={styles.formTitle}>
                    {mode === 'register' ? 'Register New Executive Account' : 'Welcome Back to Your Workspace'}
                  </Text>
                  <Text style={styles.formSubtitle}>
                    {mode === 'register'
                      ? 'Create your account to unlock private database storage and AI career tools.'
                      : 'Sign in with your registered email and password to access your pipeline.'}
                  </Text>
                </View>

                {/* Full Name (Sign Up only) */}
                {mode === 'register' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialIcons name="person" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Jordan Lee"
                        placeholderTextColor={theme.colors.outline}
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                      />
                    </View>
                  </View>
                )}

                {/* Email Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email Address *</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="alternate-email" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="candidate@example.com"
                      placeholderTextColor={theme.colors.outline}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                {/* Password with Show / Hide Toggle */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Password *</Text>
                    {mode === 'login' && (
                      <TouchableOpacity onPress={() => switchMode('forgot')}>
                        <Text style={styles.forgotLink}>Forgot password?</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock-outline" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder={mode === 'register' ? 'Min. 8 characters' : 'Enter your password'}
                      placeholderTextColor={theme.colors.outline}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    {/* Show / Hide Toggle Button */}
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowPassword(!showPassword)}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <MaterialIcons
                        name={showPassword ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={showPassword ? theme.colors.primary : theme.colors.outline}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password with Show / Hide Toggle (Sign Up only) */}
                {mode === 'register' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm Password *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialIcons name="lock-outline" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                      <TextInput
                        style={styles.textInput}
                        placeholder="Re-type your password"
                        placeholderTextColor={theme.colors.outline}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      {/* Show / Hide Toggle Button */}
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        accessibilityLabel={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        <MaterialIcons
                          name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                          size={20}
                          color={showConfirmPassword ? theme.colors.primary : theme.colors.outline}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* 30-Day Auto-Login Session Info Badge */}
                <View style={styles.sessionBadge}>
                  <MaterialIcons name="verified-user" size={16} color={theme.colors.primary} />
                  <Text style={styles.sessionBadgeText}>
                    Automatic session stay active for <Text style={{ fontWeight: '700' }}>30 days (1 month)</Text>. If inactive for more than a month, sign-in will be required.
                  </Text>
                </View>

                {/* Submit Action Button */}
                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name={mode === 'register' ? 'person-add' : 'login'} size={18} color="#fff" />
                      <Text style={styles.submitBtnText}>
                        {mode === 'register' ? 'Create Free Executive Account' : 'Sign In to Workspace'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Switcher Text Link */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchMutedText}>
                    {mode === 'register' ? 'Already registered?' : "Don't have an account yet?"}
                  </Text>
                  <TouchableOpacity onPress={() => switchMode(mode === 'register' ? 'login' : 'register')}>
                    <Text style={styles.switchHighlight}>
                      {mode === 'register' ? 'Sign In' : 'Create Free Account'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {/* ============================================================= */}
            {/* FORGOT PASSWORD: REQUEST EMAIL CODE */}
            {/* ============================================================= */}
            {mode === 'forgot' && (
              <View style={styles.formBody}>
                <View style={styles.titleSection}>
                  <Text style={styles.formTitle}>Reset Your Password</Text>
                  <Text style={styles.formSubtitle}>
                    Enter your registered email address to receive a secure email verification code.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Registered Email Address *</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="alternate-email" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="candidate@example.com"
                      placeholderTextColor={theme.colors.outline}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleSendResetCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name="send" size={18} color="#fff" />
                      <Text style={styles.submitBtnText}>Send Verification Code</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backLinkRow} onPress={() => switchMode('login')}>
                  <MaterialIcons name="arrow-back" size={16} color={theme.colors.primary} />
                  <Text style={styles.backLinkText}>Return to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ============================================================= */}
            {/* RESET PASSWORD: CODE & NEW PASSWORD WITH EYE TOGGLE */}
            {/* ============================================================= */}
            {mode === 'reset' && (
              <View style={styles.formBody}>
                <View style={styles.titleSection}>
                  <Text style={styles.formTitle}>Enter Verification Code</Text>
                  <Text style={styles.formSubtitle}>
                    A 6-digit verification code has been dispatched to <Text style={{ fontWeight: '700' }}>{email}</Text>.
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>6-Digit Verification Code *</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="pin" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. 849201"
                      placeholderTextColor={theme.colors.outline}
                      value={resetCode}
                      onChangeText={setResetCode}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>New Password *</Text>
                  <View style={styles.inputWrapper}>
                    <MaterialIcons name="lock" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="Min. 8 characters"
                      placeholderTextColor={theme.colors.outline}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowNewPassword(!showNewPassword)}
                    >
                      <MaterialIcons
                        name={showNewPassword ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={showNewPassword ? theme.colors.primary : theme.colors.outline}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                  onPress={handleConfirmPasswordReset}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={18} color="#fff" />
                      <Text style={styles.submitBtnText}>Save New Password & Sign In</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backLinkRow} onPress={() => switchMode('login')}>
                  <MaterialIcons name="arrow-back" size={16} color={theme.colors.primary} />
                  <Text style={styles.backLinkText}>Cancel & Return to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Security Assurance */}
            <View style={styles.cardFooter}>
              <MaterialIcons name="lock" size={13} color={theme.colors.outline} />
              <Text style={styles.cardFooterText}>
                Encrypted with Argon2id & SQLite/Postgres DB Storage
              </Text>
            </View>

          </View>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollRoot: {
    minHeight: '100%',
    backgroundColor: '#f9f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    maxWidth: 1040,
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerDesktop: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 36,
  },
  // Hero Side (Left)
  heroSide: {
    flex: 1,
    backgroundColor: 'linear-gradient(135deg, #121b2e 0%, #273044 100%)',
    backgroundColor: '#121b2e',
    borderRadius: 24,
    padding: 36,
    justifyContent: 'space-between',
    ...theme.shadows.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  brandIconText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9485ff',
    letterSpacing: 1.5,
  },
  heroPitch: {
    marginVertical: 28,
  },
  heroHeadline: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroSubheadline: {
    fontSize: 13,
    color: '#edf0ff',
    opacity: 0.85,
    lineHeight: 20,
  },
  featureList: {
    gap: 18,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12,
    color: '#c3c6d4',
    lineHeight: 16,
  },
  heroFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroFooterText: {
    fontSize: 11,
    color: '#c3c6d4',
    fontWeight: '500',
  },

  // Form Side (Right)
  formSide: {
    flex: 1,
    maxWidth: 480,
    width: '100%',
  },
  formSideFull: {
    maxWidth: 480,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainer,
    ...theme.shadows.lg,
  },
  mobileBrandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandIconSm: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  brandIconTextSm: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 20,
  },
  mobileBrandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.onSurface,
  },
  mobileBrandSub: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  // Alerts
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff4e5',
    borderWidth: 1,
    borderColor: '#ffd8a8',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningBannerText: {
    fontSize: 12,
    color: '#b25e00',
    fontWeight: '600',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.successContainer,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  successBannerText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.errorContainer,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '600',
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.primaryFixed,
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBannerText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    flex: 1,
  },

  // Switcher
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    ...theme.shadows.sm,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  tabBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Form Elements
  formBody: {
    width: '100%',
  },
  titleSection: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  forgotLink: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainer,
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: theme.colors.onSurface,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  eyeBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 10,
    padding: 10,
    marginVertical: 12,
  },
  sessionBadgeText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 15,
    flex: 1,
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    ...theme.shadows.md,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  switchMutedText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  switchHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  backLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  backLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainerLow,
  },
  cardFooterText: {
    fontSize: 10,
    color: theme.colors.outline,
    fontWeight: '500',
  },
});
