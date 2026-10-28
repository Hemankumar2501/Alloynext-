import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme, u } from './theme';
import { useApp } from './context';

// =============================================================================
// 1. STAT CARD COMPONENT
// =============================================================================
export const StatCard = ({ title, value, badge, subtext, icon, iconColor, iconBg }) => (
  <View style={[u.card, { flex: 1, minWidth: 200 }]}>
    <View style={[u.rowBetween, { marginBottom: 12 }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={[u.center, styles.iconBox, { backgroundColor: iconBg || theme.colors.surfaceContainer }]}>
        <MaterialIcons name={icon} size={20} color={iconColor || theme.colors.primary} />
      </View>
    </View>
    <View style={[u.rowBetween, { alignItems: 'baseline', marginBottom: 6 }]}>
      <Text style={styles.statValue}>{value}</Text>
      {badge && <View style={u.badge}><Text style={u.badgeText}>{badge}</Text></View>}
    </View>
    {subtext && (
      <View style={[u.row, { gap: 4 }]}>
        <MaterialIcons name="trending-up" size={14} color={theme.colors.primary} />
        <Text style={styles.statSubText}>{subtext}</Text>
      </View>
    )}
  </View>
);

// =============================================================================
// 2. HEADER COMPONENT
// =============================================================================
export const Header = ({ onOpenMenu, isMobile }) => {
  const { currentTab, setCurrentTab, searchQuery, setSearchQuery, setIsAddModalOpen, setIsAuthModalOpen, currentUser, showToast } = useApp();
  const titleMap = {
    dashboard: 'Overview',
    applications: 'My Applications',
    resume: 'Resume Builder',
    analyzer: 'AI Job Analyzer',
    interview: 'Interview Prep',
  };

  const userInitials = currentUser?.full_name
    ? currentUser.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <View style={[styles.header, isMobile && { paddingHorizontal: 16, height: 64 }]}>
      <View style={[u.row, { gap: 12 }]}>
        {isMobile && (
          <TouchableOpacity onPress={onOpenMenu} style={{ padding: 6 }}>
            <MaterialIcons name="menu" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        )}
        <View style={[u.row, { gap: 6 }]}>
          {!isMobile && (
            <>
              <Text style={styles.mutedText}>Workspace</Text>
              <MaterialIcons name="chevron-right" size={16} color={theme.colors.outline} />
            </>
          )}
          <Text style={styles.activeBreadcrumb}>{titleMap[currentTab] || 'Overview'}</Text>
        </View>
      </View>

      {!isMobile && (
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={theme.colors.outline} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search applications, resumes, skills... (Cmd+K)"
            placeholderTextColor={theme.colors.outline}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              if (currentTab !== 'applications') setCurrentTab('applications');
            }}
          />
          <View style={styles.kbd}><Text style={styles.kbdText}>⌘K</Text></View>
        </View>
      )}

      <View style={[u.row, { gap: 12 }]}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => showToast('Upcoming: Stripe technical interview tomorrow at 2:00 PM EST')}>
          <MaterialIcons name="notifications" size={22} color={theme.colors.onSurfaceVariant} />
          <View style={styles.notifDot} />
        </TouchableOpacity>

        <TouchableOpacity style={u.btnPrimary} onPress={() => setIsAddModalOpen(true)}>
          <MaterialIcons name="add" size={18} color="#fff" />
          {!isMobile && <Text style={styles.btnTextWhite}>Add Application</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[u.center, styles.avatar]} onPress={() => setIsAuthModalOpen(true)}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// =============================================================================
