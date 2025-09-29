import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Auth routing component
function AuthWrapper() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      // Redirect to login if user is not signed in and not already on login screen
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if user is signed in and on login screen
      router.replace('/');
    }
  }, [user, segments, loading, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="attendance" options={{ headerShown: false }} />
      <Stack.Screen name="people" options={{ headerShown: false }} />
      <Stack.Screen name="person_form" options={{ headerShown: false }} />
      <Stack.Screen name="reports" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TranslationProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthWrapper />
          <StatusBar style="auto" />
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </TranslationProvider>
  );
}
