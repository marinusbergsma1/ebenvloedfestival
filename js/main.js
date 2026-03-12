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

  // --- Complete Hero Animation Timeline ---
  const heroVideo = document.getElementById('heroVideo');
  const heroIsBack = document.getElementById('heroIsBack');
  const heroIn2026 = document.getElementById('heroIn2026');
  const heroTickets = document.getElementById('heroTickets');
  const heroLogo = document.getElementById('heroLogo');
  const waveFlood = document.getElementById('waveFlood');
  const heroDjFlash = document.getElementById('heroDjFlash');

  // Timeline (FAST):
  // 0s: Poster visible
  // 1.5s: Logo BAM
  // 2.5s: Video starts, logo fades
  // ~2.5s into video: Waves start rising OVER the video
  // Wave peak: video hidden, IS BACK → IN 2026 → TICKETS → DJ flash → waves recede

  if (heroVideo) {
    // Step 1: Logo slams in at 1.5s
    setTimeout(() => {
      if (heroLogo) heroLogo.classList.add('logo-visible');
    }, 1500);

    // Step 2: At 2.5s start video, fade out logo
    setTimeout(() => {
      heroVideo.classList.add('playing');
      heroVideo.play();
    }, 2500);

    setTimeout(() => {
      if (heroLogo) {
        heroLogo.classList.remove('logo-visible');
        heroLogo.style.animation = 'none';
        heroLogo.style.opacity = '0';
      }
    }, 3000);

    // Step 3: Waves start rising ~2.5s into video (while still playing!)
    setTimeout(() => {
      if (waveFlood) waveFlood.classList.add('rising');
    }, 5000);

    // Step 4: At wave peak — hide video, start text sequence
    setTimeout(() => {
      heroVideo.pause();
      heroVideo.classList.remove('playing');
      heroVideo.classList.add('ended');
    }, 6200);

    // IS BACK (fast)
    setTimeout(() => {
      if (heroIsBack) heroIsBack.classList.add('visible');
    }, 6400);

    setTimeout(() => {
      if (heroIsBack) {
        heroIsBack.classList.remove('visible');
        heroIsBack.classList.add('fadeout');
      }
    }, 7200);

    // IN 2026
    setTimeout(() => {
      if (heroIn2026) heroIn2026.classList.add('visible');
    }, 7400);

    setTimeout(() => {
      if (heroIn2026) {
        heroIn2026.classList.remove('visible');
        heroIn2026.classList.add('fadeout');
      }
    }, 8100);

    // GET YOUR TICKETS NOW!
    setTimeout(() => {
      if (heroTickets) heroTickets.classList.add('visible');
    }, 8300);

    setTimeout(() => {
      if (heroTickets) {
        heroTickets.classList.remove('visible');
        heroTickets.classList.add('fadeout');
      }
    }, 9000);

    // DJ names flash
    setTimeout(() => {
      if (heroDjFlash) heroDjFlash.classList.add('visible');
    }, 9200);

    setTimeout(() => {
      if (heroDjFlash) {
        heroDjFlash.classList.remove('visible');
        heroDjFlash.classList.add('fadeout');
      }
    }, 10200);

    // Waves recede → reveal poster
    setTimeout(() => {
      if (waveFlood) {
        waveFlood.classList.remove('rising');
        waveFlood.classList.add('receding');
      }
    }, 10500);
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
