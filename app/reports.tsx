import { useTranslation } from '@/contexts/TranslationContext';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { attendanceApi, AttendanceRecord } from '../api';

interface AttendeeReport {
  id: string;
  name: string;
  isPresent: boolean;
}

export default function ReportsScreen() {
  const { t } = useTranslation();
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBackPress = () => {
    console.log('Back button pressed');
    router.back();
  };

  const handleSearch = () => {
    console.log('Search pressed for date:', currentDate);
    fetchData()
  };

  // fetch the relevant data needed for the screen
  const fetchData = async()=>{
    try {
      const attendanceData = await attendanceApi.getAttendanceByDate(currentDate.toISOString().split('T')[0]);
      setAttendances(attendanceData);
      console.log(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  }

  // use Effect
  useEffect(()=>{
    fetchData()
  },[])

  // Calculate attendance statistics
  const attendedCount = attendances.filter(attendee => attendee.attendance).length;
  const absentCount = attendances.filter(attendee => !attendee.attendance).length;

  const renderAttendeeItem = ({ item }: { item: AttendanceRecord }) => (
    <View style={styles.attendeeItem}>
      <View style={[
        styles.statusIndicator, 
        { backgroundColor: item.attendance ? '#4CAF50' : '#BDBDBD' }
      ]} />
      <Text style={styles.attendeeName}>{item.name} {item.surname} {item.familyname}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A9B8E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('report')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Background with Content */}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {/* Date Picker Section */}
          <View style={styles.dateSearchContainer}>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Feather name="calendar" size={16} color="#fff" />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                style={{ flex: 1, marginTop: 5 }}
                value={currentDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setCurrentDate(selectedDate);
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Feather name="search" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.selectedDateText}>{currentDate.toDateString()}</Text>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('attendedCount')}</Text>
              <Text style={styles.summaryNumber}>{attendedCount}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{t('absentCount')}</Text>
              <Text style={styles.summaryNumber}>{absentCount}</Text>
            </View>
          </View>

          {/* Attendee List */}
          <View style={styles.listContainer}>
            <FlatList
              data={attendances}
              renderItem={renderAttendeeItem}
              keyExtractor={(item) => item.person_id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  dateSearchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: '#4A9B8E',
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#4A9B8E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    flex: 1,
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 16,
  },
  attendeeName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4A9B8E',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    padding: 16
  }
});
