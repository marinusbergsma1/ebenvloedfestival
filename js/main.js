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
  const heroTickets = document.getElementById('heroTickets');
  const heroLogo = document.getElementById('heroLogo');
  const waveFlood = document.getElementById('waveFlood');
  const heroDjFlash = document.getElementById('heroDjFlash');
  const heroBlueIntro = document.getElementById('heroBlueIntro');
  const heroGenres = document.getElementById('heroGenres');

  // NEW Timeline:
  // 0s: Blue screen + logo visible
  // 2s: Blue screen recedes via waves → poster revealed, logo stays
  // 4.5s: Logo fades out, IS BACK! appears
  // 5.3s: IS BACK fades, video starts
  // ~7.5s: Wave flood rises over video
  // 9s: Video hidden, DJ names flash
  // 10s: DJs fade, genres appear
  // 11s: Genres fade
  // 11.5s: Waves recede with GET YOUR TICKETS NOW!
  // 13s: Tickets fades, poster stays

  // Countdown timer
  function updateCountdown() {
    const festivalDate = new Date('2026-06-13T14:00:00+02:00');
    const now = new Date();
    const diff = festivalDate - now;
    if (diff <= 0) return;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    const el = document.getElementById('heroCountdown');
    if (el) {
      el.innerHTML = `
        <div class="countdown-item"><span class="countdown-num">${days}</span><span class="countdown-label">dagen</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span class="countdown-num">${String(hours).padStart(2,'0')}</span><span class="countdown-label">uur</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span class="countdown-num">${String(mins).padStart(2,'0')}</span><span class="countdown-label">min</span></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-item"><span class="countdown-num">${String(secs).padStart(2,'0')}</span><span class="countdown-label">sec</span></div>
      `;
    }
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- Audio System ---
  const bgMusic = document.getElementById('bgMusic');
  const sfxIntro1 = document.getElementById('sfxIntro1');
  const sfxIntro2 = document.getElementById('sfxIntro2');
  const musicToggle = document.getElementById('musicToggle');
  const enterOverlay = document.getElementById('enterOverlay');
  let allMuted = false;

  // Music toggle = mute/unmute ALL audio
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      allMuted = !allMuted;
      if (allMuted) {
        if (bgMusic) bgMusic.volume = 0;
        if (sfxIntro1) sfxIntro1.volume = 0;
        if (sfxIntro2) sfxIntro2.volume = 0;
        if (heroVideo) heroVideo.muted = true;
        musicToggle.classList.remove('playing');
      } else {
        if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.3;
        if (heroVideo) heroVideo.muted = false;
        musicToggle.classList.add('playing');
      }
    });
  }

  function playSfx(audio, vol) {
    if (!audio || allMuted) return;
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // --- ENTER overlay click starts EVERYTHING ---
  function startExperience() {
    // Hide enter overlay
    if (enterOverlay) {
      enterOverlay.classList.add('leaving');
      setTimeout(() => { enterOverlay.style.display = 'none'; }, 800);
    }

    // Unlock & start background music immediately with fade-in
    if (bgMusic) {
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        if (musicToggle) musicToggle.classList.add('playing');
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol += 0.015;
          if (vol >= 0.3) { vol = 0.3; clearInterval(fadeIn); }
          if (!allMuted) bgMusic.volume = vol;
        }, 60);
      }).catch(() => {});
    }

    // Start hero animation timeline
    startHeroTimeline();
  }

  if (enterOverlay) {
    enterOverlay.addEventListener('click', startExperience);
    enterOverlay.addEventListener('touchstart', startExperience);
  }

  function startHeroTimeline() {
    if (!heroVideo) return;

    const heroDateFlash = document.getElementById('heroDateFlash');

    // PHASE 1: Blue intro with date flash
    setTimeout(() => {
      if (heroDateFlash) heroDateFlash.classList.add('visible');
    }, 800);

    setTimeout(() => {
      if (heroDateFlash) {
        heroDateFlash.classList.remove('visible');
        heroDateFlash.classList.add('fadeout');
      }
    }, 2200);

    // PHASE 2: Blue intro recedes → VIDEO starts immediately (no poster)
    setTimeout(() => {
      heroVideo.classList.add('playing');
      heroVideo.play();
      playSfx(sfxIntro1, 0.6);
      if (heroBlueIntro) heroBlueIntro.classList.add('receding');
    }, 2500);

    // PHASE 3: IS BACK! slams in while video plays + SFX
    setTimeout(() => {
      if (heroIsBack) heroIsBack.classList.add('visible');
      playSfx(sfxIntro2, 0.5);
    }, 4200);

    setTimeout(() => {
      if (heroIsBack) {
        heroIsBack.classList.remove('visible');
        heroIsBack.classList.add('fadeout');
      }
    }, 5000);

    // PHASE 5: Track video time — start waves 1.5s BEFORE video ends
    let waveStarted = false;
    heroVideo.addEventListener('timeupdate', () => {
      if (waveStarted) return;
      const timeLeft = heroVideo.duration - heroVideo.currentTime;
      if (timeLeft <= 1.5 && timeLeft > 0) {
        waveStarted = true;
        if (waveFlood) waveFlood.classList.add('rising');
      }
    });

    // PHASE 6: When video ends → DJ flash, genres, then recede
    heroVideo.addEventListener('ended', () => {
      heroVideo.classList.remove('playing');
      heroVideo.classList.add('ended');

      // DJ names flash
      setTimeout(() => {
        if (heroDjFlash) heroDjFlash.classList.add('visible');
        const djNames = heroDjFlash ? heroDjFlash.querySelectorAll('span') : [];
        djNames.forEach((name, i) => {
          name.style.animationDelay = (i * 0.15) + 's';
        });
      }, 300);

      // DJs fade out
      setTimeout(() => {
        if (heroDjFlash) {
          heroDjFlash.classList.remove('visible');
          heroDjFlash.classList.add('fadeout');
        }
      }, 2000);

      // Genres appear
      setTimeout(() => {
        if (heroGenres) heroGenres.classList.add('visible');
      }, 2200);

      // Genres fade
      setTimeout(() => {
        if (heroGenres) {
          heroGenres.classList.remove('visible');
          heroGenres.classList.add('fadeout');
        }
      }, 3200);

      // Waves recede — poster revealed, NO logo
      setTimeout(() => {
        if (waveFlood) {
          waveFlood.classList.remove('rising');
          waveFlood.classList.add('receding');
        }
      }, 3600);

      // GET YOUR TICKETS NOW! big and centered (no logo)
      setTimeout(() => {
        if (heroTickets) heroTickets.classList.add('visible');
      }, 4300);

      // Show countdown big
      setTimeout(() => {
        const cd = document.getElementById('heroCountdown');
        if (cd) cd.classList.add('visible');
      }, 5100);

      // Logo stays hidden — don't show it
      // heroLogo stays opacity: 0
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
