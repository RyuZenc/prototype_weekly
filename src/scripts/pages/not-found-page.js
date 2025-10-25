const NotFoundPage = {
  async render() {
    return `
      <div style="display: flex; justify-content: center; align-items: center; min-height: 60vh;">
        <div style="text-align: center; max-width: 500px; padding: 2rem;">
          <div style="font-size: 6rem; margin-bottom: 1rem;">🔍</div>
          <h1 style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-dark);">404</h1>
          <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-dark);">
            Halaman Tidak Ditemukan
          </h2>
          <p style="color: var(--text-light); margin-bottom: 2rem; line-height: 1.6;">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <a href="#/" class="btn btn-primary">
              🏠 Kembali ke Beranda
            </a>
            <a href="#/weekly-target" class="btn" style="background: var(--secondary-color); color: var(--white);">
              📅 Weekly Target
            </a>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    // No additional logic needed for 404 page
  }
};

export default NotFoundPage;
