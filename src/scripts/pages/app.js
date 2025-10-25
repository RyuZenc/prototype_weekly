import WeeklyTargetPage from './weekly-target-page';
import RuntutanPage from './runtutan-page';
import NotFoundPage from './not-found-page';

class App {
  constructor({ content }) {
    this._content = content;
    
    // Sidebar elements
    this._sidebarToggle = document.querySelector('#sidebar-toggle');
    this._sidebar = document.querySelector('#sidebar');
    this._sidebarOverlay = document.querySelector('#sidebar-overlay');
    
    // Mobile nav elements
    this._mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    this._mobileNav = document.querySelector('#mobile-nav');
    this._mobileNavOverlay = document.querySelector('#mobile-nav-overlay');
    this._mobileNavClose = document.querySelector('#mobile-nav-close');

    this._initialAppShell();
  }

  _initialAppShell() {
    // Check if desktop and initialize sidebar state
    this._initializeSidebarState();

    // Toggle sidebar
    if (this._sidebarToggle) {
      this._sidebarToggle.addEventListener('click', () => {
        this._toggleSidebar();
      });
    }

    // Close sidebar when overlay clicked
    if (this._sidebarOverlay) {
      this._sidebarOverlay.addEventListener('click', () => {
        this._closeSidebar();
      });
    }

    // Handle sidebar navigation clicks
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        this._closeSidebar();
      });
    });

    // Toggle mobile navigation
    if (this._mobileMenuToggle) {
      this._mobileMenuToggle.addEventListener('click', () => {
        this._toggleMobileNav();
      });
    }

    // Close mobile nav when overlay clicked
    if (this._mobileNavOverlay) {
      this._mobileNavOverlay.addEventListener('click', () => {
        this._closeMobileNav();
      });
    }

    // Close mobile nav when close button clicked
    if (this._mobileNavClose) {
      this._mobileNavClose.addEventListener('click', () => {
        this._closeMobileNav();
      });
    }

    // Handle navigation clicks - header, sidebar, and mobile nav
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Let hash navigation work naturally, just close menus
        this._closeMobileNav();
        if (window.innerWidth <= 1024) {
          this._closeSidebar();
        }
        
        // Update active state immediately for better UX
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Set initial active menu
    this._updateActiveNav();

    // Prevent default link behavior for smooth SPA navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        // Let the browser handle the hash change naturally
        // Hash change event will trigger renderPage
      }
    });
  }

  _initializeSidebarState() {
    if (!this._sidebar) return;
    
    // On desktop (>1024px), sidebar is open by default
    // On mobile/tablet, sidebar is closed by default
    const isDesktop = window.innerWidth > 1024;
    
    if (isDesktop) {
      // Desktop: sidebar visible by default, no overlay
      document.body.classList.remove('sidebar-closed');
    } else {
      // Mobile/Tablet: sidebar hidden, can be toggled with overlay
      document.body.classList.add('sidebar-closed');
    }

    // Re-check on window resize
    window.addEventListener('resize', () => {
      if (!this._sidebar) return;
      
      const isDesktop = window.innerWidth > 1024;
      if (isDesktop) {
        document.body.classList.remove('sidebar-closed');
        this._closeSidebar(); // Close overlay if open
      } else {
        if (!this._sidebar.classList.contains('open')) {
          document.body.classList.add('sidebar-closed');
        }
      }
    });
  }

  _toggleSidebar() {
    if (!this._sidebar || !this._sidebarOverlay) return;
    
    const isDesktop = window.innerWidth > 1024;
    
    if (isDesktop) {
      // Desktop: toggle sidebar-closed class to push/pull content
      document.body.classList.toggle('sidebar-closed');
      this._sidebar.classList.toggle('open');
    } else {
      // Mobile: toggle sidebar with overlay
      this._sidebar.classList.toggle('open');
      this._sidebarOverlay.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    }
  }

  _closeSidebar() {
    if (!this._sidebar || !this._sidebarOverlay) return;
    
    const isDesktop = window.innerWidth > 1024;
    
    if (!isDesktop) {
      // Only close with overlay on mobile
      this._sidebar.classList.remove('open');
      this._sidebarOverlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  }

  _toggleMobileNav() {
    if (!this._mobileNav || !this._mobileNavOverlay) return;
    
    this._mobileNav.classList.toggle('open');
    this._mobileNavOverlay.classList.toggle('active');
    document.body.classList.toggle('mobile-nav-open');
  }

  _closeMobileNav() {
    if (!this._mobileNav || !this._mobileNavOverlay) return;
    
    this._mobileNav.classList.remove('open');
    this._mobileNavOverlay.classList.remove('active');
    document.body.classList.remove('mobile-nav-open');
  }

  _updateActiveNav() {
    const hash = window.location.hash || '#/';
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  async renderPage() {
    // Show loading state
    this._showLoading();

    try {
      const url = this._parseActiveUrlWithCombiner();
      const routes = this._routes();
      const page = routes[url] || routes['/404'] || routes['/'];
      
      // Render page
      this._content.innerHTML = await page.render();
      
      // Execute after render logic
      if (page.afterRender) {
        await page.afterRender();
      }

      // Update active nav after page render
      this._updateActiveNav();

      // Close mobile nav and sidebar after navigation
      this._closeMobileNav();
      
      // On mobile, close sidebar after navigation
      if (window.innerWidth <= 1024) {
        this._closeSidebar();
      }

      // Scroll to top
      window.scrollTo(0, 0);

      // Update page title
      this._updatePageTitle(url);
    } catch (error) {
      console.error('Error rendering page:', error);
      this._showError();
    }
  }

  _showLoading() {
    this._content.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
        <div style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
          <p style="color: var(--text-light);">Memuat halaman...</p>
        </div>
      </div>
    `;
  }

  _showError() {
    this._content.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 50vh;">
        <div style="text-align: center; max-width: 400px; padding: 2rem;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
          <h2 style="margin-bottom: 1rem; color: var(--text-dark);">Terjadi Kesalahan</h2>
          <p style="color: var(--text-light); margin-bottom: 1.5rem;">
            Maaf, terjadi kesalahan saat memuat halaman.
          </p>
          <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
        </div>
      </div>
    `;
  }

  _updatePageTitle(url) {
    const titles = {
      '/': 'Runtutan Belajar - Dicoding',
      '/weekly-target': 'Weekly Target - Dicoding',
      '/404': '404 - Halaman Tidak Ditemukan',
    };
    document.title = titles[url] || 'Dicoding - Learning Weekly Target';
  }

  _routes() {
    return {
      '/': RuntutanPage,  // Beranda = Runtutan Belajar
      '/weekly-target': WeeklyTargetPage,  // Weekly Target
      '/404': NotFoundPage,  // 404 Page
    };
  }

  _parseActiveUrlWithCombiner() {
    const url = window.location.hash.slice(1).toLowerCase();
    const splitedUrl = this._urlSplitter(url);
    const combineUrl = this._urlCombiner(splitedUrl);

    return combineUrl;
  }

  _urlSplitter(url) {
    const urlsSplits = url.split('/');
    return urlsSplits;
  }

  _urlCombiner(splitedUrl) {
    return splitedUrl.reduce((accumulator, currentValue) => {
      return currentValue ? `${accumulator}/${currentValue}` : accumulator;
    });
  }

  // Helper method for programmatic navigation
  navigateTo(path) {
    window.location.hash = path;
  }

  // Get current route
  getCurrentRoute() {
    return this._parseActiveUrlWithCombiner();
  }
}

export default App;
