// Helper untuk manipulasi DOM
export class DOMHelper {
  // Membuat element dengan class dan atribut opsional
  // Contoh: createElement('div', { classes: 'btn', attrs: {id: 'myBtn'}, text: 'Klik' })
  static createElement(tag, options = {}) {
    const element = document.createElement(tag);
    
    if (options.classes) {
      const classes = Array.isArray(options.classes) ? options.classes : [options.classes];
      element.classList.add(...classes);
    }
    
    if (options.attrs) {
      Object.entries(options.attrs).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
    
    if (options.text) {
      element.textContent = options.text;
    }
    
    if (options.html) {
      element.innerHTML = options.html;
    }
    
    return element;
  }

  // Shorthand untuk querySelector
  static query(selector, parent = document) {
    return parent.querySelector(selector);
  }

  // Shorthand untuk querySelectorAll
  static queryAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
  }

  // Menambahkan event listener
  static on(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
  }

  // Menghapus event listener
  static off(element, event, handler) {
    element.removeEventListener(event, handler);
  }

  // Toggle class pada element
  static toggleClass(element, className, force) {
    element.classList.toggle(className, force);
  }

  // Menampilkan element dengan menghapus class 'hidden'
  static show(element) {
    element.classList.remove('hidden');
  }

  // Menyembunyikan element dengan menambahkan class 'hidden'
  static hide(element) {
    element.classList.add('hidden');
  }

  // Mengosongkan element dengan menghapus semua child
  static empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Menambahkan beberapa child sekaligus ke parent
  static appendChildren(parent, children) {
    children.forEach(child => parent.appendChild(child));
  }
}
