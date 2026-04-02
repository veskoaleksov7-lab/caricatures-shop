const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'assets', 'images');
const indexPath = path.join(__dirname, 'index.html');

// Read all files
const files = fs.readdirSync(imgDir).filter(f => !['hero.png', 'birthday.png', 'couple.png', 'pet.png', 'profession.png', 'wedding.png'].includes(f) && (f.endsWith('.jpg') || f.endsWith('.png')));

const cats = ['birthdays', 'weddings', 'couples', 'pets', 'professions'];
const layouts = ['', 'gallery__item--tall', 'gallery__item--wide', '', ''];

let newGrid = `<div class="gallery__grid" id="galleryGrid">\n`;
files.forEach((f, i) => {
    let cat = cats[i % cats.length];
    let layout = layouts[i % layouts.length];
    let catClass = layout ? ` ${layout}` : '';

    newGrid += `      <div class="gallery__item${catClass}" data-category="${cat}">
        <div class="gallery__card tilt-card">
          <div class="gallery__skeleton"></div>
          <img src="assets/images/${f}" alt="Уникална карикатура" class="gallery__img" loading="lazy" />
          <div class="gallery__overlay">
            <p class="gallery__overlay-label" data-i18n="overlay_${i}">Уникално творение</p>
            <button class="gallery__view-btn ripple-btn" data-i18n="gallery_view">Виж</button>
          </div>
        </div>
      </div>\n`;
});
newGrid += `    </div>`;

let html = fs.readFileSync(indexPath, 'utf8');

// Replace everything between <div class="gallery__grid" id="galleryGrid"> and </section> (but keep the </section>)
let regex = /<div class="gallery__grid" id="galleryGrid">[\s\S]*?<\/section>/;
html = html.replace(regex, newGrid + '\n  </section>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated gallery with ' + files.length + ' images.');
