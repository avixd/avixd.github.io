/* ── Nav scroll effect ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile hamburger ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Smooth scroll for nav-cta button ── */
window.scrollTo = function(target) {
  if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
};

/* ── Intersection Observer: fade-up + skill bars ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    io.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* Skill bars observer */
const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-fill').forEach(fill => fill.classList.add('animated'));
    skillIO.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const skillsPanel = document.querySelector('.skills-panel');
if (skillsPanel) skillIO.observe(skillsPanel);

/* ── Add fade-up to sections ── */
const animTargets = [
  '.hero-badge', '.hero-title', '.hero-sub', '.hero-actions', '.hero-certs',
  '.chart-card', '.about-text', '.skills-panel',
  '.project-card', '.service-card', '.channel-card', '.contact-form',
];
animTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-up');
    el.style.transitionDelay = `${i * 0.06}s`;
  });
});

// Re-observe after adding class
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ── Portfolio filter ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.tags.includes(filter);
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ── Contact form (Formspree-ready or mailto fallback) ── */
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Replace the action URL below with your Formspree endpoint, e.g.:
  // https://formspree.io/f/YOUR_ID
  // Until then we simulate a send.
  const FORMSPREE_URL = form.dataset.action || '';

  if (FORMSPREE_URL) {
    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        formNote.textContent = '✓ Message sent! I\'ll get back to you shortly.';
        form.reset();
      } else {
        formNote.textContent = '✗ Something went wrong. Try reaching me on TopMate or Fiverr.';
      }
    } catch {
      formNote.textContent = '✗ Network error. Please try again.';
    }
  } else {
    // Fallback: open mailto
    const name    = form.querySelector('[name=name]').value;
    const email   = form.querySelector('[name=email]').value;
    const subject = form.querySelector('[name=subject]').value;
    const message = form.querySelector('[name=message]').value;
    const mailto  = `mailto:?subject=${encodeURIComponent(subject || 'Portfolio enquiry')}&body=${encodeURIComponent(`Hi Avinash,\n\n${message}\n\n— ${name} (${email})`)}`;
    window.open(mailto);
    formNote.textContent = '✓ Opening your email client…';
    form.reset();
  }

  btn.textContent = 'Send message';
  btn.disabled = false;
});

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');

const navIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + entry.target.id ? 'var(--text)' : '';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navIO.observe(s));
