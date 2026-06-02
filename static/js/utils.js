/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-US', options);
}

/**
 * Calculate reading time based on word count
 * @param {string} text - Text content
 * @returns {string} - Reading time in minutes
 */
function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Get query parameters from URL
 * @returns {object} - Query parameters
 */
function getQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });
  
  return params;
}

/**
 * Set query parameter in URL
 * @param {string} key - Parameter key
 * @param {string} value - Parameter value
 */
function setQueryParam(key, value) {
  const params = getQueryParams();
  params[key] = value;
  
  const queryString = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  
  const newUrl = queryString ? `?${queryString}` : window.location.pathname;
  window.history.pushState(null, '', newUrl);
}

/**
 * Check if element is in viewport
 * @param {element} element - DOM element
 * @returns {boolean}
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

/**
 * Smooth scroll to element
 * @param {element} element - Target element
 * @param {number} offset - Offset from top in pixels
 */
function smoothScrollTo(element, offset = 0) {
  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/**
 * Add scroll animation observer
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} className - Class to add when in view
 */
function observeScrollAnimations(selector = '.animate-on-scroll', className = 'in-view') {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(className);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  elements.forEach(element => observer.observe(element));
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {function} - Throttled function
 */
function throttle(func, delay) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      func.apply(this, args);
      lastCall = now;
    }
  };
}

/**
 * Get localStorage with fallback
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*}
 */
function getStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('[v0] Storage error:', error);
    return defaultValue;
  }
}

/**
 * Set localStorage with fallback
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('[v0] Storage error:', error);
  }
}

/**
 * Create element with classes
 * @param {string} tag - HTML tag
 * @param {string} classes - CSS classes
 * @param {object} attributes - HTML attributes
 * @returns {element} - DOM element
 */
function createElement(tag, classes = '', attributes = {}) {
  const element = document.createElement(tag);
  if (classes) element.className = classes;
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  
  return element;
}

/**
 * Safely parse HTML string
 * @param {string} htmlString - HTML string
 * @returns {element} - DOM element
 */
function parseHTML(htmlString) {
  const container = document.createElement('div');
  container.innerHTML = htmlString;
  return container.firstElementChild || container;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (error) {
    console.error('[v0] Copy failed:', error);
    return false;
  }
}

/**
 * Create a unique ID
 * @returns {string}
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add event listener with cleanup
 * @param {element} element - Target element
 * @param {string} event - Event name
 * @param {function} handler - Handler function
 * @returns {function} - Cleanup function
 */
function addEventListener(element, event, handler) {
  element.addEventListener(event, handler);
  return () => element.removeEventListener(event, handler);
}

/**
 * Wait for time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Capitalize string
 * @param {string} str - String to capitalize
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sort array of objects by key
 * @param {array} arr - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {array} - Sorted array
 */
function sortBy(arr, key, order = 'asc') {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Detect device type
 * @returns {string} - 'mobile', 'tablet', or 'desktop'
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Check if dark mode is enabled
 * @returns {boolean}
 */
function isDarkMode() {
  const theme = getStorage('theme', 'auto');
  
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Number of bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
