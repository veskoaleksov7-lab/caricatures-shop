/* ===================================================
   ARTHOUSE CARICATURES — MAIN JS
   =================================================== */
'use strict';

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let fx = 0, fy = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  function animFollower() {
    fx += (cx - fx) * 0.14;
    fy += (cy - fy) * 0.14;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animFollower);
  }
  animFollower();

  document.querySelectorAll('a, button, .gallery__filter, .style-chip, .counter-btn, .liquid-toggle__track, .upload-zone')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

  document.querySelectorAll('h1, h2, h3, p')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
    });
})();

/* ── RIPPLE EFFECT ── */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.ripple-btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

/* ── NAV SCROLL ── */
(function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileMenu.querySelectorAll('.nav__mobile-link').forEach(l => {
    l.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => io.observe(el));
})();

/* ── HOW IT WORKS SCROLL STORYTELLING ── */
(function initHowItWorks() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.how__step--reveal').forEach(el => io.observe(el));
})();

/* ── PARALLAX SHAPES ── */
(function initParallax() {
  const shapes = document.querySelectorAll('.shape[data-depth]');
  if (!shapes.length) return;
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    shapes.forEach(s => {
      const depth = parseFloat(s.dataset.depth);
      s.style.transform = `translateY(${sy * depth * 0.25}px)`;
    });
  }, { passive: true });
})();

