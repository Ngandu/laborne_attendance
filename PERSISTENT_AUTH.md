# Persistent Authentication Implementation

## Overview
The app now implements persistent authentication using AsyncStorage to maintain user sessions across app restarts. Users will remain logged in even if they close and reopen the app.

## Features

### 🔒 Persistent Login Sessions
- User authentication state is stored in AsyncStorage
- Users remain logged in after app restarts
- Automatic session restoration on app launch

### 🔄 Token Management
- Automatic token refresh every 50 minutes (tokens expire in 1 hour)
- Safe token storage and retrieval
- Proper cleanup on logout

### 📱 Storage Management
- User data and tokens stored securely in AsyncStorage
- Automatic cleanup when user logs out
- Error handling for storage operations

## How It Works

### Login Process
1. User enters credentials and logs in
2. Firebase authenticates the user
3. User data and auth token are stored in AsyncStorage
4. User is redirected to the home screen

### App Restart
1. App checks AsyncStorage for stored user data
2. If found, user is automatically logged in
3. If not found, user is redirected to login screen

### Token Refresh
- Automatic token refresh runs every 50 minutes
- New tokens are stored in AsyncStorage
- Prevents session expiration

### Logout Process
1. AsyncStorage is cleared of user data and tokens
2. Firebase session is terminated
3. User is redirected to login screen

## Technical Implementation

### Storage Keys
- `@auth_user` - Stores user profile data
- `@auth_token` - Stores Firebase auth token

### AuthContext Methods
- `signIn()` - Authenticates and stores user session
- `signOut()` - Clears session and logs out
- `refreshToken()` - Refreshes and updates stored token
- `getStoredToken()` - Retrieves current auth token
- `isAuthenticated` - Boolean indicating auth status

### API Utilities
- `getAuthToken()` - Get stored auth token
- `getAuthHeaders()` - Create authenticated headers
- `authenticatedFetch()` - Make authenticated API calls
- `isUserAuthenticated()` - Check if user is authenticated

## Usage Examples

### Using the Auth Context
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, refreshToken, getStoredToken } = useAuth();
  
  // Check if user is logged in
  if (isAuthenticated) {
    // User is logged in
  }
  
  // Manually refresh token
  await refreshToken();
  
  // Get stored token for API calls
  const token = await getStoredToken();
}
```

### Making Authenticated API Calls
```tsx
import { authenticatedFetch, getAuthHeaders } from '../api';

// Option 1: Use authenticatedFetch utility
const response = await authenticatedFetch('/api/people', {
  method: 'GET'
});

// Option 2: Use getAuthHeaders manually
const headers = await getAuthHeaders();
const response = await fetch('/api/people', {
  method: 'GET',
  headers
});
```

## Benefits

### User Experience
- ✅ No need to login repeatedly
- ✅ Seamless app experience
- ✅ Automatic session management

### Security
- ✅ Tokens automatically refresh
- ✅ Proper session cleanup on logout
- ✅ Secure storage of credentials

### Development
- ✅ Easy to implement authenticated API calls
- ✅ Consistent auth state management
- ✅ Error handling built-in

## Notes
- Firebase handles the core authentication
- AsyncStorage provides persistence across app restarts
- Token refresh prevents automatic logouts
- All auth state is centralized in AuthContext
- Compatible with existing authentication flow