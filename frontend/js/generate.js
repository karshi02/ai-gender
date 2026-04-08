// ========== GENERATE ==========
async function startGenerate() {
  if (!selectedTheme || !photoBase64) { showToast('กรุณาถ่ายรูปและเลือกธีม', 'error'); return; }
  if (!validateImageSize(photoBase64)) return;
  gotoScreen('generating');
  document.getElementById('genLoadingState').style.display = 'flex';
  document.getElementById('genSelectState').classList.remove('show');
  document.getElementById('genEmoji').textContent = selectedTheme.icon;
  const steps = ['gs1','gs2','gs3','gs4'];
  const bar = document.getElementById('genProgressBar');
  let stepIdx = 0;
  steps.forEach(s => { document.getElementById(s).className = 'gen-step'; });
  bar.style.width = '0%';
  const advanceStep = () => {
    if (stepIdx > 0) { document.getElementById(steps[stepIdx-1]).classList.remove('active'); document.getElementById(steps[stepIdx-1]).classList.add('done'); }
    if (stepIdx < steps.length) { document.getElementById(steps[stepIdx]).classList.add('active'); bar.style.width = ((stepIdx+1)/steps.length*100)+'%'; stepIdx++; }
  };
  advanceStep();
  currentInterval = setInterval(() => { if (stepIdx < steps.length) advanceStep(); else { clearInterval(currentInterval); currentInterval = null; } }, 2500);
  try {
    const response = await fetch('/api/generate-4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: selectedTheme.name, prompt: selectedTheme.prompt, referenceImage: photoBase64, strength: 0.45 })
    });
    clearAllIntervals();
    steps.forEach(s => { document.getElementById(s).classList.remove('active'); document.getElementById(s).classList.add('done'); });
    bar.style.width = '100%';
    if (!response.ok) { const err = await response.json(); throw new Error(err.error || 'API error'); }
    const data = await response.json();
    if (data.success && data.imageUrls && data.imageUrls.length > 0) {
      generatedImages = data.imageUrls;
      showImageSelection(generatedImages);
    } else { throw new Error(data.error || 'ไม่สามารถสร้างภาพได้'); }
  } catch(err) {
    clearAllIntervals();
    console.error(err);
    showToast('⚠️ ' + err.message, 'error');
    setTimeout(() => {
      generatedImages = [photoDataUrl, photoDataUrl, photoDataUrl, photoDataUrl];
      showImageSelection(generatedImages);
    }, 1000);
  }
}

function showImageSelection(images) {
  document.getElementById('genLoadingState').style.display = 'none';
  document.getElementById('genSelectState').classList.add('show');
  selectedImageIndex = -1;
  document.getElementById('btnSelectResult').disabled = true;
  document.getElementById('btnSelectResult').textContent = 'เลือกภาพนี้';
  const grid = document.getElementById('gen4Grid');
  grid.innerHTML = images.map((url, i) =>
    `<div class="gen-4card" id="gen4card-${i}" onclick="selectGenImage(${i})">
      <img src="${url}" alt="Option ${i+1}" loading="lazy">
      <div class="card-check">✓</div>
    </div>`
  ).join('');
}

function selectGenImage(idx) {
  document.querySelectorAll('.gen-4card').forEach(c => c.classList.remove('selected'));
  document.getElementById('gen4card-' + idx).classList.add('selected');
  selectedImageIndex = idx;
  document.getElementById('btnSelectResult').disabled = false;
  document.getElementById('btnSelectResult').textContent = `✨ ใช้ภาพที่ ${idx+1}`;
}

function confirmSelectedImage() {
  if (selectedImageIndex < 0) return;
  showResult(generatedImages[selectedImageIndex], generatedImages[selectedImageIndex] === photoDataUrl);
}