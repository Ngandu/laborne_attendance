import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase_config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  getStoredToken: () => Promise<string | null>;
}

// Storage keys for persistent authentication
const USER_STORAGE_KEY = '@auth_user';
const USER_TOKEN_KEY = '@auth_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in - store in AsyncStorage
        await storeUser(firebaseUser);
        setUser(firebaseUser);
      } else {
        // User is signed out - clear AsyncStorage
        await clearStoredUser();
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Periodic token refresh (every 50 minutes - tokens expire in 1 hour)
  useEffect(() => {
    let tokenRefreshInterval: ReturnType<typeof setInterval>;

    if (user) {
      tokenRefreshInterval = setInterval(() => {
        refreshToken().catch(console.error);
      }, 50 * 60 * 1000); // 50 minutes
    }

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [user, refreshToken]);

  const loadStoredUser = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      const storedToken = await AsyncStorage.getItem(USER_TOKEN_KEY);
      
      if (storedUserData && storedToken) {
        const userData = JSON.parse(storedUserData);
        // Create a minimal user object that matches Firebase User interface
        const restoredUser = {
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          emailVerified: userData.emailVerified,
        } as User;
        
        setUser(restoredUser);
        console.log('User restored from AsyncStorage:', restoredUser.email);
      } else {
        console.log('No stored user found');
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setLoading(false);
    }
  };

  const storeUser = async (user: User) => {
    try {
      // Store essential user data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };
      
      // Get and store the auth token
      const token = await user.getIdToken();
      
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(USER_TOKEN_KEY, token);
      
      console.log('User stored in AsyncStorage:', user.email);
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const clearStoredUser = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(USER_TOKEN_KEY);
      console.log('User data cleared from AsyncStorage');
    } catch (error) {
      console.error('Error clearing stored user:', error);
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      if (user) {
        const newToken = await user.getIdToken(true); // Force refresh
        await AsyncStorage.setItem(USER_TOKEN_KEY, newToken);
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }, [user]);

  const getStoredToken = useCallback(async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem(USER_TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      // Clear stored user data first
      await clearStoredUser();
      // Then sign out from Firebase
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Periodic token refresh (every 50 minutes - tokens expire in 1 hour)
  useEffect(() => {
    let tokenRefreshInterval: ReturnType<typeof setInterval>;

    if (user) {
      tokenRefreshInterval = setInterval(() => {
        refreshToken().catch(console.error);
      }, 50 * 60 * 1000); // 50 minutes
    }

    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [user, refreshToken]);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut: signOutUser,
    refreshToken,
    isAuthenticated: !!user,
    getStoredToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};