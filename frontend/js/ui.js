// ========== TOAST ==========
let toastTimer;
function showToast(msg, type='info') {
  if (toastTimer) clearTimeout(toastTimer);
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg;
  document.body.appendChild(t);
  toastTimer = setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

// ========== NAVIGATION ==========
function gotoScreen(name) {
  if (currentScreen === 'photo' && name !== 'photo' && cameraStream) closeCamera();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const targetScreen = document.getElementById('screen-' + name);
  targetScreen.classList.add('active');
  currentScreen = name;
  targetScreen.scrollTop = 0;
  if (name === 'photo') {
    checkSecureContext();
    if (!photoDataUrl) {
      document.getElementById('btnGroupCapture').style.display = 'none';
      document.getElementById('btnGroupCamera').style.display = 'flex';
      document.getElementById('cameraPlaceholder').style.display = 'flex';
      document.getElementById('photoPreview').style.display = 'none';
    }
  }
  if (name === 'theme' && photoDataUrl) updateUserPhotoThumb();
}

function validateAndGoToTheme() {
  if (!photoDataUrl) { showToast('กรุณาถ่ายรูปหรืออัปโหลดรูปก่อน', 'error'); return; }
  gotoScreen('theme');
}