// Helper untuk operasi tanggal
export class DateHelper {
  // Mengubah tanggal menjadi string format YYYY-MM-DD
  static toDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Mengubah string YYYY-MM-DD menjadi objek Date
  static fromDateString(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Mendapatkan awal hari (00:00:00)
  static startOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  // Mendapatkan akhir hari (23:59:59)
  static endOfDay(date) {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  // Menambah atau mengurangi hari dari tanggal
  static addDays(date, days) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  // Mengecek apakah dua tanggal adalah hari yang sama
  static isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  // Mengecek apakah tanggal adalah hari ini
  static isToday(date) {
    return this.isSameDay(date, new Date());
  }

  // Menghitung selisih hari antara dua tanggal
  static daysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = this.startOfDay(date1);
    const end = this.startOfDay(date2);
    const diffTime = Math.abs(end - start);
    return Math.round(diffTime / oneDay);
  }

  // Mendapatkan nama hari dari tanggal
  static getDayName(date, locale = 'en-US') {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }

  // Mendapatkan nama bulan dari tanggal
  static getMonthName(date, locale = 'id-ID') {
    return date.toLocaleDateString(locale, { month: 'long' });
  }

  // Mendapatkan nomor minggu dalam tahun
  static getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  // Mengecek apakah tahun adalah tahun kabisat
  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // Mendapatkan jumlah hari dalam bulan
  static getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }
}
