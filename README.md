# 📚 Dicoding - Learning Weekly Target

> Aplikasi untuk membantu siswa Dicoding menetapkan dan melacak target belajar mingguan

## 🎯 Deskripsi Proyek

**[DC-03] Learning Weekly Target** adalah aplikasi web yang dirancang khusus untuk membantu siswa Dicoding dalam:
- Menetapkan target belajar mingguan yang terstruktur
- Melacak progres belajar secara visual
- Membangun konsistensi belajar dengan sistem streak
- Mencatat aktivitas belajar harian melalui kalender check-in

### Tim Pengembang
Komposisi Tim: 5 Front-End & Back-End Developer

## 🚀 Fitur Utama

### 1. **Dashboard Progress Belajar**
- Visualisasi progress mingguan dengan progress bar
- Sistem streak untuk melacak konsistensi belajar
- Daftar jadwal belajar dengan toggle completion

### 2. **Kalender Belajar Interaktif**
- Kalender bulanan dengan navigasi
- Check-in harian untuk mencatat aktivitas belajar
- Indikator visual untuk hari yang sudah check-in

### 3. **Jadwal Mingguan**
- Pengaturan jadwal belajar untuk 7 hari
- Toggle switch untuk menandai hari yang sudah selesai
- Icon unik untuk setiap hari

### 4. **Sistem Reminder**
- Notifikasi untuk mengingatkan target belajar
- Pengingat setiap pukul 9 pagi (fitur konsep)

## 📋 Latar Belakang Masalah

Setiap siswa memiliki tujuan dan harapan yang ingin dicapai dengan mempercayai Dicoding sebagai platform belajar pemrograman digital. Penting bagi mereka untuk menentukan target pembelajaran sendiri.

### Masalah yang Dihadapi:
- Dicoding belum memiliki sistem untuk membantu menentukan target belajar
- Para siswa membuat target belajar sendiri secara manual
- Atau menggunakan platform scheduling lain seperti Google Calendar

### Solusi yang Ditawarkan:
Membangun fitur scheduling terintegrasi yang dapat membantu progres belajar para siswa.

## ✅ Hasil yang Diharapkan

Produk akhir dapat memenuhi indikator berikut:

- ☑️ Siswa dapat melihat hasil progres belajar pada halaman dashboard
- ☑️ Siswa dapat melihat hasil progres belajar mingguan pada halaman dashboard
- ☑️ Sistem dapat mengirimkan pesan reminder kepada siswa setiap pukul 9 pagi

## 🎨 Keunggulan

Ada beberapa keuntungan dalam menetapkan progres belajar setiap minggu:

- ✓ Siswa mampu melacak perjalanan belajarnya
- ✓ Siswa memiliki konsistensi belajar yang terus meningkat
- ✓ Dapat melaporkan progres belajar yang terstruktur sesuai preferensi
- ✓ Siswa dapat melakukan kelas dengan tepat waktu
- ✓ Meningkatkan kepuasan siswa terhadap Dicoding sebagai platform belajar

## 🛠️ Teknologi yang Digunakan

- **Vite** - Build tool modern dan cepat
- **Vanilla JavaScript** - Logika aplikasi tanpa framework
- **CSS3** - Styling dengan custom properties dan grid/flexbox
- **Local Storage** - Penyimpanan data lokal browser

## 📦 Instalasi dan Menjalankan

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone repository atau extract project
```bash
cd starter-project-with-vite
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka browser dan akses `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

### Preview build production

```bash
npm run preview
```

## 📁 Struktur Folder

```
starter-project-with-vite/
├── src/
│   ├── index.html              # HTML utama
│   ├── public/                 # Assets statis
│   │   ├── favicon.png
│   │   └── images/
│   ├── scripts/
│   │   ├── index.js           # Entry point aplikasi
│   │   ├── config.js          # Konfigurasi
│   │   ├── pages/
│   │   │   ├── app.js         # Router aplikasi
│   │   │   ├── home.js        # Halaman beranda
│   │   │   └── about.js       # Halaman tentang
│   │   └── utils/
│   │       └── storage.js     # Utility untuk localStorage
│   └── styles/
│       └── styles.css         # CSS styling
├── package.json
├── vite.config.js
└── README.md
```

## 💡 Cara Menggunakan

### 1. Melihat Progress Belajar
- Dashboard utama menampilkan progress mingguan Anda
- Lihat berapa hari sudah diselesaikan dari target 7 hari

### 2. Menandai Hari Selesai
- Klik toggle switch pada jadwal hari yang sudah diselesaikan
- Progress bar akan otomatis terupdate

### 3. Check-in Harian
- Klik tanggal pada kalender untuk melakukan check-in
- Hari yang sudah check-in akan ditandai dengan warna hijau dan icon centang

### 4. Navigasi Kalender
- Gunakan tombol ‹ dan › untuk berpindah bulan
- Lihat riwayat check-in Anda di bulan sebelumnya

## 🔮 Pengembangan Selanjutnya

Fitur yang dapat dikembangkan:
- [ ] Integrasi dengan API Dicoding
- [ ] Sistem notifikasi push
- [ ] Export laporan progress
- [ ] Analitik pembelajaran
- [ ] Sinkronisasi multi-device
- [ ] Gamifikasi dengan badge dan achievement
- [ ] Kompetisi dengan sesama learner

## 📝 Lisensi

Project ini dibuat untuk keperluan pembelajaran dan prototype capstone project Dicoding.

## 👥 Kontak

Untuk pertanyaan atau saran, silakan hubungi tim pengembang [DC-03].

---

**Dibuat dengan ❤️ oleh Tim Dicoding Indonesia**
