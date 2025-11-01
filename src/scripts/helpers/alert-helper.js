// Helper untuk menampilkan alert custom di website

export class AlertHelper {
  // Menampilkan alert sukses
  static showSuccess(message, duration = 3000) {
    this._showAlert(message, 'success', duration);
  }

  // Menampilkan alert error
  static showError(message, duration = 3000) {
    this._showAlert(message, 'error', duration);
  }

  // Menampilkan alert info
  static showInfo(message, duration = 3000) {
    this._showAlert(message, 'info', duration);
  }

  // Membuat dan menampilkan alert
  static _showAlert(message, type, duration) {
    // Buat container alert jika belum ada
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
      alertContainer = document.createElement('div');
      alertContainer.className = 'alert-container';
      document.body.appendChild(alertContainer);
    }

    // Buat elemen alert
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    
    // Icon berdasarkan tipe
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    alert.innerHTML = `
      <span class="alert-icon">${icons[type]}</span>
      <span class="alert-message">${message}</span>
    `;

    // Tambahkan ke container
    alertContainer.appendChild(alert);

    // Animasi muncul
    setTimeout(() => {
      alert.classList.add('show');
    }, 10);

    // Hapus setelah duration
    setTimeout(() => {
      alert.classList.remove('show');
      setTimeout(() => {
        alert.remove();
        
        // Hapus container jika kosong
        if (alertContainer.children.length === 0) {
          alertContainer.remove();
        }
      }, 300);
    }, duration);
  }
}
