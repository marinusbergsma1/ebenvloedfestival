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
  let allMuted = false;
  let audioUnlocked = false;
  let pendingSfx = []; // queue SFX that fire before user interacts

  // Unlock audio on first user interaction
  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;

    // Start music with fast fade-in
    if (bgMusic) {
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        if (musicToggle) musicToggle.classList.add('playing');
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol += 0.03;
          if (vol >= 0.35) { vol = 0.35; clearInterval(fadeIn); }
          if (!allMuted) bgMusic.volume = vol;
        }, 40);
      }).catch(() => {});
    }

    // Play any queued SFX
    pendingSfx.forEach(s => { s.audio.volume = s.vol; s.audio.play().catch(() => {}); });
    pendingSfx = [];

    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('scroll', unlockAudio);
    document.removeEventListener('mousemove', unlockAudio);
  }
  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('scroll', unlockAudio);
  document.addEventListener('mousemove', unlockAudio);

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
        if (bgMusic && !bgMusic.paused) bgMusic.volume = 0.35;
        if (heroVideo) heroVideo.muted = false;
        musicToggle.classList.add('playing');
      }
    });
  }

  function playSfx(audio, vol) {
    if (!audio || allMuted) return;
    if (!audioUnlocked) {
      pendingSfx.push({ audio, vol });
      return;
    }
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // Hide blue intro — start with poster visible
  if (heroBlueIntro) heroBlueIntro.style.display = 'none';

  // --- Hero Animation Timeline (starts automatically) ---
  if (heroVideo) {
    const heroDateFlash = document.getElementById('heroDateFlash');

    // 0s: Poster image visible, music fading in on first interaction

    // 1.5s: "13 JUNI" appears over poster
    setTimeout(() => {
      if (heroDateFlash) heroDateFlash.classList.add('visible');
    }, 1500);

    // 2s: Gejuich / cheering SFX
    setTimeout(() => {
      playSfx(sfxIntro1, 0.7);
    }, 2000);

    // 3.2s: "13 JUNI" fades out
    setTimeout(() => {
      if (heroDateFlash) {
        heroDateFlash.classList.remove('visible');
        heroDateFlash.classList.add('fadeout');
      }
    }, 3200);

    // 3.5s: Video starts playing (replaces poster) + SFX
    setTimeout(() => {
      heroVideo.classList.add('playing');
      heroVideo.play();
      playSfx(sfxIntro2, 0.5);
    }, 3500);

    // 5.5s: IS BACK! slams in while video plays
    setTimeout(() => {
      if (heroIsBack) heroIsBack.classList.add('visible');
    }, 5500);

    // 6.3s: IS BACK fades
    setTimeout(() => {
      if (heroIsBack) {
        heroIsBack.classList.remove('visible');
        heroIsBack.classList.add('fadeout');
      }
    }, 6300);

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
  } // end if(heroVideo)

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

  // --- Falling Flower Petals ---
  const petalsContainer = document.getElementById('petalsContainer');
  if (petalsContainer) {
    const petalColors = [
      { fill: '#ff6b8a', stroke: '#e8507a' },  // pink hibiscus
      { fill: '#ff9a56', stroke: '#e87a36' },  // orange tropical
      { fill: '#ffdd57', stroke: '#e8c437' },  // yellow frangipani
      { fill: '#ff4757', stroke: '#cc2f3f' },  // red
      { fill: '#ff85a2', stroke: '#e86585' },  // light pink
      { fill: '#ffa94d', stroke: '#e88930' },  // warm orange
    ];

    const petalShapes = [
      // Hibiscus-style petal
      '<svg width="28" height="28" viewBox="0 0 28 28"><path d="M14 2C14 2 8 6 6 12C4 18 8 24 14 26C20 24 24 18 22 12C20 6 14 2 14 2Z" fill="FILL" stroke="STROKE" stroke-width="0.5" opacity="0.85"/></svg>',
      // Frangipani petal
      '<svg width="24" height="30" viewBox="0 0 24 30"><path d="M12 0C12 0 4 8 2 16C0 24 6 30 12 30C18 30 24 24 22 16C20 8 12 0 12 0Z" fill="FILL" stroke="STROKE" stroke-width="0.5" opacity="0.85"/></svg>',
      // Round petal
      '<svg width="22" height="22" viewBox="0 0 22 22"><ellipse cx="11" cy="11" rx="10" ry="8" fill="FILL" stroke="STROKE" stroke-width="0.5" opacity="0.8" transform="rotate(15 11 11)"/></svg>',
      // Small star flower
      '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 0L12 7L20 10L12 13L10 20L8 13L0 10L8 7Z" fill="FILL" stroke="STROKE" stroke-width="0.3" opacity="0.75"/></svg>',
    ];

    function createPetal() {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      const shape = petalShapes[Math.floor(Math.random() * petalShapes.length)];
      const x = Math.random() * 100;
      const size = 0.6 + Math.random() * 0.8;
      const duration = 6 + Math.random() * 8;
      const delay = Math.random() * 2;
      const swayAmount = 40 + Math.random() * 80;

      petal.innerHTML = shape.replace(/FILL/g, color.fill).replace(/STROKE/g, color.stroke);
      petal.style.cssText = `
        left: ${x}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        transform-origin: center;
      `;

      // Add horizontal sway with CSS custom property
      petal.style.setProperty('--sway', swayAmount + 'px');
      petal.querySelector('svg').style.transform = `scale(${size})`;

      petalsContainer.appendChild(petal);
      setTimeout(() => petal.remove(), (duration + delay) * 1000);
    }

    // Create initial burst
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createPetal(), i * 300);
    }
    // Keep creating petals
    setInterval(createPetal, 1500);
  }

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
