/**
 * Simple router utilities for SPA navigation
 */

class Router {
  /**
   * Navigate to a specific route
   * @param {string} path - The path to navigate to (e.g., '/', '/weekly-target')
   */
  static navigateTo(path) {
    window.location.hash = path;
  }

  /**
   * Get the current route path
   * @returns {string} Current route path
   */
  static getCurrentRoute() {
    const hash = window.location.hash || '#/';
    return hash.slice(1);
  }

  /**
   * Go back in browser history
   */
  static goBack() {
    window.history.back();
  }

  /**
   * Go forward in browser history
   */
  static goForward() {
    window.history.forward();
  }

  /**
   * Reload current page
   */
  static reload() {
    window.location.reload();
  }

  /**
   * Add query parameters to current URL
   * @param {Object} params - Object with key-value pairs
   */
  static addQueryParams(params) {
    const currentHash = window.location.hash.split('?')[0];
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      searchParams.set(key, params[key]);
    });
    
    window.location.hash = `${currentHash}?${searchParams.toString()}`;
  }

  /**
   * Get query parameter by name
   * @param {string} name - Parameter name
   * @returns {string|null} Parameter value or null
   */
  static getQueryParam(name) {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    
    if (!queryString) return null;
    
    const params = new URLSearchParams(queryString);
    return params.get(name);
  }

  /**
   * Get all query parameters
   * @returns {Object} Object with all query parameters
   */
  static getAllQueryParams() {
    const hash = window.location.hash;
    const queryString = hash.split('?')[1];
    
    if (!queryString) return {};
    
    const params = new URLSearchParams(queryString);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  }
}

export default Router;
