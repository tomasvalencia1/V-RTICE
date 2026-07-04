/* ==========================================
   VÉRTICE — Interactive Scripts v2
   Luxury Minimal Aesthetic
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Navbar scroll effect ─────────────────
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ─── Mobile Menu ──────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const menuOverlay = document.getElementById('menuOverlay');

  const toggleMenu = () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  };

  navToggle.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) toggleMenu();
    });
  });

  // ─── Smooth scroll for anchor links ───────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const position = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    });
  });

  // ─── Scroll Reveal (Intersection Observer) ─
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── Parallax for hero background ─────────
  const heroBg = document.querySelector('.hero__bg img');
  
  if (heroBg && window.innerWidth > 768) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const heroHeight = document.querySelector('.hero').offsetHeight;
          if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.25}px) scale(1.08)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── Active nav link highlight ────────────
  const sections = document.querySelectorAll('section[id]');
  
  const highlightNav = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.navbar__link[href="#${id}"]`);

      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.navbar__link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── Counter animation ────────────────────
  const counterEl = document.querySelector('.philosophy__accent .number');
  if (counterEl) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(counterEl, 0, 100, 1800);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterObserver.observe(counterEl);
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * eased) + '%';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ─── Subtle cursor glow on CTA section ────
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner && window.innerWidth > 768) {
    ctaBanner.addEventListener('mousemove', (e) => {
      const rect = ctaBanner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctaBanner.style.background = `
        radial-gradient(600px circle at ${x}px ${y}px, rgba(196, 169, 125, 0.04), transparent 40%),
        var(--clr-dark-900)
      `;
    });

    ctaBanner.addEventListener('mouseleave', () => {
      ctaBanner.style.background = 'var(--clr-dark-900)';
    });
  }

  // ─── Navbar logo: crop to just the monogram for small nav
  const logoImg = document.querySelector('.navbar__logo-img');
  if (logoImg) {
    logoImg.style.objectPosition = 'center center';
  }

});
