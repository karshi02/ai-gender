// ========== RESULT ==========
function showResult(url, isDemo = false) {
  resultUrl = url;
  document.getElementById('resultImg').src = url;
  document.getElementById('compareOriginal').src = photoDataUrl;
  document.getElementById('compareResult').src = url;
  document.getElementById('compareThemeName').textContent = selectedTheme.icon + ' ' + selectedTheme.name;
  document.getElementById('resultBadge').textContent = isDemo ? '⚠️ Demo Mode' : '✦ AI Generated';
  generateQRCode(url);
  gotoScreen('result');
  showToast('🎉 สร้างภาพสำเร็จ!', 'success');
}

function generateQRCode(text) {
  const qrContainer = document.getElementById('qrCode');
  qrContainer.innerHTML = '';
  try {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrContainer, { text, width: 120, height: 120, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    } else throw new Error('not loaded');
  } catch(e) {
    qrContainer.innerHTML = '<div style="font-size:10px;text-align:center;color:#666;">QR Code<br>ไม่สามารถสร้างได้</div>';
  }
}

async function downloadResult() {
  try {
    const img = document.getElementById('resultImg');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 1024; canvas.height = img.naturalHeight || 1024;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.font = '12px "Space Mono", monospace'; ctx.fillStyle = 'rgba(212,175,55,0.5)';
    ctx.fillText('AI Photo Booth Thailand', 10, canvas.height - 10);
    const link = document.createElement('a');
    link.download = 'ai-photobooth-' + (selectedTheme?.id || 'theme') + '-' + Date.now() + '.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.93); link.click();
    showToast('💾 ดาวน์โหลดสำเร็จ!', 'success');
  } catch(e) { window.open(resultUrl, '_blank'); showToast('เปิดรูปในแท็บใหม่', 'info'); }
}

async function shareResult() {
  try {
    const img = document.getElementById('resultImg');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 1024; canvas.height = img.naturalHeight || 1024;
    canvas.getContext('2d').drawImage(img, 0, 0);
    canvas.toBlob(async blob => {
      const file = new File([blob], 'ai-booth.jpg', {type: 'image/jpeg'});
      if (navigator.canShare && navigator.canShare({files: [file]})) {
        await navigator.share({ title: 'AI Photo Booth Thailand', text: 'ลองดูรูปที่ AI สร้างให้ฉัน!', files: [file] });
        showToast('แชร์สำเร็จ!', 'success');
      } else { downloadResult(); }
    }, 'image/jpeg', 0.93);
  } catch(e) { downloadResult(); showToast('แชร์ไม่สำเร็จ, ดาวน์โหลดแทน', 'error'); }
}

function startAgain() {
  clearAllIntervals();
  selectedTheme = null; generatedImages = []; selectedImageIndex = -1;
  resetPhoto();
  const btn = document.getElementById('btnGenerate');
  if (btn) { btn.disabled = true; btn.textContent = 'เลือกธีมก่อน'; }
  document.querySelectorAll('.theme-tile').forEach(t => t.classList.remove('selected'));
  const sampleImg = document.getElementById('themeSampleImg');
  if (sampleImg) { sampleImg.src = ''; sampleImg.style.display = 'none'; }
  const samplePlaceholder = document.getElementById('themeSamplePlaceholder');
  if (samplePlaceholder) { samplePlaceholder.style.display = 'flex'; samplePlaceholder.textContent = '🎭'; }
  const sampleLabel = document.getElementById('themeSampleLabel');
  if (sampleLabel) sampleLabel.textContent = 'เลือกธีม';
  ['gs1','gs2','gs3','gs4'].forEach(id => { const el = document.getElementById(id); if (el) el.className = 'gen-step'; });
  const bar = document.getElementById('genProgressBar');
  if (bar) bar.style.width = '0%';
  gotoScreen('photo');
}