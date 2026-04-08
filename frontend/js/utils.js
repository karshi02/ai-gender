// ========== HELPERS ==========
function clearAllIntervals() {
  if (currentInterval) { clearInterval(currentInterval); currentInterval = null; }
  if (currentTimeout) { clearTimeout(currentTimeout); currentTimeout = null; }
}

function validateImageSize(base64String) {
  const sizeInMB = (base64String.length * 0.75) / (1024 * 1024);
  if (sizeInMB > MAX_IMAGE_SIZE_MB) {
    showToast(`รูปภาพใหญ่เกินไป (${sizeInMB.toFixed(1)}MB) กรุณาใช้รูปไม่เกิน ${MAX_IMAGE_SIZE_MB}MB`, 'error');
    return false;
  }
  return true;
}

async function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}