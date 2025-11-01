// Service untuk menghitung dan mengelola statistik streak

import { CheckInService } from './checkin-service.js';
import { STORAGE_KEYS } from '../constants/storage-keys.js';

export class StreakService {
  // Menghitung streak check-in berturut-turut saat ini
  static getCurrentStreak() {
    const checkInDates = CheckInService.getCheckInDates();
    
    // Pastikan checkInDates adalah array
    if (!Array.isArray(checkInDates) || checkInDates.length === 0) return 0;

    // Urutkan tanggal dari yang terbaru
    const sortedDates = checkInDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Cek apakah check-in terakhir adalah hari ini atau kemarin
    const lastCheckIn = new Date(sortedDates[0]);
    lastCheckIn.setHours(0, 0, 0, 0);

    // Jika check-in terakhir bukan hari ini atau kemarin, streak = 0
    if (lastCheckIn.getTime() !== today.getTime() && 
        lastCheckIn.getTime() !== yesterday.getTime()) {
      return 0;
    }

    // Mulai hitung streak dari hari ini atau kemarin
    let currentDate = new Date(lastCheckIn);

    for (let i = 0; i < sortedDates.length; i++) {
      const checkInDate = new Date(sortedDates[i]);
      checkInDate.setHours(0, 0, 0, 0);

      if (checkInDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (checkInDate.getTime() < currentDate.getTime()) {
        break;
      }
    }

    return streak;
  }

  // Mendapatkan streak terbaik yang pernah dicapai
  static getBestStreak() {
    return parseInt(localStorage.getItem(STORAGE_KEYS.BEST_STREAK) || '0');
  }

  // Memperbarui streak terbaik jika streak saat ini lebih tinggi
  static updateBestStreak(currentStreak) {
    let bestStreak = this.getBestStreak();
    
    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
      localStorage.setItem(STORAGE_KEYS.BEST_STREAK, bestStreak.toString());
    }
    
    return bestStreak;
  }

  // Mendapatkan streak saat ini dan streak terbaik
  static getStreakStats() {
    const current = this.getCurrentStreak();
    const best = this.updateBestStreak(current);
    
    return { current, best };
  }
}
