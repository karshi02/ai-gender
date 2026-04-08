// ========== CAMERA ==========
async function openCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } } });
    cameraStream = stream;
    const vid = document.getElementById('videoEl');
    vid.srcObject = stream;
    vid.style.display = 'block';
    document.getElementById('cameraPlaceholder').style.display = 'none';
    document.getElementById('btnGroupCamera').style.display = 'none';
    document.getElementById('btnGroupLive').style.display = 'flex';
  } catch(e) { showToast('ไม่สามารถเปิดกล้อง: ' + e.message, 'error'); }
}

function closeCamera() {
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  const vid = document.getElementById('videoEl');
  vid.srcObject = null; vid.style.display = 'none';
  document.getElementById('cameraPlaceholder').style.display = 'flex';
  document.getElementById('btnGroupCamera').style.display = 'flex';
  document.getElementById('btnGroupLive').style.display = 'none';
}

function startCountdown() {
  const snapBtn = document.getElementById('snapBtn');
  snapBtn.disabled = true;
  const overlay = document.getElementById('countdownOverlay');
  const num = document.getElementById('countdownNum');
  overlay.classList.add('show');
  let count = 3;
  num.textContent = count;
  const tick = setInterval(() => {
    count--;
    if (count > 0) { num.textContent = count; num.style.animation = 'none'; num.offsetHeight; num.style.animation = 'countPulse 0.9s ease-out'; }
    else { clearInterval(tick); overlay.classList.remove('show'); capturePhoto(); snapBtn.disabled = false; }
  }, 900);
}

function capturePhoto() {
  const vid = document.getElementById('videoEl');
  if (!vid.videoWidth || !vid.videoHeight) { showToast('กรุณารอให้กล้องทำงานก่อนถ่ายรูป', 'error'); return; }
  const canvas = document.getElementById('captureCanvas');
  canvas.width = vid.videoWidth; canvas.height = vid.videoHeight;
  canvas.getContext('2d').drawImage(vid, 0, 0);
  const flash = document.getElementById('flashOverlay');
  flash.classList.add('flash'); setTimeout(() => flash.classList.remove('flash'), 350);
  photoDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  photoBase64 = photoDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
  closeCamera(); setPreviewPhoto(photoDataUrl);
  showToast('📸 ถ่ายรูปสำเร็จ!', 'success');
}

async function handleUpload(input) {
  const file = input.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น', 'error'); return; }
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    showToast(`รูปภาพใหญ่เกินไป (${(file.size/(1024*1024)).toFixed(1)}MB) กรุณาใช้รูปไม่เกิน ${MAX_IMAGE_SIZE_MB}MB`, 'error');
    input.value = ''; return;
  }
  const reader = new FileReader();
  reader.onload = async (e) => {
    const dimensions = await getImageDimensions(e.target.result);
    if (dimensions.width < MIN_IMAGE_DIMENSION || dimensions.height < MIN_IMAGE_DIMENSION) {
      showToast(`รูปภาพเล็กเกินไป (${dimensions.width}x${dimensions.height}px) ต้องอย่างน้อย ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px`, 'error');
      input.value = ''; return;
    }
    photoDataUrl = e.target.result;
    photoBase64 = photoDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
    setPreviewPhoto(photoDataUrl);
    showToast('📁 อัปโหลดสำเร็จ!', 'success');
  };
  reader.onerror = () => showToast('เกิดข้อผิดพลาดในการอัปโหลด', 'error');
  reader.readAsDataURL(file);
  input.value = '';
}

function setPreviewPhoto(dataUrl) {
  const img = document.getElementById('photoPreview');
  img.src = dataUrl; img.style.display = 'block';
  document.getElementById('cameraPlaceholder').style.display = 'none';
  document.getElementById('btnGroupCamera').style.display = 'none';
  document.getElementById('btnGroupCapture').style.display = 'flex';
  updateUserPhotoThumb();
}

function updateUserPhotoThumb() {
  if (!photoDataUrl) return;
  const thumb = document.getElementById('userPhotoThumb');
  thumb.src = photoDataUrl; thumb.style.display = 'block';
  document.getElementById('userPhotoPlaceholder').style.display = 'none';
}

function resetPhoto() {
  photoDataUrl = null; photoBase64 = null;
  const img = document.getElementById('photoPreview');
  img.src = ''; img.style.display = 'none';
  document.getElementById('cameraPlaceholder').style.display = 'flex';
  document.getElementById('btnGroupCapture').style.display = 'none';
  document.getElementById('btnGroupCamera').style.display = 'flex';
  document.getElementById('userPhotoThumb').style.display = 'none';
  document.getElementById('userPhotoPlaceholder').style.display = 'flex';
}

function checkSecureContext() {
  const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const notice = document.getElementById('httpsNotice');
  if (notice) notice.style.display = secure ? 'none' : 'block';
}