// 3. SIDEBAR COMPONENT
// =============================================================================
export const Sidebar = ({ isMobile, onClose }) => {
  const { currentTab, setCurrentTab, applications, currentUser, logout, setIsAuthModalOpen, showToast } = useApp();
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'grid-view' },
    { key: 'applications', label: 'My Applications', icon: 'work', count: applications.length },
    { key: 'resume', label: 'Resume Builder', icon: 'description', badge: 'ATS 98%' },
    { key: 'analyzer', label: 'AI Job Analyzer', icon: 'auto-awesome', dot: true },
    { key: 'interview', label: 'Interview Prep', icon: 'forum' },
  ];

  const handleSelect = (key) => {
    setCurrentTab(key);
    if (isMobile && onClose) onClose();
  };

  const userInitials = currentUser?.full_name
    ? currentUser.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AR';

  return (
    <View style={[styles.sidebar, isMobile && { width: 280 }]}>
      <View style={[u.rowBetween, styles.brandContainer]}>
        <View style={[u.row, { gap: 8 }]}>
          <View style={[u.center, styles.brandLogo]}><Text style={styles.brandLogoText}>A</Text></View>
          <View>
            <Text style={styles.brandTitle}>AlloyNext</Text>
            <Text style={styles.brandSub}>CAREER SUITE</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1, padding: 12 }}>
        <Text style={styles.sectionHeader}>WORKSPACE</Text>
        {navItems.map((item) => {
          const isActive = currentTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[u.row, styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handleSelect(item.key)}
            >
              <MaterialIcons name={item.icon} size={20} color={isActive ? '#fff' : theme.colors.onSurfaceVariant} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
              {item.count !== undefined && (
                <View style={[styles.navBadge, isActive && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Text style={[styles.navBadgeText, isActive && { color: '#fff' }]}>{item.count}</Text>
                </View>
              )}
              {item.badge && <Text style={styles.atsBadge}>{item.badge}</Text>}
              {item.dot && <View style={styles.pulsingDot} />}
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>PERSONAL</Text>
        <TouchableOpacity style={[u.row, styles.navItem]} onPress={() => setIsAuthModalOpen(true)}>
          <MaterialIcons name="person" size={20} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>{currentUser ? 'My Account' : 'Sign In / Register'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[u.row, styles.navItem]} onPress={() => showToast('Match Settings: Strict ATS Keyword Mode')}>
          <MaterialIcons name="tune" size={20} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[u.row, styles.navItem]} onPress={() => showToast('AlloyNext Career Suite v4.2 • 24/7 Support')}>
          <MaterialIcons name="help" size={20} color={theme.colors.onSurfaceVariant} />
          <Text style={styles.navLabel}>Help & Feedback</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[u.rowBetween, styles.profileRow]}>
        <TouchableOpacity style={[u.row, { flex: 1, gap: 10 }]} onPress={() => setIsAuthModalOpen(true)}>
          <View style={[u.center, styles.avatarSm]}><Text style={styles.avatarSmText}>{userInitials}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName} numberOfLines={1}>{currentUser ? currentUser.full_name : 'My Account'}</Text>
            <Text style={styles.profileRole} numberOfLines={1}>{currentUser ? currentUser.email : 'Click to Sign In'}</Text>
          </View>
        </TouchableOpacity>
        {currentUser ? (
          <TouchableOpacity onPress={logout} style={{ padding: 6 }}>
            <MaterialIcons name="logout" size={18} color={theme.colors.error} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsAuthModalOpen(true)} style={{ padding: 6 }}>
            <MaterialIcons name="login" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// =============================================================================
// 4. ADD APPLICATION MODAL COMPONENT
// =============================================================================
export const AddApplicationModal = () => {
  const { isAddModalOpen, setIsAddModalOpen, addApplication, showToast } = useApp();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [status, setStatus] = useState('applied');
  const [jobDescription, setJobDescription] = useState('');

  const statuses = [
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'applied', label: 'Applied' },
    { key: 'assessment', label: 'Assessment' },
    { key: 'interview', label: 'Interview' },
    { key: 'offer', label: 'Offer' },
  ];

  const handleSubmit = () => {
    if (!company.trim() || !role.trim()) {
      showToast('Please enter both company name and job title');
      return;
    }
    addApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      status,
      jobDescription: jobDescription.trim(),
    });
    setCompany('');
    setRole('');
    setJobDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <Modal visible={isAddModalOpen} transparent animationType="fade" onRequestClose={() => setIsAddModalOpen(false)}>
      <View style={[u.center, styles.modalBackdrop]}>
        <View style={styles.modalBox}>
          <View style={[u.rowBetween, styles.modalHeader]}>
            <View style={[u.row, { gap: 8 }]}>
              <MaterialIcons name="post-add" size={22} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>Add New Application</Text>
            </View>
            <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
              <MaterialIcons name="close" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }}>
            <Text style={styles.fieldLabel}>Company Name *</Text>
            <TextInput style={[u.input, styles.inputField]} placeholder="e.g. Stripe, Google" placeholderTextColor={theme.colors.outline} value={company} onChangeText={setCompany} />

            <Text style={styles.fieldLabel}>Job Title *</Text>
            <TextInput style={[u.input, styles.inputField]} placeholder="e.g. Full Stack Engineer" placeholderTextColor={theme.colors.outline} value={role} onChangeText={setRole} />

            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput style={[u.input, styles.inputField]} placeholder="e.g. San Francisco or Remote" placeholderTextColor={theme.colors.outline} value={location} onChangeText={setLocation} />

            <Text style={styles.fieldLabel}>Initial Stage</Text>
            <View style={[u.row, { flexWrap: 'wrap', gap: 6, marginBottom: 16 }]}>
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[styles.chip, status === s.key && styles.chipActive]}
                  onPress={() => setStatus(s.key)}
                >
                  <Text style={[styles.chipText, status === s.key && { color: '#fff', fontWeight: '700' }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Job Description Notes</Text>
            <TextInput
              style={[u.input, { height: 75, paddingTop: 8, textAlignVertical: 'top' }]}
              placeholder="Paste responsibilities or stack notes..."
              placeholderTextColor={theme.colors.outline}
              value={jobDescription}
              onChangeText={setJobDescription}
              multiline
            />
          </ScrollView>

          <View style={[u.rowBetween, styles.modalFooter]}>
            <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.onSurfaceVariant }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={u.btnPrimary} onPress={handleSubmit}>
              <MaterialIcons name="check" size={18} color="#fff" />
              <Text style={styles.btnTextWhite}>Save Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// =============================================================================
// 5. SECURE AUTHENTICATION & PROFILE MODAL
// =============================================================================
export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser, login, register, logout, showToast } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (mode === 'register' && password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password.trim());
      } else {
        await register(email.trim(), password.trim(), fullName.trim());
      }
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={isAuthModalOpen} transparent animationType="fade" onRequestClose={() => setIsAuthModalOpen(false)}>
      <View style={[u.center, styles.modalBackdrop]}>
        <View style={styles.modalBox}>
          <View style={[u.rowBetween, styles.modalHeader]}>
            <View style={[u.row, { gap: 8 }]}>
              <MaterialIcons name="lock" size={20} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>
                {currentUser ? 'Executive Profile' : mode === 'login' ? 'Sign In to AlloyNext' : 'Create Executive Account'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setIsAuthModalOpen(false)}>
              <MaterialIcons name="close" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {currentUser ? (
            <View style={{ padding: 24, gap: 14 }}>
              <View style={[u.center, { marginVertical: 10 }]}>
                <View style={[u.center, { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primaryContainer, marginBottom: 8 }]}>
                  <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff' }}>
                    {currentUser.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.onSurface }}>{currentUser.full_name}</Text>
                <Text style={{ fontSize: 13, color: theme.colors.onSurfaceVariant }}>{currentUser.email}</Text>
              </View>

              <View style={u.cardLow}>
                <Text style={styles.labelMicro}>SECURITY POSTURE</Text>
                <Text style={{ fontSize: 12, color: theme.colors.primary, fontWeight: '600', marginTop: 2 }}>
                  ✓ Argon2id Protected • JWT Token Active • Database Connected
                </Text>
              </View>

              <TouchableOpacity
                style={[u.btnSecondary, { backgroundColor: theme.colors.errorContainer, marginTop: 8 }]}
                onPress={() => {
                  logout();
                  setIsAuthModalOpen(false);
                }}
              >
                <MaterialIcons name="logout" size={18} color={theme.colors.error} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.error }}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ padding: 20 }}>
              {/* Tab Selector */}
              <View style={[u.row, styles.authToggle]}>
                <TouchableOpacity
                  style={[styles.authTab, mode === 'login' && styles.authTabActive]}
                  onPress={() => { setMode('login'); setErrorMsg(''); }}
                >
                  <Text style={[styles.authTabText, mode === 'login' && { color: theme.colors.primary, fontWeight: '700' }]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authTab, mode === 'register' && styles.authTabActive]}
                  onPress={() => { setMode('register'); setErrorMsg(''); }}
                >
                  <Text style={[styles.authTabText, mode === 'register' && { color: theme.colors.primary, fontWeight: '700' }]}>Register</Text>
                </TouchableOpacity>
              </View>

              {errorMsg ? (
                <View style={styles.errorBox}>
                  <MaterialIcons name="error-outline" size={16} color={theme.colors.error} />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {mode === 'register' && (
                <>
                  <Text style={styles.fieldLabel}>Full Name *</Text>
                  <TextInput
                    style={[u.input, styles.inputField]}
                    placeholder="e.g. Jordan Lee"
                    placeholderTextColor={theme.colors.outline}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </>
              )}

              <Text style={styles.fieldLabel}>Email Address *</Text>
              <TextInput
                style={[u.input, styles.inputField]}
                placeholder="candidate@example.com"
                placeholderTextColor={theme.colors.outline}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <Text style={styles.fieldLabel}>Password *</Text>
              <View style={[u.row, u.input, styles.inputField, { paddingHorizontal: 0, overflow: 'hidden' }]}>
                <TextInput
                  style={{ flex: 1, height: '100%', paddingHorizontal: 12, fontSize: 13, color: '#121b2e', outlineStyle: 'none' }}
                  placeholder="Min. 8 characters"
                  placeholderTextColor={theme.colors.outline}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 10 }}>
                  <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={18} color={theme.colors.outline} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[u.btnPrimary, { marginTop: 10 }]} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialIcons name={mode === 'login' ? 'login' : 'person-add'} size={18} color="#fff" />
                    <Text style={styles.btnTextWhite}>{mode === 'login' ? 'Sign In to Workspace' : 'Create Free Account'}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

