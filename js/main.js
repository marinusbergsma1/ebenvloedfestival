/* ============================================
   Eb & Vloed Festival - Main JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 800);
  });
  // Fallback: hide preloader after 3s even if load event already fired
  setTimeout(() => preloader.classList.add('loaded'), 3000);

  // --- Navigation ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 60);
    lastScroll = scrollY;
  }, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = navLinks.querySelectorAll('.nav-link:not(.nav-link--cta)');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinkElements.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- Hero Video → Poster + IS BACK → Logo sequence ---
  const heroVideo = document.getElementById('heroVideo');
  const heroIsBack = document.getElementById('heroIsBack');
  const heroLogo = document.getElementById('heroLogo');

  if (heroVideo) {
    heroVideo.addEventListener('ended', () => {
      heroVideo.classList.add('ended');
    });
  }

  // Animation timeline:
  // 3s: IS BACK slams in
  // 4.2s: IS BACK gone
  // 4.6s: Logo BAM
  if (heroIsBack) {
    setTimeout(() => {
      heroIsBack.classList.add('visible');
    }, 3000);

    setTimeout(() => {
      heroIsBack.classList.remove('visible');
      heroIsBack.classList.add('fadeout');
    }, 4200);

    setTimeout(() => {
      if (heroLogo) heroLogo.classList.add('logo-visible');
    }, 4600);
  }

  // --- Scroll Reveal (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Parallax on palms ---
  const palms = document.querySelectorAll('[data-parallax]');
  if (palms.length && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      palms.forEach(palm => {
        const speed = parseFloat(palm.dataset.parallax);
        palm.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  // --- Floating Particles ---
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer && window.innerWidth > 768) {
    function createParticle() {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const x = Math.random() * 100;
      const size = 2 + Math.random() * 4;
      const duration = 8 + Math.random() * 12;
      const delay = Math.random() * 5;

      particle.style.cssText = `
        left: ${x}%;
        bottom: -10px;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        background: ${Math.random() > 0.5 ? 'var(--color-accent)' : 'var(--color-accent-2)'};
      `;

      particlesContainer.appendChild(particle);
      setTimeout(() => particle.remove(), (duration + delay) * 1000);
    }

    // Create initial batch
    for (let i = 0; i < 15; i++) createParticle();
    // Keep creating particles
    setInterval(createParticle, 2000);
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item.active').forEach(activeItem => {
        if (activeItem !== item) activeItem.classList.remove('active');
      });

      item.classList.toggle('active', !isActive);
      button.setAttribute('aria-expanded', !isActive);
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Mouse move parallax on hero (desktop only) ---
  if (window.innerWidth > 768) {
    const heroContent = document.querySelector('.hero-content');
    const hero = document.querySelector('.hero');

    if (hero && heroContent) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroContent.style.transform = `translate(${x * -8}px, ${y * -8}px)`;
      });
    }
  }

});
