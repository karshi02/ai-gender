// gesture-detector.js
class GestureDetector {
    constructor() {
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.hands = null;
        this.onTwoFingers = null;
        this.isRunning = false;
    }

    async init(onTwoFingersCallback) {
        this.onTwoFingers = onTwoFingersCallback;
        
        // โหลด MediaPipe Hands
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        document.head.appendChild(script);
        
        const handsScript = document.createElement('script');
        handsScript.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        document.head.appendChild(handsScript);
        
        await new Promise(resolve => {
            handsScript.onload = resolve;
        });
        
        // สร้าง video element
        this.video = document.createElement('video');
        this.video.setAttribute('autoplay', '');
        this.video.setAttribute('playsinline', '');
        this.video.style.display = 'none';
        document.body.appendChild(this.video);
        
        // สร้าง canvas สำหรับตรวจจับ
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // ตั้งค่า MediaPipe Hands
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.hands.onResults((results) => this.onHandResults(results));
        
        // เปิดกล้อง
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.video.srcObject = stream;
        
        const camera = new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({image: this.video});
            },
            width: 640,
            height: 480
        });
        camera.start();
        
        this.isRunning = true;
        console.log('✅ Gesture detector started');
    }
    
    onHandResults(results) {
        if (!this.isRunning) return;
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const isTwoFingers = this.detectTwoFingers(landmarks);
            
            if (isTwoFingers && this.onTwoFingers) {
                this.onTwoFingers();
                // ป้องกันการเรียกซ้ำบ่อยเกินไป
                setTimeout(() => {}, 2000);
            }
        }
    }
    
    detectTwoFingers(landmarks) {
        // นิ้วชี้ (tip: 8, pip: 6)
        // นิ้วกลาง (tip: 12, pip: 10)
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        const middleTip = landmarks[12];
        const middlePip = landmarks[10];
        
        const isIndexUp = indexTip.y < indexPip.y;
        const isMiddleUp = middleTip.y < middlePip.y;
        
        // ตรวจสอบว่านิ้วอื่นๆ งอ
        const ringTip = landmarks[16];
        const ringPip = landmarks[14];
        const pinkyTip = landmarks[20];
        const pinkyPip = landmarks[18];
        
        const isRingDown = ringTip.y > ringPip.y;
        const isPinkyDown = pinkyTip.y > pinkyPip.y;
        const isThumbDown = landmarks[4].x < landmarks[3].x; // ง่ายๆ
        
        return isIndexUp && isMiddleUp && isRingDown && isPinkyDown;
    }
    
    stop() {
        this.isRunning = false;
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }
}

// ประกาศให้ global ใช้ได้
window.GestureDetector = GestureDetector;