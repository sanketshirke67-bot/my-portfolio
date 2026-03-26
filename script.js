// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth scroll for navigation links
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

// Dark/Light mode toggle
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
}

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

// Contact form submission (using Formspree)
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(contactForm);
  const response = await fetch(contactForm.action, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  });
  if (response.ok) {
    formFeedback.textContent = "Thanks! Your message has been sent.";
    formFeedback.style.color = '#e94560';
    contactForm.reset();
  } else {
    formFeedback.textContent = "Oops! Something went wrong. Please try again later.";
    formFeedback.style.color = '#ff6b6b';
  }
  setTimeout(() => {
    formFeedback.textContent = '';
  }, 5000);
});

// Skill bars animation on scroll
const skillProgressBars = document.querySelectorAll('.skill-progress');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target.getAttribute('data-progress');
      entry.target.style.width = progress + '%';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

skillProgressBars.forEach(bar => observer.observe(bar));

// Scroll animations for sections (fade-in)
const fadeElements = document.querySelectorAll('section, .skill-card, .project-card, .timeline-item');
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