// ========== MARQUEE BUILDER ==========
function buildMarquee() {
  const container = document.getElementById('themesMarquee');
  if (!container) return;
  const doubled = [...MARQUEE_THEMES, ...MARQUEE_THEMES];
  container.innerHTML = doubled.map(t => {
    const fallbackSvg = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231a1a2e'/><text x='50' y='60' font-size='45' text-anchor='middle' fill='%23D4AF37'>${encodeURIComponent(t.icon)}</text></svg>`;
    return `
    <div class="marquee-card ${t.bg}">
      <div class="mc-bg">
        <img src="${t.image}" alt="${t.name.th}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackSvg}'">
      </div>
      <div class="mc-label">${t.name.th}<span class="mc-en">${t.name.en}</span></div>
    </div>`;
  }).join('');
}

// ========== THEME GRID ==========
function buildThemeGrid() {
  const grid = document.getElementById('themeGrid');
  grid.innerHTML = THEMES.map(t =>
    `<div class="theme-tile ${t.bg}" id="tile-${t.id}" data-id="${t.id}">
      <div class="t-icon" style="color:${t.color}">${t.icon}</div>
      <div class="t-name">${t.name}</div>
      <div class="t-en">${t.en}</div>
    </div>`
  ).join('');
  grid.addEventListener('click', e => {
    const tile = e.target.closest('.theme-tile');
    if (tile) selectTheme(tile.dataset.id);
  });
}

function selectTheme(id) {
  selectedTheme = THEMES.find(t => t.id === id);
  document.querySelectorAll('.theme-tile').forEach(t => t.classList.remove('selected'));
  document.getElementById('tile-' + id).classList.add('selected');
  const sampleImg = document.getElementById('themeSampleImg');
  const samplePlaceholder = document.getElementById('themeSamplePlaceholder');
  const sampleLabel = document.getElementById('themeSampleLabel');
  sampleLabel.textContent = selectedTheme.icon + ' ' + selectedTheme.name;
  sampleImg.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='${encodeURIComponent(selectedTheme.color)}'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em' fill='white'%3E${selectedTheme.icon}%3C/text%3E%3C/svg%3E`;
  sampleImg.onload = () => { sampleImg.style.display = 'block'; samplePlaceholder.style.display = 'none'; };
  sampleImg.onerror = () => { sampleImg.style.display = 'none'; samplePlaceholder.style.display = 'flex'; samplePlaceholder.textContent = selectedTheme.icon; samplePlaceholder.style.fontSize = '40px'; };
  const btn = document.getElementById('btnGenerate');
  btn.disabled = false;
  btn.textContent = `✨ สร้างภาพธีม ${selectedTheme.name}`;
}