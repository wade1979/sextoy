// Waveform Animation Module
// 波形动画模块

class WaveformAnimation {
    constructor() {
        this.isRunning = false;
        this.animationSpeed = 1;
        this.intensity = 0.5;
        this.pattern = 'wave';
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
        this.waves = [];
        this.init();
    }

    // 初始化波形动画
    init() {
        this.createCanvas();
        this.createWaves();
        this.setupEventListeners();
    }

    // 创建画布
    createCanvas() {
        const container = document.getElementById('waveformContainer');
        if (!container) return;

        this.canvas = document.createElement('canvas');
        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    // 调整画布大小
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = document.getElementById('waveformContainer');
        if (container) {
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        }
    }

    // 创建波形数据
    createWaves() {
        this.waves = [
            {
                amplitude: 30,
                frequency: 0.02,
                phase: 0,
                color: '#6366f1',
                opacity: 0.8
            },
            {
                amplitude: 20,
                frequency: 0.03,
                phase: Math.PI / 2,
                color: '#8b5cf6',
                opacity: 0.6
            },
            {
                amplitude: 15,
                frequency: 0.04,
                phase: Math.PI,
                color: '#f59e0b',
                opacity: 0.4
            }
        ];
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听控制参数变化
        document.addEventListener('waveformUpdate', (e) => {
            this.updateParameters(e.detail);
        });
    }

    // 更新动画参数
    updateParameters(params) {
        if (params.speed !== undefined) {
            this.animationSpeed = params.speed / 100;
        }
        if (params.intensity !== undefined) {
            this.intensity = params.intensity / 100;
        }
        if (params.pattern !== undefined) {
            this.pattern = params.pattern;
        }
    }

    // 开始动画
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.animate();
    }

    // 停止动画
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // 动画循环
    animate() {
        if (!this.isRunning || !this.ctx || !this.canvas) return;

        this.clearCanvas();
        this.drawWaves();
        this.updatePhases();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    // 清空画布
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制波形
    drawWaves() {
        const centerY = this.canvas.height / 2;
        const width = this.canvas.width;

        this.waves.forEach((wave, index) => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = wave.color;
            this.ctx.globalAlpha = wave.opacity * this.intensity;
            this.ctx.lineWidth = 2 + index;

            for (let x = 0; x < width; x += 2) {
                const y = this.calculateY(x, wave);
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
        });

        // 重置透明度
        this.ctx.globalAlpha = 1;
    }

    // 计算Y坐标
    calculateY(x, wave) {
        const centerY = this.canvas.height / 2;
        let y = centerY;

        switch (this.pattern) {
            case 'wave':
                y = centerY + wave.amplitude * Math.sin(x * wave.frequency + wave.phase);
                break;
            case 'pulse':
                y = centerY + wave.amplitude * Math.sin(x * wave.frequency + wave.phase) * 
                    Math.sin(x * 0.01 + wave.phase);
                break;
            case 'random':
                y = centerY + wave.amplitude * Math.sin(x * wave.frequency + wave.phase) * 
                    (0.5 + 0.5 * Math.sin(x * 0.005 + wave.phase));
                break;
            default:
                y = centerY + wave.amplitude * Math.sin(x * wave.frequency + wave.phase);
        }

        return y;
    }

    // 更新相位
    updatePhases() {
        this.waves.forEach(wave => {
            wave.phase += 0.02 * this.animationSpeed;
            if (wave.phase > Math.PI * 2) {
                wave.phase -= Math.PI * 2;
            }
        });
    }

    // 设置动画速度
    setSpeed(speed) {
        this.animationSpeed = speed / 100;
        this.dispatchUpdateEvent();
    }

    // 设置强度
    setIntensity(intensity) {
        this.intensity = intensity / 100;
        this.dispatchUpdateEvent();
    }

    // 设置模式
    setPattern(pattern) {
        this.pattern = pattern;
        this.dispatchUpdateEvent();
    }

    // 发送更新事件
    dispatchUpdateEvent() {
        const event = new CustomEvent('waveformUpdate', {
            detail: {
                speed: this.animationSpeed * 100,
                intensity: this.intensity * 100,
                pattern: this.pattern
            }
        });
        document.dispatchEvent(event);
    }

    // 获取当前状态
    getStatus() {
        return {
            isRunning: this.isRunning,
            speed: this.animationSpeed * 100,
            intensity: this.intensity * 100,
            pattern: this.pattern
        };
    }

    // 重置动画
    reset() {
        this.stop();
        this.waves.forEach(wave => {
            wave.phase = 0;
        });
        this.animationSpeed = 1;
        this.intensity = 0.5;
        this.pattern = 'wave';
    }

    // 销毁动画
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
    }
}

// 导出波形动画模块
window.WaveformAnimation = WaveformAnimation;