// =============================================================================
// CONCISE COMPONENT STYLES
// =============================================================================
const styles = StyleSheet.create({
  header: {
    height: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 40,
    ...Platform.select({ web: { position: 'sticky', top: 0, backdropFilter: 'blur(16px)' } }),
  },
  mutedText: { fontSize: 13, color: theme.colors.onSurfaceVariant },
  activeBreadcrumb: { fontSize: 14, fontWeight: '600', color: theme.colors.onSurface },
  searchBar: {
    flex: 1,
    maxWidth: 400,
    height: 40,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 13, color: theme.colors.onSurface, outlineStyle: 'none' },
  kbd: { backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: '#e1e8ff' },
  kbdText: { fontSize: 10, fontWeight: '700', color: theme.colors.outline },
  iconBtn: { padding: 8, position: 'relative' },
  notifDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.error, borderWidth: 1.5, borderColor: '#fff' },
  btnTextWhite: { color: '#fff', fontWeight: '600', fontSize: 13 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: theme.colors.primaryContainer },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  statTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 26, fontWeight: '800', color: theme.colors.onSurface },
  statSubText: { fontSize: 11, color: theme.colors.onSurfaceVariant },
  iconBox: { width: 36, height: 36, borderRadius: 10 },
  sidebar: { width: 256, height: '100%', backgroundColor: '#fff', borderRightWidth: 1, borderRightColor: theme.colors.surfaceContainerLow },
  brandContainer: { height: 72, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow },
  brandLogo: { width: 32, height: 32, borderRadius: 10, backgroundColor: theme.colors.primary },
  brandLogoText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  brandTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.onSurface },
  brandSub: { fontSize: 9, fontWeight: '700', color: theme.colors.primary, letterSpacing: 1 },
  proTag: { backgroundColor: theme.colors.surfaceContainerHigh, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  proTagText: { color: theme.colors.primary, fontSize: 10, fontWeight: '700' },
  sectionHeader: { fontSize: 10, fontWeight: '700', color: theme.colors.onSurfaceVariant, letterSpacing: 1, marginBottom: 6, paddingHorizontal: 8 },
  navItem: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, gap: 12, marginBottom: 2 },
  navItemActive: { backgroundColor: theme.colors.primaryContainer },
  navLabel: { fontSize: 13, fontWeight: '500', color: theme.colors.onSurfaceVariant, flex: 1 },
  navLabelActive: { color: '#fff', fontWeight: '600' },
  navBadge: { backgroundColor: theme.colors.surfaceContainerLow, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  navBadgeText: { fontSize: 11, fontWeight: '700', color: theme.colors.onSurface },
  atsBadge: { fontSize: 10, fontWeight: '700', color: theme.colors.primary, backgroundColor: theme.colors.surfaceContainerHigh, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  pulsingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.secondary },
  profileRow: { padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.surfaceContainerLow },
  avatarSm: { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.primaryContainer },
  avatarSmText: { color: '#fff', fontWeight: '700', fontSize: 11 },
  profileName: { fontSize: 13, fontWeight: '600', color: theme.colors.onSurface },
  profileRole: { fontSize: 11, color: theme.colors.onSurfaceVariant },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(39, 48, 68, 0.45)', padding: 16 },
  modalBox: { width: '100%', maxWidth: 440, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', ...theme.shadows.lg },
  modalHeader: { height: 56, paddingHorizontal: 20, backgroundColor: theme.colors.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainer },
  modalTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.onSurface },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: theme.colors.onSurfaceVariant, marginBottom: 4 },
  inputField: { height: 40, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: theme.colors.surfaceContainerLow },
  chipActive: { backgroundColor: theme.colors.primary },
  chipText: { fontSize: 12, fontWeight: '500', color: theme.colors.onSurfaceVariant },
  modalFooter: { paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: theme.colors.surfaceContainerLow },
  authToggle: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 10, padding: 4, marginBottom: 16 },
  authTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  authTabActive: { backgroundColor: '#fff', ...theme.shadows.sm },
  authTabText: { fontSize: 13, fontWeight: '600', color: theme.colors.onSurfaceVariant },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.colors.errorContainer, padding: 10, borderRadius: 8, marginBottom: 14 },
  errorText: { fontSize: 12, color: theme.colors.error, fontWeight: '500', flex: 1 },
  labelMicro: { fontSize: 10, fontWeight: '700', color: theme.colors.outline, letterSpacing: 0.5 },
});
