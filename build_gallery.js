const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'assets', 'images');
const cats = ['birthdays', 'weddings', 'couples', 'pets', 'professions', 'hobbies'];
const layouts = ['', 'gallery__item--tall', 'gallery__item--wide'];

let newGrid = `<div class="gallery__grid" id="galleryGrid">\n`;
let fileCount = 0;

cats.forEach((cat) => {
    const dir = path.join(baseDir, cat);
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir).filter(f => !f.endsWith('.keep') && !['hero.png', 'birthday.png', 'couple.png', 'pet.png', 'profession.png', 'wedding.png'].includes(f) && (f.endsWith('.jpg') || f.endsWith('.png')));
    
    files.forEach((f) => {
        let layout = layouts[fileCount % layouts.length];
        let catClass = layout ? ` ${layout}` : '';

        newGrid += `      <div class="gallery__item${catClass}" data-category="${cat}">
        <div class="gallery__card tilt-card">
          <div class="gallery__skeleton"></div>
          <img src="assets/images/${cat}/${f}" alt="Карикатура" class="gallery__img" loading="lazy" />
          <div class="gallery__overlay">
            <p class="gallery__overlay-label" data-i18n="overlay_${fileCount}">Творба</p>
            <button class="gallery__view-btn ripple-btn" data-i18n="gallery_view">Виж</button>
          </div>
        </div>
      </div>\n`;
      fileCount++;
    });
});
newGrid += `    </div>`;

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Update filters to include hobbies
let filterRegex = /<div class="gallery__filters reveal-up" role="tablist">[\s\S]*?<\/div>/;
let newFilters = `<div class="gallery__filters reveal-up" role="tablist">
      <button class="gallery__filter active" data-filter="all" role="tab" aria-selected="true" data-i18n="filter_all">Всички</button>
      <button class="gallery__filter" data-filter="birthdays" role="tab" data-i18n="filter_birthdays">Рождени дни</button>
      <button class="gallery__filter" data-filter="weddings" role="tab" data-i18n="filter_weddings">Сватби</button>
      <button class="gallery__filter" data-filter="couples" role="tab" data-i18n="filter_couples">Двойки</button>
      <button class="gallery__filter" data-filter="pets" role="tab" data-i18n="filter_pets">Домашни любимци</button>
      <button class="gallery__filter" data-filter="professions" role="tab" data-i18n="filter_professions">Професии</button>
      <button class="gallery__filter" data-filter="hobbies" role="tab" data-i18n="filter_hobbies">Хобита</button>
    </div>`;
html = html.replace(filterRegex, newFilters);

// Update grid
let gridRegex = /<div class="gallery__grid" id="galleryGrid">[\s\S]*?<\/div>\s*<\/section>/;
html = html.replace(gridRegex, newGrid + '\n  </section>');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Successfully generated gallery with ' + fileCount + ' images.');
