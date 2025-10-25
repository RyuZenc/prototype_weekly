# SPA Implementation Guide

## Overview
Aplikasi ini menggunakan arsitektur **Single Page Application (SPA)** dengan hash-based routing untuk navigasi yang cepat dan smooth tanpa reload halaman penuh.

## Fitur SPA

### ✅ Hash-based Routing
- Menggunakan URL hash (`#/`) untuk routing
- Tidak memerlukan konfigurasi server khusus
- Kompatibel dengan GitHub Pages dan hosting static

### ✅ Dynamic Page Loading
- Halaman dimuat secara dinamis tanpa reload
- Loading state saat transisi halaman
- Error handling untuk halaman yang gagal dimuat

### ✅ Browser History Support
- Support tombol back/forward browser
- Preserves navigation history
- Smooth navigation tanpa flicker

### ✅ Active Link Highlighting
- Menu navigasi secara otomatis highlight halaman aktif
- Sinkronisasi antara header nav, sidebar, dan mobile nav

### ✅ 404 Page
- Halaman custom untuk route yang tidak ditemukan
- Navigasi mudah kembali ke halaman utama

## Struktur Routing

### Routes Available:
```javascript
{
  '/': RuntutanPage,           // Beranda - Runtutan Belajar
  '/weekly-target': WeeklyTargetPage,  // Weekly Target
  '/404': NotFoundPage          // 404 - Halaman tidak ditemukan
}
```

### URL Examples:
- `http://localhost:5173/#/` → Beranda (Runtutan Belajar)
- `http://localhost:5173/#/weekly-target` → Weekly Target Page
- `http://localhost:5173/#/random-url` → 404 Page

## Page Component Structure

Setiap halaman harus memiliki struktur berikut:

```javascript
const PageName = {
  // Render method - return HTML string
  async render() {
    return `<div>Your HTML here</div>`;
  },

  // After render - execute after DOM is ready
  async afterRender() {
    // Initialize event listeners
    // Fetch data
    // Setup interactions
  }
};

export default PageName;
```

## Navigation Methods

### 1. Declarative Navigation (Recommended)
Menggunakan link dengan hash:
```html
<a href="#/">Beranda</a>
<a href="#/weekly-target">Weekly Target</a>
```

### 2. Programmatic Navigation
Menggunakan Router utility:
```javascript
import Router from './utils/router';

// Navigate to route
Router.navigateTo('/weekly-target');

// Get current route
const currentRoute = Router.getCurrentRoute();

// Go back
Router.goBack();

// With query parameters
Router.navigateTo('/weekly-target?tab=completed');
const tab = Router.getQueryParam('tab');
```

## Adding New Pages

### Step 1: Create Page Component
```javascript
// src/scripts/pages/new-page.js
const NewPage = {
  async render() {
    return `
      <div class="new-page">
        <h1>New Page</h1>
        <p>Your content here</p>
      </div>
    `;
  },

  async afterRender() {
    console.log('New page loaded');
  }
};

export default NewPage;
```

### Step 2: Register Route
```javascript
// src/scripts/pages/app.js
import NewPage from './new-page';

_routes() {
  return {
    '/': RuntutanPage,
    '/weekly-target': WeeklyTargetPage,
    '/new-page': NewPage,  // Add your route here
    '/404': NotFoundPage,
  };
}
```

### Step 3: Add to Navigation
```html
<!-- In index.html -->
<a href="#/new-page" class="nav-link">
  <span class="nav-icon">🆕</span>
  <span class="nav-text">New Page</span>
</a>
```

### Step 4: Update Page Title (Optional)
```javascript
// In app.js
_updatePageTitle(url) {
  const titles = {
    '/': 'Runtutan Belajar - Dicoding',
    '/weekly-target': 'Weekly Target - Dicoding',
    '/new-page': 'New Page - Dicoding',  // Add title
    '/404': '404 - Halaman Tidak Ditemukan',
  };
  document.title = titles[url] || 'Dicoding - Learning Weekly Target';
}
```

## Page Lifecycle

```
User clicks link → Hash changes → hashchange event fired
                ↓
          Show loading state
                ↓
          Parse URL route
                ↓
      Get page component from routes
                ↓
        Call page.render()
                ↓
     Update DOM with HTML
                ↓
      Call page.afterRender()
                ↓
      Update active navigation
                ↓
         Close mobile menus
                ↓
         Scroll to top
                ↓
       Update page title
                ↓
           Page ready!
```

## Performance Features

### ✅ Lazy Loading
- Pages hanya dimuat saat dibutuhkan
- Mengurangi initial bundle size

### ✅ Smooth Transitions
- CSS animations untuk page transitions
- Loading indicators untuk better UX

### ✅ Optimized Re-renders
- Hanya update bagian yang berubah
- Minimize DOM manipulation

## Best Practices

### 1. Keep Pages Modular
```javascript
// ❌ Bad - Everything in one file
const BigPage = {
  async render() {
    return `<div>10000 lines of HTML</div>`;
  }
};

// ✅ Good - Separated components
const ModularPage = {
  async render() {
    return `
      <div>
        ${this._renderHeader()}
        ${this._renderContent()}
        ${this._renderFooter()}
      </div>
    `;
  },
  
  _renderHeader() { /* ... */ },
  _renderContent() { /* ... */ },
  _renderFooter() { /* ... */ }
};
```

### 2. Clean Up Resources
```javascript
const PageWithTimer = {
  _timerId: null,
  
  async afterRender() {
    // Start timer
    this._timerId = setInterval(() => {
      console.log('tick');
    }, 1000);
  },
  
  // Add cleanup method
  cleanup() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  }
};
```

### 3. Handle Errors
```javascript
const SafePage = {
  async afterRender() {
    try {
      await this._loadData();
    } catch (error) {
      console.error('Failed to load data:', error);
      this._showErrorMessage();
    }
  }
};
```

## Debugging Tips

### Check Current Route
```javascript
console.log('Current route:', Router.getCurrentRoute());
console.log('Current hash:', window.location.hash);
```

### Monitor Route Changes
```javascript
window.addEventListener('hashchange', () => {
  console.log('Route changed to:', window.location.hash);
});
```

### Test 404 Page
Navigate to any invalid route:
```
http://localhost:5173/#/this-does-not-exist
```

## Future Enhancements

- [ ] Route guards / authentication
- [ ] Nested routes support
- [ ] Route transitions animations
- [ ] Route metadata (title, description, etc)
- [ ] Breadcrumb navigation
- [ ] Deep linking support
- [ ] State management integration
