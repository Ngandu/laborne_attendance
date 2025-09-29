export const en = {
  // Common
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  search: 'Search',
  yes: 'Yes',
  no: 'No',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  
  // Authentication
  login: 'Login',
  logout: 'Logout',
  email: 'Email',
  password: 'Password',
  signIn: 'Sign In',
  signOut: 'Sign Out',
  loginError: 'Login failed. Please check your credentials.',
  logoutConfirm: 'Are you sure you want to logout?',
  
  // Navigation & Headers
  home: 'Home',
  attendance: 'Attendance',
  people: 'People',
  reports: 'Reports',
  addPerson: 'Add Person',
  editPerson: 'Edit Person',
  
  // Home Screen
  welcomeMessage: 'Welcome to Laborne Attendance',
  attendanceButton: 'Take Attendance',
  peopleButton: 'Manage People',
  reportsButton: 'View Reports',
  
  // People Screen
  searchPeople: 'Search people...',
  noResults: 'No results found',
  addNewPerson: 'Add New Person',
  
  // Person Form
  surname: 'Surname',
  familyName: 'Family Name',
  firstName: 'First Name',
  cellphone: 'Cellphone',
  address: 'Address',
  requiredField: 'This field is required',
  personAdded: 'Person added successfully!',
  personUpdated: 'Person updated successfully!',
  personError: 'Error saving person. Please try again.',
  
  // Attendance Screen
  takeAttendance: 'Take Attendance',
  present: 'Present',
  absent: 'Absent',
  attendanceMarked: 'Attendance marked successfully!',
  attendanceError: 'Error marking attendance. Please try again.',
  
  // Reports Screen
  report: 'Report',
  attended: 'Attended',
  attendedCount: 'Attended',
  absentCount: 'Absent',
  totalAttendees: 'Total Attendees',
  attendanceReport: 'Attendance Report',
  
  // Settings
  language: 'Language',
  selectLanguage: 'Select Language',
  english: 'English',
  french: 'Français',
};

export type TranslationKeys = keyof typeof en;