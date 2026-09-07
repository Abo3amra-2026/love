<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>لمريومتي</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;800&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; touch-action: manipulation; }
        
        body, html {
            width: 100%; height: 100%;
            background-color: #0a0002;
            overflow: hidden;
            font-family: 'Cairo', sans-serif;
            color: white;
            position: fixed; 
        }

        #magicCanvas {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 1;
        }

        #start-container {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
            transition: opacity 0.8s ease;
        }

        .glass-btn {
            padding: 18px 45px;
            font-size: 20px;
            font-weight: 800;
            color: white;
            background: rgba(255, 10, 84, 0.2);
            border: 2px solid rgba(255, 10, 84, 0.5);
            border-radius: 50px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            cursor: pointer;
            box-shadow: 0 0 25px rgba(255, 10, 84, 0.4);
            animation: pulseBtn 2s infinite;
        }

        @keyframes pulseBtn {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 10, 84, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(255, 10, 84, 0.6); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 10, 84, 0.3); }
        }

        #ui-container {
            position: absolute;
            bottom: 8%;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 450px;
            z-index: 5;
            text-align: center;
            opacity: 0;
            transition: opacity 1.5s ease, transform 1.5s ease;
        }

        #ui-container.hidden {
            display: none;
        }

        #ui-container.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .glow-title {
            font-size: 26px;
            color: #ffb3c6;
            text-shadow: 0 0 15px #ff0a54, 0 0 25px #ff0a54;
            margin-bottom: 15px;
        }

        .glass-panel {
            background: rgba(20, 0, 5, 0.8);
            border: 1px solid rgba(255, 10, 84, 0.4);
            border-radius: 20px;
            padding: 20px;
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        }

        .subtitle {
            font-size: 16px;
            color: #ffccd5;
            margin-bottom: 15px;
        }

        .timer-grid {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 15px 0;
        }

        .time-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            background: rgba(255, 10, 84, 0.2);
            padding: 10px;
            border-radius: 12px;
            min-width: 65px;
            border: 1px solid rgba(255, 10, 84, 0.3);
        }

        .time-val {
            font-size: 24px;
            font-weight: 800;
            color: #fff;
            text-shadow: 0 0 10px #ff0a54;
        }

        .time-label {
            font-size: 12px;
            color: #ffb3c6;
        }

        .footer-text {
            font-size: 16px;
            color: #ffccd5;
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <canvas id="magicCanvas"></canvas>

    <div id="start-container">
        <button id="start-btn" class="glass-btn">دوسي هنا ي مريومتي ❤️</button>
    </div>

    <div id="ui-container" class="hidden">
        <div class="glow-title">إلى حب حياتي</div>
        <div class="glass-panel">
            <div class="subtitle">حبي لك بيكبر من...</div>
            <div id="timer" class="timer-grid">
                <!-- العداد هيتحط هنا ديناميكياً -->
            </div>
            <div class="footer-text">وإلى الأبد... ❤️</div>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('magicCanvas');
        const ctx = canvas.getContext('2d');
        const startBtn = document.getElementById('start-btn');
        const startContainer = document.getElementById('start-container');
        const uiContainer = document.getElementById('ui-container');
        const timerDiv = document.getElementById('timer');

        let width, height;
        let particles = [];
        let treeIsGrown = false;

        const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#c9184a', '#ffffff'];

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            if (particles.length > 0) {
                updateParticleTargets();
            }
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // --- تعديل العداد ليبدأ من 6/9/2026 ---
        const startDate = new Date('2026-09-06T00:00:00').getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const distance = now - startDate;
            
            if (distance < 0) return;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            timerDiv.innerHTML = `
                <div class="time-box"><span class="time-val">${seconds.toString().padStart(2, '0')}</span><span class="time-label">ثانية</span></div>
                <div class="time-box"><span class="time-val">${minutes.toString().padStart(2, '0')}</span><span class="time-label">دقيقة</span></div>
                <div class="time-box"><span class="time-val">${hours.toString().padStart(2, '0')}</span><span class="time-label">ساعة</span></div>
                <div class="time-box"><span class="time-val">${days}</span><span class="time-label">يوم</span></div>
            `;
        }
        setInterval(updateTimer, 1000);
        updateTimer();

        function getHeartPoint(t, scale) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
            return { x: x * scale, y: y * scale };
        }

        class Particle {
            constructor(targetX, targetY) {
                this.x = width / 2;
                this.y = height + 50;
                this.targetX = targetX;
                this.targetY = targetY;
                
                this.vx = (Math.random() - 0.5) * 12;
                this.vy = (Math.random() - 1) * 15;
                
                this.friction = Math.random() * 0.02 + 0.92; 
                this.springFactor = 0.008 + Math.random() * 0.01; 
                
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 3.5 + 2; 
                this.isFalling = false;
                
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = Math.random() * 0.02; 
            }

            update() {
                if (!this.isFalling) {
                    const dx = this.targetX - this.x;
                    const dy = this.targetY - this.y;
                    
                    this.vx += dx * this.springFactor;
                    this.vy += dy * this.springFactor;
                    this.vx *= this.friction;
                    this.vy *= this.friction;
                    
                    this.x += this.vx;
                    this.y += this.vy;

                    this.angle += this.angleSpeed;
                    this.x += Math.sin(this.angle) * 0.2; 
                    this.y += Math.cos(this.angle) * 0.2;

                    if (treeIsGrown && Math.random() < 0.0002) {
                        this.isFalling = true;
                        this.vx = (Math.random() - 0.5) * 2;
                        this.vy = Math.random() * 1 + 1; 
                    }
                } else {
                    this.vy += 0.03; 
                    this.x += Math.sin(this.angle) * 1.5; 
                    this.angle += 0.04;
                    this.y += this.vy;
                    this.x += this.vx;

                    if (this.y > height + 10) {
                        this.isFalling = false;
                        this.x = width / 2;
                        this.y = height + 50;
                        this.vx = 0;
                        this.vy = 0;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function updateParticleTargets() {
            const isMobile = width < 768;
            const centerX = width / 2;
            const centerY = height * (isMobile ? 0.4 : 0.45);
            const scale = Math.min(width, height) / (isMobile ? 30 : 40);

            particles.forEach(p => {
                const t = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()); 
                const pt = getHeartPoint(t, scale * r);
                p.targetX = centerX + pt.x;
                p.targetY = centerY + pt.y;
            });
        }

        function initTree() {
            particles = [];
            const numParticles = width < 768 ? 2000 : 3000; 
            
            const isMobile = width < 768;
            const centerX = width / 2;
            const centerY = height * (isMobile ? 0.4 : 0.45); 
            const scale = Math.min(width, height) / (isMobile ? 30 : 40); 

            for (let i = 0; i < numParticles; i++) {
                const t = Math.random() * Math.PI * 2;
                const r = Math.sqrt(Math.random()); 
                const pt = getHeartPoint(t, scale * r);
                particles.push(new Particle(centerX + pt.x, centerY + pt.y));
            }
        }

        function animate() {
            ctx.fillStyle = 'rgba(10, 0, 2, 0.3)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.globalCompositeOperation = 'lighter';

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            ctx.globalCompositeOperation = 'source-over';
            requestAnimationFrame(animate);
        }

        startBtn.addEventListener('click', () => {
            startContainer.style.opacity = '0';
            
            setTimeout(() => {
                startContainer.style.display = 'none';
                initTree();
                animate(); 
                
                setTimeout(() => {
                    treeIsGrown = true; 
                    uiContainer.classList.remove('hidden');
                    setTimeout(() => uiContainer.classList.add('show'), 50);
                }, 4000);

            }, 800); 
        });
    </script>
</body>
</html>