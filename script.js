// =============================================
// 東京ドローンパーク — JavaScript
// =============================================

// ---- Blog pages: HOME button (back to top page) ----
(function () {
  var isBlogPage = document.querySelector('.blog-wrap') || document.querySelector('.blog-index-wrap');
  if (!isBlogPage) return;
  var btn = document.createElement('a');
  btn.href = '../index.html';
  btn.className = 'blog-home-btn';
  btn.setAttribute('aria-label', 'TOPページへ戻る');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M3 12L12 3L21 12"/><path d="M5 10V20H9.5V15H14.5V20H19V10"/></svg><span>TOP</span>';
  document.body.appendChild(btn);
})();

// ---- Header scroll behavior ----
const header = document.getElementById('siteHeader');
const handleHeaderScroll = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};
window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll();

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ---- Duplicate ticker items for seamless loop ----
const tickerItems = document.querySelector('.ticker-items');
if (tickerItems) {
  const clone = tickerItems.cloneNode(true);
  tickerItems.parentElement.appendChild(clone);
}

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Lazy-load videos (pause offscreen to save performance) ----
const videoEls = document.querySelectorAll('video[autoplay]');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.1 });

videoEls.forEach(v => videoObserver.observe(v));

// ---- Works filter ----
const filterBtns = document.querySelectorAll('.works-filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    workCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger reveal for newly shown cards
        if (!card.classList.contains('visible')) {
          requestAnimationFrame(() => card.classList.add('visible'));
        }
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- Hero title: scatter on hover ----
(function () {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  // Split each .hero-line into individual character spans
  titleEl.querySelectorAll('.hero-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    [...text].forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.classList.add('hero-char');
      const angle = Math.random() * 360;
      const dist  = 130 + Math.random() * 240;
      const rot   = (Math.random() - 0.5) * 540;
      span.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
      span.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * dist}px`);
      span.style.setProperty('--tr', `${rot}deg`);
      span.style.setProperty('--td', `${Math.random() * 0.15}s`);
      line.appendChild(span);
    });
  });

  titleEl.addEventListener('mouseenter', () => titleEl.classList.add('scattered'));
  titleEl.addEventListener('mouseleave', () => titleEl.classList.remove('scattered'));
})();

// ---- Parallax on hero ----
const heroContent = document.querySelector('.hero-content');
window.addEventListener('scroll', () => {
  if (!heroContent) return;
  const y = window.scrollY;
  heroContent.style.transform = `translateY(${y * 0.25}px)`;
}, { passive: true });

// ---- Contact form feedback ----
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 送信中
    submitBtn.textContent = '送信中...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // 送信完了
        submitBtn.textContent = '送信完了 ✓';
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '#5BCFB5';
        submitBtn.style.color = '#fff';
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      submitBtn.textContent = '送信失敗 — 再度お試しください';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.background = '#ff6b6b';
      submitBtn.style.color = '#fff';
    }
  });
}

