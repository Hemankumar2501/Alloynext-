import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Modal, TouchableWithoutFeedback, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context';
import { theme } from './src/theme';
import { Sidebar, Header, AddApplicationModal, AuthModal } from './src/components';
import { AuthScreen } from './src/AuthScreen';

// Consolidated Feature Screens
import {
  DashboardScreen,
  MyApplicationsScreen,
  ResumeBuilderScreen,
  JobAnalyzerScreen,
  InterviewPrepScreen,
} from './src/screens';

const MainLayout = () => {
  const { currentTab, toastMessage } = useApp();
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderScreen = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'applications':
        return <MyApplicationsScreen />;
      case 'resume':
        return <ResumeBuilderScreen />;
      case 'analyzer':
        return <JobAnalyzerScreen />;
      case 'interview':
        return <InterviewPrepScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.appRoot}>
      <StatusBar style="dark" />

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar isMobile={false} />}

      {/* Mobile Drawer Modal */}
      {isMobile && (
        <Modal
          visible={mobileMenuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMobileMenuOpen(false)}
        >
          <View style={styles.mobileBackdrop}>
            <TouchableWithoutFeedback onPress={() => setMobileMenuOpen(false)}>
              <View style={styles.backdropClickArea} />
            </TouchableWithoutFeedback>
            <View style={styles.mobileDrawer}>
              <Sidebar isMobile={true} onClose={() => setMobileMenuOpen(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        <Header onOpenMenu={() => setMobileMenuOpen(true)} isMobile={isMobile} />
        <View style={styles.screenArea}>{renderScreen()}</View>
      </View>

      {/* Global Interactive Add Application Modal */}
      <AddApplicationModal />

      {/* Global Interactive Auth & Profile Modal */}
      <AuthModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
};

const AppContent = () => {
  const { currentUser, isLoadingAuth, toastMessage } = useApp();

  // Initial Authentication Check / Session Verification
  if (isLoadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>A</Text>
        </View>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 16 }} />
        <Text style={styles.loadingTitle}>AlloyNext Executive Suite</Text>
        <Text style={styles.loadingSubtitle}>Verifying secure session...</Text>
      </View>
    );
  }

  // Not logged in: Show the dedicated Login and Sign Up page first!
  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style="dark" />
        <AuthScreen />
        {toastMessage && (
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        )}
      </View>
    );
  }

  // Authenticated: Render the full interactive executive workspace
  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f9f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingLogo: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
  },
  loadingLogoText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginTop: 12,
  },
  loadingSubtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  appRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    height: '100%',
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  screenArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mobileBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(39, 48, 68, 0.4)',
    flexDirection: 'row',
  },
  backdropClickArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  mobileDrawer: {
    width: 280,
    height: '100%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    zIndex: 10,
    ...theme.shadows.lg,
  },
  toast: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: theme.colors.inverseSurface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    zIndex: 9999,
    ...theme.shadows.lg,
  },
  toastText: {
    color: theme.colors.inverseOnSurface,
    fontSize: 13,
    fontWeight: '500',
  },
});
