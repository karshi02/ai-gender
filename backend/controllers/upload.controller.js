const multer = require('multer');
const path = require('path'); // ✅ เพิ่มบรรทัดนี้
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
                && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
        ok ? cb(null, true) : cb(new Error('เฉพาะไฟล์รูปภาพเท่านั้น'));
    }
});

const handleUpload = (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'ไม่พบไฟล์รูปภาพ' });
        const buf = fs.readFileSync(req.file.path);
        res.json({
            success: true,
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            base64: `data:${req.file.mimetype};base64,${buf.toString('base64')}`,
            message: 'อัปโหลดรูปสำเร็จ'
        });
        setTimeout(() => {
            fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting file:', err); });
        }, 5000);
    } catch (e) {
        console.error('Upload error:', e);
        res.status(500).json({ error: e.message });
    }
};

module.exports = { upload, handleUpload };