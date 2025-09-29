import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function HomeScreen() {
  const [loggingOut, setLoggingOut] = useState(false);
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirm'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await signOut();
              // Navigation will be handled automatically by AuthWrapper
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert(t('error'), 'Failed to logout. Please try again.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };
  const handleAttendance = () => {
    console.log('Attendance pressed');
    router.push('/attendance');
  };

  const handlePeople = () => {
    console.log('People pressed');
    router.push('/people');
  };

  const handleReports = () => {
    console.log('Reports pressed');
    router.push('/reports');
  };

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#4A9B8E" />
      
      {/* Header */}
      <View style={styles.header}>
        <LanguageSwitcher />
        <Text style={styles.headerTitle}>{t('home')}</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="log-out" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Background with Navigation Buttons */}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {/* Attendance Button - Full Width */}
          <TouchableOpacity style={styles.attendanceButton} onPress={handleAttendance}>
            <Feather name="check-circle" size={24} color="#ffffff" />
            <Text style={styles.buttonText}>{t('attendance')}</Text>
          </TouchableOpacity>

          {/* People and Reports Buttons - Side by Side */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.bottomButton} onPress={handlePeople}>
              <Feather name="users" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>{t('people')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomButton} onPress={handleReports}>
              <Feather name="file-text" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>{t('reports')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A9B8E',
  },
  header: {
    backgroundColor: '#4A9B8E',
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    // Removed fixed width to accommodate language switcher
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  attendanceButton: {
    backgroundColor: '#4A9B8E',
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 80,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  bottomButton: {
    backgroundColor: '#4A9B8E',
    flexDirection: 'row',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 12,
  },
});
