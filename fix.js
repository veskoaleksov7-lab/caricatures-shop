const fs = require('fs');

const htmlPath = 'index.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const badHtml = `      <button class="modal__close" id="modalClose" aria-label="Затвори">
                </svg>
              </div>
              <p class="upload-zone__text" data-i18n="upload_text">Плъзни и пусни снимката си тук</p>
              <p class="upload-zone__sub">или <span class="upload-zone__link" data-i18n="upload_link">разгледай
                  файловете</span></p>
              <p class="upload-zone__formats" data-i18n="upload_formats">JPG, PNG, HEIC до 20MB</p>
            </div>
            <div class="upload-zone__preview" id="uploadPreview" style="display:none;">
              <img src="" alt="Твоята качена снимка" id="uploadPreviewImg" />
              <button class="upload-zone__remove" id="removeUpload" aria-label="Премахни снимката">×</button>
              <div class="upload-zone__success">
                <svg class="checkmark" viewBox="0 0 52 52">
                  <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                  <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
                <span data-i18n="upload_success">Снимката е готова!</span>
              </div>
            </div>
            <input type="file" id="fileInput" accept="image/*" class="upload-zone__input"
              aria-label="Качване на файл" />
          </div>

          <button class="btn btn--primary btn--next ripple-btn" id="step1Next">
            <span data-i18n="btn_continue">Продължи</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>`;

const goodHtml = `      <button class="modal__close" id="modalClose" aria-label="Затвори">×</button>
      <img src="" alt="" class="modal__image" id="modalImage" />
      <p class="modal__label" id="modalLabel"></p>
      <a href="#order" class="btn btn--primary modal__cta ripple-btn" data-i18n="modal_cta">Поръчай подобна</a>
    </div>
  </div>

  <!-- ========== HOW IT WORKS ========== -->
  <section class="how" id="how-it-works">
    <div class="section-header reveal-up">
      <p class="section-eyebrow" data-i18n="hiw_eyebrow">Нашият процес</p>
      <h2 class="section-title" data-i18n-html="hiw_title">Три стъпки до<br /><em>чиста магия.</em></h2>
    </div>

    <div class="how__timeline">
      <div class="how__step how__step--reveal">
        <div class="how__num">1</div>
        <div class="how__content">
          <h3 data-i18n="hiw_step1_h">Качи своята снимка</h3>
          <p data-i18n="hiw_step1_p">Просто плъзни и пусни любимата си снимка. Нашата система приема всякакъв формат и ще те насочим към идеалния кадър.</p>
        </div>
      </div>
      <div class="how__step how__step--reveal">
        <div class="how__num">2</div>
        <div class="how__content">
          <h3 data-i18n="hiw_step2_h">Опиши своята визия</h3>
          <p data-i18n="hiw_step2_p">Разкажи ни всичко — фонови теми, аксесоари, стилови предпочитания и всички специални детайли. Колкото повече споделиш, толкова по-магичен ще е резултатът.</p>
        </div>
      </div>
      <div class="how__step how__step--reveal">
        <div class="how__num">3</div>
        <div class="how__content">
          <h3 data-i18n="hiw_step3_h">Получи чиста магия</h3>
          <p data-i18n="hiw_step3_p">В рамките на 48 часа шедьовърът ти пристига на имейл като висококачествен дигитален файл, готов за печат, споделяне и съхранение завинаги.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== ORDER / CONFIGURATOR ========== -->
  <section class="order" id="order">
    <div class="section-header reveal-up">
      <p class="section-eyebrow" data-i18n="order_eyebrow">Поръчай своето изкуство</p>
      <h2 class="section-title" data-i18n-html="order_title">Създай своя<br /><em>шедьовър.</em></h2>
    </div>
    
    <div class="configurator" id="configurator">
      <div class="config-progress">
        <div class="config-progress__bar"><div class="config-progress__fill" id="progressFill"></div></div>
        <div class="config-progress__dots">
          <div class="step-dot active"><span data-i18n="step1_label">Качи</span></div>
          <div class="step-dot"><span data-i18n="step2_label">Опиши</span></div>
          <div class="step-dot"><span data-i18n="step3_label">Персонализирай</span></div>
          <div class="step-dot"><span data-i18n="step4_label">Преглед</span></div>
        </div>
      </div>
      
      <div class="config-steps">
        <!-- STEP 1: Upload -->
        <div class="config-step active" id="step1" data-step="1">
          <h3 class="config-step__title" data-i18n="step1_title">Качи своите снимки</h3>
          <p class="config-step__sub" data-i18n="step1_sub">Можеш да качиш до 10 снимки тук.</p>
          
          <div class="upload-zone" id="uploadZone" role="button" tabindex="0">
            <div class="upload-zone__inner" id="uploadZoneInner">
              <div class="upload-zone__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </div>
              <p class="upload-zone__text" data-i18n="upload_text">Плъзни и пусни снимките си тук</p>
              <p class="upload-zone__sub">или <span class="upload-zone__link" data-i18n="upload_link">разгледай файловете</span></p>
              <p class="upload-zone__formats" data-i18n="upload_formats">JPG, PNG, HEIC до 20MB</p>
            </div>
            
            <div class="upload-zone__preview" id="uploadPreview" style="display:none; padding:1.5rem; width:100%;">
              <div class="upload-grid" id="uploadGrid" style="display:flex; flex-wrap:wrap; gap:10px; width:100%; justify-content:center;">
                <!-- Images will be injected here -->
              </div>
            </div>
            <input type="file" id="fileInput" accept="image/*" multiple class="upload-zone__input" aria-label="Качване на файлове" />
          </div>

          <button class="btn btn--primary btn--next ripple-btn" id="step1Next">
            <span data-i18n="btn_continue">Продължи</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>`;

// Normalize logic for line endings
const normalize = str => str.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n');
html = normalize(html).replace(normalize(badHtml), goodHtml);
fs.writeFileSync(htmlPath, html, 'utf8');

console.log("HTML structure restored.");

// Now JS updates for multiple files and Telegram API
const jsPath = 'js/main.js';
let js = fs.readFileSync(jsPath, 'utf8');

// Replace upload logic
const oldUploadRegex = /\\/\\* ── UPLOAD DRAG & DROP ── \\*\\/[\\s\\S]*?\\}\\)\\(\\);/;
const newUploadLogic = \`/* ── UPLOAD DRAG & DROP ── */
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
        thumb.style.position = 'relative';
        thumb.style.width = '80px';
        thumb.style.height = '80px';
        thumb.style.borderRadius = '8px';
        thumb.style.overflow = 'hidden';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '×';
        removeBtn.style.position = 'absolute';
        removeBtn.style.top = '4px';
        removeBtn.style.right = '4px';
        removeBtn.style.background = 'rgba(0,0,0,0.6)';
        removeBtn.style.color = '#fff';
        removeBtn.style.border = 'none';
        removeBtn.style.borderRadius = '50%';
        removeBtn.style.width = '20px';
        removeBtn.style.height = '20px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.display = 'flex';
        removeBtn.style.alignItems = 'center';
        removeBtn.style.justifyContent = 'center';
        removeBtn.style.fontSize = '14px';
        
        removeBtn.onclick = (e) => {
          e.stopPropagation();
          window.uploadedFiles.splice(index, 1);
          renderGrid();
        };

        thumb.appendChild(img);
        thumb.appendChild(removeBtn);
        grid.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  }

  zone.addEventListener('click', e => {
    if (e.target.tagName !== 'BUTTON') {
      fileInput.click();
    }
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
})();\`;

js = js.replace(oldUploadRegex, newUploadLogic);

// Replace checkout logic to handle sendMediaGroup
const oldCheckoutRegex = /document\\.getElementById\\('checkoutBtn'\\)\\.addEventListener\\('click', async \\(\\) => \\{[\\s\\S]*?\\}\\);/m;
const newCheckoutLogic = \`document.getElementById('checkoutBtn').addEventListener('click', async () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!window.uploadedFiles || window.uploadedFiles.length === 0) {
      alert("Моля, качете поне една снимка преди да завършите поръчката!");
      return;
    }

    const originalText = checkoutBtn.innerText;
    checkoutBtn.innerText = "⏳ Изпращане...";
    checkoutBtn.disabled = true;

    let caption = \`🆕 *Нова Поръчка от ArtHouse!*\\n\\n\`;
    caption += \`📧 *Имейл:* \${state.email}\\n\`;
    caption += \`🎨 *Стил:* \${state.style}\\n\`;
    caption += \`👥 *Лица:* \${state.faces}\\n\`;
    caption += \`🐾 *Елементи:* \${state.elements}\\n\`;
    caption += \`🖨️ *Печат:* \${state.print ? "Да" : "Не"}\\n\`;
    caption += \`⚡ *Експресна:* \${state.express ? "Да" : "Не"}\\n\`;
    caption += \`\\n📝 *Описание:*\\n\${document.getElementById('visionText').value || "Няма описание"}\`;

    try {
      const formData = new FormData();
      formData.append('chat_id', '2104447273');
      
      const mediaGroup = [];
      
      window.uploadedFiles.forEach((file, index) => {
        const attachName = \`photo\${index}\`;
        formData.append(attachName, file);
        
        let mediaObj = {
          type: 'photo',
          media: \`attach://\${attachName}\`
        };
        
        if (index === 0) {
          mediaObj.caption = caption;
          mediaObj.parse_mode = 'Markdown';
        }
        mediaGroup.push(mediaObj);
      });
      
      formData.append('media', JSON.stringify(mediaGroup));

      const response = await fetch('https://api.telegram.org/bot8288215249:AAE1xkxOHOJmTzH9yLqwVe8MoJ74WD8dZMw/sendMediaGroup', {
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
  });\`;

js = js.replace(oldCheckoutRegex, newCheckoutLogic);

// also fix step1 validation to use window.uploadedFiles
js = js.replace(/if \\(!fileInput.files \\|\\| fileInput\\.files\\.length === 0\\) \\{/, \`if (!window.uploadedFiles || window.uploadedFiles.length === 0) {\`);

fs.writeFileSync(jsPath, js, 'utf8');

console.log("JS multiple upload logic updated.");
