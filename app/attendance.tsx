import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    ImageBackground,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Attendee {
  id: string;
  name: string;
  isPresent: boolean;
}

export default function AttendanceScreen() {
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: '1', name: 'Patrick Ngandu Mudiayi', isPresent: false },
    { id: '2', name: 'Patrick Ngandu Mudiayi', isPresent: true },
    // Add more attendees as needed
  ]);

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')} / ${(currentDate.getMonth() + 1).toString().padStart(2, '0')}. / ${currentDate.getFullYear()}`;

  const toggleAttendance = (id: string) => {
    setAttendees(prev => 
      prev.map(attendee => 
        attendee.id === id 
          ? { ...attendee, isPresent: !attendee.isPresent }
          : attendee
      )
    );
  };

  const handleFloatingButtonPress = () => {
    console.log('Floating button pressed');
    // TODO: Add functionality (e.g., add new attendee, save attendance, etc.)
  };

  const handleBackPress = () => {
    console.log('Back button pressed');
    router.back();
  };

  const renderAttendeeItem = ({ item }: { item: Attendee }) => (
    <TouchableOpacity 
      style={styles.attendeeItem}
      onPress={() => toggleAttendance(item.id)}
    >
      <View style={[
        styles.statusIndicator, 
        { backgroundColor: item.isPresent ? '#4CAF50' : '#BDBDBD' }
      ]} />
      <Text style={styles.attendeeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A9B8E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Background with Content */}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {/* Date Display */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>

          {/* Attendee List */}
          <View style={styles.listContainer}>
            <FlatList
              data={attendees}
              renderItem={renderAttendeeItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleFloatingButtonPress}
        >
            <Feather name="save" size={24} color="#ffffff" />
        </TouchableOpacity>
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
    width: 40, // Same width as back button to center the title
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
  dateContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    flex: 1,
    paddingVertical: 16,
    marginBottom: 100, // Space for floating button
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
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A9B8E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
