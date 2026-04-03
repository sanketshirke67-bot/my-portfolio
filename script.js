// ==================== INITIAL SETUP ====================
// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

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

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').substring(1);
    if (targetId === '') return;
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Hero button scroll to projects
document.getElementById('hero-btn').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

// ==================== DARK/LIGHT MODE with System Preference ====================
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
let savedTheme = localStorage.getItem('theme');
if (!savedTheme) {
  savedTheme = prefersDark ? 'dark' : 'light';
}
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  toggleBtn.textContent = '☀️';
} else {
  body.classList.remove('light-mode');
  toggleBtn.textContent = '🌙';
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

// ==================== TYPING ANIMATION ====================
const typingText = document.querySelector('.typing-text');
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

// ==================== STATS COUNTER ====================
const statNumbers = document.querySelectorAll('.stat-number:not(#visitor-count)');
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

// ==================== CIRCULAR SKILLS ====================
const circularProgresses = document.querySelectorAll('.circular-progress');
const circularObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progress = entry.target.getAttribute('data-progress');
      const percentSpan = entry.target.querySelector('.skill-percent');
      let currentPercent = 0;
      const targetPercent = parseInt(progress);
      const increment = targetPercent / 50;
      const interval = setInterval(() => {
        if (currentPercent < targetPercent) {
          currentPercent += increment;
          const percentVal = Math.min(Math.floor(currentPercent), targetPercent);
          percentSpan.textContent = percentVal + '%';
          const deg = (percentVal / 100) * 360;
          entry.target.style.background = `conic-gradient(#e94560 ${deg}deg, ${body.classList.contains('light-mode') ? '#ddd' : '#333'} ${deg}deg)`;
        } else {
          percentSpan.textContent = targetPercent + '%';
          const deg = targetPercent / 100 * 360;
          entry.target.style.background = `conic-gradient(#e94560 ${deg}deg, ${body.classList.contains('light-mode') ? '#ddd' : '#333'} ${deg}deg)`;
          clearInterval(interval);
        }
      }, 20);
      circularObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
circularProgresses.forEach(progress => circularObserver.observe(progress));

// ==================== GITHUB PROJECTS (with Load More & Search) ====================
const githubUsername = 'sanketshirke67-bot'; // CHANGE TO YOUR USERNAME
const projectsContainer = document.getElementById('github-projects');
let allRepos = [];
let displayedCount = 6;
const loadMoreBtn = document.getElementById('load-more-btn');
const searchInput = document.getElementById('project-search');
let currentFilter = 'all';
let currentSearch = '';

async function fetchGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error('GitHub API error');
    allRepos = await response.json();
    displayedCount = 6;
    applyFiltersAndRender();
  } catch (error) {
    projectsContainer.innerHTML = '<div class="loader">Failed to load GitHub projects. Please check your username or try again later.</div>';
  }
}

function filterReposByLanguage(repos, language) {
  if (language === 'all') return repos;
  return repos.filter(repo => repo.language === language);
}

function filterReposBySearch(repos, query) {
  if (!query) return repos;
  const lowerQuery = query.toLowerCase();
  return repos.filter(repo => repo.name.toLowerCase().includes(lowerQuery) || 
    (repo.description && repo.description.toLowerCase().includes(lowerQuery)));
}

function getFilteredRepos() {
  let filtered = filterReposByLanguage(allRepos, currentFilter);
  filtered = filterReposBySearch(filtered, currentSearch);
  return filtered;
}

function renderProjects() {
  const filtered = getFilteredRepos();
  const toDisplay = filtered.slice(0, displayedCount);
  if (toDisplay.length === 0) {
    projectsContainer.innerHTML = '<div class="loader">No projects match your criteria.</div>';
    loadMoreBtn.style.display = 'none';
    return;
  }
  projectsContainer.innerHTML = '';
  toDisplay.forEach(repo => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-language', repo.language || 'Unknown');
    card.innerHTML = `
      <i class="fab fa-github"></i>
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description provided.'}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
    `;
    projectsContainer.appendChild(card);
  });
  if (filtered.length > displayedCount) {
    loadMoreBtn.style.display = 'inline-block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

function applyFiltersAndRender() {
  displayedCount = 6;
  renderProjects();
}

function loadMore() {
  const filtered = getFilteredRepos();
  if (displayedCount < filtered.length) {
    displayedCount += 6;
    renderProjects();
  }
}

// Filter buttons
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    applyFiltersAndRender();
  });
});

