// Service untuk mengelola pengaturan jadwal

import { STORAGE_KEYS } from '../constants/storage-keys.js';
import { DAY_NAMES_ID } from '../constants/days.js';

export class ScheduleService {
  // Mendapatkan pengaturan jadwal mingguan
  static getWeeklySchedule() {
    const stored = localStorage.getItem(STORAGE_KEYS.WEEKLY_SCHEDULE_SETTINGS);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing schedule settings:', e);
        return {};
      }
    }
    
    return {};
  }

  // Menyimpan pengaturan jadwal mingguan
  static saveWeeklySchedule(schedule) {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_SCHEDULE_SETTINGS, JSON.stringify(schedule));
  }

  // Mendapatkan hari-hari yang dipilih dari jadwal
  static getSelectedDays() {
    const schedule = this.getWeeklySchedule();
    return Object.keys(schedule).filter(day => schedule[day]);
  }

  // Mendapatkan hari-hari yang dipilih dalam Bahasa Indonesia
  static getSelectedDaysIndonesian() {
    const selectedDays = this.getSelectedDays();
    return selectedDays.map(day => DAY_NAMES_ID[day]);
  }

  // Memperbarui jadwal untuk hari-hari tertentu
  static updateDays(dayValues) {
    const currentSchedule = this.getWeeklySchedule();
    const updatedSchedule = { ...currentSchedule, ...dayValues };
    this.saveWeeklySchedule(updatedSchedule);
  }

  // Mengecek apakah hari tertentu dipilih
  static isDaySelected(day) {
    const schedule = this.getWeeklySchedule();
    return schedule[day.toLowerCase()] || false;
  }
}
