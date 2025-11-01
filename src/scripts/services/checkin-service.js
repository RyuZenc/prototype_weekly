// Service untuk mengelola check-in harian

import { STORAGE_KEYS } from '../constants/storage-keys.js';

export class CheckInService {
  // Mendapatkan semua check-in harian
  static getAllCheckIns() {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKINS);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing check-ins:', e);
        return {};
      }
    }
    
    return {};
  }

  // Mendapatkan check-in untuk tanggal tertentu
  static getCheckIn(dateStr) {
    const checkIns = this.getAllCheckIns();
    return checkIns[dateStr] || null;
  }

  // Menyimpan check-in untuk tanggal tertentu
  static saveCheckIn(dateStr, checkInData) {
    const checkIns = this.getAllCheckIns();
    checkIns[dateStr] = checkInData;
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(checkIns));
  }

  // Mengecek apakah tanggal memiliki check-in
  static hasCheckIn(dateStr) {
    return this.getCheckIn(dateStr) !== null;
  }

  // Mendapatkan semua detail check-in
  static getAllCheckInDetails() {
    const stored = localStorage.getItem(STORAGE_KEYS.CHECKIN_DETAILS);
    
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing check-in details:', e);
        return {};
      }
    }
    
    return {};
  }

  // Mendapatkan detail check-in untuk tanggal tertentu
  static getCheckInDetails(dateStr) {
    const details = this.getAllCheckInDetails();
    return details[dateStr] || null;
  }

  // Menyimpan detail check-in untuk tanggal tertentu
  static saveCheckInDetails(dateStr, detailsData) {
    const details = this.getAllCheckInDetails();
    details[dateStr] = detailsData;
    localStorage.setItem(STORAGE_KEYS.CHECKIN_DETAILS, JSON.stringify(details));
  }

  // Mendapatkan array tanggal check-in yang sudah diurutkan
  static getCheckInDates() {
    const checkIns = this.getAllCheckIns();
    return Object.keys(checkIns).sort();
  }

  // Mendapatkan total jumlah check-in
  static getTotalCheckIns() {
    return this.getCheckInDates().length;
  }

  // Menghapus check-in beserta detailnya
  static deleteCheckIn(dateStr) {
    const checkIns = this.getAllCheckIns();
    const details = this.getAllCheckInDetails();
    
    delete checkIns[dateStr];
    delete details[dateStr];
    
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKINS, JSON.stringify(checkIns));
    localStorage.setItem(STORAGE_KEYS.CHECKIN_DETAILS, JSON.stringify(details));
  }
}
