import { Person } from '../types';

// API Configuration
const API_BASE_URL = 'http://localhost/Laborne/api.php';

// API Error class for better error handling
export class ApiException extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;
  }
}

// Generic API request function with error handling
async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiException(
        `HTTP Error: ${response.status} ${response.statusText}`,
        response.status,
        'HTTP_ERROR'
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    // Handle network errors, JSON parsing errors, etc.
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiException(
        'Network error: Unable to connect to the server. Please check your internet connection.',
        0,
        'NETWORK_ERROR'
      );
    }

    throw new ApiException(
      `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'UNKNOWN_ERROR'
    );
  }
}

// People API Functions
export const peopleApi = {

  /**
   * Add a new person
  */
  async addPerson(person: Person): Promise<Person> {
    console.log('adding person');
    console.log(JSON.stringify(person));
    try {
      const url = `${API_BASE_URL}?param=person`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        throw new ApiException(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      // Get response as text first to handle non-JSON responses
      const responseText = await response.text();
      console.log("Add person response text:", responseText);

      // Check if response is empty
      if (!responseText || responseText.trim() === '') {
        console.log("Empty response, returning original person object");
        return person;
      }

      try {
        const result = JSON.parse(responseText);
        console.log("Parsed JSON response:", result);
        return result;
      } catch (jsonError) {
        console.warn("Failed to parse JSON response:", jsonError);
        console.warn("Response text was:", responseText);
        
        // If JSON parsing fails but HTTP status was OK, 
        // check if the response indicates success
        if (responseText.toLowerCase().includes('success') || 
            responseText.toLowerCase().includes('created') ||
            responseText.toLowerCase().includes('added')) {
          return person; // Return the original person object
        }
        
        // If response indicates failure, throw an error
        throw new ApiException(
          `Server returned non-JSON response: ${responseText}`,
          response.status,
          'INVALID_RESPONSE'
        );
      }
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  },

  /**
   * Fetches all people from the API
   * @returns Promise<Person[]> Array of people
   */
  async getAllPeople(): Promise<Person[]> {
    try {
      const url = `${API_BASE_URL}?param=people`;
      const people = await apiRequest<Person[]>(url);
      
      // Validate the response structure
      if (!Array.isArray(people)) {
        throw new ApiException(
          'Invalid response format: Expected an array of people',
          0,
          'INVALID_RESPONSE'
        );
      }

      // Validate each person object has required fields
      people.forEach((person, index) => {
        if (!person.id || !person.surname || !person.name) {
          throw new ApiException(
            `Invalid person data at index ${index}: Missing required fields`,
            0,
            'INVALID_PERSON_DATA'
          );
        }
      });

      return people;
    } catch (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
  },

  /**
   * Searches people by query string (name, surname, cellphone, address)
   * @param query Search query string
   * @returns Promise<Person[]> Filtered array of people
   */
  async searchPeople(query: string): Promise<Person[]> {
    const people = await this.getAllPeople();
    
    if (!query.trim()) {
      return people;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return people.filter(person => 
      person.name.toLowerCase().includes(searchTerm) ||
      person.surname.toLowerCase().includes(searchTerm) ||
      person.familyname.toLowerCase().includes(searchTerm) ||
      person.cellphone.includes(searchTerm) ||
      person.address.toLowerCase().includes(searchTerm)
    );
  },

  /**
   * Gets a person by ID
   * @param id Person ID
   * @returns Promise<Person | null> Person object or null if not found
   */
  async getPersonById(id: string): Promise<Person | null> {
    const people = await this.getAllPeople();
    return people.find(person => person.id === id) || null;
  },
};

// Export API configuration for use in other API files
export const apiConfig = {
  baseUrl: API_BASE_URL,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

// Utility function to handle API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof ApiException) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case 'HTTP_ERROR':
        return `Server error (${error.status}). Please try again later.`;
      case 'INVALID_RESPONSE':
      case 'INVALID_PERSON_DATA':
        return 'Received invalid data from server. Please contact support.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
}