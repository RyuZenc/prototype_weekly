# Dokumentasi Halaman Runtutan Belajar

## 📚 Overview
Halaman Runtutan Belajar adalah fitur baru yang menampilkan daftar learning path dan kelas-kelas yang sedang dipelajari oleh siswa Dicoding, menggunakan **Presenter Pattern** untuk memisahkan logika bisnis dari tampilan.

## 🏗️ Arsitektur (Presenter Pattern)

### 1. **Presenter** (`runtutan-presenter.js`)
**Tanggung Jawab:**
- Mengelola logika bisnis
- Mengambil dan memproses data learning paths
- Menangani event dari UI
- Memfilter data berdasarkan tab yang aktif
- Menghitung statistik completion

**Key Methods:**
```javascript
- init()                          // Inisialisasi presenter
- _getLearningPaths()             // Mendapatkan data learning paths
- _attachEventListeners()         // Attach event handlers
- _handleTabSwitch(tabName)       // Handle switching tabs
- _handleCourseClick(courseId)    // Handle click pada course
- _handlePathClick(pathId)        // Handle click pada learning path
- getCompletionStats()            // Menghitung statistik
```

### 2. **View** (`runtutan-page.js`)
**Tanggung Jawab:**
- Me-render HTML
- Menampilkan data yang diberikan oleh presenter
- Berinteraksi dengan DOM
- Menerima input dari user

**Key Methods:**
```javascript
- render()                        // Render HTML structure
- afterRender()                   // Initialize presenter
- displayLearningPaths(paths)     // Tampilkan learning paths
- _displayStats()                 // Tampilkan statistik
```

## 📊 Struktur Data

### Learning Path Object
```javascript
{
  id: 1,
  title: 'AWS Back-End Academy',
  deadline: '28 Februari 2026 - 23:59',
  daysRemaining: 126,
  courses: [
    {
      id: 1,
      title: 'Belajar Dasar Cloud dan Gen AI di AWS',
      completed: true
    },
    // ...
  ],
  icon: '🎓',
  status: 'active' // 'active', 'not-started', 'completed'
}
```

## 🎨 Fitur UI

### 1. **Stats Overview Cards**
- Total Learning Path
- Path Aktif
- Kelas Selesai (completed/total)
- Progress Keseluruhan (%)

### 2. **Tab Filtering**
- **Kelas yang Dipelajari**: Menampilkan semua path yang ada course yang sudah dimulai
- **Kelas yang Diselesaikan**: Menampilkan path yang semua coursenya sudah selesai

### 3. **Learning Path Card**
Setiap card menampilkan:
- Icon dan title
- Deadline dengan countdown
- Daftar course dengan status completion
- Progress bar
- Badge status (Selesai/Sedang Belajar)

### 4. **Interactive Elements**
- Click course item → Alert course ID (bisa diganti navigasi ke detail)
- Click path card → Alert path ID (bisa diganti navigasi ke detail)
- Click tab → Filter learning paths
- Hover effects untuk better UX

## 🎯 Use Cases

### UC-1: Melihat Daftar Learning Path
1. User mengakses halaman Runtutan Belajar
2. Sistem menampilkan semua learning paths
3. User melihat statistik overall di bagian atas

### UC-2: Filter Berdasarkan Status
1. User klik tab "Kelas yang Diselesaikan"
2. Presenter memfilter data
3. View menampilkan hanya path yang sudah selesai

### UC-3: Membuka Detail Course
1. User klik pada course item
2. Presenter menangani event
3. Sistem navigasi ke detail course (implementasi future)

### UC-4: Tracking Progress
1. User melihat progress bar di setiap path
2. User melihat badge completion status
3. User mendapat visual feedback tentang pencapaian

## 🔄 Flow Diagram

```
User Action → View (runtutan-page.js)
                ↓
              Event
                ↓
      Presenter (runtutan-presenter.js)
                ↓
           Process Data
                ↓
      View.displayMethod()
                ↓
           Update DOM
```

## 📁 File Structure

```
src/
├── scripts/
│   ├── presenters/
│   │   └── runtutan-presenter.js    // Business logic
│   └── pages/
│       └── runtutan-page.js         // View layer
└── styles/
    └── styles.css                   // Styling (section Runtutan Belajar)
```

## 🎨 Styling Classes

### Main Containers
- `.runtutan-page` - Main container
- `.learning-paths-container` - Container untuk cards
- `.stats-overview` - Grid untuk stats cards

### Components
- `.stat-card` - Card statistik individual
- `.learning-path-card` - Card untuk setiap learning path
- `.course-item` - Item course dalam path
- `.learning-tab` - Tab untuk filtering

### States
- `.active` - Tab yang sedang aktif
- `.completed` - Course yang sudah selesai
- `.empty-state` - State ketika tidak ada data

## 🚀 Future Enhancements

### 1. **Integration dengan API**
```javascript
async _getLearningPaths() {
  try {
    const response = await fetch(`${CONFIG.BASE_URL}/learning-paths`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    return [];
  }
}
```

### 2. **Real Navigation**
```javascript
_handleCourseClick(courseId) {
  window.location.hash = `#/course/${courseId}`;
}

_handlePathClick(pathId) {
  window.location.hash = `#/learning-path/${pathId}`;
}
```

### 3. **Search & Filter**
- Search bar untuk mencari course
- Filter by status (ongoing, completed, not started)
- Sort by deadline, progress, etc.

### 4. **LocalStorage Integration**
- Simpan progress completion
- Cache data untuk offline access
- Sync dengan server

### 5. **Animation & Transitions**
- Smooth transition saat filter
- Loading states
- Skeleton screens

## 🧪 Testing Scenarios

### Test 1: Tab Switching
```javascript
// Klik tab "Kelas yang Diselesaikan"
// Expected: Hanya path dengan semua course completed yang tampil
```

### Test 2: Empty State
```javascript
// Filter dengan kriteria yang tidak ada datanya
// Expected: Tampil empty state dengan message
```

### Test 3: Stats Calculation
```javascript
// Check apakah stats dihitung dengan benar
// Expected: Total courses = sum of all courses in all paths
```

## 📝 Notes

- Data saat ini hardcoded di presenter, ready untuk diganti dengan API call
- Event handlers sudah di-setup untuk future navigation
- Responsive design sudah diimplementasi untuk mobile & desktop
- Presenter pattern memudahkan testing dan maintenance
- Ready untuk integrasi dengan backend API

## 🔗 Routes

- `#/` - Home page
- `#/runtutan-belajar` - Runtutan Belajar page ✨ NEW
- `#/about` - About page

## 📞 Integration Points

### Dengan Home Page
- Link button "Lihat Runtutan Belajar" di hero section
- Navigation menu item

### Future Integration
- Course detail page
- Learning path detail page
- User profile page
- Progress tracking system
- Notification system untuk deadline

---

**Dibuat dengan ❤️ menggunakan Presenter Pattern**
