// ============================================================================
// SCROLL ANIMATIONS & INTERACTIVE EFFECTS
// ============================================================================

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.scrollProgress = 0;
    this.initObserver();
    this.setupScrollListener();
    this.setupParallax();
  }

  // Setup Intersection Observer for fade-in animations
  initObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll, .post-card, .section-title, .timeline-item').forEach(el => {
      this.observer.observe(el);
    });
  }

  // Track scroll progress
  setupScrollListener() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      this.scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      // Update scroll progress bar if it exists
      const progressBar = document.querySelector('.scroll-progress');
      if (progressBar) {
        progressBar.style.width = this.scrollProgress + '%';
      }

      // Parallax effect
      this.updateParallax();
    });
  }

  // Parallax effect for hero images
  setupParallax() {
    this.parallaxElements = document.querySelectorAll('[data-parallax]');
  }

  updateParallax() {
    this.parallaxElements.forEach(el => {
      const speed = el.dataset.parallax || 0.5;
      const yPos = window.scrollY * speed;
      el.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// ============================================================================
// INTERACTIVE ELEMENTS
// ============================================================================

class InteractiveElements {
  constructor() {
    this.setupHoverEffects();
    this.setupFormInteractions();
    this.setupButtonRipple();
  }

  setupHoverEffects() {
    // Card hover effects
    document.querySelectorAll('.post-card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });

    // Category pill hover
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('mouseenter', function() {
        this.style.background = 'var(--accent)';
        this.style.color = 'var(--bg)';
      });

      pill.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
        this.style.color = 'var(--accent)';
      });
    });
  }

  setupFormInteractions() {
    // Form input focus effects
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('form-focused');
      });

      input.addEventListener('blur', function() {
        if (!this.value) {
          this.parentElement.classList.remove('form-focused');
        }
      });

      // Validate on input
      input.addEventListener('input', function() {
        if (this.value) {
          this.parentElement.classList.add('form-focused');
        }
      });
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(contactForm);
      });
    }
  }

  handleContactForm(form) {
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;

    if (!name || !email || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Show success message
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Message Sent! ✓';
    submitBtn.disabled = true;

    // Reset form
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('form-focused');
      });
    }, 2000);
  }

  setupButtonRipple() {
    document.querySelectorAll('.btn, button').forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }
}

// ============================================================================
// ADVANCED EFFECTS
// ============================================================================

class AdvancedEffects {
  constructor() {
    this.setupMouseGlow();
    this.setupCopyToClipboard();
    this.setupReadingProgress();
  }

  setupMouseGlow() {
    const glow = document.querySelector('.mouse-glow');
    if (!glow) return;

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseenter', () => {
      glow.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  }

  setupCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(element => {
      element.addEventListener('click', function() {
        const text = this.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          const original = this.textContent;
          this.textContent = 'Copied! ✓';
          setTimeout(() => {
            this.textContent = original;
          }, 2000);
        });
      });
    });
  }

  setupReadingProgress() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const readingTime = Math.ceil(postContent.textContent.split(/\s+/).length / 200);
    const readingProgressEl = document.querySelector('.reading-time');
    if (readingProgressEl) {
      readingProgressEl.textContent = `${readingTime} min read`;
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
  new InteractiveElements();
  new AdvancedEffects();

  console.log('[v0] Animations initialized');
});
