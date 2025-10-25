// CSS imports
import '../styles/styles.css';

import App from './pages/app';

const app = new App({
  content: document.querySelector('#main-content'),
});

const init = async () => {
  // Render initial page
  await app.renderPage();

  // Listen for hash changes
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Listen for popstate (browser back/forward)
  window.addEventListener('popstate', async () => {
    await app.renderPage();
  });
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
