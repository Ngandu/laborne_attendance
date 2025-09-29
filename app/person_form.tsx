import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { peopleApi } from '../api';

export default function PersonFormScreen() {
  const params = useLocalSearchParams();
  const isEdit = params.isEdit === 'true';
  
  const [formData, setFormData] = useState({
    id: '',
    surname: '',
    familyname: '',
    name: '',
    cellphone: '',
    address: '',
  });

  // Pre-fill form data when editing
  useEffect(() => {
    console.log('isEdit:', isEdit, 'params:', params);
    if (isEdit && params) {
      setFormData({
        id: (params.id as string) || '',
        surname: (params.surname as string) || '',
        familyname: (params.familyname as string) || '',
        name: (params.name as string) || '',
        cellphone: (params.cellphone as string) || '',
        address: (params.address as string) || '',
      });
    }
  }, []);

  const handleBackPress = () => {
    console.log('Back button pressed');
    router.back();
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async() => {
    console.log('Save pressed with data:', formData);
    console.log('Is edit mode:', isEdit);
    
    // Validate form data
    if (!formData.surname || !formData.familyname || !formData.name) {
      showToast('error','Validation Error','Surname, Family name, and Name are required.');
      return;
    }

    try {
      if (isEdit) {
        // TODO: Implement update person API call
        // For now, we'll use addPerson (you can add updatePerson to your API)
        const updated = await peopleApi.addPerson(formData);
        if(updated){
          showToast("success","Person","Person was updated successfully");
          router.back();
        }
      } else {
        // Create new person
        const posted = await peopleApi.addPerson(formData);
        if(posted){
          showToast("success","Person","Person was created successfully");
          handleCancel();
        }
      }
    } catch (error) {
      showToast('error', 'Error', isEdit ? 'Failed to update person' : 'Failed to create person');
      console.error('Save error:', error);
    }
  };

  const handleCancel = () => {
    console.log('Cancel pressed');
    
    if (isEdit) {
      // In edit mode, just go back without resetting
      router.back();
    } else {
      // In create mode, reset the form and go back
      setFormData({
        id: '',
        surname: '',
        familyname: '',
        name: '',
        cellphone: '',
        address: '',
      });
      router.back();
    }
  };
  
  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    Toast.show({
      type,
      text1: title,
      text2: message
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A9B8E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit person' : 'New person'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Background with Content */}
      <ImageBackground
        source={require('../assets/images/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              {/* Surname Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Surname"
                  placeholderTextColor="#A0A0A0"
                  value={formData.surname}
                  onChangeText={(text) => handleInputChange('surname', text)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Lastname Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Lastname"
                  placeholderTextColor="#A0A0A0"
                  value={formData.familyname}
                  onChangeText={(text) => handleInputChange('familyname', text)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Pre-name Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="#A0A0A0"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="#A0A0A0"
                  value={formData.cellphone}
                  onChangeText={(text) => handleInputChange('cellphone', text)}
                  keyboardType="phone-pad"
                  autoCorrect={false}
                />
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Address"
                  placeholderTextColor="#A0A0A0"
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isEdit ? 'Update' : 'Save'}</Text>
              </TouchableOpacity>

              {/* Cancel Link */}
              <TouchableOpacity style={styles.cancelContainer} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#4A9B8E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
    shadowColor: '#4A9B8E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: '#4A9B8E',
    fontSize: 16,
    fontWeight: '500',
  },
});
