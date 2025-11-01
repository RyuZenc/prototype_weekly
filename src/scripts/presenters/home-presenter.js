// Presenter for Home page
class HomePresenter {
  constructor(view) {
    this._view = view;
  }

  async init() {
    const learningPaths = this._getLearningPaths();
    this._view.displayLearningPaths(learningPaths);
    this._attachEventListeners();
  }

  _getLearningPaths() {
    // Data learning paths - bisa diganti dengan API call
    return [
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
          {
            id: 2,
            title: 'Belajar Dasar Pemrograman JavaScript',
            completed: true
          },
          {
            id: 3,
            title: 'Belajar Back-End Pemula dengan JavaScript',
            completed: true
          }
        ],
        icon: '<i class="fa fa-graduation-cap"></i>',
        status: 'active'
      },
      {
        id: 2,
        title: 'Front-End Web Developer',
        deadline: '15 Maret 2026 - 23:59',
        daysRemaining: 141,
        courses: [
          {
            id: 1,
            title: 'Belajar Dasar Pemrograman Web',
            completed: true
          },
          {
            id: 2,
            title: 'Belajar Fundamental Front-End Web Development',
            completed: false
          },
          {
            id: 3,
            title: 'Belajar Membuat Front-End Web untuk Pemula',
            completed: false
          }
        ],
        icon: '<i class="fa fa-graduation-cap"></i>',
        status: 'active'
      },
      {
        id: 3,
        title: 'Machine Learning Developer',
        deadline: '30 April 2026 - 23:59',
        daysRemaining: 187,
        courses: [
          {
            id: 1,
            title: 'Belajar Dasar Visualisasi Data',
            completed: false
          },
          {
            id: 2,
            title: 'Memulai Pemrograman dengan Python',
            completed: false
          },
          {
            id: 3,
            title: 'Belajar Machine Learning untuk Pemula',
            completed: false
          }
        ],
        icon: '<i class="fa fa-graduation-cap"></i>',
        status: 'not-started'
      }
    ];
  }

  _attachEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.learning-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this._handleTabSwitch(e.target.dataset.tab);
      });
    });

    // Course item click
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach(item => {
      item.addEventListener('click', () => {
        const courseId = item.dataset.courseId;
        this._handleCourseClick(courseId);
      });
    });

    // Learning path click
    const pathCards = document.querySelectorAll('.learning-path-card');
    pathCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.course-item')) {
          const pathId = card.dataset.pathId;
          this._handlePathClick(pathId);
        }
      });
    });
  }

  _handleTabSwitch(tabName) {
    // Remove active class from all tabs
    document.querySelectorAll('.learning-tab').forEach(tab => {
      tab.classList.remove('active');
    });

    // Add active class to clicked tab
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // Filter learning paths based on tab
    const learningPaths = this._getLearningPaths();
    let filteredPaths;

    if (tabName === 'semua') {
      // Show all paths (default)
      filteredPaths = learningPaths;
    } else if (tabName === 'diselesaikan') {
      // Show only paths where all courses are completed
      filteredPaths = learningPaths.filter(path => 
        path.courses.every(course => course.completed)
      );
    } else {
      filteredPaths = learningPaths;
    }

    this._view.displayLearningPaths(filteredPaths);
    this._attachEventListeners(); // Re-attach after re-render
  }

  _handleCourseClick(courseId) {
    console.log('Course clicked:', courseId);
    // Navigate to course detail or open course
    alert(`Membuka kelas ID: ${courseId}`);
  }

  _handlePathClick(pathId) {
    console.log('Learning path clicked:', pathId);
    // Navigate to learning path detail
    alert(`Membuka learning path ID: ${pathId}`);
  }

  getCompletionStats() {
    const paths = this._getLearningPaths();
    let totalCourses = 0;
    let completedCourses = 0;

    paths.forEach(path => {
      totalCourses += path.courses.length;
      completedCourses += path.courses.filter(c => c.completed).length;
    });

    return {
      totalPaths: paths.length,
      activePaths: paths.filter(p => p.status === 'active').length,
      totalCourses,
      completedCourses,
      completionPercentage: Math.round((completedCourses / totalCourses) * 100)
    };
  }
}

export default HomePresenter;
