// ==================== INITIAL SETUP ====================
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

document.getElementById('hero-btn').addEventListener('click', () => {
  document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

// ==================== DARK/LIGHT MODE ====================
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;
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
const phrases = ["I build websites.", "I love coding.", "I learn every day.", "Welcome to my portfolio!"];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
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

// ==================== GITHUB PROJECTS (with Skeleton Loader) ====================
const githubUsername = 'sanketshirke67-bot'; // CHANGE TO YOUR USERNAME
const projectsContainer = document.getElementById('github-projects');
let allRepos = [];
let displayedCount = 6;
const loadMoreBtn = document.getElementById('load-more-btn');
const searchInput = document.getElementById('project-search');
let currentFilter = 'all';
let currentSearch = '';

function showSkeletons() {
  projectsContainer.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    projectsContainer.appendChild(skeleton);
  }
}

async function fetchGitHubRepos() {
  showSkeletons();
  try {
    const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error('GitHub API error');
    allRepos = await response.json();
    displayedCount = 6;
    applyFiltersAndRender();
    const lastUpdatedSpan = document.getElementById('last-updated');
    if (lastUpdatedSpan) {
      const now = new Date();
      lastUpdatedSpan.textContent = `Last updated: ${now.toLocaleString()}`;
    }
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
  return repos.filter(repo => repo.name.toLowerCase().includes(lowerQuery) || (repo.description && repo.description.toLowerCase().includes(lowerQuery)));
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
    card.innerHTML = `<i class="fab fa-github"></i><h3>${repo.name}</h3><p>${repo.description || 'No description provided.'}</p><a href="${repo.html_url}" target="_blank">View on GitHub →</a>`;
    projectsContainer.appendChild(card);
  });
  if (filtered.length > displayedCount) loadMoreBtn.style.display = 'inline-block';
  else loadMoreBtn.style.display = 'none';
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
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    applyFiltersAndRender();
  });
});
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
  slideInterval = setInterval(() => { nextSlide(); }, 5000);
}
prevBtn.addEventListener('click', () => { clearInterval(slideInterval); prevSlide(); startAutoSlide(); });
nextBtn.addEventListener('click', () => { clearInterval(slideInterval); nextSlide(); startAutoSlide(); });
window.addEventListener('resize', () => { updateCarousel(); });
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
  for (let i = 0; i < 100; i++) particles.push(new Particle());
}
initParticles();
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==================== BACK TO TOP & SCROLL PROGRESS ====================
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) backToTopBtn.style.display = 'flex';
  else backToTopBtn.style.display = 'none';
});
backToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
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
  const namespace = 'sanket_portfolio_day11';
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

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ==================== EMAILJS CONTACT FORM ====================
emailjs.init({ publicKey: 'YOUR_PUBLIC_KEY' });
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
  const templateParams = { from_name: name, from_email: email, message: message, to_name: 'Sanket' };
  try {
    const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    if (response.status === 200) {
      showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
    } else throw new Error('EmailJS error');
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
document.addEventListener('mouseleave', () => {
  cursor.style.display = 'none';
  cursorFollower.style.display = 'none';
});
document.addEventListener('mouseenter', () => {
  cursor.style.display = 'block';
  cursorFollower.style.display = 'block';
});

// ==================== GITHUB ACTIVITY (PRs, Issues, Code Reviews) with Demo Fallback ====================
const repoInput = document.getElementById('repo-input');
const refreshBtn = document.getElementById('refresh-activity');
const prOpenSpan = document.getElementById('pr-open');
const prClosedSpan = document.getElementById('pr-closed');
const prProgressBar = document.getElementById('pr-progress');
const issuesOpenSpan = document.getElementById('issues-open');
const issuesClosedSpan = document.getElementById('issues-closed');
const issuesProgressBar = document.getElementById('issues-progress');
const reviewReviewedSpan = document.getElementById('review-reviewed');
const reviewPendingSpan = document.getElementById('review-pending');
const reviewProgressBar = document.getElementById('review-progress');

// Demo data (fallback)
const demoPRs = { open: 3, closed: 7 };
const demoIssues = { open: 2, closed: 5 };
const demoReviews = { reviewed: 2, pending: 1 };

// GitHub token (optional but recommended)
const GITHUB_TOKEN = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';

async function githubFetch(url, token = null) {
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (token && token !== 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN') {
    headers['Authorization'] = `token ${token}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
  return response.json();
}

async function fetchGitHubActivity() {
  const repo = repoInput.value.trim();
  if (!repo) {
    showToast('Please enter a repository (format: owner/repo)', 'error');
    return;
  }

  // Loading state
  prOpenSpan.textContent = '...';
  prClosedSpan.textContent = '...';
  issuesOpenSpan.textContent = '...';
  issuesClosedSpan.textContent = '...';
  reviewReviewedSpan.textContent = '...';
  reviewPendingSpan.textContent = '...';

  try {
    const prs = await githubFetch(`https://api.github.com/repos/${repo}/pulls?state=all&per_page=100`, GITHUB_TOKEN);
    const issuesData = await githubFetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&filter=all`, GITHUB_TOKEN);
    const issues = issuesData.filter(issue => !issue.pull_request);

    let openPRs = prs.filter(pr => pr.state === 'open');
    let closedPRs = prs.filter(pr => pr.state === 'closed');
    let openIssues = issues.filter(issue => issue.state === 'open');
    let closedIssues = issues.filter(issue => issue.state === 'closed');

    const hasRealPRs = openPRs.length + closedPRs.length > 0;
    const hasRealIssues = openIssues.length + closedIssues.length > 0;

    if (!hasRealPRs) {
      openPRs = demoPRs.open;
      closedPRs = demoPRs.closed;
    }
    if (!hasRealIssues) {
      openIssues = demoIssues.open;
      closedIssues = demoIssues.closed;
    }

    prOpenSpan.textContent = typeof openPRs === 'number' ? openPRs : openPRs.length;
    prClosedSpan.textContent = typeof closedPRs === 'number' ? closedPRs : closedPRs.length;
    const prTotal = (typeof openPRs === 'number' ? openPRs : openPRs.length) + (typeof closedPRs === 'number' ? closedPRs : closedPRs.length);
    const prPercent = prTotal === 0 ? 0 : ((typeof closedPRs === 'number' ? closedPRs : closedPRs.length) / prTotal) * 100;
    prProgressBar.style.width = `${prPercent}%`;

    issuesOpenSpan.textContent = typeof openIssues === 'number' ? openIssues : openIssues.length;
    issuesClosedSpan.textContent = typeof closedIssues === 'number' ? closedIssues : closedIssues.length;
    const issuesTotal = (typeof openIssues === 'number' ? openIssues : openIssues.length) + (typeof closedIssues === 'number' ? closedIssues : closedIssues.length);
    const issuesPercent = issuesTotal === 0 ? 0 : ((typeof closedIssues === 'number' ? closedIssues : closedIssues.length) / issuesTotal) * 100;
    issuesProgressBar.style.width = `${issuesPercent}%`;

    let reviewedPRs = 0, pendingPRs = 0;
    if (hasRealPRs && openPRs.length > 0) {
      const reviewPromises = openPRs.slice(0, 30).map(async (pr) => {
        try {
          const reviews = await githubFetch(pr.url + '/reviews', GITHUB_TOKEN);
          return reviews.length > 0 ? 1 : 0;
        } catch (err) {
          return 0;
        }
      });
      const reviewResults = await Promise.all(reviewPromises);
      reviewedPRs = reviewResults.reduce((a, b) => a + b, 0);
      pendingPRs = openPRs.length - reviewedPRs;
    } else if (!hasRealPRs && openPRs > 0) {
      reviewedPRs = demoReviews.reviewed;
      pendingPRs = demoReviews.pending;
    } else {
      reviewedPRs = 0;
      pendingPRs = 0;
    }

    reviewReviewedSpan.textContent = reviewedPRs;
    reviewPendingSpan.textContent = pendingPRs;
    const reviewPercent = (reviewedPRs + pendingPRs) === 0 ? 0 : (reviewedPRs / (reviewedPRs + pendingPRs)) * 100;
    reviewProgressBar.style.width = `${reviewPercent}%`;

    if (!hasRealPRs || !hasRealIssues) {
      showToast('This repo has no real PRs/issues – showing demo data for illustration.', 'info');
    }
  } catch (error) {
    console.error('Failed to fetch GitHub activity:', error);
    showToast(`Could not load data for "${repo}". Using demo data.`, 'error');
    // Fallback to demo data
    prOpenSpan.textContent = demoPRs.open;
    prClosedSpan.textContent = demoPRs.closed;
    prProgressBar.style.width = `${(demoPRs.closed / (demoPRs.open + demoPRs.closed)) * 100}%`;
    issuesOpenSpan.textContent = demoIssues.open;
    issuesClosedSpan.textContent = demoIssues.closed;
    issuesProgressBar.style.width = `${(demoIssues.closed / (demoIssues.open + demoIssues.closed)) * 100}%`;
    reviewReviewedSpan.textContent = demoReviews.reviewed;
    reviewPendingSpan.textContent = demoReviews.pending;
    reviewProgressBar.style.width = `${(demoReviews.reviewed / (demoReviews.reviewed + demoReviews.pending)) * 100}%`;
  }
}

refreshBtn.addEventListener('click', fetchGitHubActivity);
repoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') fetchGitHubActivity();
});

fetchGitHubActivity();
// ==================== COPY EMAIL TO CLIPBOARD (Day 12) ====================

const copyBtn = document.getElementById('copy-email-Btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
      const myEmail = 'sanketshirke67@gmail.com'; // email
      try {
          await navigator.clipboard.writeText(myEmail);
          showToast('email copy to clipboard!' , 'success' );
       }  catch (err) {
          showToast('failed to copy email.please try again' , 'error');

       }
  });
}