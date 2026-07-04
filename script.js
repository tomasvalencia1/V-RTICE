/* ==========================================
   VÉRTICE — Premium Interactions v3
   Custom cursor, magnetic buttons, tilt cards,
   text splitting, parallax, smooth scroll,
   preloader, SVG draw, clip-path reveals
   ========================================== */

(() => {
  'use strict';

  // ─── Smooth Scroll Engine (Lerp-based) ────
  class SmoothScroll {
    constructor() {
      this.current = window.scrollY;
      this.target = window.scrollY;
      this.ease = 0.08;
      this.running = true;
      this.callbacks = [];
      this.raf = null;
      this.init();
    }

    init() {
      window.addEventListener('scroll', () => {
        this.target = window.scrollY;
      }, { passive: true });
      this.animate();
    }

    animate() {
      this.current += (this.target - this.current) * this.ease;
      if (Math.abs(this.target - this.current) < 0.5) {
        this.current = this.target;
      }
      this.callbacks.forEach(cb => cb(this.current));
      this.raf = requestAnimationFrame(() => this.animate());
    }

    onScroll(cb) { this.callbacks.push(cb); }
    destroy() { cancelAnimationFrame(this.raf); }
  }

  // ─── Custom Cursor ────────────────────────
  class CustomCursor {
    constructor() {
      this.el = document.getElementById('cursor');
      if (!this.el || window.innerWidth <= 768) return;
      this.pos = { x: 0, y: 0 };
      this.mouse = { x: 0, y: 0 };
      this.speed = 0.15;
      this.init();
    }

    init() {
      document.addEventListener('mousemove', e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      // Hover targets
      const hoverEls = document.querySelectorAll('a, button, [data-magnetic], .value-card, .atelier__gallery-item');
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => this.el.classList.add('hover'));
        el.addEventListener('mouseleave', () => this.el.classList.remove('hover'));
      });

      // Click feedback
      document.addEventListener('mousedown', () => this.el.classList.add('click'));
      document.addEventListener('mouseup', () => this.el.classList.remove('click'));

      this.render();
    }

    render() {
      this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
      this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
      this.el.style.transform = `translate(${this.pos.x - 4}px, ${this.pos.y - 4}px)`;
      requestAnimationFrame(() => this.render());
    }
  }

  // ─── Magnetic Buttons ─────────────────────
  class MagneticElements {
    constructor() {
      this.elements = document.querySelectorAll('[data-magnetic]');
      if (window.innerWidth <= 768) return;
      this.init();
    }

    init() {
      this.elements.forEach(el => {
        el.addEventListener('mousemove', e => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const strength = 0.3;
          el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translate(0, 0)';
          el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
          setTimeout(() => { el.style.transition = ''; }, 500);
        });
      });
    }
  }

  // ─── Tilt Cards ───────────────────────────
  class TiltCards {
    constructor() {
      this.cards = document.querySelectorAll('[data-tilt]');
      if (window.innerWidth <= 768) return;
      this.init();
    }

    init() {
      this.cards.forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;
          const tiltX = (y - 0.5) * 8;
          const tiltY = (x - 0.5) * -8;
          card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
          card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          setTimeout(() => { card.style.transition = 'background 0.5s var(--ease)'; }, 600);
        });

        card.addEventListener('mouseenter', () => {
          card.style.transition = 'none';
        });
      });
    }
  }

  // ─── Text Splitter (Hero Title) ───────────
  class TextSplitter {
    constructor() {
      this.elements = document.querySelectorAll('[data-split]');
      this.init();
    }

    init() {
      this.elements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        el.setAttribute('aria-label', text);

        [...text].forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.animationDelay = `${1.7 + i * 0.07}s`;
          el.appendChild(span);
        });
      });
    }
  }

  // ─── Scroll Reveal (Enhanced IO) ──────────
  class ScrollReveal {
    constructor() {
      this.init();
    }

    init() {
      // Standard reveals
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.reveal, .img-reveal, .img-reveal--right, .reveal-scale, .line-grow').forEach(el => {
        revealObs.observe(el);
      });

      // Divider dot animations
      const dividerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            dividerObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.divider--dot').forEach(el => dividerObs.observe(el));

      // Line grow elements
      const lineObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = '40px';
            lineObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('[data-line-grow]').forEach(el => lineObs.observe(el));

      // Process steps line
      const stepsObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            stepsObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.process__steps').forEach(el => stepsObs.observe(el));

      // Experience items with check draw
      const itemObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            itemObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.experience__item').forEach(el => itemObs.observe(el));

      // Atelier features (line grow)
      const featureObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            featureObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.atelier__feature').forEach(el => featureObs.observe(el));

      // Philosophy image frame + accent
      const imgFrameObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            imgFrameObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      document.querySelectorAll('.philosophy__image, .experience__image').forEach(el => imgFrameObs.observe(el));

      // Philosophy quote border animation
      const quoteObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            quoteObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      document.querySelectorAll('.philosophy__quote').forEach(el => quoteObs.observe(el));
    }
  }

  // ─── Counter Animation ────────────────────
  class CounterAnimation {
    constructor() {
      this.counters = document.querySelectorAll('[data-counter]');
      this.init();
    }

    init() {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      this.counters.forEach(el => obs.observe(el));
    }

    animate(el) {
      const end = parseInt(el.dataset.counter);
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        // Spring-like easing
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * end);
        el.textContent = current + '%';
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }
  }

  // ─── Parallax Images ─────────────────────
  class ParallaxImages {
    constructor(smoothScroll) {
      this.images = document.querySelectorAll('[data-parallax-img] img');
      if (window.innerWidth <= 768 || this.images.length === 0) return;
      this.smoothScroll = smoothScroll;
      this.init();
    }

    init() {
      this.smoothScroll.onScroll((scrollY) => {
        this.images.forEach(img => {
          const rect = img.parentElement.getBoundingClientRect();
          const inView = rect.top < window.innerHeight && rect.bottom > 0;
          if (inView) {
            const progress = (rect.top / window.innerHeight);
            const y = progress * -40;
            img.style.transform = `translateY(${y}px) scale(1.08)`;
          }
        });
      });
    }
  }

  // ─── Hero Parallax ────────────────────────
  class HeroParallax {
    constructor(smoothScroll) {
      this.bg = document.querySelector('.hero__bg img');
      this.content = document.querySelector('.hero__content');
      if (!this.bg || window.innerWidth <= 768) return;
      this.heroH = document.querySelector('.hero').offsetHeight;
      this.smoothScroll = smoothScroll;
      this.init();
    }

    init() {
      this.smoothScroll.onScroll((scrollY) => {
        if (scrollY < this.heroH) {
          const progress = scrollY / this.heroH;
          this.bg.style.transform = `translateY(${scrollY * 0.3}px) scale(${1.08 + progress * 0.05})`;
          this.bg.style.opacity = Math.max(0.35 - progress * 0.3, 0);
          if (this.content) {
            this.content.style.transform = `translateY(${scrollY * 0.15}px)`;
            this.content.style.opacity = Math.max(1 - progress * 1.5, 0);
          }
        }
      });
    }
  }

  // ─── Navbar Controller ────────────────────
  class NavbarController {
    constructor(smoothScroll) {
      this.navbar = document.getElementById('navbar');
      this.toggle = document.getElementById('navToggle');
      this.links = document.getElementById('navLinks');
      this.overlay = document.getElementById('menuOverlay');
      this.sections = document.querySelectorAll('section[id]');
      this.smoothScroll = smoothScroll;
      this.init();
    }

    init() {
      // Scroll state
      this.smoothScroll.onScroll((scrollY) => {
        if (scrollY > 80) {
          this.navbar.classList.add('scrolled');
        } else {
          this.navbar.classList.remove('scrolled');
        }
        this.highlightActiveLink(scrollY);
      });

      // Mobile menu
      this.toggle.addEventListener('click', () => this.toggleMenu());
      this.overlay.addEventListener('click', () => this.toggleMenu());

      this.links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (this.links.classList.contains('active')) this.toggleMenu();
        });
      });

      // Smooth anchor scrolling
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            const offset = this.navbar.offsetHeight + 20;
            const pos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
          }
        });
      });
    }

    toggleMenu() {
      this.toggle.classList.toggle('active');
      this.links.classList.toggle('active');
      this.overlay.classList.toggle('active');
      document.body.style.overflow = this.links.classList.contains('active') ? 'hidden' : '';
    }

    highlightActiveLink(scrollY) {
      const offset = this.navbar.offsetHeight + 120;
      this.sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.navbar__link[href="#${id}"]`);
        if (link) {
          if (scrollY + offset >= top && scrollY + offset < top + height) {
            document.querySelectorAll('.navbar__link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    }
  }

  // ─── Scroll Progress Bar ──────────────────
  class ScrollProgress {
    constructor(smoothScroll) {
      this.bar = document.getElementById('scrollProgress');
      if (!this.bar) return;
      this.smoothScroll = smoothScroll;
      this.init();
    }

    init() {
      this.smoothScroll.onScroll((scrollY) => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        this.bar.style.width = progress + '%';
      });
    }
  }

  // ─── WhatsApp Float Visibility ────────────
  class WhatsAppFloat {
    constructor() {
      this.el = document.getElementById('whatsappFloat');
      if (!this.el) return;
      this.init();
    }

    init() {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            this.el.classList.add('visible');
          }
        });
      }, { threshold: 0 });

      const hero = document.querySelector('.hero');
      if (hero) obs.observe(hero);

      // Fallback: show after scroll
      setTimeout(() => this.el.classList.add('visible'), 5000);
    }
  }

  // ─── Button Ripple Effect ─────────────────
  class ButtonRipple {
    constructor() {
      document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const rect = btn.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'ripple';
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 800);
        });
      });
    }
  }

  // ─── CTA Glow Effect ─────────────────────
  class CTAGlow {
    constructor() {
      this.el = document.querySelector('.cta-banner');
      if (!this.el || window.innerWidth <= 768) return;
      this.init();
    }

    init() {
      this.el.addEventListener('mousemove', (e) => {
        const rect = this.el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.el.style.background = `
          radial-gradient(800px circle at ${x}px ${y}px, rgba(196,169,125,0.05), transparent 35%),
          var(--clr-dark-900)
        `;
      });

      this.el.addEventListener('mouseleave', () => {
        this.el.style.background = 'var(--clr-dark-900)';
      });
    }
  }

  // ─── Preloader ────────────────────────────
  class Preloader {
    constructor(onComplete) {
      this.el = document.getElementById('preloader');
      this.onComplete = onComplete;
      this.init();
    }

    init() {
      // Wait for all critical assets
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.el.classList.add('done');
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        }, 1200);
      });

      // Fallback: force close after 4s
      setTimeout(() => {
        if (!this.el.classList.contains('done')) {
          this.el.classList.add('done');
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        }
      }, 2500);

      // Prevent scroll during preloader
      document.body.style.overflow = 'hidden';
    }
  }

  // ─── Gallery Hover Parallax ───────────────
  class GalleryHover {
    constructor() {
      if (window.innerWidth <= 768) return;
      const items = document.querySelectorAll('.atelier__gallery-item');
      items.forEach(item => {
        const img = item.querySelector('img');
        if (!img) return;

        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          img.style.transform = `scale(1.08) translate(${x * -15}px, ${y * -15}px)`;
        });

        item.addEventListener('mouseleave', () => {
          img.style.transform = 'scale(1)';
          img.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
          setTimeout(() => {
            img.style.transition = 'transform 1s var(--ease), filter 0.6s var(--ease)';
          }, 800);
        });

        item.addEventListener('mouseenter', () => {
          img.style.transition = 'none';
        });
      });
    }
  }

  // ─── Initialize Everything ────────────────
  document.addEventListener('DOMContentLoaded', () => {

    const smoothScroll = new SmoothScroll();

    new Preloader(() => {
      // After preloader completes, init everything
      // Custom cursor disabled by user preference
      new MagneticElements();
      new TiltCards();
      new TextSplitter();
      new ScrollReveal();
      new CounterAnimation();
      new ParallaxImages(smoothScroll);
      new HeroParallax(smoothScroll);
      new NavbarController(smoothScroll);
      new ScrollProgress(smoothScroll);
      new WhatsAppFloat();
      new ButtonRipple();
      new CTAGlow();
      new GalleryHover();

      // Trigger hero divider animation
      setTimeout(() => {
        const heroDivider = document.querySelector('.hero__divider .divider--dot');
        if (heroDivider) heroDivider.classList.add('animated');
      }, 2700);

      // Safety fallback: force all hidden elements to reveal after 4s
      setTimeout(() => {
        document.querySelectorAll('.img-reveal:not(.revealed), .img-reveal--right:not(.revealed)').forEach(el => {
          el.classList.add('revealed');
        });
      }, 4000);
    });

  });

})();
