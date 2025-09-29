import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTranslation } from '../contexts/TranslationContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, t, availableLanguages } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  const handleLanguageSelect = (languageCode: 'en' | 'fr') => {
    setLanguage(languageCode);
    setIsVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.languageButton} onPress={() => setIsVisible(true)}>
        <Feather name="globe" size={20} color="#FFFFFF" />
        <Text style={styles.languageButtonText}>
          {language.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
            
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.selectedLanguageOption,
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <Text style={[
                  styles.languageOptionText,
                  language === lang.code && styles.selectedLanguageOptionText,
                ]}>
                  {lang.name}
                </Text>
                {language === lang.code && (
                  <Feather name="check" size={20} color="#4A9B8E" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  languageButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLanguageOption: {
    backgroundColor: '#F0F8F6',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedLanguageOptionText: {
    color: '#4A9B8E',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
});