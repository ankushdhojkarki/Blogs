// ============================================================================
// MAIN INITIALIZATION & GLOBAL FUNCTIONS
// ============================================================================

class App {
  constructor() {
    this.darkMode = this.loadDarkModePreference();
    this.init();
  }

  init() {
    this.setupDarkMode();
    this.loadBlogPosts();
    this.setupPageSpecific();
    this.setupGlobalListeners();
    console.log('[v0] App initialized');
  }

  // ========================================================================
  // DARK MODE
  // ========================================================================

  loadDarkModePreference() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Detect system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  saveDarkModePreference(isDark) {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }

  setupDarkMode() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    }

    // Dark mode toggle button
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
      this.updateDarkModeButton();
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        this.darkMode = e.matches;
        this.applyDarkMode();
      }
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.applyDarkMode();
    this.saveDarkModePreference(this.darkMode);
  }

  applyDarkMode() {
    if (this.darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    this.updateDarkModeButton();
  }

  updateDarkModeButton() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (toggle) {
      toggle.innerHTML = this.darkMode ? '☀️' : '🌙';
      toggle.setAttribute('aria-label', this.darkMode ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // ========================================================================
  // BLOG POSTS MANAGEMENT
  // ========================================================================

  loadBlogPosts() {
    // Load and render posts on blog page
    const blogGrid = document.querySelector('.posts-list');
    if (blogGrid && window.blogData) {
      this.renderBlogPosts(blogData.posts, blogGrid);
    }

    // Load featured posts on home page
    const featuredContainer = document.querySelector('.featured-posts .posts-grid');
    if (featuredContainer && window.blogData) {
      const featured = blogData.posts.slice(0, 3);
      this.renderBlogPosts(featured, featuredContainer);
    }

    // Load single post on detail page
    const postDetail = document.querySelector('.post-detail');
    if (postDetail && window.blogData) {
      this.renderSinglePost();
    }
  }

  renderBlogPosts(posts, container) {
    container.innerHTML = '';

    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card animate-on-scroll';
      card.innerHTML = `
        <div class="post-card-image" style="background: linear-gradient(135deg, ${post.color1}, ${post.color2});">
          <span class="post-date">${this.formatDate(post.date)}</span>
        </div>
        <div class="post-card-content">
          <div class="post-card-category">
            <span>${post.category}</span>
          </div>
          <h3 class="post-card-title">${post.title}</h3>
          <p class="post-card-excerpt">${post.excerpt}</p>
          <div class="post-card-meta">
            <span class="post-author">By ${post.author}</span>
            <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `post.html?id=${post.id}`;
      });

      container.appendChild(card);
    });
  }

  renderSinglePost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id')) || 1;

    const post = blogData.posts.find(p => p.id === postId);
    if (!post) return;

    // Update page title
    document.title = `${post.title} - A Quiet Corner`;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = post.excerpt;

    // Render post
    const postContainer = document.querySelector('.post-detail');
    if (postContainer) {
      postContainer.innerHTML = `
        <article class="post-article">
          <header class="post-header">
            <div class="breadcrumb">
              <a href="blog.html">← Back to Blog</a>
            </div>
            <h1 class="post-title-large">${post.title}</h1>
            <div class="post-meta">
              <span class="post-date">${this.formatDate(post.date)}</span>
              <span class="reading-time">${Math.ceil(post.content.split(/\s+/).length / 200)} min read</span>
              <span class="post-category-badge">${post.category}</span>
            </div>
            <div class="post-hero" style="background: linear-gradient(135deg, ${post.color1}, ${post.color2});"></div>
          </header>

          <main class="post-content">
            ${post.content}
          </main>

          <footer class="post-footer-detail">
            <div class="post-author-info">
              <p><strong>${post.author}</strong></p>
              <p>Writing about code, books, games, and life.</p>
            </div>

            <div class="post-share">
              <h4>Share this post:</h4>
              <div class="share-buttons">
                <button class="share-btn" data-copy="${window.location.href}" title="Copy link">
                  🔗 Copy link
                </button>
                <a href="https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}" class="share-btn" target="_blank">
                  𝕏 Tweet
                </a>
              </div>
            </div>
          </footer>

          <nav class="post-navigation">
            ${this.getAdjacentPosts(postId, 'prev')}
            ${this.getAdjacentPosts(postId, 'next')}
          </nav>
        </article>
      `;
    }
  }

  getAdjacentPosts(currentId, direction) {
    const posts = blogData.posts;
    const currentIndex = posts.findIndex(p => p.id === currentId);

    let adjacentPost = null;
    let label = '';
    let link = '';

    if (direction === 'prev' && currentIndex > 0) {
      adjacentPost = posts[currentIndex - 1];
      label = '← Previous Post';
      link = `post.html?id=${adjacentPost.id}`;
    } else if (direction === 'next' && currentIndex < posts.length - 1) {
      adjacentPost = posts[currentIndex + 1];
      label = 'Next Post →';
      link = `post.html?id=${adjacentPost.id}`;
    }

    if (adjacentPost) {
      return `
        <a href="${link}" class="adjacent-post adjacent-${direction}">
          <span>${label}</span>
          <strong>${adjacentPost.title}</strong>
        </a>
      `;
    }
    return '';
  }

  // ========================================================================
  // PAGE-SPECIFIC SETUP
  // ========================================================================

  setupPageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    switch (currentPage) {
      case 'index.html':
      case '':
        this.setupHomePage();
        break;
      case 'blog.html':
        this.setupBlogPage();
        break;
      case 'post.html':
        this.setupPostPage();
        break;
      case 'about.html':
        this.setupAboutPage();
        break;
      case 'contact.html':
        this.setupContactPage();
        break;
    }
  }

  setupHomePage() {
    // Setup home page specific features
    const cta = document.querySelector('.hero-cta');
    if (cta) {
      cta.addEventListener('click', () => {
        window.location.href = 'blog.html';
      });
    }
  }

  setupBlogPage() {
    // Setup filtering by category
    const categoryPills = document.querySelectorAll('.category-filter');
    categoryPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const category = pill.dataset.category;
        this.filterPostsByCategory(category);
      });
    });
  }

  setupPostPage() {
    // Already handled in renderSinglePost
  }

  setupAboutPage() {
    // About page specific setup
  }

  setupContactPage() {
    // Contact form is handled by InteractiveElements
  }

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  filterPostsByCategory(category) {
    const filtered = category === 'all' 
      ? blogData.posts 
      : blogData.posts.filter(p => p.category === category);

    const blogGrid = document.getElementById('blog-grid');
    if (blogGrid) {
      this.renderBlogPosts(filtered, blogGrid);
    }
  }

  formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  setupGlobalListeners() {
    // Global scroll-to-top button
    const scrollTop = document.querySelector('.scroll-to-top');
    if (scrollTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          scrollTop.classList.add('visible');
        } else {
          scrollTop.classList.remove('visible');
        }
      });

      scrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