// Search input
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  applyFiltersAndRender();
});

loadMoreBtn.addEventListener('click', loadMore);

fetchGitHubRepos();

// ==================== TESTIMONIALS CAROUSEL ====================
const slides = document.querySelectorAll('.testimonial-card');
const slideContainer = document.querySelector('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let slideInterval;

function updateCarousel() {
  const slideWidth = slides[0].clientWidth;
  slideContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    if (idx === currentIndex) dot.classList.add('active');
    else dot.classList.remove('active');
  });
}

function createDots() {
  dotsContainer.innerHTML = '';
  slides.forEach((_, idx) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (idx === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      currentIndex = idx;
      updateCarousel();
      startAutoSlide();
    });
    dotsContainer.appendChild(dot);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

prevBtn.addEventListener('click', () => {
  clearInterval(slideInterval);
  prevSlide();
  startAutoSlide();
});
nextBtn.addEventListener('click', () => {
  clearInterval(slideInterval);
  nextSlide();
  startAutoSlide();
});

window.addEventListener('resize', () => {
  updateCarousel();
});

createDots();
startAutoSlide();

// ==================== PARTICLE BACKGROUND ====================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = (Math.random() - 0.5) * 1;
    this.color = `rgba(233, 69, 96, ${Math.random() * 0.5 + 0.2})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==================== BACK TO TOP ====================
const backToTopBtn = document.getElementById('back-to-top');
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

// ==================== SCROLL PROGRESS INDICATOR ====================
const progressCircle = document.querySelector('.progress-ring-circle');
const scrollPercentSpan = document.querySelector('.scroll-percent');
const radius = 26;
const circumference = 2 * Math.PI * radius;
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
  scrollPercentSpan.textContent = `${Math.floor(percent)}%`;
}

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = (scrollTop / docHeight) * 100;
  setProgress(percent);
});

// Click on progress to scroll to top
document.querySelector('.scroll-progress').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== SCROLL ANIMATIONS ====================
const fadeElements = document.querySelectorAll('section, .skill-card, .project-card, .timeline-item, .blog-card');
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

// ==================== VISITOR COUNTER ====================
async function updateVisitorCount() {
  const visitorSpan = document.getElementById('visitor-count');
  const namespace = 'sanket_portfolio_day8';
  const key = 'visitors';
  try {
    const response = await fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`);
    const data = await response.json();
    visitorSpan.textContent = data.value;
  } catch (error) {
    console.error('Visitor counter failed', error);
    visitorSpan.textContent = '?';
  }
}
updateVisitorCount();

// ==================== TOAST NOTIFICATION SYSTEM ====================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// ==================== EMAILJS CONTACT FORM ====================
// Initialize EmailJS with your public key (replace with yours)
emailjs.init({
  publicKey: 'YOUR_PUBLIC_KEY', // Get from https://dashboard.emailjs.com/admin/account
});

const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all fields.', 'error');
    return;
  }

  const templateParams = {
    from_name: name,
    from_email: email,
    message: message,
    to_name: 'Sanket',
  };

  try {
    const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    if (response.status === 200) {
      showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else {
      throw new Error('EmailJS error');
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    showToast('Oops! Failed to send. Please try again later.', 'error');
  }
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorFollower.style.left = e.clientX + 'px';
  cursorFollower.style.top = e.clientY + 'px';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.display = 'none';
  cursorFollower.style.display = 'none';
});
document.addEventListener('mouseenter', () => {
  cursor.style.display = 'block';
  cursorFollower.style.display = 'block';
});