/* ── MAGNETIC BUTTON ── */
(function initMagnetic() {
  document.querySelectorAll('.btn--magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ── 3D TILT CARDS ── */
(function initTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03,1.03,1.03)`;
      card.style.boxShadow = `${-x * 16}px ${y * 16}px 40px rgba(62,39,35,0.18)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
})();

/* ── GALLERY ── */
(function initGallery() {
  const reel       = document.getElementById('galleryReel');
  const progressEl = document.getElementById('galleryProgress');
  const prevBtn    = document.getElementById('galleryPrev');
  const nextBtn    = document.getElementById('galleryNext');
  const filterBtns = document.querySelectorAll('.gallery__filter');
  const modal      = document.getElementById('galleryModal');
  const modalImg   = document.getElementById('modalImage');
  const modalLabel = document.getElementById('modalLabel');
  const modalClose = document.getElementById('modalClose');
  const backdrop   = document.getElementById('modalBackdrop');

  if (!reel) return;

  /* ── Progress + arrow state ──────────────────────── */
  function updateUI() {
    const max = reel.scrollWidth - reel.clientWidth;
    const pct = max > 0 ? (reel.scrollLeft / max) * 100 : 0;
    if (progressEl) progressEl.style.width = pct + '%';
    if (prevBtn) prevBtn.disabled = reel.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = reel.scrollLeft >= max - 2;
  }
  reel.addEventListener('scroll', updateUI, { passive: true });
  updateUI();

  /* ── Arrow click → scroll by 80% of visible width ── */
  function scrollReel(dir) {
    reel.scrollBy({ left: dir * reel.clientWidth * 0.8, behavior: 'smooth' });
  }
  if (prevBtn) prevBtn.addEventListener('click', () => scrollReel(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollReel(1));

  /* ── Keyboard ──────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (document.activeElement && document.activeElement.closest('.configurator')) return;
    if (e.key === 'ArrowLeft')  scrollReel(-1);
    if (e.key === 'ArrowRight') scrollReel(1);
  });

  /* ── Drag-to-scroll (desktop mouse) ──────────────── */
  let isDragging = false, startX = 0, startScroll = 0, hasDragged = false;

  reel.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging  = true;
    hasDragged  = false;
    startX      = e.clientX;
    startScroll = reel.scrollLeft;
    reel.classList.add('is-dragging');
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    reel.classList.remove('is-dragging');
    // small delay so click fires correctly after drag
    setTimeout(() => { hasDragged = false; }, 100);
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) hasDragged = true;
    reel.scrollLeft = startScroll - dx;
    updateUI();
  });

  /* ── Filter ───────────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const cat = btn.dataset.filter;
      reel.querySelectorAll('.gallery__item').forEach(item => {
        if (cat === 'all' || item.dataset.category === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      reel.scrollLeft = 0;
      setTimeout(updateUI, 50);
    });
  });

  /* ── Modal ────────────────────────────────────────── */
  document.addEventListener('click', e => {
    if (hasDragged) return; // don't open modal after drag
    const btn = e.target.closest('.gallery__view-btn');
    if (!btn) return;
    const card  = btn.closest('.gallery__card');
    if (!card) return;
    const img   = card.querySelector('.gallery__img');
    const label = card.querySelector('.gallery__overlay-label');
    modalImg.src  = img ? img.src  : '';
    modalImg.alt  = img ? img.alt  : '';
    modalLabel.textContent = label ? label.textContent : '';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (backdrop)   backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Skeleton loader removal ──────────────────────── */
  reel.querySelectorAll('.gallery__img').forEach(img => {
    const sk = img.previousElementSibling;
    function onLoad() { if (sk) sk.classList.add('hidden'); }
    if (img.complete) onLoad();
    else img.addEventListener('load', onLoad);
  });
})();




/* ── CONFIGURATOR ── */
(function initConfigurator() {
  // ── ЦЕНИ (промени тук за актуализация) ──
  const BASE_PRICE = 20;      // Базова цена (1 карикатура, 1 лице)
  const FACE_PRICE = 2;       // +€2 за всяко допълнително лице
  const ELEMENT_PRICE = 2;    // +€2 за всеки елемент с изображение (1-вият е безплатен)
  const PRINT_A4_PRICE = 5;   // Печат в рамка А4 (21x30 см)
  const PRINT_A3_PRICE = 10;  // Печат в рамка А3 (30x42 см)
  const EXPRESS_PRICE = 10;   // Експресна доставка 24ч

  let state = {
    faces: 1, elements: 0,
    printSize: 'none', // 'none' | 'a4' | 'a3'
    express: false,
    style: 'classic',
    email: ''
  };

  function getTotal() {
    let t = BASE_PRICE;
    // Допълнителни лица: от 2-ро нагоре
    if (state.faces > 1) t += (state.faces - 1) * FACE_PRICE;
    // Елементи: 1-вият е безплатен, от 2-ри нагоре +€2
    if (state.elements > 1) t += (state.elements - 1) * ELEMENT_PRICE;
    // Печат в рамка
    if (state.printSize === 'a4') t += PRINT_A4_PRICE;
    if (state.printSize === 'a3') t += PRINT_A3_PRICE;
    // Експресна доставка
    if (state.express) t += EXPRESS_PRICE;
    return t;
  }

  function bumpEl(el) {
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 250);
  }

  function updatePriceUI() {
    const total = getTotal();
    const fmt = `€${total}`;
    document.getElementById('priceAmount').textContent = fmt;
    document.getElementById('reviewTotal').textContent = fmt;
    document.getElementById('cartBtnPrice').textContent = fmt;
    bumpEl(document.getElementById('priceAmount'));
    bumpEl(document.getElementById('reviewTotal'));
    document.getElementById('cartItemPrice').textContent = fmt;
    document.getElementById('cartTotal').textContent = fmt;
  }

  function updateReview() {
    document.getElementById('reviewFaces').textContent = state.faces;
    document.getElementById('reviewElements').textContent = state.elements;
    document.getElementById('reviewStyle').textContent = state.style.charAt(0).toUpperCase() + state.style.slice(1);
    const printLabels = { none: 'Не', a4: 'А4 рамка (+€5)', a3: 'А3 рамка (+€10)' };
    document.getElementById('reviewPrint').textContent = printLabels[state.printSize] || 'Не';
    document.getElementById('reviewExpress').textContent = state.express ? 'Да (+€10, 24ч)' : 'Не (48ч)';
  }

  // Counter buttons
  function makeCounter(upId, downId, valId, key, min, max) {
    const valEl = document.getElementById(valId);
    document.getElementById(upId).addEventListener('click', () => {
      if (state[key] >= max) return;
      state[key]++;
      valEl.textContent = state[key];
      bumpEl(valEl);
      updatePriceUI();
    });
    document.getElementById(downId).addEventListener('click', () => {
      if (state[key] <= min) return;
      state[key]--;
      valEl.textContent = state[key];
      bumpEl(valEl);
      updatePriceUI();
    });
  }
  makeCounter('facesUp', 'facesDown', 'facesVal', 'faces', 1, 8);
  makeCounter('elementsUp', 'elementsDown', 'elementsVal', 'elements', 0, 6);

  // Toggles
  document.getElementById('expressToggle').addEventListener('change', e => {
    state.express = e.target.checked;
    updatePriceUI();
  });

  // Print size radio buttons
  document.querySelectorAll('input[name="printSize"]').forEach(radio => {
    radio.addEventListener('change', e => {
      state.printSize = e.target.value;
      updatePriceUI();
    });
  });

  // Style chips
  document.querySelectorAll('.style-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.style-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.style = chip.dataset.style;
      updateReview();
    });
  });

  // Textarea char count
  const visionText = document.getElementById('visionText');
  visionText.addEventListener('input', () => {
    document.getElementById('charCount').textContent = visionText.value.length;
  });

  // Step wizard
  const steps = document.querySelectorAll('.config-step');
  const stepDots = document.querySelectorAll('.step-dot');
  const progressF = document.getElementById('progressFill');
  let currentStep = 1;

  function goToStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    const target = document.getElementById('step' + n);
    if (target) target.classList.add('active');

    stepDots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i + 1 < n) d.classList.add('done');
      if (i + 1 === n) d.classList.add('active');
    });

    progressF.style.width = ((n / 4) * 100) + '%';
    currentStep = n;

    if (n === 4) { updateReview(); updatePriceUI(); }

    // Show floating price from step 3 onward
    document.getElementById('priceFloat').classList.toggle('visible', n >= 3);
    updatePriceUI();

    // Scroll configurator into view
    document.getElementById('configurator').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Next / Prev buttons
  document.getElementById('step1Next').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    if (!window.uploadedFiles || window.uploadedFiles.length === 0) {
      const zone = document.getElementById('uploadZone');
      zone.style.border = '2px solid red';
      setTimeout(() => zone.style.border = '', 1000);
      return;
    }
    goToStep(2);
  });
  document.getElementById('step2Prev').addEventListener('click', () => goToStep(1));
  document.getElementById('step2Next').addEventListener('click', () => goToStep(3));
  document.getElementById('step3Prev').addEventListener('click', () => goToStep(2));
  document.getElementById('step3Next').addEventListener('click', () => { updateReview(); goToStep(4); });
  document.getElementById('step4Prev').addEventListener('click', () => goToStep(3));

  // Email validation
  function validateEmail(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

  // Add to cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    const emailInput = document.getElementById('emailInput');
    const emailError = document.getElementById('emailError');
    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add('error');
      emailError.classList.add('visible');
      emailInput.addEventListener('animationend', () => emailInput.classList.remove('error'), { once: true });
      return;
    }
    emailError.classList.remove('visible');
    state.email = emailInput.value;
    state.phone = (document.getElementById('phoneInput').value || '').trim();

    // Cart state
    document.getElementById('cartItem').style.display = 'flex';
    document.getElementById('cartEmpty').style.display = 'none';
    document.getElementById('cartFooter').style.display = 'block';
    document.getElementById('cartDetails').textContent = `${state.faces} face(s) · ${state.elements} element(s) · ${state.style}`;
    document.getElementById('cartCount').style.display = 'flex';

    // Thumb - use first uploaded file if available
    const cartThumb = document.getElementById('cartThumb');
    if (window.uploadedFiles && window.uploadedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = e => { cartThumb.src = e.target.result; };
      reader.readAsDataURL(window.uploadedFiles[0]);
    } else {
      cartThumb.src = 'assets/images/hero.png';
    }

    openCart();
    fireConfetti();
  });

  // Cart panel
  const cartPanel = document.getElementById('cartPanel');
  const cartBackdrop = document.getElementById('cartBackdrop');

  function openCart() {
    cartPanel.classList.add('open');
    cartBackdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartPanel.classList.remove('open');
    cartBackdrop.classList.remove('visible');
    document.body.style.overflow = '';
  }

  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartBackdrop.addEventListener('click', closeCart);
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!window.uploadedFiles || window.uploadedFiles.length === 0) {
      alert("Моля, качете поне една снимка преди да завършите поръчката!");
      return;
    }

    const originalText = checkoutBtn.innerText;
    checkoutBtn.innerText = "⏳ Изпращане...";
    checkoutBtn.disabled = true;

    let caption = `🆕 *Нова Поръчка от ArtHouse!*\n\n`;
    caption += `📧 *Имейл:* ${state.email}\n`;
    caption += `📞 *Телефон/Viber/WhatsApp:* ${state.phone || '—'}\n`;
    caption += `🎨 *Стил:* ${state.style}\n`;
    caption += `👥 *Лица:* ${state.faces}\n`;
    caption += `🐾 *Елементи:* ${state.elements}\n`;
    caption += `🖨️ *Печат:* ${state.print ? "Да" : "Не"}\n`;
    caption += `⚡ *Експресна:* ${state.express ? "Да" : "Не"}\n`;
    caption += `\n📝 *Описание:*\n${document.getElementById('visionText').value || "Няма описание"}`;

    try {
      const formData = new FormData();
      formData.append('chat_id', '2104447273');
      
      const mediaGroup = [];
      
      window.uploadedFiles.forEach((file, index) => {
        const attachName = `photo${index}`;
        formData.append(attachName, file);
        
        let mediaObj = {
          type: 'photo',
          media: `attach://${attachName}`
        };
        
        if (index === 0) {
          mediaObj.caption = caption;
          mediaObj.parse_mode = 'Markdown';
        }
        mediaGroup.push(mediaObj);
      });
      
      formData.append('media', JSON.stringify(mediaGroup));

      // Изпращаме данните към нашия защитен Vercel сървър вместо директно към Telegram
      const response = await fetch('/api/send-order', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.ok) {
        alert('Поръчката е приета успешно! 🎉 Очаквайте нискокачествено превю на вашия шедьовър на имейла си в рамките на 48ч.');
        closeCart();
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert('Грешка при изпращането: ' + result.description);
      }
    } catch (error) {
      console.error(error);
      alert('Грешка с мрежата. Моля, сигурете се че сте свързани с интернет.');
    } finally {
      checkoutBtn.innerText = originalText;
      checkoutBtn.disabled = false;
    }
  });

})(); // END initConfigurator

