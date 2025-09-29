import { AttendanceRecord } from '../types';
import { apiConfig, ApiException } from './people';

// Attendance API Functions
export const attendanceApi = {
  /**
   * Fetches attendance records for a specific date
   * @param date Date in YYYY-MM-DD format
   * @returns Promise<AttendanceRecord[]> Array of attendance records
   */
  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    console.log("Fetching attendance for date:", date);
    try {
      const url = `${apiConfig.baseUrl}?param=attendance&date=${encodeURIComponent(date)}`;
      console.log("Request URL:", url);

      const response = await fetch(url, {
        headers: apiConfig.defaultHeaders,
      });

      if (!response.ok) {
        throw new ApiException(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      const attendanceRecords = await response.json();
      
      if (!Array.isArray(attendanceRecords)) {
        throw new ApiException(
          'Invalid response format: Expected an array of attendance records',
          0,
          'INVALID_RESPONSE'
        );
      }

      return attendanceRecords;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  /**
   * Post attendance for multiple records
   * @param records Array of attendance records to post
   * @returns Promise<boolean> Success status
   */
  async postAttendance(records: AttendanceRecord[]): Promise<boolean> {
    let data = JSON.stringify(records);
    console.log("Posting attendance data:", data);
    try {
      const url = apiConfig.baseUrl+"?param=post_attendance";
      const response = await fetch(url, {
        method: 'POST',
        headers: apiConfig.defaultHeaders,
        body: data,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new ApiException(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      // Check if response has content before trying to parse JSON
      const responseText = await response.text();
      console.log("Response text:", responseText);
      
      // If response is empty, assume success if status was OK
      if (!responseText || responseText.trim() === '') {
        console.log("Empty response, assuming success based on OK status");
        return true;
      }

      try {
        const result = JSON.parse(responseText);
        return result.success === true || response.ok;
      } catch (jsonError) {
        console.warn("Failed to parse JSON response:", jsonError);
        console.warn("Response text was:", responseText);
        // If JSON parsing fails but HTTP status was OK, assume success
        return response.ok;
      }
    }
    catch (error) {
      console.error('Error posting attendance:', error);
      throw error;
    }
  },

  /**
   * Marks attendance for a person
   * @param personId Person ID
   * @param date Date in YYYY-MM-DD format
   * @param isPresent Whether the person is present
   * @returns Promise<boolean> Success status
   */
  async markAttendance(personId: string, date: string, isPresent: boolean): Promise<boolean> {
    try {
      const url = apiConfig.baseUrl;
      const response = await fetch(url, {
        method: 'POST',
        headers: apiConfig.defaultHeaders,
        body: JSON.stringify({
          param: 'mark_attendance',
          person_id: personId,
          date: date,
          is_present: isPresent,
        }),
      });

      if (!response.ok) {
        throw new ApiException(
          `HTTP Error: ${response.status} ${response.statusText}`,
          response.status,
          'HTTP_ERROR'
        );
      }

      const result = await response.json();
      return result.success === true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  /**
   * Gets attendance statistics for a date
   * @param date Date in YYYY-MM-DD format
   * @returns Promise<{attended: number, absent: number}> Attendance statistics
   */
  async getAttendanceStats(date: string): Promise<{ attended: number; absent: number }> {
    try {
      const records = await this.getAttendanceByDate(date);
      
      const attended = records.filter(record => record.attendance).length;
      const absent = records.filter(record => !record.attendance).length;

      return { attended, absent };
    } catch (error) {
      console.error('Error getting attendance stats:', error);
      throw error;
    }
  },
};