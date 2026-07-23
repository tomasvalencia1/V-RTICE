/* ==========================================
   VÉRTICE — E-commerce Logic v4
   ========================================== */

(() => {
  'use strict';

  // ─── Smooth Scroll Engine (Lerp-based) ────
  class SmoothScroll {
    constructor() {
      this.current = window.scrollY;
      this.target = window.scrollY;
      this.ease = 0.08;
      this.callbacks = [];
      this.init();
    }
    init() {
      window.addEventListener('scroll', () => { this.target = window.scrollY; }, { passive: true });
      this.animate();
    }
    animate() {
      this.current += (this.target - this.current) * this.ease;
      if (Math.abs(this.target - this.current) < 0.5) this.current = this.target;
      this.callbacks.forEach(cb => cb(this.current));
      requestAnimationFrame(() => this.animate());
    }
    onScroll(cb) { this.callbacks.push(cb); }
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
          span.style.animationDelay = `${0.1 + i * 0.07}s`;
          el.appendChild(span);
        });
      });
    }
  }

  // ─── Scroll Reveal ──────────
  class ScrollReveal {
    constructor() { this.init(); }
    init() {
      const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal, .line-grow').forEach(el => revealObs.observe(el));
      
      const dividerObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            dividerObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('.divider--dot').forEach(el => dividerObs.observe(el));
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
      this.smoothScroll = smoothScroll;
      this.init();
    }
    init() {
      this.smoothScroll.onScroll((scrollY) => {
        if (scrollY > 80) this.navbar.classList.add('scrolled');
        else this.navbar.classList.remove('scrolled');
      });
      this.toggle.addEventListener('click', () => this.toggleMenu());
      this.overlay.addEventListener('click', () => this.toggleMenu());
      this.links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (this.links.classList.contains('active')) this.toggleMenu();
        });
      });
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
          if (!entry.isIntersecting) this.el.classList.add('visible');
        });
      }, { threshold: 0 });
      const hero = document.querySelector('.hero');
      if (hero) obs.observe(hero);
      setTimeout(() => this.el.classList.add('visible'), 5000);
    }
  }

  // ─── FAQ Accordion ────────────────────────
  class FAQAccordion {
    constructor() {
      this.items = document.querySelectorAll('.faq-item');
      if (!this.items.length) return;
      this.init();
    }
    init() {
      this.items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          this.items.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-answer').style.maxHeight = null;
          });
          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
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
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.el.classList.add('done');
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        }, 1200);
      });
      setTimeout(() => {
        if (!this.el.classList.contains('done')) {
          this.el.classList.add('done');
          document.body.style.overflow = '';
          if (this.onComplete) this.onComplete();
        }
      }, 2500);
      document.body.style.overflow = 'hidden';
    }
  }

  // ─── E-commerce / Cart Logic ──────────────
  class EcommerceSystem {
    constructor() {
      this.cart = JSON.parse(localStorage.getItem('vertice_cart')) || [];
      
      this.cartSidebar = document.getElementById('cartSidebar');
      this.cartOverlay = document.getElementById('cartOverlay');
      this.cartItemsContainer = document.getElementById('cartItems');
      this.cartCount = document.getElementById('cartCount');
      this.cartTotalValue = document.getElementById('cartTotalValue');
      
      this.checkoutModal = document.getElementById('checkoutOverlay');
      this.checkoutForm = document.getElementById('checkoutForm');
      
      this.init();
    }

    init() {
      this.updateCartUI();
      
      // Bind Add to Cart Buttons
      document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const card = e.target.closest('.product-card');
          const id = btn.getAttribute('data-id');
          const name = btn.getAttribute('data-name');
          const price = parseInt(btn.getAttribute('data-price'));
          const color = card.querySelector('.color-select').value;
          const size = card.querySelector('.size-select').value;
          const imgSrc = card.querySelector('.product-card__image').src;
          
          this.addToCart({ id: id + '-' + color + '-' + size, name, price, color, size, qty: 1 });
          this.flyToCart(card.querySelector('.product-card__image'));
          this.showToast(name, imgSrc);
        });
      });

      // Cart Toggles
      document.getElementById('cartToggle').addEventListener('click', () => this.openCart());
      document.getElementById('cartClose').addEventListener('click', () => this.closeCart());
      this.cartOverlay.addEventListener('click', () => this.closeCart());

      // Checkout Toggles
      document.getElementById('btnCheckout').addEventListener('click', () => {
        if (this.cart.length === 0) {
          alert('Tu carrito está vacío.');
          return;
        }
        this.closeCart();
        this.openCheckout();
      });
      
      document.getElementById('checkoutClose').addEventListener('click', () => this.closeCheckout());
      
      const btnBackToCart = document.getElementById('btnBackToCart');
      if (btnBackToCart) {
        btnBackToCart.addEventListener('click', () => {
          this.closeCheckout();
          this.openCart();
        });
      }
      
      // Form submit -> WhatsApp
      this.checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processCheckout();
      });
    }

    addToCart(item) {
      const existing = this.cart.find(i => i.id === item.id);
      if (existing) {
        existing.qty++;
      } else {
        this.cart.push(item);
      }
      this.saveCart();
      this.updateCartUI();
    }

    removeFromCart(id) {
      this.cart = this.cart.filter(i => i.id !== id);
      this.saveCart();
      this.updateCartUI();
    }

    saveCart() {
      localStorage.setItem('vertice_cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
      this.cartItemsContainer.innerHTML = '';
      let total = 0;
      let count = 0;

      if (this.cart.length === 0) {
        this.cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--clr-dark-500); margin-top:2rem;">Tu carrito está vacío.</p>';
      } else {
        this.cart.forEach(item => {
          total += item.price * item.qty;
          count += item.qty;
          
          const el = document.createElement('div');
          el.className = 'cart-item';
          el.innerHTML = `
            <div class="cart-item-details">
              <h4>${item.name}</h4>
              <p>Color: ${item.color} | Talla: ${item.size} | Cant: ${item.qty}</p>
              <button class="btn-remove-item" data-id="${item.id}">Eliminar</button>
            </div>
            <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-CO')}</div>
          `;
          this.cartItemsContainer.appendChild(el);
        });
      }

      this.cartCount.textContent = count;
      this.cartTotalValue.textContent = '$' + total.toLocaleString('es-CO');

      // Bind remove buttons
      this.cartItemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.removeFromCart(e.target.getAttribute('data-id'));
        });
      });
    }

    flyToCart(imgElement) {
      const cartIcon = document.getElementById('cartToggle');
      if (!imgElement || !cartIcon) return;

      const imgRect = imgElement.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();

      const flyingImg = imgElement.cloneNode();
      flyingImg.style.position = 'fixed';
      flyingImg.style.left = `${imgRect.left}px`;
      flyingImg.style.top = `${imgRect.top}px`;
      flyingImg.style.width = `${imgRect.width}px`;
      flyingImg.style.height = `${imgRect.height}px`;
      flyingImg.style.objectFit = 'cover';
      flyingImg.style.borderRadius = '8px';
      flyingImg.style.zIndex = '10005';
      flyingImg.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      flyingImg.style.pointerEvents = 'none';
      
      document.body.appendChild(flyingImg);

      requestAnimationFrame(() => {
        flyingImg.style.left = `${cartRect.left + cartRect.width / 2 - 10}px`;
        flyingImg.style.top = `${cartRect.top + cartRect.height / 2 - 10}px`;
        flyingImg.style.width = '20px';
        flyingImg.style.height = '20px';
        flyingImg.style.opacity = '0.5';
        flyingImg.style.transform = 'scale(0.1)';
      });

      setTimeout(() => {
        if (flyingImg.parentElement) flyingImg.remove();
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 400);
      }, 800);
    }

    showToast(productName, imgSrc) {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `
        <div class="toast-content">
          <img src="${imgSrc}" class="toast-img" alt="${productName}">
          <div class="toast-info">
            <div class="toast-title">
              <svg viewBox="0 0 24 24" class="toast-icon"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>
              <span>¡Agregado con éxito!</span>
            </div>
            <p>${productName}</p>
          </div>
        </div>
        <div class="toast-actions">
          <button class="btn-toast-cart">Ver Carrito</button>
          <button class="btn-toast-checkout">Pagar Ahora</button>
        </div>
      `;
      container.appendChild(toast);
      
      toast.querySelector('.btn-toast-cart').addEventListener('click', () => {
        toast.classList.remove('show');
        this.openCart();
      });
      toast.querySelector('.btn-toast-checkout').addEventListener('click', () => {
        toast.classList.remove('show');
        this.openCheckout();
      });
      
      requestAnimationFrame(() => toast.classList.add('show'));
      
      setTimeout(() => {
        if(toast.parentElement) {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 400);
        }
      }, 5000);
    }

    openCart() {
      this.cartSidebar.classList.add('active');
      this.cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeCart() {
      this.cartSidebar.classList.remove('active');
      this.cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    openCheckout() {
      this.checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    closeCheckout() {
      this.checkoutModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    processCheckout() {
      const name = document.getElementById('cxName').value;
      const phone = document.getElementById('cxPhone').value;
      const address = document.getElementById('cxAddress').value;
      const details = document.getElementById('cxDetails').value;

      let total = 0;
      let orderText = `Hola *Vértice* ✨\nQuiero realizar el siguiente pedido con pago *Contra Entrega*:\n\n`;
      orderText += `*🛍️ PRODUCTOS:*\n`;
      
      this.cart.forEach(item => {
        orderText += `- ${item.qty}x ${item.name} (${item.color}, Talla ${item.size}) - $${(item.price * item.qty).toLocaleString('es-CO')}\n`;
        total += item.price * item.qty;
      });

      orderText += `\n*💰 TOTAL A PAGAR:* $${total.toLocaleString('es-CO')}\n\n`;
      orderText += `*📦 DATOS DE ENVÍO:*\n`;
      orderText += `Nombre: ${name}\n`;
      orderText += `Teléfono: ${phone}\n`;
      orderText += `Dirección: ${address}\n`;
      if (details) orderText += `Detalles: ${details}\n`;

      const encoded = encodeURIComponent(orderText);
      const waLink = `https://wa.me/573052294646?text=${encoded}`;
      
      // Clear cart
      this.cart = [];
      this.saveCart();
      this.updateCartUI();
      this.closeCheckout();

      // Open WhatsApp
      window.open(waLink, '_blank');
    }
  }

  // ─── Initialize Everything ────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const smoothScroll = new SmoothScroll();
    new Preloader(() => {
      new MagneticElements();
      new TextSplitter();
      new ScrollReveal();
      new HeroParallax(smoothScroll);
      new NavbarController(smoothScroll);
      new ScrollProgress(smoothScroll);
      new WhatsAppFloat();
      new FAQAccordion();
      new EcommerceSystem();

      // Trigger hero divider animation
      setTimeout(() => {
        const heroDivider = document.querySelector('.hero__divider .divider--dot');
        if (heroDivider) heroDivider.classList.add('animated');
      }, 800);

      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.revealed)').forEach(el => el.classList.add('revealed'));
      }, 1500);
    });
  });

})();
