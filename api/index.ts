// API exports for the Laborne Attendance App
export { attendanceApi } from './attendance';
export { authenticatedFetch, clearAuthToken, getAuthHeaders, getAuthToken, isUserAuthenticated } from './auth';
export { apiConfig, ApiException, handleApiError, peopleApi } from './people';

// Re-export types for convenience
export type { ApiError, ApiResponse, AttendanceRecord, Person } from '../types';