/* ── UPLOAD DRAG & DROP ── */
(function initUpload() {
  const zone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('uploadPreview');
  const inner = document.getElementById('uploadZoneInner');
  const grid = document.getElementById('uploadGrid');
  
  window.uploadedFiles = []; // Global state for files

  function renderGrid() {
    grid.innerHTML = '';
    if (window.uploadedFiles.length === 0) {
      preview.style.display = 'none';
      inner.style.display = 'flex';
      return;
    }
    preview.style.display = 'flex';
    inner.style.display = 'none';

    window.uploadedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = e => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb-wrapper';
        thumb.dataset.index = index;

        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'thumb-img';
        img.alt = file.name;

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.className = 'thumb-remove';
        removeBtn.type = 'button';
        removeBtn.setAttribute('data-remove-index', index);
        // Override cursor:none from global CSS and ensure it's above the fileInput overlay
        removeBtn.style.cssText = `
          position: absolute; top: 4px; right: 4px;
          width: 22px; height: 22px; border-radius: 50%;
          background: rgba(180,30,30,0.85); color: #fff;
          border: none; font-size: 15px; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          z-index: 10; cursor: pointer !important;
          pointer-events: all !important;
          transition: transform 0.15s, background 0.15s;
        `;

        removeBtn.addEventListener('click', function(ev) {
          ev.stopPropagation();
          ev.preventDefault();
          const idx = parseInt(this.getAttribute('data-remove-index'), 10);
          window.uploadedFiles.splice(idx, 1);
          renderGrid();
        });

        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        grid.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  }

  zone.addEventListener('click', e => {
    // fileInput covers the whole zone (position:absolute, inset:0)
    // Only programmatically click it if the user clicked on something other than the input or a remove button
    if (e.target === fileInput || e.target.tagName === 'BUTTON') return;
    fileInput.click();
  });

  fileInput.addEventListener('change', () => { 
    if (fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(f => {
        if(window.uploadedFiles.length < 10) {
          window.uploadedFiles.push(f);
        }
      });
      renderGrid();
    }
  });

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(f => {
        if(window.uploadedFiles.length < 10 && f.type.startsWith('image/')) {
          window.uploadedFiles.push(f);
        }
      });
      renderGrid();
    }
  });
})();

