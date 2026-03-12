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

  // Timeline:
  // 0s: Poster visible (sunset DJ booth)
  // 3s: Logo BAM on top of poster
  // 4.5s: Video fades in + plays, logo fades out
  // Video ends: IS BACK → IN 2026 → GET YOUR TICKETS NOW!
  //             → Blue wave flood rises → DJ names flash → DJ fade → waves recede → poster stays

  if (heroVideo) {
    // Step 1: Logo slams in at 3s on top of poster
    setTimeout(() => {
      if (heroLogo) heroLogo.classList.add('logo-visible');
    }, 3000);

    // Step 2: At 4.5s start video, fade out logo
    setTimeout(() => {
      heroVideo.classList.add('playing');
      heroVideo.play();
    }, 4500);

    setTimeout(() => {
      if (heroLogo) {
        heroLogo.classList.remove('logo-visible');
        heroLogo.style.animation = 'none';
        heroLogo.style.opacity = '0';
      }
    }, 5000);

    // Step 3: When video ends → text sequence then flood
    heroVideo.addEventListener('ended', () => {
      const t = 0; // offset from video end

      // IS BACK
      setTimeout(() => {
        if (heroIsBack) heroIsBack.classList.add('visible');
      }, t + 300);

      setTimeout(() => {
        if (heroIsBack) {
          heroIsBack.classList.remove('visible');
          heroIsBack.classList.add('fadeout');
        }
      }, t + 1400);

      // IN 2026
      setTimeout(() => {
        if (heroIn2026) heroIn2026.classList.add('visible');
      }, t + 1700);

      setTimeout(() => {
        if (heroIn2026) {
          heroIn2026.classList.remove('visible');
          heroIn2026.classList.add('fadeout');
        }
      }, t + 2600);

      // GET YOUR TICKETS NOW!
      setTimeout(() => {
        if (heroTickets) heroTickets.classList.add('visible');
      }, t + 2900);

      setTimeout(() => {
        if (heroTickets) {
          heroTickets.classList.remove('visible');
          heroTickets.classList.add('fadeout');
        }
      }, t + 3800);

      // Blue wave flood rises
      setTimeout(() => {
        if (waveFlood) waveFlood.classList.add('rising');
      }, t + 4200);

      // At flood peak: hide video, show DJ names
      setTimeout(() => {
        heroVideo.classList.remove('playing');
        heroVideo.classList.add('ended');
        if (heroDjFlash) heroDjFlash.classList.add('visible');
      }, t + 5600);

      // DJ names fade out
      setTimeout(() => {
        if (heroDjFlash) {
          heroDjFlash.classList.remove('visible');
          heroDjFlash.classList.add('fadeout');
        }
      }, t + 6800);

      // Waves recede → reveal poster
      setTimeout(() => {
        if (waveFlood) {
          waveFlood.classList.remove('rising');
          waveFlood.classList.add('receding');
        }
      }, t + 7200);
    });
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
