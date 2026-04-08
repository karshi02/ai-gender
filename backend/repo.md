backend/
│
├── server.js                 (ตัวเริ่มต้น server - แค่เรียก app)
├── app.js                    (ตั้งค่า Express, middleware, routes)
│
├── routes/
│   ├── main.routes.js        (route หลัก: /, /health, /upload)
│   ├── ai.routes.js          (route AI: /generate-leonardo, /generate-4)
│   └── admin.routes.js       (route admin: /admin, /api/admin/*)
│
├── controllers/
│   ├── upload.controller.js  (จัดการอัปโหลดไฟล์)
│   ├── ai.controller.js      (จัดการ generate รูป)
│   └── admin.controller.js   (จัดการ login, API key, system status)
│
├── services/
│   └── leonardo.service.js   (เรียก Leonardo API, upload, poll, generate)
│
├── middlewares/
│   └── auth.middleware.js    (requireAdmin, session config)
│
└── utils/
    └── env.util.js           (อ่าน/เขียน .env file)