/* ── NEWSLETTER ── */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const error = document.getElementById('newsletterError');
  const success = document.getElementById('newsletterSuccess');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const val = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!valid) {
      input.classList.add('error');
      error.classList.add('visible');
      input.addEventListener('animationend', () => input.classList.remove('error'), { once: true });
      return;
    }
    error.classList.remove('visible');
    form.style.display = 'none';
    success.style.display = 'flex';
  });
})();

/* ── CONFETTI ── */
function fireConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = ['#C9A96E', '#3E2723', '#E3C99A', '#F9F4F0', '#5D3A34', '#FAD5A5'];
  const COUNT = 120;
  let particles = [];

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 8 + 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 5,
      vy: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      gravity: 0.12,
      life: 1,
      decay: Math.random() * 0.012 + 0.008
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.angle += p.spin;
      p.life -= p.decay;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.4);
      ctx.restore();
    });
    if (particles.length > 0) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
  // Canvas must never block pointer events
  canvas.style.pointerEvents = 'none';
}

/* ── HERO IMAGE TILT ON MOUSE MOVE ── */
(function initHeroTilt() {
  const frame = document.getElementById('heroFrame');
  if (!frame) return;
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    frame.style.transform = `perspective(1000px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
  });
})();

/* ── SMOOTH ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (a.target === '_blank') return; // never intercept external links
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── GALLERY MODAL CLOSE LINK ── */
document.querySelector('.modal__cta')?.addEventListener('click', () => {
  document.getElementById('galleryModal').classList.remove('open');
  document.body.style.overflow = '';
});

/* ============================================================
   BILINGUAL SYSTEM — EN / BG
   ============================================================ */
(function initI18n() {

  const translations = {
    bg: {
      page_title: 'Арт Хаус Карикатури — Персонализирани Дигитални Портрети',
      meta_desc: 'Превърни снимките си в изключителни дигитални карикатури. Ръчно изработени за рождени дни, сватби, двойки, домашни любимци и професии.',
      nav_logo_sub: 'Карикатури',
      nav_gallery: 'Галерия',
      nav_process: 'Процес',
      nav_order: 'Поръчай',
      nav_contact: 'Контакт',
      nav_cta: 'Създай карикатура',
      // Hero
      hero_eyebrow: 'Персонализирано Дигитално Изкуство',
      hero_headline: 'Твоята история,<br/><em>превърната</em><br/>в изкуство.',
      hero_sub: 'Превръщаме най-скъпите ти моменти в изключително уникални дигитални карикатурни портрети. Премиум качество. Безкрайни детайли.',
      hero_cta: 'Създай своята карикатура',
      hero_gallery: 'Разгледай галерията',
      badge_artworks: 'Създадени творби',
      badge_clients: 'Доволни клиенти',
      badge_delivery: 'Доставка',
      hero_artwork_label: 'Премиум Творба',
      hero_scroll: 'Скролирай надолу',
      // Gallery
      gallery_eyebrow: 'Нашето Портфолио',
      gallery_title: 'Всеки момент<br/><em>заслужава изкуство.</em>',
      gallery_sub: 'Разгледай колекцията ни от персонализирани дигитални карикатури, всяка с любов изработена да улови личността и радостта.',
      filter_all: 'Всички',
      filter_birthdays: 'Рождени дни',
      filter_weddings: 'Сватби',
      filter_couples: 'Двойки',
      filter_pets: 'Домашни любимци',
      filter_professions: 'Професии',
      overlay_birthday1: 'Изненада за рожден ден',
      overlay_wedding: 'Завинаги заедно',
      overlay_couple: 'Любовна история',
      overlay_pet: 'Пухкаво семейство',
      overlay_profession: 'Професионалистът',
      overlay_birthday2: 'Незабравим момент',
      gallery_view: 'Виж',
      modal_cta: 'Поръчай подобна',
      // How it Works
      hiw_eyebrow: 'Нашият процес',
      hiw_title: 'Три стъпки до<br/><em>чиста магия.</em>',
      hiw_step1_h: 'Качи своята снимка',
      hiw_step1_p: 'Просто плъзни и пусни любимата си снимка. Нашата система приема всякакъв формат и ще те насочим към идеалния кадър.',
      hiw_step2_h: 'Опиши своята визия',
      hiw_step2_p: 'Разкажи ни всичко — фонови теми, аксесоари, стилови предпочитания и всички специални детайли. Колкото повече споделиш, толкова по-магичен ще е резултатът.',
      hiw_step3_h: 'Получи чиста магия',
      hiw_step3_p: 'В рамките на 48 часа шедьовърът ти пристига на имейл като висококачествен дигитален файл, готов за печат, споделяне и съхранение завинаги.',
      // Order
      order_eyebrow: 'Поръчай своето изкуство',
      order_title: 'Създай своя<br/><em>шедьовър.</em>',
      step1_label: 'Качи',
      step2_label: 'Опиши',
      step3_label: 'Персонализирай',
      step4_label: 'Преглед',
      // Step 1
      step1_title: 'Качи своите снимки',
      step1_sub: 'Можеш да качиш до 10 снимки тук.',
      upload_text: 'Плъзни и пусни снимката си тук',
      upload_link: 'разгледай файловете',
      upload_formats: 'JPG, PNG, HEIC до 20MB',
      upload_success: 'Снимката е готова!',
      btn_continue: 'Продължи',
      // Step 2
      step2_title: 'Опиши своята визия',
      step2_sub: 'Нарисувай ни картина с думите си.',
      vision_label: 'Твоята визия за творбата',
      vision_placeholder: 'напр. \'Карикатура за рожден ден на съпруга ми като супергерой, с нашия лабрадор до него. Фон: залез на плажа. Той обича риболов — може би с въдица?\'',
      style_label: 'Предпочитан стил',
      chip_classic: 'Класически',
      chip_cartoon: 'Карикатура',
      chip_realistic: 'Реалистичен',
      chip_watercolor: 'Акварел',
      delivery_label: 'Формат на доставка',
      print_label: 'Дигитален файл (PNG/PDF)',
      print_extra: '+ Премиум печатен пакет',
      btn_back: '← Назад',
      // Step 3
      step3_title: 'Персонализирай поръчката си',
      step3_sub: 'Цените се обновяват автоматично с всеки твой избор.',
      faces_h: 'Брой лица / хора',
      faces_p: '+€2 за всяко допълнително лице (от 2-ро нагоре)',
      elements_h: 'Допълнителни елементи',
      elements_p: '1 елемент безплатно. Елементи с описание с думи (топка, пура, куче...) — безплатни. Елементи с конкретно изображение: +€2/бр.',
      express_h: 'Експресна доставка (24ч)',
      express_p: 'С приоритет от нашия старши артист',
      btn_review: 'Прегледай поръчката',
      delivery_label: 'Формат на доставка',
      delivery_sub: 'Получаваш дигитален файл с висока резолюция. По желание можеш да добавиш печат в рамка.',
      print_none: 'Само дигитален файл',
      print_a4: 'Печат в рамка А4 (21×30 см)',
      print_a3: 'Печат в рамка А3 (30×42 см)',
      review_print_label: 'Печат в рамка',
      // Step 4
      step4_title: 'Прегледай поръчката си',
      step4_sub: 'Всичко изглежда перфектно? Нека го направим официално.',
      review_photo_label: 'Твоята снимка',
      review_photo_val: 'Качена ✓',
      review_style_label: 'Стил',
      review_faces_label: 'Лица / Хора',
      review_elements_label: 'Персонализирани елементи',
      review_print_label: 'Печатен пакет',
      review_express_label: 'Експресна доставка',
      review_no: 'Не',
      review_no_48: 'Не (48ч)',
      review_total: 'Общо',
      email_label: 'Имейл за доставка',
      email_placeholder: 'твой@имейл.com',
      email_error: 'Моля, въведи валиден имейл адрес.',
      phone_label: 'Телефон / Viber / WhatsApp',
      phone_optional: '(по желание)',
      phone_placeholder: '+359 88 888 8888',
      btn_add_cart: 'Добави в количката —',
      // Price float
      price_label: 'Твоята цена',
      price_sub: 'ДДС включено',
      // Cart
      cart_title: 'Твоята количка',
      cart_item_title: 'Персонализирана дигитална карикатура',
      cart_empty: 'Количката ти е празна.',
      cart_start: 'Направи поръчка',
      btn_checkout: 'Продължи към плащане',
      // Footer
      footer_tagline: 'Превръщаме спомените в изключително изкуство. Всеки щрих разказва твоята история.',
      footer_services: 'Услуги',
      service1: 'Карикатури за рожден ден',
      service2: 'Сватбени портрети',
      service3: 'Творби за двойки',
      service4: 'Илюстрации на животни',
      service5: 'Професионални карикатури',
      footer_company: 'Компания',
      company1: 'За нас',
      company2: 'Нашите артисти',
      company3: 'Блог',
      company4: 'Въпроси',
      company5: 'Отзиви',
      newsletter_h: 'Вдъхновявай се',
      newsletter_p: 'Получавай ексклузивни арт съвети и специални оферти директно в пощата си.',
      newsletter_placeholder: 'твой@имейл.com',
      newsletter_error: 'Моля, въведи валиден имейл.',
      newsletter_success: 'Вече си в списъка!',
      footer_copy: '© 2026 ArtHouse Карикатури. Всички права запазени.',
      footer_privacy: 'Политика за поверителност',
      footer_terms: 'Общи условия',
      footer_refund: 'Политика за връщане',
    },

    en: {
      page_title: 'ArtHouse Caricatures — Bespoke Digital Portraits',
      meta_desc: 'Transform your photos into extraordinary custom digital caricatures. Handcrafted for birthdays, weddings, couples, pets and professions.',
      nav_logo_sub: 'Caricatures',
      nav_gallery: 'Gallery',
      nav_process: 'Process',
      nav_order: 'Order',
      nav_contact: 'Contact',
      nav_cta: 'Start Artwork',
      // Hero
      hero_eyebrow: 'Bespoke Digital Art',
      hero_headline: 'Your Story,<br/><em>Artfully</em><br/>Caricatured.',
      hero_sub: 'We transform your most cherished moments into extraordinary, one-of-a-kind digital caricature portraits. Premium quality. Infinite detail.',
      hero_cta: 'Start Your Artwork',
      hero_gallery: 'Explore Gallery',
      badge_artworks: 'Artworks Created',
      badge_clients: 'Happy Clients',
      badge_delivery: 'Delivery',
      hero_artwork_label: 'Premium Artwork',
      hero_scroll: 'Scroll to explore',
      // Gallery
      gallery_eyebrow: 'Our Portfolio',
      gallery_title: 'Every moment<br/><em>deserves art.</em>',
      gallery_sub: 'Browse our collection of bespoke digital caricatures, each lovingly crafted to capture personality and joy.',
      filter_all: 'All',
      filter_birthdays: 'Birthdays',
      filter_weddings: 'Weddings',
      filter_couples: 'Couples',
      filter_pets: 'Pets',
      filter_professions: 'Professions',
      overlay_birthday1: 'Birthday Surprise',
      overlay_wedding: 'Forever Together',
      overlay_couple: 'Love Story',
      overlay_pet: 'Furry Family',
      overlay_profession: 'The Professional',
      overlay_birthday2: 'Milestone Moment',
      gallery_view: 'View',
      modal_cta: 'Order Similar',
      // How it Works
      hiw_eyebrow: 'Our Process',
      hiw_title: 'Three steps to<br/><em>pure magic.</em>',
      hiw_step1_h: 'Upload Your Photo',
      hiw_step1_p: 'Simply drag and drop your favourite photo. Our artist-friendly system accepts any format and we\'ll guide you to the perfect shot.',
      hiw_step2_h: 'Describe Your Vision',
      hiw_step2_p: 'Tell us everything — background themes, accessories, style preferences, and any special details. The more you share, the more magical the result.',
      hiw_step3_h: 'Receive Pure Magic',
      hiw_step3_p: 'Within 48 hours, your masterpiece arrives in your inbox as a high-resolution digital file, ready to print, share, and treasure forever.',
      // Order
      order_eyebrow: 'Commission Your Art',
      order_title: 'Create your<br/><em>masterpiece.</em>',
      step1_label: 'Upload',
      step2_label: 'Describe',
      step3_label: 'Customize',
      step4_label: 'Review',
      // Step 1
      step1_title: 'Upload Your Photos',
      step1_sub: 'You can upload up to 10 photos here.',
      upload_text: 'Drag & drop your photo here',
      upload_link: 'browse files',
      upload_formats: 'JPG, PNG, HEIC up to 20MB',
      upload_success: 'Photo ready!',
      btn_continue: 'Continue',
      // Step 2
      step2_title: 'Describe Your Vision',
      step2_sub: 'Paint us a picture with your words.',
      vision_label: 'Your artwork vision',
      vision_placeholder: 'e.g. \'A birthday caricature of my husband as a superhero, with our golden retriever by his side. Background: golden sunset on a beach. He loves fishing — maybe include a fishing rod?\'',
      style_label: 'Style Preference',
      chip_classic: 'Classic',
      chip_cartoon: 'Cartoon',
      chip_realistic: 'Realistic',
      chip_watercolor: 'Watercolor',
      delivery_label: 'Delivery Format',
      print_label: 'Digital File (PNG/PDF)',
      print_extra: '+ Premium Print Package',
      btn_back: '← Back',
      // Step 3
      step3_title: 'Customize Your Order',
      step3_sub: 'Prices update automatically as you choose.',
      faces_h: 'Number of Faces / People',
      faces_p: '€25 per additional person',
      elements_h: 'Custom Elements / Pets',
      elements_p: '€15 per additional element or pet',
      express_h: 'Express Delivery (24h)',
      express_p: 'Prioritized by our senior artist',
      btn_review: 'Review Order',
      // Step 4
      step4_title: 'Review Your Order',
      step4_sub: 'Everything looks perfect? Let\'s make it official.',
      review_photo_label: 'Your Photo',
      review_photo_val: 'Uploaded ✓',
      review_style_label: 'Style',
      review_faces_label: 'Faces / People',
      review_elements_label: 'Custom Elements',
      review_print_label: 'Print Package',
      review_express_label: 'Express Delivery',
      review_no: 'No',
      review_no_48: 'No (48h)',
      review_total: 'Total',
      email_label: 'Your Email for Delivery',
      email_placeholder: 'your@email.com',
      email_error: 'Please enter a valid email address.',
      phone_label: 'Phone / Viber / WhatsApp',
      phone_optional: '(optional)',
      phone_placeholder: '+359 88 888 8888',
      btn_add_cart: 'Add to Cart —',
      // Price float
      price_label: 'Your Price',
      price_sub: 'VAT included',
      // Cart
      cart_title: 'Your Cart',
      cart_item_title: 'Custom Digital Caricature',
      cart_empty: 'Your cart is empty.',
      cart_start: 'Start an Order',
      btn_checkout: 'Proceed to Checkout',
      // Footer
      footer_tagline: 'Transforming memories into extraordinary art. Every brushstroke tells your story.',
      footer_services: 'Services',
      service1: 'Birthday Caricatures',
      service2: 'Wedding Portraits',
      service3: 'Couple Artwork',
      service4: 'Pet Illustrations',
      service5: 'Professional Caricatures',
      footer_company: 'Company',
      company1: 'About Us',
      company2: 'Our Artists',
      company3: 'Blog',
      company4: 'FAQ',
      company5: 'Reviews',
      newsletter_h: 'Stay Inspired',
      newsletter_p: 'Get exclusive art tips and special offers delivered to your inbox.',
      newsletter_placeholder: 'your@email.com',
      newsletter_error: 'Please enter a valid email.',
      newsletter_success: 'You\'re on the list!',
      footer_copy: '© 2026 ArtHouse Caricatures. All rights reserved.',
      footer_privacy: 'Privacy Policy',
      footer_terms: 'Terms of Service',
      footer_refund: 'Refund Policy',
    }
  };

  // Badge hour display per language
  const badgeHour = { bg: '48ч', en: '48h' };

  let currentLang = 'bg';

  function applyLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    if (!t) return;

    // page title
    document.title = t.page_title;

    // data-i18n — text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });

    // data-i18n-html — innerHTML (supports <br>, <em> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // data-i18n-placeholder — input/textarea placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Fix the 48h badge explicitly (it's a raw text node in .badge__num)
    var deliveryNum = document.querySelectorAll('.badge__num');
    deliveryNum.forEach(function (n) {
      if (n.textContent === '48ч' || n.textContent === '48h') {
        n.textContent = badgeHour[lang];
      }
    });

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update toggle active states
    document.getElementById('langBg').classList.toggle('active', lang === 'bg');
    document.getElementById('langEn').classList.toggle('active', lang === 'en');

    // Persist preference
    try { localStorage.setItem('arthouse-lang', lang); } catch (e) { }
  }

  // Language toggle click handler
  var toggle = document.getElementById('langToggle');
  toggle.addEventListener('click', function (e) {
    var opt = e.target.closest('[data-lang]');
    if (opt) {
      var targetLang = opt.getAttribute('data-lang');
      if (targetLang !== currentLang) applyLanguage(targetLang);
    } else {
      // Click anywhere on toggle = switch
      applyLanguage(currentLang === 'bg' ? 'en' : 'bg');
    }
  });
  toggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      applyLanguage(currentLang === 'bg' ? 'en' : 'bg');
    }
  });

  // Magnetic hover on toggle
  toggle.addEventListener('mousemove', function (e) {
    var r = toggle.getBoundingClientRect();
    var dx = (e.clientX - r.left - r.width / 2) * 0.25;
    var dy = (e.clientY - r.top - r.height / 2) * 0.25;
    toggle.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateY(-1px)';
  });
  toggle.addEventListener('mouseleave', function () {
    toggle.style.transform = '';
  });

  // Add toggle to cursor hover tracking
  document.body.addEventListener('mouseover', function (e) {
    if (e.target.closest('#langToggle')) document.body.classList.add('cursor-hover');
  });
  document.body.addEventListener('mouseout', function (e) {
    if (e.target.closest('#langToggle')) document.body.classList.remove('cursor-hover');
  });

  // Init: read saved preference or default to BG
  var saved = '';
  try { saved = localStorage.getItem('arthouse-lang') || 'bg'; } catch (e) { saved = 'bg'; }
  applyLanguage(saved);

  // Expose globally so configurator can update review labels in current lang
  window.i18n = { t: function (key) { return translations[currentLang][key] || key; }, lang: function () { return currentLang; } };
})();
