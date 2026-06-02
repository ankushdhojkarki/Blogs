/* ============================================
   NAVIGATION & THEME TOGGLE
   ============================================ */

/**
 * Initialize navigation
 */
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Close menu when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.classList.remove('active');
      if (navMenu) navMenu.classList.remove('active');
    });
  });
  
  // Update active link based on current page
  updateActiveNavLink();
  
  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navToggle && navMenu) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    }
  });
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = href === currentPage || 
                    (currentPage === '' && href === 'index.html') ||
                    (href === 'index.html' && currentPage === 'index.html');
    
    if (isActive) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initialize theme toggle
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (!themeToggle) return;
  
  // Set initial theme
  applyTheme(getSavedTheme());
  
  // Theme toggle button
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    setStorage('theme', newTheme);
    updateThemeIcon(newTheme);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const savedTheme = getStorage('theme', 'auto');
    if (savedTheme === 'auto') {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/**
 * Apply theme to document
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  if (theme === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  updateThemeIcon(theme);
}

/**
 * Update theme toggle icon
 * @param {string} theme - Current theme
 */
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const icon = themeToggle.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Get saved theme from storage
 * @returns {string} - Saved theme or 'auto'
 */
function getSavedTheme() {
  const saved = getStorage('theme', 'auto');
  
  if (saved === 'dark' || saved === 'light' || saved === 'auto') {
    return saved;
  }
  
  return 'auto';
}

/**
 * Initialize sticky navbar behavior
 */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let lastScrollTop = 0;
  let isNavbarVisible = true;
  
  window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show navbar when scrolling up, hide when scrolling down
    if (scrollTop < lastScrollTop) {
      // Scrolling up
      if (!isNavbarVisible) {
        navbar.style.transform = 'translateY(0)';
        isNavbarVisible = true;
      }
    } else if (scrollTop > 100) {
      // Scrolling down and past header
      if (isNavbarVisible) {
        navbar.style.transform = 'translateY(-100%)';
        isNavbarVisible = false;
      }
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, 100));
  
  // Add transition
  navbar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

/**
 * Initialize breadcrumb navigation
 */
function initBreadcrumb() {
  const backLink = document.querySelector('.back-link');
  if (!backLink) return;
  
  backLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });
}

/**
 * Initialize all navigation features
 */
function initAllNavigation() {
  initNavigation();
  initThemeToggle();
  initStickyNavbar();
  initBreadcrumb();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllNavigation);
} else {
  initAllNavigation();
}
