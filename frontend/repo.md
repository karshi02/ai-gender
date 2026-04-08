frontend/
│
├── index.html                 (โครงสร้าง HTML หลัก - ย่อขนาดลง)
│
├── css/
│   ├── main.css              (สไตล์หลักทั้งหมดจาก style ในไฟล์)
│   └── responsive.css        (media queries แยก)
│
├── js/
│   ├── app.js                (ตัวหลัก - initializer, navigation)
│   ├── config.js             (CONFIG, MAX_IMAGE_SIZE_MB, MIN_IMAGE_DIMENSION)
│   ├── data.js               (MARQUEE_THEMES, THEMES - ข้อมูลธีมทั้งหมด)
│   ├── camera.js             (กล้อง, ถ่ายรูป, อัปโหลด)
│   ├── theme.js              (เลือกธีม, แสดง preview, theme grid)
│   ├── generate.js           (เรียก API, สร้างภาพ, แสดงผล)
│   ├── result.js             (แสดงผลลัพธ์, ดาวน์โหลด, แชร์, QR Code)
│   ├── ui.js                 (showToast, updateProgress, animations)
│   └── utils.js              (validateImageSize, getImageDimensions, etc)
│
├── assets/
│   ├── img/                  (รูป icons, samples)
│   ├── videos/               (video background)
│   └── themes/               (theme preview images)
│
└── libs/                     (external libraries ถ้ามี)
    └── qrcode.min.js