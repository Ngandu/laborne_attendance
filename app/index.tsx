import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const handleAttendance = () => {
    console.log('Attendance pressed');
    router.push('attendance');
  };

  const handlePeople = () => {
    console.log('People pressed');
    router.push('people');
  };

  const handleReports = () => {
    console.log('Reports pressed');
    router.push('reports');
  };

  return (
    <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#4A9B8E" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
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
            <Text style={styles.buttonText}>Attendance</Text>
          </TouchableOpacity>

          {/* People and Reports Buttons - Side by Side */}
          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity style={styles.bottomButton} onPress={handlePeople}>
              <Feather name="users" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>People</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomButton} onPress={handleReports}>
              <Feather name="file-text" size={24} color="#ffffff" />
              <Text style={styles.buttonText}>Reports</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
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
