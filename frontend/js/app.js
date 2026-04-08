// ========== INIT ==========
window.addEventListener('load', () => {
  buildThemeGrid();
  buildMarquee();
  checkSecureContext();
  window.addEventListener('beforeunload', () => {
    clearAllIntervals();
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
  });
});

window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Global error:', msg, error);
  return false;
};