// Types for the Laborne Attendance App

export interface Person {
  id: string;
  surname: string;
  familyname: string;
  name: string;
  cellphone: string;
  address: string;
}

export interface AttendanceRecord {
  person_id: string;
  name: string;
  surname: string;
  familyname: string;
  id: string | null;
  attendance: boolean | null;
  date: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}