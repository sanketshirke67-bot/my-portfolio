// ========== DAY 6 SCRIPT ==========
// (Includes all previous features + new ones)

// --- Preloader ---
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

// --- Scroll Progress Bar ---
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.style.width = scrolled + '%';
});

// --- Mobile Menu Toggle ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// --- Smooth Scroll ---
document.querySelectorAll('.nav-links a, #hero-btn').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// --- Dark/Light Mode Toggle ---
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  if (toggleBtn) toggleBtn.textContent = '☀️';
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
      toggleBtn.textContent = '☀️';
    } else {
      localStorage.setItem('theme', 'dark');
      toggleBtn.textContent = '🌙';
    }
  });
}

// --- Contact Form with Formspree ---
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formFeedback.textContent = "Please fill in all fields.";
      formFeedback.style.color = '#ff6b6b';
      setTimeout(() => formFeedback.textContent = '', 3000);
      return;
    }

    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      formFeedback.textContent = "Thanks! Your message has been sent.";
      formFeedback.style.color = '#e94560';
      contactForm.reset();
    } else {
      formFeedback.textContent = "Oops! Something went wrong. Please try again later.";
      formFeedback.style.color = '#ff6b6b';
    }
    setTimeout(() => formFeedback.textContent = '', 5000);
  });
}

// --- Typing Animation ---
const typingText = document.querySelector('.typing-text');
if (typingText) {
  const phrases = [
    "I build websites.",
    "I love coding.",
    "I learn every day.",
    "Welcome to my portfolio!"
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
  }
  typeEffect();
}

// --- Skill Bar & Percentage Animation ---
const skillProgressBars = document.querySelectorAll('.skill-progress');
const skillPercentSpans = document.querySelectorAll('.skill-percent');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target.getAttribute('data-progress');
      entry.target.style.width = progress + '%';
      const parentCard = entry.target.closest('.skill-card');
      const percentSpan = parentCard.querySelector('.skill-percent');
      let currentPercent = 0;
      const targetPercent = parseInt(progress);
      const increment = targetPercent / 50;
      const interval = setInterval(() => {
        if (currentPercent < targetPercent) {
          currentPercent += increment;
          percentSpan.textContent = Math.min(Math.floor(currentPercent), targetPercent) + '%';
        } else {
          percentSpan.textContent = targetPercent + '%';
          clearInterval(interval);
        }
      }, 20);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillProgressBars.forEach(bar => observer.observe(bar));

// --- Stats Counter ---
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const targetNumber = parseInt(target.getAttribute('data-target'));
      let current = 0;
      const increment = targetNumber / 50;
      const interval = setInterval(() => {
        if (current < targetNumber) {
          current += increment;
          target.textContent = Math.floor(current);
        } else {
          target.textContent = targetNumber;
          clearInterval(interval);
        }
      }, 20);
      statObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(stat => statObserver.observe(stat));

// --- Project Filtering ---
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// --- Project Details Modal (from Day 5) ---
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalLink = document.getElementById('modal-link');
const closeModal = document.querySelector('.close-modal');

const projectDetails = {
  project1: {
    title: "Day 1: Interactive Card",
    description: "A simple interactive card with a click button – my first step into DOM manipulation. Built with HTML, CSS, and JavaScript.",
    link: "#"
  },
  project2: {
    title: "Day 2: Styled Portfolio",
    description: "Added custom Google Fonts, beautiful hover effects, and a clean modern design.",
    link: "#"
  },
  project3: {
    title: "Day 3: Full Portfolio",
    description: "Created a complete multi-section portfolio with navigation, dark mode toggle, and smooth scrolling.",
    link: "#"
  },
  project4: {
    title: "Day 4: Enhanced Portfolio",
    description: "Added skills section, daily learning log, working contact form with Formspree, scroll animations, and mobile menu.",
    link: "#"
  },
  project5: {
    title: "Day 5: Advanced Portfolio",
    description: "Typing animation, project modals, blog section, count-up stats, back-to-top button, and more!",
    link: "#"
  },
  project6: {
    title: "Day 6: Filter + Lightbox",
    description: "Filterable projects, lightbox gallery, testimonials slider, scroll progress bar, preloader, and enhanced UI.",
    link: "#"
  }
};

document.querySelectorAll('.project-detail-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const projectCard = btn.closest('.project-card');
    const projectId = projectCard.getAttribute('data-project');
    const details = projectDetails[projectId];
    if (details && modal) {
      modalTitle.textContent = details.title;
      modalDescription.textContent = details.description;
      modalLink.href = details.link;
      modal.style.display = 'flex';
    }
  });
});

if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// --- Lightbox Gallery ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

document.querySelectorAll('.lightbox-trigger').forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const imgSrc = trigger.getAttribute('data-img');
    if (lightboxImg) {
      lightboxImg.src = imgSrc;
      lightbox.style.display = 'flex';
    }
  });
});

if (closeLightbox) {
  closeLightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// --- Testimonials Slider ---
const testimonialContainer = document.querySelector('.testimonial-container');
const testimonials = document.querySelectorAll('.testimonial');
const prevBtn = document.querySelector('.prev-testimonial');
const nextBtn = document.querySelector('.next-testimonial');
const dotsContainer = document.querySelector('.testimonial-dots');

let currentSlide = 0;
const totalSlides = testimonials.length;

if (testimonials.length && dotsContainer) {
  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function goToSlide(index) {
    currentSlide = index;
    const offset = -currentSlide * 100;
    testimonialContainer.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      if (i === currentSlide) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-slide (optional)
  setInterval(nextSlide, 5000);
}

// --- Back to Top Button ---
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.display = 'flex';
    } else {
      backToTopBtn.style.display = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- Scroll Animations (Fade-in) ---
const fadeElements = document.querySelectorAll('section, .skill-card, .project-card, .timeline-item, .blog-card, .testimonial');
fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => fadeObserver.observe(el));