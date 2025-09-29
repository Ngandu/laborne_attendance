import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Person, handleApiError, peopleApi } from '../api';

export default function PeopleScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Fetch people data on component mount
  useEffect(() => {
    loadPeople();
  }, []);

  // Filter people when search query changes
  useEffect(() => {
    const filterPeople = () => {
      if (!searchQuery.trim()) {
        setFilteredPeople(people);
        return;
      }

      const query = searchQuery.toLowerCase().trim();
      const filtered = people.filter(person => 
        person.name.toLowerCase().includes(query) ||
        person.surname.toLowerCase().includes(query) ||
        person.familyname.toLowerCase().includes(query) ||
        person.cellphone.includes(query) ||
        person.address.toLowerCase().includes(query)
      );
      setFilteredPeople(filtered);
    };
    
    filterPeople();
  }, [searchQuery, people]);

  const loadPeople = async () => {
    try {
      setLoading(true);
      const peopleData = await peopleApi.getAllPeople();
      setPeople(peopleData);
    } catch (error) {
      console.error('Error loading people:', error);
      Alert.alert('Error', handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredPeople(people);
      return;
    }

    try {
      setSearching(true);
      // filter the people data using the search
      const filtered = people.filter(person =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.familyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.cellphone.includes(searchQuery) ||
        person.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPeople(filtered);
    } catch (error) {
      console.error('Error searching people:', error);
      Alert.alert('Search Error', handleApiError(error));
    } finally {
      setSearching(false);
    }
  };

  const handleBackPress = () => {
    console.log('Back button pressed');
    router.back();
  };

  const handleFloatingButtonPress = () => {
    console.log('Add person button pressed');
    router.push('/person_form');
  };

  const handlePersonPress = (person: Person) => {
    console.log('Person pressed for editing:', person);
    // Navigate to person_form with the person data for editing
    router.push({
      pathname: '/person_form',
      params: {
        id: person.id,
        name: person.name,
        surname: person.surname,
        familyname: person.familyname,
        cellphone: person.cellphone,
        address: person.address,
        isEdit: 'true'
      }
    });
  };

  const renderPersonItem = ({ item }: { item: Person }) => (
    <TouchableOpacity 
      style={styles.personItem} 
      onPress={() => handlePersonPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.personName}>{`${item.name} ${item.familyname} ${item.surname}`}</Text>
      <Text style={styles.personPhone}>{item.cellphone}</Text>
      <Text style={styles.personAddress}>{item.address}</Text>
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
        <Text style={styles.headerTitle}>People</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Background with Content */}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.contentContainer}>
          {/* Search Section */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Filter"
              placeholderTextColor="#A0A0A0"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Feather name="search" size={16} color="#ffffff" />
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* People List */}
          <View style={styles.listContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A9B8E" />
                <Text style={styles.loadingText}>Loading people...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredPeople}
                renderItem={renderPersonItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshing={searching}
                onRefresh={loadPeople}
              />
            )}
          </View>
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleFloatingButtonPress}
        >
          <Feather name="plus" size={24} color="#ffffff" />
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  listContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    flex: 1,
    paddingVertical: 16,
    marginBottom: 100,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  personItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  personPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  personAddress: {
    fontSize: 14,
    color: '#666',
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
