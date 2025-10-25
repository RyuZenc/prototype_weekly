import RuntutanPresenter from '../presenters/runtutan-presenter';

const RuntutanPage = {
  _presenter: null,

  async render() {
    return `
      <div class="runtutan-page">
        <!-- Header Section -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">📚 Runtutan Belajar</h1>
            <p class="page-subtitle">Kelola dan lacak progress pembelajaran Anda di Dicoding</p>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-overview" id="stats-overview">
          <!-- Will be populated by presenter -->
        </div>

        <!-- Tabs -->
        <div class="learning-tabs">
          <button class="learning-tab active" data-tab="semua">Kelas yang Dipelajari</button>
          <button class="learning-tab" data-tab="diselesaikan">Kelas yang Diselesaikan</button>
        </div>

        <!-- Learning Paths Container -->
        <div class="learning-paths-container" id="learning-paths-container">
          <!-- Will be populated by presenter -->
        </div>
      </div>
    `;
  },

  async afterRender() {
    // Initialize presenter with view methods
    this._presenter = new RuntutanPresenter(this);
    await this._presenter.init();
    this._displayStats();
  },

  // View methods called by presenter
  displayLearningPaths(paths) {
    const container = document.getElementById('learning-paths-container');
    if (!container) return;

    if (paths.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3>Belum ada kelas</h3>
          <p>Mulai perjalanan belajar Anda dengan mendaftar kelas di Dicoding!</p>
          <a href="#/" class="btn btn-primary">Jelajahi Kelas</a>
        </div>
      `;
      return;
    }

    container.innerHTML = paths.map(path => `
      <div class="learning-path-card" data-path-id="${path.id}">
        <div class="path-header">
          <div class="path-icon">${path.icon}</div>
          <div class="path-info">
            <h2 class="path-title">${path.title}</h2>
            <div class="path-deadline">
              <span class="deadline-icon">⏰</span>
              Deadline belajar seluruh kelas: <strong>${path.deadline}</strong>
              <span class="days-remaining">(${path.daysRemaining} hari lagi)</span>
            </div>
          </div>
        </div>

        <div class="courses-list">
          ${path.courses.map(course => `
            <div class="course-item ${course.completed ? 'completed' : ''}" data-course-id="${course.id}">
              <div class="course-status-icon">
                ${course.completed ? 
                  '<span class="check-icon">✓</span>' : 
                  '<span class="empty-icon">○</span>'
                }
              </div>
              <div class="course-title">${course.title}</div>
              <div class="course-action">
                ${course.completed ? 
                  '<span class="badge-completed">Selesai</span>' : 
                  '<span class="badge-ongoing">Sedang Belajar</span>'
                }
              </div>
            </div>
          `).join('')}
        </div>

        <div class="path-progress">
          <div class="progress-info">
            <span>Progress: ${path.courses.filter(c => c.completed).length}/${path.courses.length} kelas</span>
            <span>${Math.round((path.courses.filter(c => c.completed).length / path.courses.length) * 100)}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${(path.courses.filter(c => c.completed).length / path.courses.length) * 100}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  _displayStats() {
    const stats = this._presenter.getCompletionStats();
    const statsContainer = document.getElementById('stats-overview');
    
    if (!statsContainer) return;

    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <h3>${stats.totalPaths}</h3>
          <p>Total Learning Path</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📖</div>
        <div class="stat-info">
          <h3>${stats.activePaths}</h3>
          <p>Path Aktif</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>${stats.completedCourses}/${stats.totalCourses}</h3>
          <p>Kelas Selesai</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <h3>${stats.completionPercentage}%</h3>
          <p>Progress Keseluruhan</p>
        </div>
      </div>
    `;
  }
};

export default RuntutanPage;
