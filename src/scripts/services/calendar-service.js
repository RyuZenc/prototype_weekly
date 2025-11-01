// Service untuk generasi data kalender dan utilitas tanggal

import { WEEKDAY_SHORT, MONTH_NAMES } from '../constants/days.js';
import { CheckInService } from './checkin-service.js';

export class CalendarService {
  // Mendapatkan data kalender untuk bulan tertentu
  static getCalendarData(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return {
      year,
      month,
      daysInMonth,
      startDayOfWeek,
      firstDay,
      lastDay
    };
  }

  // Mengubah tanggal menjadi string format YYYY-MM-DD
  static formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Mengubah string tanggal menjadi objek Date
  static parseDateString(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Mendapatkan nama hari dalam bentuk singkat
  static getWeekdayShort(date) {
    const dayIndex = date.getDay();
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Ubah Minggu dari 0 ke 6
    return WEEKDAY_SHORT[adjustedIndex];
  }

  // Mengecek apakah tanggal adalah hari ini
  static isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Mengecek apakah tanggal memiliki check-in
  static hasCheckIn(date) {
    const dateStr = this.formatDateString(date);
    return CheckInService.hasCheckIn(dateStr);
  }

  // Mendapatkan nama bulan dalam Bahasa Indonesia
  static getMonthNameIndonesian(monthIndex) {
    return MONTH_NAMES[monthIndex];
  }

  // Mendapatkan bulan sebelumnya
  static getPreviousMonth(year, month) {
    if (month === 0) {
      return { year: year - 1, month: 11 };
    }
    return { year, month: month - 1 };
  }

  // Mendapatkan bulan berikutnya
  static getNextMonth(year, month) {
    if (month === 11) {
      return { year: year + 1, month: 0 };
    }
    return { year, month: month + 1 };
  }

  // Menghitung selisih hari antara dua tanggal
  static getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffTime = Math.abs(date2 - date1);
    return Math.round(diffTime / oneDay);
  }
}
