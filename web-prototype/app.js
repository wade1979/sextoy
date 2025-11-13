// Main Application Logic - AI Control Prototype
class SmartControlApp {
    constructor() {
        this.mqttClient = new MQTTClient();
        this.voiceInteraction = new VoiceInteraction();
        // 自由模式使用的波形动画（保留用于向后兼容）
        this.waveformAnimation = typeof WaveformAnimation !== 'undefined' ? new WaveformAnimation() : null;
        
        this.currentScreen = 'home';
        this.currentCharacter = null;
        this.currentScenario = null;
        this.currentMode = null;
        this.setupStep = 1;
        this.isRunning = false;
        this.freeModeState = 'stopped';
        this.aiModeState = 'stopped';
        this.freeModeRunning = false;
        this.aiModeRunning = false;
        this.freeModePaused = false;
        this.aiModePaused = false;
        this.settings = this.loadSettings();
        this.selectedSSID = null;         // 选中的WiFi SSID
        this.selectedPassword = null;     // 输入的WiFi密码
        this.passwordModalInitialized = false; // 密码模态框是否已初始化
        this.deviceToken = this.settings.deviceToken || this.settings.deviceId || null; // 设备Token
        this.deviceConnectionInfo = this.settings.deviceConnectionInfo || null; // 设备连接信息
        this.deviceConnected = !!(this.deviceToken && (this.settings.deviceConnected || this.deviceConnectionInfo));
        this.editingCharacter = null;     // 当前正在编辑的角色
        this.browseMode = 'ai';           // 角色浏览模式：'ai' 或 'idol'
        this.selectionMode = 'ai';        // 角色选择模式：'ai' 或 'idol'
        
        // 波形图相关属性
        this.waveformData = [];           // 存储波形数据点 {time: timestamp, speed: 0-100}
        this.waveformAnimationId = null;  // 动画帧ID
        this.waveformCanvas = null;        // Canvas元素
        this.waveformCtx = null;          // Canvas上下文
        this.waveformLastUpdate = 0;      // 上次更新时间戳
        this.waveformCurrentSpeed = 50;   // 当前速度值（用于平滑变化）
        this.waveformTimeWindow = 20000;  // 显示时间窗口：20秒

        // 聊天状态
        this.chatState = 'compact';
        this.chatMessages = [];
        this.chatRecentLimit = 6;
        this.chatTemplatesCollapsed = false;
        this.chatRecordingTimer = null;
        this.chatRecording = false;
        this.chatMediaPreviewEnabled = true;
        this.currentGreetingUtterance = null;
        this.preferredFemaleVoice = null;
        this.connectionHighlightTimer = null;
        
        // 语音识别实例
        this.freeModeRecognition = null;
        this.aiModeRecognition = null;
        this.isFreeModeListening = false;
        this.isAIModeListening = false;
        this.currentFreeModeUtterance = null;
        this.currentAIModeUtterance = null;
        
        this.setupSpeechVoices();
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.setupEventListeners();         // 设置事件监听器
        this.setupMQTTClient();            // 初始化MQTT客户端
        this.loadCharacters();             // 加载角色数据
        this.loadCharacterSettings();      // 加载保存的角色设置
        this.updateConnectionStatus();     // 更新连接状态
        this.startHeartbeat();             // 启动心跳检测
        this.setupChatModal();             // 初始化AI互动聊天模态框
        this.setupQuickConnect();          // 初始化快速连接入口
        this.refreshQuickConnectUI();      // 同步快速连接状态
        this.updateHomeConnectionState();  // 同步首页功能可用性
    }

    /**
     * 设置所有事件监听器
     * 包括：首页卡片、返回按钮、WiFi配置、角色选择、模式选择等
     */
    setupEventListeners() {
        // Home screen cards
        document.querySelectorAll('.home-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleHomeAction(action);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.dataset.back;
                this.switchScreen(target);
            });
        });

        // Setup flow
        this.setupWiFiFlowListeners();
        
        // Character and scenario selection
        this.setupCharacterListeners();
        this.setupScenarioListeners();
        
        // Mode selection
        this.setupModeListeners();
        
        // Free mode controls
        this.setupFreeModeListeners();
        
        // AI mode controls
        this.setupAIModeListeners();
        
        // Device token actions
        this.setupTokenActions();
        
        // Character editor
        this.setupCharacterEditor();
        
        // Browse tabs
        this.setupBrowseTabs();
        
        // Selection tabs
        this.setupSelectionTabs();
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.switchScreen(screen);
            });
        });
    }

    /**
     * WiFi配置流程监听器
     * 包括：步骤导航、WiFi扫描、密码输入验证
     */
    setupWiFiFlowListeners() {
        // Step navigation
        document.querySelectorAll('[data-next]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = parseInt(e.currentTarget.dataset.next);
                this.nextSetupStep(nextStep);
            });
        });

        // WiFi scan
        const scanWifiBtn = document.getElementById('scanWifi');
        if (scanWifiBtn) {
            scanWifiBtn.addEventListener('click', () => {
                this.scanWiFiNetworks();
            });
        }

        // WiFi password input
        const wifiPasswordInput = document.getElementById('wifiPassword');
        if (wifiPasswordInput) {
            wifiPasswordInput.addEventListener('input', () => {
                this.validateWiFiConfig();
            });
        }
    }

    // Character Selection Listeners
    setupCharacterListeners() {
        // Characters will be dynamically added
    }

    // Scenario Selection Listeners
    setupScenarioListeners() {
        // Scenarios will be dynamically added
    }

    // Mode Selection Listeners
    setupModeListeners() {
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.selectMode(mode);
            });
        });
    }

    // Free Mode Listeners
    setupFreeModeListeners() {
        // Slider controls
        this.setupSliderControls();
        
        // Voice controls
        const voiceCommandBtn = document.getElementById('voiceCommandBtn');
        if (voiceCommandBtn) {
            // 更新提示信息
            voiceCommandBtn.setAttribute('title', '语音指令：快点/慢点/用力/轻点/暂停/继续');
            voiceCommandBtn.setAttribute('aria-label', '语音指令：快点/慢点/用力/轻点/暂停/继续');
            
            voiceCommandBtn.addEventListener('click', () => {
                if (this.isFreeModeListening) {
                    this.stopFreeModeVoiceRecognition();
                } else {
                    this.startFreeModeVoiceRecognition();
                }
            });
        }

        const playPauseBtn = document.getElementById('freePlayPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (this.freeModeState === 'running') {
                    this.pauseFreeMode();
                } else {
                    this.startFreeMode();
                }
            });
        }

        const stopBtn = document.getElementById('freeStopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopFreeMode();
            });
        }
    }

    // AI Mode Listeners
    setupAIModeListeners() {
        // 移除AI模式的麦克风按钮监听器（AI模式不再需要语音输入）

        const aiPlayPauseBtn = document.getElementById('aiPlayPauseBtn');
        if (aiPlayPauseBtn) {
            aiPlayPauseBtn.addEventListener('click', () => {
                if (this.aiModeState === 'running') {
                    this.pauseAIMode();
                } else {
                    this.startAIMode();
                }
            });
        }

        const aiStopBtn = document.getElementById('aiStopBtn');
        if (aiStopBtn) {
            aiStopBtn.addEventListener('click', () => {
                this.stopAIMode();
            });
        }

        // Feedback buttons
        this.setupFeedbackButtons();
    }

    setupFeedbackButtons() {
        const feedbackButtons = {
            feedbackLike: () => this.handleFeedback('like', '我喜欢'),
            feedbackSkip: () => this.handleFeedback('skip', '跳过'),
            feedbackFast: () => this.handleFeedback('fast', '快点'),
            feedbackSlow: () => this.handleFeedback('slow', '慢点'),
            feedbackHard: () => this.handleFeedback('hard', '用力'),
            feedbackSoft: () => this.handleFeedback('soft', '轻点')
        };

        Object.entries(feedbackButtons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', handler);
            }
        });
    }

    handleFeedback(type, message) {
        // Show visual feedback
        const btn = document.getElementById(`feedback${type.charAt(0).toUpperCase() + type.slice(1)}`);
        if (btn) {
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        }

        // Send feedback to AI system
        this.sendFeedbackToAI(type, message);
        
        // Show toast notification
        this.showToast(message, 'info');
    }

    sendFeedbackToAI(type, message) {
        const feedbackData = {
            type: 'feedback',
            action: type,
            message: message,
            timestamp: Date.now(),
            characterId: this.currentCharacter?.id,
            scenarioId: this.currentScenario?.id
        };

        // Send via MQTT
        this.sendCommand(feedbackData);

        // Log feedback
        console.log('User feedback:', feedbackData);
    }

    // Slider Controls Setup
    setupSliderControls() {
        // Stroke Speed
        const strokeSpeedSlider = document.getElementById('strokeSpeedSlider');
        const strokeSpeedValue = document.getElementById('strokeSpeedValue');
        
        if (strokeSpeedSlider && strokeSpeedValue) {
            strokeSpeedSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                strokeSpeedValue.textContent = `${value}%`;
                this.sendCommand(DeviceCommands.setStrokeSpeed(parseInt(value)));
                if (this.waveformAnimation) {
                    this.waveformAnimation.setSpeed(parseInt(value));
                }
            });
        }

        // Rotation Speed
        const rotationSpeedSlider = document.getElementById('rotationSpeedSlider');
        const rotationSpeedValue = document.getElementById('rotationSpeedValue');
        
        if (rotationSpeedSlider && rotationSpeedValue) {
            rotationSpeedSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                rotationSpeedValue.textContent = `${value}%`;
                this.sendCommand(DeviceCommands.setRotationSpeed(parseInt(value)));
            });
        }

        // Suction Intensity
        const suctionIntensitySlider = document.getElementById('suctionIntensitySlider');
        const suctionIntensityValue = document.getElementById('suctionIntensityValue');
        
        if (suctionIntensitySlider && suctionIntensityValue) {
            suctionIntensitySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                suctionIntensityValue.textContent = `${value}%`;
                this.sendCommand(DeviceCommands.setSuctionIntensity(parseInt(value)));
                if (this.waveformAnimation) {
                    this.waveformAnimation.setIntensity(parseInt(value));
                }
            });
        }
    }

    // MQTT Client Setup
    setupMQTTClient() {
        this.mqttClient.onConnect(() => {
            this.updateConnectionStatus();
            this.showToast('设备已连接', 'success');
        });

        this.mqttClient.onDisconnect(() => {
            this.updateConnectionStatus();
            this.showToast('设备已断开', 'warning');
        });

        this.mqttClient.onMessage((topic, message) => {
            this.handleDeviceMessage(topic, message);
        });

        this.mqttClient.onError((error) => {
            console.error('MQTT Error:', error);
            this.showToast('连接错误: ' + error.message, 'error');
        });
    }

    // Screen Management
    switchScreen(screenName) {
        console.log('Switching to screen:', screenName);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('Screen switched successfully to:', screenName);
        } else {
            console.error('Screen not found:', screenName);
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-screen="${screenName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Handle screen-specific initialization
        this.handleScreenEnter(screenName);
    }

    // Handle screen entry
    handleScreenEnter(screenName) {
        switch (screenName) {
            case 'characterBrowse':
                // Render based on current browse mode
                if (this.browseMode === 'idol') {
                    this.renderIdolsForBrowse();
                } else {
                    this.renderCharactersForBrowse();
                }
                break;
            case 'characterScenarios':
                this.renderCharacterScenarios();
                break;
            case 'characterSelection':
                // Clear current scenario when selecting a new character
                this.currentScenario = null;
                // Render based on current selection mode
                if (this.selectionMode === 'idol') {
                    this.renderIdolsForSelection();
                } else {
                    this.renderCharactersForSelection();
                }
                break;
            case 'scenarioSelection':
                this.renderScenarios();
                break;
            case 'freeMode':
                this.updateModeStatus('free', this.freeModeState);
                this.updateFreeModeControls();
                // 请求麦克风权限
                this.requestMicrophonePermission();
                if (this.freeModeState === 'running') {
                    // 延迟初始化波形图，确保DOM已准备好
                    setTimeout(() => {
                        // 停止之前的动画（如果有）
                        if (this.waveformAnimationId) {
                            cancelAnimationFrame(this.waveformAnimationId);
                            this.waveformAnimationId = null;
                        }
                        
                        // 重新初始化波形图
                        this.initWaveform();
                        if (this.waveformCanvas && this.waveformCtx) {
                            console.log('[Free Mode Screen Enter] Waveform initialized, starting animation');
                            this.startWaveformAnimation();
                        } else {
                            console.warn('[Free Mode Screen Enter] Waveform canvas not found, retrying...');
                            setTimeout(() => {
                                this.initWaveform();
                                if (this.waveformCanvas && this.waveformCtx) {
                                    this.startWaveformAnimation();
                                }
                            }, 200);
                        }
                    }, 150);
                } else {
                    // 如果处于暂停或停止状态，停止波形图
                    this.stopWaveformAnimation();
                }
                break;
            case 'aiMode':
                if (this.aiModeState === 'stopped') {
                    this.startAIMode();
                } else {
                    this.updateModeStatus('ai', this.aiModeState);
                    this.updateAIControls();
                    if (this.aiModeState === 'running') {
                        // 延迟初始化波形图，确保DOM已准备好
                        setTimeout(() => {
                            // 停止之前的动画（如果有）
                            if (this.waveformAnimationId) {
                                cancelAnimationFrame(this.waveformAnimationId);
                                this.waveformAnimationId = null;
                            }
                            
                            // 重新初始化波形图
                            this.initWaveform();
                            if (this.waveformCanvas && this.waveformCtx) {
                                console.log('[AI Mode Screen Enter] Waveform initialized, starting animation');
                                this.startWaveformAnimation();
                            } else {
                                console.warn('[AI Mode Screen Enter] Waveform canvas not found, retrying...');
                                setTimeout(() => {
                                    this.initWaveform();
                                    if (this.waveformCanvas && this.waveformCtx) {
                                        this.startWaveformAnimation();
                                    }
                                }, 200);
                            }
                        }, 150);
                        
                        setTimeout(() => {
                            this.updateAIInfo();
                        }, 100);
                    } else {
                        // 如果处于暂停或停止状态，停止波形图
                        this.stopWaveformAnimation();
                    }
                }
                break;
        }
    }

    // Home Action Handler
    handleHomeAction(action) {
        console.log('Home action triggered:', action);

        const actionLabels = {
            characterBrowse: 'AI模式配置',
            modeSelection: '智能模式启动'
        };

        if (!this.isDeviceConnected() && action !== 'wifiSetup') {
            this.showConnectionRequiredPrompt(actionLabels[action]);
            return;
        }

        switch (action) {
            case 'wifiSetup':
                this.switchScreen('wifiSetup');
                break;
            case 'characterBrowse':
                this.switchScreen('characterBrowse');
                break;
            case 'modeSelection':
                this.switchScreen('modeSelection');
                break;
        }
    }

    // WiFi Setup Flow
    nextSetupStep(step) {
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
            if (index + 1 < step) {
                stepEl.classList.add('completed');
                stepEl.classList.remove('active');
            } else if (index + 1 === step) {
                stepEl.classList.add('active');
                stepEl.classList.remove('completed');
            } else {
                stepEl.classList.remove('active', 'completed');
            }
        });

        // Hide current step
        document.querySelectorAll('.setup-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show target step
        const targetStep = document.getElementById(`setupStep${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.setupStep = step;
        }

        // Handle step-specific logic
        this.handleSetupStep(step);
    }

    handleSetupStep(step) {
        switch (step) {
            case 2:
                this.checkDeviceConnection();
                break;
            case 3:
                this.scanWiFiNetworks();
                break;
            case 4:
                this.startWiFiConfiguration();
                break;
        }
    }

    // Device Connection Check
    async checkDeviceConnection() {
        const hotspotStatus = document.getElementById('hotspotStatus');
        const deviceStatus = document.getElementById('deviceStatus');
        const nextBtn = document.getElementById('nextStep2');

        // Simulate hotspot check
        hotspotStatus.textContent = '检测中...';
        await this.delay(2000);
        hotspotStatus.textContent = '已连接';
        hotspotStatus.classList.add('success');

        // Simulate device communication
        deviceStatus.textContent = '建立连接中...';
        await this.delay(1500);
        deviceStatus.textContent = '连接成功';
        deviceStatus.classList.add('success');

        // Enable next button
        nextBtn.disabled = false;
    }

    // WiFi Network Scanning
    async scanWiFiNetworks() {
        const wifiList = document.getElementById('wifiList');
        wifiList.innerHTML = '<div style="text-align: center; padding: 1rem;">扫描中...</div>';

        // Simulate WiFi scanning
        await this.delay(2000);

        const mockNetworks = [
            { name: 'HomeWiFi', strength: '强' },
            { name: 'OfficeWiFi', strength: '中' },
            { name: 'GuestNetwork', strength: '弱' },
            { name: 'NeighborWiFi', strength: '弱' }
        ];

        wifiList.innerHTML = mockNetworks.map(network => `
            <div class="wifi-item" data-ssid="${network.name}">
                <div class="wifi-icon">📶</div>
                <div class="wifi-name">${network.name}</div>
                <div class="wifi-strength">${network.strength}</div>
            </div>
        `).join('');

        // Add click listeners
        wifiList.querySelectorAll('.wifi-item').forEach(item => {
            item.addEventListener('click', () => {
                const ssid = item.dataset.ssid;
                this.selectWiFiNetwork(ssid);
            });
        });
    }

    selectWiFiNetwork(ssid) {
        // Update UI to show selected network
        document.querySelectorAll('.wifi-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        const selectedItem = document.querySelector(`[data-ssid="${ssid}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }

        // Store selected SSID
        this.selectedSSID = ssid;
        
        // Show password modal
        this.showWiFiPasswordModal(ssid);
    }
    
    showWiFiPasswordModal(ssid) {
        const modal = document.getElementById('wifiPasswordModal');
        const wifiName = document.getElementById('selectedWifiName');
        const passwordInput = document.getElementById('wifiPasswordInput');
        const confirmBtn = document.getElementById('confirmPasswordBtn');
        
        wifiName.textContent = ssid;
        passwordInput.value = '';
        confirmBtn.disabled = true;
        
        modal.style.display = 'flex';
        passwordInput.focus();
        
        // Setup modal event listeners if not already set
        if (!this.passwordModalInitialized) {
            this.setupPasswordModal();
            this.passwordModalInitialized = true;
        }
    }
    
    setupPasswordModal() {
        const modal = document.getElementById('wifiPasswordModal');
        const passwordInput = document.getElementById('wifiPasswordInput');
        const showPasswordCheckbox = document.getElementById('showPassword');
        const confirmBtn = document.getElementById('confirmPasswordBtn');
        const cancelBtn = document.getElementById('cancelPasswordBtn');
        const closeBtn = document.getElementById('closePasswordModal');
        const overlay = modal.querySelector('.modal-overlay');
        
        // Password input validation
        passwordInput.addEventListener('input', () => {
            confirmBtn.disabled = passwordInput.value.trim().length === 0;
        });
        
        // Show/hide password toggle
        showPasswordCheckbox.addEventListener('change', (e) => {
            passwordInput.type = e.target.checked ? 'text' : 'password';
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            const password = passwordInput.value.trim();
            if (password.length > 0) {
                this.selectedPassword = password;
                this.hideWiFiPasswordModal();
                // Start WiFi configuration
                this.nextSetupStep(4);
            }
        });
        
        // Cancel/Close buttons
        const closeModal = () => {
            this.hideWiFiPasswordModal();
            // Reset selection
            document.querySelectorAll('.wifi-item').forEach(item => {
                item.classList.remove('selected');
            });
            this.selectedSSID = null;
            this.selectedPassword = null;
        };
        
        cancelBtn.addEventListener('click', closeModal);
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Enter key to confirm
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !confirmBtn.disabled) {
                confirmBtn.click();
            }
        });
    }
    
    hideWiFiPasswordModal() {
        const modal = document.getElementById('wifiPasswordModal');
        modal.style.display = 'none';
    }

    // Generate device token based on device ID (constant for same device)
    generateDeviceToken(deviceId = null) {
        // Use a fixed device ID if not provided (in real app, this would come from device)
        // For prototype, use a fixed value to ensure token is constant
        if (!deviceId) {
            deviceId = 'smart-device-001'; // Fixed device ID for constant token
        }
        
        // Simple hash function to generate token (same input = same output)
        let hash = 0;
        for (let i = 0; i < deviceId.length; i++) {
            const char = deviceId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        
        // Generate token (12 characters, similar to example: 2hwazpsh95yi)
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const tokenLength = 12;
        let token = '';
        const seed = Math.abs(hash);
        
        for (let i = 0; i < tokenLength; i++) {
            token += chars[(seed + i * 37) % chars.length];
        }
        
        return token;
    }

    // WiFi Configuration Process
    async startWiFiConfiguration() {
        const configProgressSection = document.getElementById('configProgressSection');
        const configProgress = document.getElementById('configProgress');
        const configStatus = document.getElementById('configStatus');
        const configResult = document.getElementById('configResult');

        // Show progress section
        configProgressSection.style.display = 'block';
        configResult.style.display = 'none';

        // Start configuration
        configStatus.textContent = '正在配置设备...';

        // Simulate configuration progress
        const steps = [
            '连接设备热点...',
            '发送WiFi配置...',
            '设备重启中...',
            '连接WiFi网络...',
            '验证连接...',
            '获取设备信息...'
        ];

        for (let i = 0; i < steps.length; i++) {
            configStatus.textContent = steps[i];
            configProgress.style.width = `${((i + 1) / steps.length) * 100}%`;
            await this.delay(1500);
        }

        // Hide progress, show result
        configProgressSection.style.display = 'none';
        configResult.style.display = 'block';

        // Generate and display device token (constant for this device)
        // If token already exists, reuse it; otherwise generate new one
        if (!this.deviceToken) {
            this.deviceToken = this.generateDeviceToken();
        }
        document.getElementById('deviceToken').textContent = this.deviceToken;

        // Display connection information (simulated)
        const connectedNetwork = this.selectedSSID || 'HomeWiFi';
        document.getElementById('connectedNetworkName').textContent = connectedNetwork;
        
        // Generate simulated network info
        // In real app, these come from device response
        const simulatedIP = this.generateRandomIP();
        document.getElementById('deviceIP').textContent = simulatedIP;
        document.getElementById('deviceNetmask').textContent = '255.255.255.0';
        document.getElementById('deviceGateway').textContent = simulatedIP.split('.').slice(0, 3).join('.') + '.1';
        document.getElementById('wifiStrength').textContent = '4/4';

        // Store device token and connection info
        this.deviceConnectionInfo = {
            network: connectedNetwork,
            ip: simulatedIP,
            netmask: '255.255.255.0',
            gateway: simulatedIP.split('.').slice(0, 3).join('.') + '.1',
            strength: '4/4'
        };

        this.markDeviceConnected({
            token: this.deviceToken,
            info: this.deviceConnectionInfo
        });
    }
    
    generateRandomIP() {
        // Generate a random IP in common private network ranges
        const ranges = [
            { start: [192, 168, 50], end: 254 },
            { start: [192, 168, 1], end: 254 },
            { start: [10, 0, 0], end: 254 }
        ];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const lastOctet = Math.floor(Math.random() * (range.end - 100) + 10); // Random between 10-244
        return `${range.start[0]}.${range.start[1]}.${range.start[2]}.${lastOctet}`;
    }

    /**
     * 判断当前是否已连接设备
     */
    isDeviceConnected() {
        return !!(this.deviceToken && this.deviceConnected);
    }

    /**
     * 标记设备已连接并保存信息
     */
    markDeviceConnected({ token, info } = {}) {
        if (token) {
            this.deviceToken = token;
        }
        if (info) {
            this.deviceConnectionInfo = info;
        }

        this.deviceConnected = true;
        this.settings.deviceToken = this.deviceToken || this.settings.deviceToken || '';
        this.settings.deviceId = this.settings.deviceId || this.deviceToken || '';
        this.settings.deviceConnected = true;
        this.settings.deviceConnectionInfo = this.deviceConnectionInfo || null;
        this.saveSettings();

        this.updateConnectionStatus();
        this.updateHomeConnectionState();
        this.refreshQuickConnectUI();
    }

    /**
     * 标记设备断开连接
     */
    markDeviceDisconnected() {
        this.deviceConnected = false;
        this.deviceToken = '';
        this.deviceConnectionInfo = null;
        this.settings.deviceConnected = false;
        this.settings.deviceToken = '';
        this.settings.deviceId = '';
        this.settings.deviceConnectionInfo = null;
        this.saveSettings();

        this.updateConnectionStatus();
        this.updateHomeConnectionState();
        this.refreshQuickConnectUI();
    }

    /**
     * 未连接设备时的提示
     */
    showConnectionRequiredPrompt(context = '') {
        const suffix = '，或在首页输入设备 Token 解锁';
        const hint = context ? `请先连接设备后再进入「${context}」${suffix}` : `请先连接设备${suffix}`;
        this.showToast(hint, 'warning');
        this.highlightConnectionCard();
    }

    /**
     * 更新首页功能卡片的连接状态
     */
    updateHomeConnectionState() {
        const cards = document.querySelectorAll('.home-card[data-requires-connection="true"]');
        const connected = this.isDeviceConnected();
        cards.forEach(card => {
            card.classList.toggle('home-card-disabled', !connected);
            card.setAttribute('aria-disabled', String(!connected));
        });
        this.refreshQuickConnectUI();
    }

    highlightConnectionCard() {
        const card = document.querySelector('.home-card[data-action="wifiSetup"]');
        if (!card) return;

        if (this.connectionHighlightTimer) {
            clearTimeout(this.connectionHighlightTimer);
            card.classList.remove('home-card-cta');
        }

        card.classList.add('home-card-cta');
        this.connectionHighlightTimer = setTimeout(() => {
            card.classList.remove('home-card-cta');
            this.connectionHighlightTimer = null;
        }, 1800);
    }

    setupQuickConnect() {
        const tokenInput = document.getElementById('deviceTokenInput');
        const submitBtn = document.getElementById('deviceTokenSubmit');

        if (!tokenInput || !submitBtn) return;

        const handleSubmit = () => {
            if (this.isDeviceConnected()) {
                this.markDeviceDisconnected();
                this.showToast('已断开设备连接', 'info');
                return;
            }

            const value = tokenInput.value.trim();
            if (!value) {
                this.showToast('请输入设备 Token', 'warning');
                tokenInput.focus();
                return;
            }

            this.markDeviceConnected({
                token: value,
                info: {
                    network: '手动输入',
                    ip: '127.0.0.1',
                    netmask: '255.255.255.0',
                    gateway: '127.0.0.1',
                    strength: '模拟'
                }
            });
            this.showToast('已模拟连接设备', 'success');
        };

        submitBtn.addEventListener('click', handleSubmit);
        tokenInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        });

    }

    refreshQuickConnectUI() {
        const container = document.getElementById('homeQuickConnect');
        if (!container) return;

        const tokenInput = document.getElementById('deviceTokenInput');
        const submitBtn = document.getElementById('deviceTokenSubmit');
        const statusText = document.getElementById('quickConnectStatus');

        const connected = this.isDeviceConnected();
        const token = this.deviceToken || '';

        if (tokenInput) {
            tokenInput.value = connected ? token : '';
        }

        if (submitBtn) {
            submitBtn.textContent = connected ? '断开' : '连接设备';
        }

        if (statusText) {
            statusText.textContent = connected ? `已连接：${token}` : '未连接';
        }
    }
    
    // Character Editor Functions
    setupCharacterEditor() {
        // Close edit modal
        const closeEditBtn = document.getElementById('closeEditModal');
        const editModal = document.getElementById('characterEditModal');
        const editModalOverlay = editModal?.querySelector('.modal-overlay');
        
        if (closeEditBtn) {
            closeEditBtn.addEventListener('click', () => {
                this.closeCharacterEditor();
            });
        }
        
        if (editModalOverlay) {
            editModalOverlay.addEventListener('click', () => {
                this.closeCharacterEditor();
            });
        }
        
        // Tab switching
        document.querySelectorAll('.edit-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                this.switchEditTab(targetTab);
            });
        });
        
        // Edit icon buttons
        document.querySelectorAll('.edit-icon-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const editType = e.currentTarget.dataset.edit;
                if (editType) {
                    this.showSelectionModal(editType);
                }
            });
        });
        
        // Voice button in header
        const editVoiceBtn = document.getElementById('editVoiceBtn');
        if (editVoiceBtn) {
            editVoiceBtn.addEventListener('click', () => {
                this.showSelectionModal('voice');
            });
        }
        
        // Selection modal close
        const closeSelectionBtn = document.getElementById('closeSelectionModal');
        const selectionModal = document.getElementById('selectionModal');
        const selectionModalOverlay = selectionModal?.querySelector('.modal-overlay');
        
        if (closeSelectionBtn) {
            closeSelectionBtn.addEventListener('click', () => {
                this.closeSelectionModal();
            });
        }
        
        if (selectionModalOverlay) {
            selectionModalOverlay.addEventListener('click', () => {
                this.closeSelectionModal();
            });
        }
    }
    
    openCharacterEditor(characterId) {
        const character = CHARACTERS[characterId];
        if (!character) return;
        
        this.editingCharacter = character;
        const modal = document.getElementById('characterEditModal');
        
        // Update header name
        const nameEl = document.getElementById('editCharacterName');
        if (nameEl) {
            const displayName = character.name || character.englishName || 'Unknown';
            nameEl.textContent = `${displayName}, ${character.age || 21}`;
        }
        
        // Update info cards
        this.updateEditInfoCards(character);
        
        // Show modal
        if (modal) {
            modal.style.display = 'flex';
        }
    }
    
    closeCharacterEditor() {
        const modal = document.getElementById('characterEditModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.editingCharacter = null;
    }
    
    switchEditTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.edit-tab').forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update panels
        document.querySelectorAll('.tab-panel').forEach(panel => {
            if (panel.id === `panel${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`) {
                panel.classList.add('active');
                panel.style.display = 'block';
            } else {
                panel.classList.remove('active');
                panel.style.display = 'none';
            }
        });
    }
    
    updateEditInfoCards(character) {
        // Name
        const nameEl = document.getElementById('infoName');
        if (nameEl) {
            nameEl.textContent = character.name || character.englishName || 'Unknown';
        }
        
        // Personality
        const personalityEl = document.getElementById('infoPersonality');
        if (personalityEl && character.personality) {
            const option = PERSONALITY_OPTIONS.find(p => p.id === character.personality);
            personalityEl.textContent = option ? option.name : character.personality;
        }
        
        // Relationship
        const relationshipEl = document.getElementById('infoRelationship');
        if (relationshipEl && character.relationship) {
            const option = RELATIONSHIP_OPTIONS.find(r => r.id === character.relationship);
            relationshipEl.textContent = option ? option.name : character.relationship;
        }
        
        // Occupation
        const occupationEl = document.getElementById('infoOccupation');
        if (occupationEl && character.occupation) {
            const option = OCCUPATION_OPTIONS.find(o => o.id === character.occupation);
            if (option) {
                occupationEl.innerHTML = `${option.icon} ${option.name}`;
            } else {
                occupationEl.textContent = character.occupation;
            }
        }
        
        // Kinks
        const kinksEl = document.getElementById('infoKinks');
        if (kinksEl && character.kinks && character.kinks.length > 0) {
            const kinkNames = character.kinks.map(k => {
                const option = KINKS_OPTIONS.find(ko => ko.id === k);
                return option ? option.name : k;
            }).join(', ');
            kinksEl.textContent = kinkNames;
        } else {
            kinksEl.textContent = '-';
        }
        
        // Voice
        const voiceEl = document.getElementById('infoVoice');
        if (voiceEl && character.voice) {
            const option = VOICE_OPTIONS.find(v => v.id === character.voice);
            if (option) {
                voiceEl.textContent = `${option.name} - ${option.description}`;
            } else {
                voiceEl.textContent = character.voice;
            }
        }
    }
    
    showSelectionModal(editType) {
        const modal = document.getElementById('selectionModal');
        const titleEl = document.getElementById('selectionTitle');
        const gridEl = document.getElementById('selectionGrid');
        
        if (!modal || !titleEl || !gridEl) return;
        
        // Set title based on type
        const titles = {
            name: 'Edit Name',
            personality: 'Edit Personality',
            relationship: 'Edit Relationship',
            occupation: 'Edit Occupation',
            kinks: 'Edit Kinks',
            voice: 'Edit Voice'
        };
        titleEl.textContent = titles[editType] || '选择选项';
        
        // Generate selection grid based on type
        let options = [];
        let isMultiSelect = false;
        
        switch (editType) {
            case 'personality':
                options = PERSONALITY_OPTIONS;
                break;
            case 'voice':
                options = VOICE_OPTIONS;
                break;
            case 'relationship':
                options = RELATIONSHIP_OPTIONS;
                break;
            case 'occupation':
                options = OCCUPATION_OPTIONS;
                break;
            case 'kinks':
                options = KINKS_OPTIONS;
                isMultiSelect = true;
                break;
            default:
                // For name, we might need a text input, but for now skip
                return;
        }
        
        // Render selection grid
        gridEl.innerHTML = options.map(option => {
            const isSelected = this.isOptionSelected(editType, option.id);
            const selectedClass = isSelected ? 'selected' : '';
            
            if (editType === 'voice') {
                return `
                    <div class="selection-item ${selectedClass}" data-value="${option.id}" data-type="${editType}">
                        <div class="voice-icon">${option.icon}</div>
                        <div class="selection-name">${option.name}</div>
                        <div class="selection-description">${option.description}</div>
                        ${isSelected ? '<div class="selection-checkmark">✓</div>' : ''}
                    </div>
                `;
            } else {
                const emoji = option.emoji || option.icon || '';
                return `
                    <div class="selection-item ${selectedClass}" data-value="${option.id}" data-type="${editType}">
                        ${emoji ? `<div class="selection-emoji">${emoji}</div>` : ''}
                        <div class="selection-name">${option.name}</div>
                        ${isSelected ? '<div class="selection-checkmark">✓</div>' : ''}
                    </div>
                `;
            }
        }).join('');
        
        // Add click listeners
        gridEl.querySelectorAll('.selection-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.dataset.value;
                this.selectOption(editType, value, isMultiSelect);
                this.updateSelectionDisplay(editType);
            });
        });
        
        // Show modal
        modal.style.display = 'flex';
    }
    
    isOptionSelected(editType, optionId) {
        if (!this.editingCharacter) return false;
        
        switch (editType) {
            case 'personality':
                return this.editingCharacter.personality === optionId;
            case 'voice':
                return this.editingCharacter.voice === optionId;
            case 'relationship':
                return this.editingCharacter.relationship === optionId;
            case 'occupation':
                return this.editingCharacter.occupation === optionId;
            case 'kinks':
                return this.editingCharacter.kinks && this.editingCharacter.kinks.includes(optionId);
            default:
                return false;
        }
    }
    
    selectOption(editType, value, isMultiSelect = false) {
        if (!this.editingCharacter) return;
        
        if (isMultiSelect) {
            // Toggle selection for multi-select (kinks)
            if (!this.editingCharacter.kinks) {
                this.editingCharacter.kinks = [];
            }
            const index = this.editingCharacter.kinks.indexOf(value);
            if (index > -1) {
                this.editingCharacter.kinks.splice(index, 1);
            } else {
                this.editingCharacter.kinks.push(value);
            }
        } else {
            // Single select
            switch (editType) {
                case 'personality':
                    this.editingCharacter.personality = value;
                    break;
                case 'voice':
                    this.editingCharacter.voice = value;
                    break;
                case 'relationship':
                    this.editingCharacter.relationship = value;
                    break;
                case 'occupation':
                    this.editingCharacter.occupation = value;
                    break;
            }
        }
        
        // Update display
        this.updateEditInfoCards(this.editingCharacter);
        this.updateSelectionDisplay(editType);
        
        // Save to localStorage
        this.saveCharacterSettings();
    }
    
    updateSelectionDisplay(editType) {
        const gridEl = document.getElementById('selectionGrid');
        if (!gridEl) return;
        
        gridEl.querySelectorAll('.selection-item').forEach(item => {
            const value = item.dataset.value;
            const isSelected = this.isOptionSelected(editType, value);
            
            if (isSelected) {
                item.classList.add('selected');
                if (!item.querySelector('.selection-checkmark')) {
                    const checkmark = document.createElement('div');
                    checkmark.className = 'selection-checkmark';
                    checkmark.textContent = '✓';
                    item.appendChild(checkmark);
                }
            } else {
                item.classList.remove('selected');
                const checkmark = item.querySelector('.selection-checkmark');
                if (checkmark) {
                    checkmark.remove();
                }
            }
        });
    }
    
    closeSelectionModal() {
        const modal = document.getElementById('selectionModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    saveCharacterSettings() {
        // Save character settings to localStorage
        try {
            const settings = {};
            Object.keys(CHARACTERS).forEach(key => {
                const char = CHARACTERS[key];
                settings[key] = {
                    personality: char.personality,
                    relationship: char.relationship,
                    occupation: char.occupation,
                    kinks: char.kinks,
                    voice: char.voice
                };
            });
            localStorage.setItem('characterSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save character settings:', error);
        }
    }
    
    loadCharacterSettings() {
        // Load character settings from localStorage
        try {
            const saved = localStorage.getItem('characterSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                Object.keys(settings).forEach(key => {
                    if (CHARACTERS[key]) {
                        Object.assign(CHARACTERS[key], settings[key]);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load character settings:', error);
        }
    }
    
    setupTokenActions() {
        const copyTokenBtn = document.getElementById('copyTokenBtn');
        const exitSetupBtn = document.getElementById('exitSetupBtn');
        
        if (copyTokenBtn) {
            copyTokenBtn.addEventListener('click', () => {
                const token = document.getElementById('deviceToken').textContent;
                if (token && token !== '加载中...') {
                    navigator.clipboard.writeText(token).then(() => {
                        this.showToast('Token已复制到剪贴板', 'success');
                        // Visual feedback
                        copyTokenBtn.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            copyTokenBtn.style.transform = '';
                        }, 150);
                    }).catch(err => {
                        // Fallback for older browsers
                        const textarea = document.createElement('textarea');
                        textarea.value = token;
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textarea);
                        this.showToast('Token已复制', 'success');
                    });
                }
            });
        }
        
        if (exitSetupBtn) {
            exitSetupBtn.addEventListener('click', () => {
                this.switchScreen('home');
            });
        }
    }

    // Character Management
    loadCharacters() {
        // Characters are loaded from characters.js
    }

    // Setup browse tabs
    setupBrowseTabs() {
        const tabAI = document.getElementById('browseTabAI');
        const tabIdol = document.getElementById('browseTabIdol');
        
        if (tabAI) {
            tabAI.addEventListener('click', () => {
                this.switchBrowseTab('ai');
            });
        }
        
        if (tabIdol) {
            tabIdol.addEventListener('click', () => {
                this.switchBrowseTab('idol');
            });
        }
    }

    // Switch browse tab
    switchBrowseTab(mode) {
        this.browseMode = mode;
        
        // Update tab buttons in browse page
        const browseTabs = document.getElementById('characterBrowse')?.querySelectorAll('.browse-tab');
        if (browseTabs) {
            browseTabs.forEach(tab => {
                if (tab.dataset.tab === mode) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
        
        // Render content based on mode
        if (mode === 'ai') {
            this.renderCharactersForBrowse();
        } else if (mode === 'idol') {
            this.renderIdolsForBrowse();
        }
    }

    // Setup selection tabs (for AI mode character selection)
    setupSelectionTabs() {
        const tabAI = document.getElementById('selectionTabAI');
        const tabIdol = document.getElementById('selectionTabIdol');
        
        if (tabAI) {
            tabAI.addEventListener('click', () => {
                this.switchSelectionTab('ai');
            });
        }
        
        if (tabIdol) {
            tabIdol.addEventListener('click', () => {
                this.switchSelectionTab('idol');
            });
        }
    }

    // Switch selection tab
    switchSelectionTab(mode) {
        this.selectionMode = mode;
        
        // Update tab buttons in selection page
        const selectionTabs = document.getElementById('characterSelection')?.querySelectorAll('.browse-tab');
        if (selectionTabs) {
            selectionTabs.forEach(tab => {
                if (tab.dataset.tab === mode) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
        
        // Render content based on mode
        if (mode === 'ai') {
            this.renderCharactersForSelection();
        } else if (mode === 'idol') {
            this.renderIdolsForSelection();
        }
    }

    // Render characters for browsing (from homepage) - New video card style
    renderCharactersForBrowse() {
        const characterGrid = document.getElementById('characterBrowseGrid');
        if (!characterGrid) return;

        characterGrid.innerHTML = Object.values(CHARACTERS).map(character => {
            const videoPath = character.videoPath || 'resource/ai/girlfriend/video.mov';
            const age = character.age || 21;
            const displayName = character.name || character.englishName || 'Unknown';
            const style = character.style || '';
            
            // Use background image as poster/placeholder
            const posterImage = character.backgroundImage || '';
            
            return `
                <div class="character-video-card" data-character-id="${character.id}">
                    <div class="video-card-container">
                        <video class="character-video" 
                               preload="none" 
                               muted 
                               loop 
                               playsinline
                               poster="${posterImage}"
                               data-video-path="${videoPath}">
                            <source src="${videoPath}" type="video/quicktime">
                            <source src="${videoPath}" type="video/mp4">
                        </video>
                        <div class="video-overlay"></div>
                        <div class="character-info-overlay">
                            <div class="character-name-age">
                                <span class="name-text">${displayName}</span>
                                <span class="age-text">${age}</span>
                            </div>
                            <div class="character-description">
                                ${character.description}
                                ${style ? `<div class="character-style">Style: ${style}</div>` : ''}
                            </div>
                        </div>
                        <button class="edit-character-btn" data-character-id="${character.id}" title="编辑角色">
                            <span class="edit-icon">✏️</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Add video hover play control with lazy loading
        characterGrid.querySelectorAll('.character-video').forEach(video => {
            const card = video.closest('.character-video-card');
            if (!card) return;
            
            let videoLoaded = false;
            const videoPath = video.dataset.videoPath;
            
            // Function to load video on demand
            const loadVideo = () => {
                if (!videoLoaded && videoPath) {
                    const source = video.querySelector('source');
                    if (source && source.src !== videoPath) {
                        // Set source and load
                        video.querySelectorAll('source').forEach(s => {
                            s.src = videoPath;
                        });
                        video.load();
                    }
                    videoLoaded = true;
                }
            };
            
            // Desktop: hover to play (lazy load on first hover)
            card.addEventListener('mouseenter', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                // Small delay to allow video to start loading
                setTimeout(() => {
                    video.play().catch(err => {
                        // Auto-play prevented, ignore
                    });
                }, 100);
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Mobile: tap to play (lazy load on first tap)
            card.addEventListener('touchstart', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    if (video.paused) {
                        video.play().catch(err => {});
                    } else {
                        video.pause();
                    }
                }, 100);
            });
            
            // Intersection Observer for lazy loading when card enters viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !videoLoaded) {
                        // Load video when card is visible (but don't play)
                        loadVideo();
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before card enters viewport
            });
            
            observer.observe(card);
        });

        // Add click listeners for viewing scenarios
        characterGrid.querySelectorAll('.character-video-card').forEach(card => {
            // Click on card (not edit button) to view scenarios
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking edit button
                if (e.target.closest('.edit-character-btn')) {
                    return;
                }
                
                const characterId = card.dataset.characterId;
                this.currentCharacter = CHARACTERS[characterId];
                this.switchScreen('characterScenarios');
            });
        });

        // Add edit button listeners
        characterGrid.querySelectorAll('.edit-character-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const characterId = btn.dataset.characterId;
                this.openCharacterEditor(characterId);
            });
        });
    }

    // Render idols for browsing - Video card style
    renderIdolsForBrowse() {
        const characterGrid = document.getElementById('characterBrowseGrid');
        if (!characterGrid) return;

        if (typeof IDOLS === 'undefined') {
            characterGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">暂无女优分身数据</div>';
            return;
        }

        characterGrid.innerHTML = Object.values(IDOLS).map(idol => {
            const videoPath = idol.videoPath || 'resource/Moena.mov';
            const age = idol.age || 26;
            const displayName = idol.name || idol.englishName || 'Unknown';
            const posterImage = idol.imagePath || '';
            
            return `
                <div class="character-video-card" data-idol-id="${idol.id}">
                    <div class="video-card-container">
                        <video class="character-video" 
                               preload="none" 
                               muted 
                               loop 
                               playsinline
                               poster="${posterImage}"
                               data-video-path="${videoPath}">
                            <source src="${videoPath}" type="video/quicktime">
                            <source src="${videoPath}" type="video/mp4">
                        </video>
                        <button class="idol-voice-btn" data-idol-id="${idol.id}" title="播放问候语">🔊</button>
                        <div class="video-overlay"></div>
                        <div class="character-info-overlay">
                            <div class="character-name-age">
                                <span class="name-text">${displayName}</span>
                                <span class="age-text">${age}</span>
                            </div>
                            <div class="character-description">
                                ${idol.description || ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add video hover play control with lazy loading
        characterGrid.querySelectorAll('.character-video').forEach(video => {
            const card = video.closest('.character-video-card');
            if (!card) return;
            
            let videoLoaded = false;
            const videoPath = video.dataset.videoPath;
            
            // Function to load video on demand
            const loadVideo = () => {
                if (!videoLoaded && videoPath) {
                    const source = video.querySelector('source');
                    if (source && source.src !== videoPath) {
                        video.querySelectorAll('source').forEach(s => {
                            s.src = videoPath;
                        });
                        video.load();
                    }
                    videoLoaded = true;
                }
            };
            
            // Desktop: hover to play
            card.addEventListener('mouseenter', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    video.play().catch(err => {});
                }, 100);
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Mobile: tap to play
            card.addEventListener('touchstart', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    if (video.paused) {
                        video.play().catch(err => {});
                    } else {
                        video.pause();
                    }
                }, 100);
            });
            
            // Intersection Observer for lazy loading
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !videoLoaded) {
                        loadVideo();
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(card);
        });

        // 添加问候语播放按钮事件
        characterGrid.querySelectorAll('.idol-voice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idolId = btn.dataset.idolId;
                this.playIdolGreeting(idolId);
            });
        });

        // Add click listeners for viewing idol detail
        characterGrid.querySelectorAll('.character-video-card').forEach(card => {
            card.addEventListener('click', () => {
                const idolId = card.dataset.idolId;
                this.showIdolDetail(idolId);
            });
        });
    }

    // Render idols for selection - Video card style
    renderIdolsForSelection() {
        const characterGrid = document.getElementById('characterSelectionGrid');
        if (!characterGrid) return;

        if (typeof IDOLS === 'undefined') {
            characterGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">暂无女优分身数据</div>';
            return;
        }

        characterGrid.innerHTML = Object.values(IDOLS).map(idol => {
            const videoPath = idol.videoPath || 'resource/unisea.mov';
            const age = idol.age || 26;
            const displayName = idol.name || idol.englishName || 'Unknown';
            const posterImage = idol.imagePath || '';
            
            return `
                <div class="character-video-card" data-idol-id="${idol.id}">
                    <div class="video-card-container">
                        <video class="character-video" 
                               preload="none" 
                               muted 
                               loop 
                               playsinline
                               poster="${posterImage}"
                               data-video-path="${videoPath}">
                            <source src="${videoPath}" type="video/quicktime">
                            <source src="${videoPath}" type="video/mp4">
                        </video>
                        <button class="idol-voice-btn" data-idol-id="${idol.id}" title="播放问候语">🔊</button>
                        <div class="video-overlay"></div>
                        <div class="character-info-overlay">
                            <div class="character-name-age">
                                <span class="name-text">${displayName}</span>
                                <span class="age-text">${age}</span>
                            </div>
                            <div class="character-description">
                                ${idol.description || ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add video hover play control with lazy loading
        characterGrid.querySelectorAll('.character-video').forEach(video => {
            const card = video.closest('.character-video-card');
            if (!card) return;
            
            let videoLoaded = false;
            const videoPath = video.dataset.videoPath;
            
            // Function to load video on demand
            const loadVideo = () => {
                if (!videoLoaded && videoPath) {
                    const source = video.querySelector('source');
                    if (source && source.src !== videoPath) {
                        video.querySelectorAll('source').forEach(s => {
                            s.src = videoPath;
                        });
                        video.load();
                    }
                    videoLoaded = true;
                }
            };
            
            // Desktop: hover to play
            card.addEventListener('mouseenter', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    video.play().catch(err => {});
                }, 100);
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Mobile: tap to play
            card.addEventListener('touchstart', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    if (video.paused) {
                        video.play().catch(err => {});
                    } else {
                        video.pause();
                    }
                }, 100);
            });
            
            // Intersection Observer for lazy loading
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !videoLoaded) {
                        loadVideo();
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(card);
        });
        
        // 添加问候语播放按钮事件
        characterGrid.querySelectorAll('.idol-voice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idolId = btn.dataset.idolId;
                this.playIdolGreeting(idolId);
            });
        });

        // Add click listeners for character selection
        characterGrid.querySelectorAll('.character-video-card').forEach(card => {
            card.addEventListener('click', () => {
                const idolId = card.dataset.idolId;
                this.selectIdol(idolId);
            });
        });
    }

    /**
     * 初始化语音合成女声
     */
    setupSpeechVoices() {
        if (!('speechSynthesis' in window)) return;

        const assignVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;
            this.preferredFemaleVoice = this.findPreferredFemaleVoice(voices);
        };

        assignVoice();
        window.speechSynthesis.onvoiceschanged = assignVoice;
    }

    findPreferredFemaleVoice(voices) {
        if (!voices || voices.length === 0) return null;

        const femaleKeywords = ['female', 'woman', 'girl'];
        const preferredNames = [
            'google uk english female',
            'google us english',
            'samantha',
            'victoria',
            'zira',
            'allison',
            'amy',
            'emma',
            'joanna',
            'linda',
            'lisa',
            'olivia',
            'scarlett'
        ];

        const englishVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('en'));

        const preferredVoice = englishVoices.find(voice => {
            const name = voice.name.toLowerCase();
            return preferredNames.some(target => name.includes(target));
        });
        if (preferredVoice) return preferredVoice;

        const keywordVoice = englishVoices.find(voice => {
            const name = voice.name.toLowerCase();
            return femaleKeywords.some(target => name.includes(target));
        });
        if (keywordVoice) return keywordVoice;

        return englishVoices[0] || voices[0];
    }

    /**
     * 播放女优固定问候语
     */
    playIdolGreeting(idolId) {
        if (typeof IDOLS === 'undefined' || !idolId) {
            this.showToast('无法播放问候语，缺少女优数据', 'warning');
            return;
        }

        const idol = IDOLS[idolId] || Object.values(IDOLS).find(item => item.id === idolId);
        const greetingText = idol?.voiceGreeting || 'Hey there, hope you have a great day. I am excited to know you better.';

        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(greetingText);
                if (this.preferredFemaleVoice) {
                    utterance.voice = this.preferredFemaleVoice;
                    utterance.lang = this.preferredFemaleVoice.lang || 'en-US';
                } else {
                    utterance.lang = 'en-US';
                }
                utterance.rate = 1;
                utterance.pitch = 1;
                utterance.onend = () => {
                    this.currentGreetingUtterance = null;
                };
                this.currentGreetingUtterance = utterance;
                window.speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Speech synthesis failed:', error);
                this.showToast('浏览器语音播放失败', 'error');
            }
        } else {
            this.showToast('当前浏览器不支持语音播放，请更换浏览器或设备', 'warning');
        }
    }

    // Select idol (for AI mode)
    selectIdol(idolId) {
        if (typeof IDOLS === 'undefined' || !IDOLS[idolId]) {
            this.showToast('女优数据不存在', 'error');
            return;
        }
        
        // Store idol as current character for AI mode
        const idol = IDOLS[idolId];
        this.currentCharacter = idol;
        
        // Update UI
        document.querySelectorAll('.character-video-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-idol-id="${idolId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        // Switch to scenario selection
        this.switchScreen('scenarioSelection');
    }

    // Show idol detail page
    showIdolDetail(idolId) {
        if (typeof IDOLS === 'undefined' || !IDOLS[idolId]) {
            this.showToast('女优数据不存在', 'error');
            return;
        }
        
        const idol = IDOLS[idolId];
        this.switchScreen('idolDetail');
        
        // Update header
        const headerName = document.getElementById('idolDetailName');
        if (headerName) {
            headerName.textContent = idol.name || idol.englishName;
        }
        
        // Update video background
        const videoBg = document.getElementById('idolBackgroundVideo');
        if (videoBg && idol.videoPath) {
            videoBg.querySelectorAll('source').forEach(source => {
                source.src = idol.videoPath;
            });
            videoBg.load();
            videoBg.play().catch(err => {
                // Auto-play prevented, ignore
            });
        }
        
        // Update basic info
        document.getElementById('idolNickname').textContent = idol.nickname || '-';
        document.getElementById('idolAlias').textContent = idol.alias || '-';
        document.getElementById('idolNationality').textContent = idol.nationality || '-';
        document.getElementById('idolBirthDate').textContent = `${idol.birthDate} (${idol.age}岁)` || '-';
        document.getElementById('idolBirthPlace').textContent = idol.birthPlace || '-';
        document.getElementById('idolActiveYears').textContent = idol.activeYears ? idol.activeYears.join(' / ') : '-';
        document.getElementById('idolExclusiveContract').textContent = `❤️ ${idol.exclusiveContract}` || '-';
        
        // Update measurements
        document.getElementById('idolHeightWeight').textContent = `${idol.height} 厘米 / ${idol.weight} 千克`;
        document.getElementById('idolBMI').textContent = `${idol.bmi} (${idol.bmiStatus})`;
        document.getElementById('idolMeasurements').textContent = `${idol.bust} - ${idol.waist} - ${idol.hip} cm`;
        document.getElementById('idolCup').textContent = idol.cup || '-';
        document.getElementById('idolFeatures').textContent = idol.features || '-';
        
        // Update social media links
        const socialMediaContainer = document.getElementById('idolSocialMedia');
        if (socialMediaContainer && idol.socialMedia) {
            let socialHTML = '';
            if (idol.socialMedia.twitter) {
                socialHTML += `<a href="${idol.socialMedia.twitter}" target="_blank" class="social-link social-twitter">🐦 Twitter</a>`;
            }
            if (idol.socialMedia.instagram) {
                socialHTML += `<a href="${idol.socialMedia.instagram}" target="_blank" class="social-link social-instagram">📷 Instagram</a>`;
            }
            if (idol.socialMedia.youtube) {
                socialHTML += `<a href="${idol.socialMedia.youtube}" target="_blank" class="social-link social-youtube">▶️ YouTube</a>`;
            }
            if (idol.socialMedia.tiktok) {
                socialHTML += `<a href="${idol.socialMedia.tiktok}" target="_blank" class="social-link social-tiktok">🎵 TikTok</a>`;
            }
            socialMediaContainer.innerHTML = socialHTML || '<span style="color: #64748b !important;">暂无社交媒体信息</span>';
        }
    }

    // Render scenarios for character browsing
    renderCharacterScenarios() {
        const scenarioGrid = document.getElementById('characterScenariosGrid');
        const characterName = document.getElementById('browseCharacterName');
        
        if (!scenarioGrid) return;

        if (characterName && this.currentCharacter) {
            characterName.textContent = `${this.currentCharacter.name}的场景`;
        }

        scenarioGrid.innerHTML = Object.values(SCENARIOS).map(scenario => `
            <div class="scenario-card">
                <div class="scenario-icon">${scenario.icon}</div>
                <div class="scenario-name">${scenario.name}</div>
                <div class="scenario-desc">${scenario.description}</div>
                <div class="scenario-duration">${scenario.duration}分钟</div>
            </div>
        `).join('');
    }

    // Render characters for selection (in mode selection flow) - Video card style
    renderCharactersForSelection() {
        const characterGrid = document.getElementById('characterSelectionGrid');
        if (!characterGrid) return;

        characterGrid.innerHTML = Object.values(CHARACTERS).map(character => {
        const videoPath = character.videoPath || 'resource/ai/girlfriend/video.mov';
            const age = character.age || 21;
            const displayName = character.name || character.englishName || 'Unknown';
            const style = character.style || '';
            
            // Use background image as poster/placeholder
            const posterImage = character.backgroundImage || '';
            
            return `
                <div class="character-video-card" data-character-id="${character.id}">
                    <div class="video-card-container">
                        <video class="character-video" 
                               preload="none" 
                               muted 
                               loop 
                               playsinline
                               poster="${posterImage}"
                               data-video-path="${videoPath}">
                            <source src="${videoPath}" type="video/quicktime">
                            <source src="${videoPath}" type="video/mp4">
                        </video>
                        <div class="video-overlay"></div>
                        <div class="character-info-overlay">
                            <div class="character-name-age">
                                <span class="name-text">${displayName}</span>
                                <span class="age-text">${age}</span>
                            </div>
                            <div class="character-description">
                                ${character.description}
                                ${style ? `<div class="character-style">Style: ${style}</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Add video hover play control with lazy loading
        characterGrid.querySelectorAll('.character-video').forEach(video => {
            const card = video.closest('.character-video-card');
            if (!card) return;
            
            let videoLoaded = false;
            const videoPath = video.dataset.videoPath;
            
            // Function to load video on demand
            const loadVideo = () => {
                if (!videoLoaded && videoPath) {
                    const source = video.querySelector('source');
                    if (source && source.src !== videoPath) {
                        // Set source and load
                        video.querySelectorAll('source').forEach(s => {
                            s.src = videoPath;
                        });
                        video.load();
                    }
                    videoLoaded = true;
                }
            };
            
            // Desktop: hover to play (lazy load on first hover)
            card.addEventListener('mouseenter', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                // Small delay to allow video to start loading
                setTimeout(() => {
                    video.play().catch(err => {
                        // Auto-play prevented, ignore
                    });
                }, 100);
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
            
            // Mobile: tap to play (lazy load on first tap)
            card.addEventListener('touchstart', () => {
                if (!videoLoaded) {
                    loadVideo();
                }
                setTimeout(() => {
                    if (video.paused) {
                        video.play().catch(err => {});
                    } else {
                        video.pause();
                    }
                }, 100);
            });
            
            // Intersection Observer for lazy loading when card enters viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !videoLoaded) {
                        // Load video when card is visible (but don't play)
                        loadVideo();
                    }
                });
            }, {
                rootMargin: '50px' // Start loading 50px before card enters viewport
            });
            
            observer.observe(card);
        });

        // Add click listeners for character selection
        characterGrid.querySelectorAll('.character-video-card').forEach(card => {
            card.addEventListener('click', () => {
                const characterId = card.dataset.characterId;
                this.selectCharacter(characterId);
            });
        });
    }

    selectCharacter(characterId) {
        const character = CHARACTERS[characterId];
        this.currentCharacter = character;
        
        // Debug: log character selection
        console.log('Character selected:', character);
        
        // Update UI
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-character-id="${characterId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Switch to scenario selection
        setTimeout(() => {
            this.switchScreen('scenarioSelection');
        }, 300);
    }

    // Scenario Management
    renderScenarios() {
        const scenarioGrid = document.getElementById('scenarioGrid');
        const characterName = document.getElementById('characterName');
        
        if (!scenarioGrid) return;

        if (characterName && this.currentCharacter) {
            characterName.textContent = this.currentCharacter.name;
        }

        scenarioGrid.innerHTML = Object.values(SCENARIOS).map(scenario => `
            <div class="scenario-card" data-scenario-id="${scenario.id}">
                <div class="scenario-icon">${scenario.icon}</div>
                <div class="scenario-name">${scenario.name}</div>
                <div class="scenario-desc">${scenario.description}</div>
                <div class="scenario-duration">${scenario.duration}分钟</div>
            </div>
        `).join('');

        // Add click listeners
        scenarioGrid.querySelectorAll('.scenario-card').forEach(card => {
            card.addEventListener('click', () => {
                const scenarioId = card.dataset.scenarioId;
                this.selectScenario(scenarioId);
            });
        });
    }

    selectScenario(scenarioId) {
        const scenario = SCENARIOS[scenarioId];
        this.currentScenario = scenario;
        
        // Debug: log scenario selection
        console.log('Scenario selected:', scenario);
        
        // Update UI
        document.querySelectorAll('.scenario-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-scenario-id="${scenarioId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Start AI mode with selected character and scenario
        setTimeout(() => {
            this.switchScreen('aiMode');
        }, 300);
    }

    // Mode Selection
    selectMode(mode) {
        this.currentMode = mode;
        
        // Update UI
        document.querySelectorAll('.mode-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-mode="${mode}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }

        // Handle mode selection
        setTimeout(() => {
            if (mode === 'free') {
                // Free mode: directly go to control panel
                this.switchScreen('freeMode');
            } else if (mode === 'ai') {
                if (this.freeModeRunning) {
                    this.stopFreeMode();
                }
                // AI mode: first select character and scenario
                this.switchScreen('characterSelection');
            }
        }, 300);
    }

    // Free Mode
    startFreeMode() {
        console.log(`[startFreeMode] 当前状态: ${this.freeModeState}`);
        if (this.freeModeState === 'running') {
            console.log(`[startFreeMode] 已经是运行状态，直接返回`);
            return;
        }

        const wasPaused = this.freeModeState === 'paused';
        console.log(`[startFreeMode] 是否从暂停状态恢复: ${wasPaused}`);

        this.freeModeState = 'running';
        this.freeModeRunning = true;
        this.freeModePaused = false;
        this.aiModeRunning = false;
        this.isRunning = true;

        this.voiceInteraction.setContext(null, null);

        this.updateModeStatus('free', 'running');
        this.updateFreeModeControls();

        // 延迟初始化波形图，确保DOM已准备好
        setTimeout(() => {
            // 停止之前的动画（如果有）
            if (this.waveformAnimationId) {
                cancelAnimationFrame(this.waveformAnimationId);
                this.waveformAnimationId = null;
            }
            
            // 重新初始化波形图
            this.initWaveform();
            if (this.waveformCanvas && this.waveformCtx) {
                console.log('[Free Mode] Waveform initialized, starting animation');
                this.startWaveformAnimation();
            } else {
                console.warn('[Free Mode] Waveform canvas not found, retrying...');
                // 如果canvas不存在，再试一次
                setTimeout(() => {
                    this.initWaveform();
                    if (this.waveformCanvas && this.waveformCtx) {
                        this.startWaveformAnimation();
                    } else {
                        console.error('[Free Mode] Failed to initialize waveform after retry');
                    }
                }, 200);
            }
        }, 100);

        const command = wasPaused && DeviceCommands.resumeFreeMode
            ? DeviceCommands.resumeFreeMode()
            : DeviceCommands.startFreeMode();
        this.sendCommand(command);
        this.showToast(wasPaused ? '设备已继续' : '设备已启动', 'success');
        console.log(`[startFreeMode] 自由模式已${wasPaused ? '继续' : '启动'}`);
    }

    pauseFreeMode() {
        console.log(`[pauseFreeMode] 当前状态: ${this.freeModeState}`);
        if (this.freeModeState !== 'running') {
            console.log(`[pauseFreeMode] 当前不是运行状态，无法暂停`);
            return;
        }

        this.freeModeState = 'paused';
        this.freeModeRunning = false;
        this.freeModePaused = true;
        this.isRunning = false;

        if (this.waveformAnimation) {
            this.waveformAnimation.stop();
        } else {
            this.stopWaveformAnimation();
            this.waveformCanvas = null;
            this.waveformCtx = null;
        }

        this.updateModeStatus('free', 'paused');
        this.updateFreeModeControls();

        const command = DeviceCommands.pauseFreeMode
            ? DeviceCommands.pauseFreeMode()
            : DeviceCommands.stopFreeMode();
        this.sendCommand(command);
        this.showToast('设备已暂停', 'info');
        console.log(`[pauseFreeMode] 自由模式已暂停，状态: ${this.freeModeState}`);
    }

    stopFreeMode() {
        if (this.freeModeState === 'stopped') return;

        this.freeModeState = 'stopped';
        this.freeModeRunning = false;
        this.freeModePaused = false;
        this.isRunning = false;

        // 停止语音识别
        this.stopFreeModeVoiceRecognition();

        if (this.waveformAnimation) {
            this.waveformAnimation.stop();
        } else {
            this.stopWaveformAnimation();
            this.waveformCanvas = null;
            this.waveformCtx = null;
        }

        this.updateModeStatus('free', 'stopped');
        this.updateFreeModeControls();

        const command = DeviceCommands.stopFreeMode
            ? DeviceCommands.stopFreeMode()
            : DeviceCommands.stop();
        this.sendCommand(command);
        this.showToast('设备已停止', 'info');
    }

    updateFreeModeControls() {
        const playPauseBtn = document.getElementById('freePlayPauseBtn');
        const playPauseIcon = document.getElementById('freePlayPauseIcon');
        const stopBtn = document.getElementById('freeStopBtn');

        if (playPauseBtn && playPauseIcon) {
            if (this.freeModeState === 'running') {
                playPauseIcon.textContent = '⏸️';
                playPauseBtn.title = '暂停';
                playPauseBtn.setAttribute('aria-label', '暂停');
            } else {
                playPauseIcon.textContent = '▶️';
                const title = this.freeModeState === 'paused' ? '继续' : '开始';
                playPauseBtn.title = title;
                playPauseBtn.setAttribute('aria-label', title);
            }
        }

        if (stopBtn) {
            const isStopped = this.freeModeState === 'stopped';
            stopBtn.disabled = isStopped;
            stopBtn.title = '停止';
            stopBtn.setAttribute('aria-label', '停止');
        }
    }

    // AI Mode
    startAIMode() {
        if (this.aiModeState === 'running') return;

        if (!this.currentCharacter || !this.currentScenario) {
            this.showToast('请先选择角色和场景', 'warning');
            return;
        }

        // Debug: log current character and scenario
        console.log('Starting AI Mode with:', {
            character: this.currentCharacter?.name || 'No character',
            scenario: this.currentScenario?.name || 'No scenario',
            fullCharacter: this.currentCharacter,
            fullScenario: this.currentScenario
        });

        const wasPaused = this.aiModeState === 'paused';

        this.aiModeState = 'running';
        this.aiModeRunning = true;
        this.aiModePaused = false;
        this.freeModeRunning = false;
        this.freeModeState = 'stopped';
        this.isRunning = true;
        this.voiceInteraction.setContext(this.currentCharacter, this.currentScenario);

        // Force UI update after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.updateAIInfo();
        }, 100);

        // 延迟初始化波形图，确保DOM已准备好
        setTimeout(() => {
            // 停止之前的动画（如果有）
            if (this.waveformAnimationId) {
                cancelAnimationFrame(this.waveformAnimationId);
                this.waveformAnimationId = null;
            }
            
            // 重新初始化波形图
            this.initWaveform();
            if (this.waveformCanvas && this.waveformCtx) {
                console.log('[AI Mode] Waveform initialized, starting animation');
                this.startWaveformAnimation();
            } else {
                console.warn('[AI Mode] Waveform canvas not found, retrying...');
                // 如果canvas不存在，再试一次
                setTimeout(() => {
                    this.initWaveform();
                    if (this.waveformCanvas && this.waveformCtx) {
                        this.startWaveformAnimation();
                    } else {
                        console.error('[AI Mode] Failed to initialize waveform after retry');
                    }
                }, 200);
            }
        }, 100);
        
        this.voiceInteraction.startScenarioPlayback();

        this.updateModeStatus('ai', 'running');
        this.updateAIControls();

        const command = wasPaused && DeviceCommands.resumeAIMode
            ? DeviceCommands.resumeAIMode()
            : DeviceCommands.startAIMode(this.currentCharacter.id, this.currentScenario.id);
        this.sendCommand(command);

        if (wasPaused) {
            this.showToast('AI模式已继续', 'success');
        } else {
            this.showToast('AI模式已启动', 'success');
        }
    }

    pauseAIMode() {
        if (this.aiModeState !== 'running') return;

        this.aiModeState = 'paused';
        this.aiModeRunning = false;
        this.aiModePaused = true;
        this.isRunning = false;

        this.voiceInteraction.stopScenarioPlayback();
        if (this.waveformAnimation) {
            this.waveformAnimation.stop();
        } else {
            this.stopWaveformAnimation();
        }

        this.updateModeStatus('ai', 'paused');
        this.updateAIControls();

        const command = DeviceCommands.pauseAIMode
            ? DeviceCommands.pauseAIMode()
            : DeviceCommands.stopAIMode();
        this.sendCommand(command);
        this.showToast('AI模式已暂停', 'info');
    }

    stopAIMode() {
        if (this.aiModeState === 'stopped') return;

        this.aiModeState = 'stopped';
        this.aiModeRunning = false;
        this.aiModePaused = false;
        this.isRunning = false;
        this.voiceInteraction.stopScenarioPlayback();
        
        // 停止语音识别
        if (this.aiModeRecognition) {
            this.stopVoiceRecordingDemo(true);
        }
        
        // 停止波形图动画
        if (this.waveformAnimation) {
            this.waveformAnimation.stop();
        } else {
            this.stopWaveformAnimation();
        }
        
        // Update status
        this.updateModeStatus('ai', 'stopped');
        this.updateAIControls();
        
        // Send stop command
        this.sendCommand(DeviceCommands.stopAIMode());
        
        this.showToast('AI模式已停止', 'info');
    }

    updateAIControls() {
        const playPauseBtn = document.getElementById('aiPlayPauseBtn');
        const playPauseIcon = document.getElementById('aiPlayPauseIcon');
        const stopBtn = document.getElementById('aiStopBtn');

        if (playPauseBtn && playPauseIcon) {
            if (this.aiModeState === 'running') {
                playPauseIcon.textContent = '⏸️';
                playPauseBtn.title = '暂停';
                playPauseBtn.setAttribute('aria-label', '暂停');
            } else {
                playPauseIcon.textContent = '▶️';
                const title = this.aiModeState === 'paused' ? '继续' : '开始';
                playPauseBtn.title = title;
                playPauseBtn.setAttribute('aria-label', title);
            }
        }

        if (stopBtn) {
            const isStopped = this.aiModeState === 'stopped';
            stopBtn.disabled = isStopped;
            stopBtn.title = '停止';
            stopBtn.setAttribute('aria-label', '停止');
        }
    }

    updateAIInfo() {
        const aiCharacterName = document.getElementById('aiCharacterName');
        const aiScenarioName = document.getElementById('aiScenarioName');
        const aiCharacterAvatar = document.getElementById('aiCharacterAvatar');

        if (aiCharacterName && this.currentCharacter) {
            aiCharacterName.textContent = this.currentCharacter.name || this.currentCharacter.englishName;
        }

        if (aiScenarioName && this.currentScenario) {
            aiScenarioName.textContent = this.currentScenario.name;
        }

        if (aiCharacterAvatar && this.currentCharacter) {
            // Support both AI character (backgroundImage) and idol (imagePath)
            const imageUrl = this.currentCharacter.backgroundImage || this.currentCharacter.imagePath;
            if (imageUrl) {
                aiCharacterAvatar.style.backgroundImage = `url('${imageUrl}')`;
            } else {
                // Clear background if no image
                aiCharacterAvatar.style.backgroundImage = 'none';
            }
        }
    }

    // 波形图相关方法
    initWaveform() {
        // 根据当前屏幕查找canvas（自由模式或AI模式）
        // 先检查当前可见的screen
        const freeModeScreen = document.getElementById('freeMode');
        const aiModeScreen = document.getElementById('aiMode');
        
        let canvas = null;
        // 优先查找当前可见的screen中的canvas
        if (freeModeScreen && freeModeScreen.classList.contains('active')) {
            canvas = freeModeScreen.querySelector('#waveformCanvas');
        } else if (aiModeScreen && aiModeScreen.classList.contains('active')) {
            canvas = aiModeScreen.querySelector('#waveformCanvas');
        }
        
        // 如果没找到，尝试直接查找（作为后备）
        if (!canvas) {
            canvas = document.getElementById('waveformCanvas');
        }
        
        if (!canvas) {
            console.warn('[Waveform] Canvas element not found in current screen');
            return;
        }
        
        // 检查canvas是否可见
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            console.warn('[Waveform] Canvas is not visible, may need to wait for screen transition');
        }
        
        this.waveformCanvas = canvas;
        this.waveformCtx = canvas.getContext('2d');
        
        if (!this.waveformCtx) {
            console.error('[Waveform] Failed to get canvas context');
            return;
        }
        
        // 设置Canvas尺寸
        const container = canvas.parentElement;
        if (!container) {
            console.warn('[Waveform] Canvas container not found');
            return;
        }
        
        const containerRect = container.getBoundingClientRect();
        // 如果container不可见，使用默认尺寸
        const width = containerRect.width > 0 
            ? Math.max(100, containerRect.width - 24) 
            : 800; // 默认宽度
        const height = containerRect.height > 0 
            ? Math.max(50, containerRect.height - 24) 
            : 200; // 默认高度
        
        canvas.width = width;
        canvas.height = height;
        
        console.log(`[Waveform] Initialized canvas: ${width}x${height}, container: ${containerRect.width}x${containerRect.height}`);
        
        // 重置数据
        this.waveformData = [];
        this.waveformCurrentSpeed = 50;
        this.waveformLastUpdate = Date.now();
        
        // 初始化一些数据点
        const now = Date.now();
        for (let i = 19; i >= 0; i--) {
            this.waveformData.push({
                time: now - (i * 1000),
                speed: 50
            });
        }
    }

    startWaveformAnimation() {
        // 如果已经有动画在运行，先停止
        if (this.waveformAnimationId) {
            cancelAnimationFrame(this.waveformAnimationId);
            this.waveformAnimationId = null;
        }
        
        // 如果Canvas不存在，尝试初始化
        if (!this.waveformCanvas || !this.waveformCtx) {
            console.log('[Waveform] Canvas not found, initializing...');
            this.initWaveform();
        }
        
        if (!this.waveformCanvas || !this.waveformCtx) {
            console.warn('[Waveform] Canvas not found after initialization, cannot start animation');
            return;
        }
        
        console.log('[Waveform] Starting animation');
        // 开始绘制波形图
        this.drawWaveform();
    }

    stopWaveformAnimation() {
        if (this.waveformAnimationId) {
            cancelAnimationFrame(this.waveformAnimationId);
            this.waveformAnimationId = null;
        }
    }

    updateWaveform() {
        const now = Date.now();
        
        // 每100-200ms生成一个新数据点
        if (now - this.waveformLastUpdate < 150) {
            return;
        }
        
        this.waveformLastUpdate = now;
        
        // 模拟生成速度数据（0-100之间，带有平滑变化和随机性）
        // 使用简单的正弦波 + 随机波动模拟节奏变化
        const baseSpeed = 50 + 30 * Math.sin(now / 3000); // 基础波形，周期约3秒
        const randomVariation = (Math.random() - 0.5) * 15; // 随机波动 ±7.5
        const targetSpeed = Math.max(0, Math.min(100, baseSpeed + randomVariation));
        
        // 平滑过渡到目标速度
        this.waveformCurrentSpeed = this.waveformCurrentSpeed * 0.7 + targetSpeed * 0.3;
        
        // 添加新数据点
        this.waveformData.push({
            time: now,
            speed: Math.round(this.waveformCurrentSpeed)
        });
        
        // 移除超出时间窗口的旧数据（保留最近20秒）
        const cutoffTime = now - this.waveformTimeWindow;
        this.waveformData = this.waveformData.filter(point => point.time >= cutoffTime);
    }

    drawWaveform() {
        // 检查是否在AI模式或自由模式下运行
        const isAIModeRunning = this.aiModeState === 'running';
        const isFreeModeRunning = this.freeModeState === 'running';
        const shouldDraw = isAIModeRunning || isFreeModeRunning;
        
        if (!this.waveformCtx || !this.waveformCanvas || !shouldDraw) {
            // 如果不在运行状态，停止动画
            if (this.waveformAnimationId) {
                cancelAnimationFrame(this.waveformAnimationId);
                this.waveformAnimationId = null;
            }
            return;
        }
        
        // 更新数据
        this.updateWaveform();
        
        const ctx = this.waveformCtx;
        const canvas = this.waveformCanvas;
        const width = canvas.width;
        const height = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        if (this.waveformData.length < 2) {
            this.waveformAnimationId = requestAnimationFrame(() => this.drawWaveform());
            return;
        }
        
        // 绘制网格线（可选，用于参考）
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        
        // 水平中线
        const centerY = height / 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        
        // 绘制波形线
        ctx.strokeStyle = '#3b82f6'; // 主题蓝色
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        const now = Date.now();
        const timeRange = this.waveformTimeWindow;
        
        // 绘制波形填充区域
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.beginPath();
        
        // 从左侧底部开始
        const firstPoint = this.waveformData[0];
        const firstTimeOffset = now - firstPoint.time;
        const firstX = Math.max(0, width - (firstTimeOffset / timeRange) * width);
        
        ctx.moveTo(firstX, height);
        
        // 绘制波形路径
        this.waveformData.forEach((point, index) => {
            // 计算X坐标：最新数据在右侧，旧数据在左侧
            const timeOffset = now - point.time;
            const x = width - (timeOffset / timeRange) * width;
            
            // 如果点在画布范围内
            if (x >= 0 && x <= width) {
                // 计算Y坐标：速度值映射到画布高度
                const y = height - (point.speed / 100) * height;
                
                ctx.lineTo(x, y);
            }
        });
        
        // 绘制到右侧底部并闭合路径
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
        
        // 绘制波形线
        ctx.strokeStyle = '#3b82f6'; // 主题蓝色
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        let pathStarted = false;
        this.waveformData.forEach((point) => {
            // 计算X坐标：最新数据在右侧，旧数据在左侧
            const timeOffset = now - point.time;
            const x = width - (timeOffset / timeRange) * width;
            
            // 只绘制在画布范围内的点
            if (x >= 0 && x <= width) {
                // 计算Y坐标：速度值映射到画布高度
                const y = height - (point.speed / 100) * height;
                
                if (!pathStarted) {
                    ctx.moveTo(x, y);
                    pathStarted = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
        });
        
        ctx.stroke();
        
        // 继续动画循环
        this.waveformAnimationId = requestAnimationFrame(() => this.drawWaveform());
    }

    // Command Handling
    sendCommand(command) {
        // 原型阶段：静默处理，不显示设备未连接提示
        // 如果需要真实的设备连接，可以在后续版本中恢复检查
        if (!this.mqttClient.isConnected) {
            // 原型阶段：仅记录日志，不显示提示
            console.log('[Command] MQTT未连接，命令已记录:', command);
            // 可以在这里模拟命令处理，或者保存到队列中
            return;
        }

        try {
            this.mqttClient.sendCommand(command);
        } catch (error) {
            console.error('[Command] 发送命令失败:', error);
            // 原型阶段：不显示错误提示，避免干扰用户体验
            // this.showToast('发送命令失败', 'error');
        }
    }

    handleDeviceMessage(topic, message) {
        try {
            const data = JSON.parse(message);
            
            if (topic.includes('status')) {
                this.updateDeviceStatus(data);
            } else if (topic.includes('heartbeat')) {
                this.updateDeviceHeartbeat(data);
            }
        } catch (error) {
            console.error('Failed to parse device message:', error);
        }
    }

    updateDeviceStatus(status) {
        console.log('Device status update:', status);
    }

    updateDeviceHeartbeat(heartbeat) {
        console.log('Device heartbeat:', heartbeat);
    }

    // UI Helpers
    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;

        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('.status-text');

        const connected = this.isDeviceConnected();

        if (connected) {
            indicator.className = 'status-indicator connected';
            text.textContent = '已连接';
        } else {
            indicator.className = 'status-indicator offline';
            text.textContent = '未连接';
        }
    }

    updateModeStatus(mode, state) {
        const screenId = mode === 'ai' ? 'aiMode' : 'freeMode';
        let statusContainer = document.getElementById(screenId)?.querySelector('.mode-status');
        if (!statusContainer) {
            statusContainer = document.querySelector(`.mode-status[data-mode="${mode}"]`);
        }
        if (!statusContainer) return;

        const indicator = statusContainer.querySelector('.status-indicator');
        const text = statusContainer.querySelector('.status-text');

        if (!indicator || !text) return;

        indicator.classList.remove('running', 'paused', 'offline');

        let className = 'offline';
        let statusText = '已停止';

        if (state === 'running') {
            className = 'running';
            statusText = '运行中';
        } else if (state === 'paused') {
            className = 'paused';
            statusText = '暂停中';
        }

        indicator.classList.add(className);
        text.textContent = statusText;
        statusContainer.setAttribute('data-state', state);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Utility Functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Settings Management
    loadSettings() {
        const defaultSettings = {
            mqttBroker: 'localhost',
            deviceId: '',
            deviceToken: '',
            deviceConnected: false,
            deviceConnectionInfo: null,
            defaultIntensity: 50,
            autoConnect: false
        };

        try {
            const saved = localStorage.getItem('smartControlSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return defaultSettings;
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('smartControlSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    }

    // Heartbeat
    startHeartbeat() {
        setInterval(() => {
            if (this.mqttClient.isConnected) {
                this.mqttClient.sendHeartbeat();
            }
        }, 30000); // Send heartbeat every 30 seconds
    }

    /**
     * ========================================
     * AI互动聊天功能
     * ========================================
     */
    
    /**
     * 初始化聊天模态框
     */
    setupChatModal() {
        const chatBtn = document.getElementById('aiChatBtn');
        const chatModal = document.getElementById('aiChatModal');
        const modalContent = chatModal?.querySelector('.chat-modal-content');
        const closeBtn = document.getElementById('chatCloseBtn');
        const templateToggleBtn = document.getElementById('templateToggleBtn');
        const templatesContainer = document.getElementById('chatQuickTemplates');
        const voiceRecordBtn = document.getElementById('voiceRecordBtn');
        const voiceStopBtn = document.getElementById('voiceStopBtn');
        const historyBtn = document.getElementById('chatHistoryBtn');
        const historyBackBtn = document.getElementById('chatHistoryBackBtn');
        const compactView = document.getElementById('chatCompactView');
        
        if (!chatBtn || !chatModal || !modalContent) return;
        
        this.chatElements = {
            modal: chatModal,
            content: modalContent,
            templatesContainer,
            templateToggleBtn,
            voiceRecordBtn,
            voiceStopBtn,
            historyBtn,
            historyBackBtn,
            compactView,
            recentMessages: document.getElementById('chatRecentMessages'),
            historyMessages: document.getElementById('chatHistoryMessages'),
            mediaPreview: document.getElementById('chatMediaPreview'),
            mediaContent: document.getElementById('chatMediaContent'),
            mediaClose: document.getElementById('chatMediaPreviewClose'),
            characterName: document.getElementById('chatCharacterName'),
            characterState: document.getElementById('chatCharacterState'),
            compactAvatar: document.getElementById('chatCompactAvatar'),
            recentAvatar: document.getElementById('chatRecentAvatar')
        };
        
        chatBtn.addEventListener('click', () => this.openChatModal());
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChatModal());
        }
        
        chatModal.addEventListener('click', (e) => {
            if (e.target === chatModal) {
                this.closeChatModal();
            }
        });
        
        if (compactView) {
            compactView.addEventListener('click', () => this.setChatState('recent'));
        }
        
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.setChatState('history'));
        }
        
        if (historyBackBtn) {
            historyBackBtn.addEventListener('click', () => this.setChatState('recent'));
        }
        
        if (templateToggleBtn && templatesContainer) {
            templateToggleBtn.addEventListener('click', () => {
                this.chatTemplatesCollapsed = !this.chatTemplatesCollapsed;
                templateToggleBtn.classList.toggle('active', !this.chatTemplatesCollapsed);
                templatesContainer.classList.toggle('collapsed', this.chatTemplatesCollapsed);
            });
        }
        
        if (voiceRecordBtn) {
            voiceRecordBtn.addEventListener('click', () => this.startVoiceRecordingDemo());
        }
        
        if (voiceStopBtn) {
            voiceStopBtn.addEventListener('click', () => this.stopVoiceRecordingDemo());
        }
        
        // 媒体预览浮层不再使用，确保保持隐藏
        this.updateMediaPreview(true);
    }
    
    /**
     * 打开聊天模态框
     */
    openChatModal() {
        const elements = this.chatElements || {};
        if (!elements.modal || !elements.content) return;
        
        const imageUrl = this.currentCharacter?.backgroundImage || this.currentCharacter?.imagePath || '';
        const displayName = this.currentCharacter?.name || this.currentCharacter?.englishName || '角色';
        
        if (elements.compactAvatar) {
            if (imageUrl) {
                elements.compactAvatar.style.backgroundImage = `url('${imageUrl}')`;
            } else {
                elements.compactAvatar.style.removeProperty('background-image');
            }
        }
        
        if (elements.recentAvatar) {
            if (imageUrl) {
                elements.recentAvatar.style.backgroundImage = `url('${imageUrl}')`;
            } else {
                elements.recentAvatar.style.removeProperty('background-image');
            }
        }
        
        if (elements.characterName) {
            elements.characterName.textContent = displayName;
        }
        
        this.chatTemplatesCollapsed = false;
        this.chatMediaPreviewEnabled = false;
        elements.templatesContainer?.classList.remove('collapsed');
        elements.templateToggleBtn?.classList.remove('active');
        
        elements.modal.classList.add('active');
        this.setChatState('compact');
        this.updateChatStatus('等待语音交互');
        this.loadChatHistory();
        this.renderQuickTemplates();
    }
    
    /**
     * 关闭聊天模态框
     */
    closeChatModal() {
        const elements = this.chatElements || {};
        if (elements.modal) {
            elements.modal.classList.remove('active');
        }
        this.setChatState('compact');
        this.chatTemplatesCollapsed = false;
        elements.templatesContainer?.classList.remove('collapsed');
        elements.templateToggleBtn?.classList.remove('active');
        this.stopVoiceRecordingDemo(true);
    }
    
    /**
     * 设置聊天形态
     */
    setChatState(state) {
        if (!this.chatElements?.content) return;
        this.chatState = state;
        this.chatElements.content.setAttribute('data-state', state);
        
        if (state === 'history') {
            this.chatTemplatesCollapsed = true;
            this.chatElements.templatesContainer?.classList.add('collapsed');
            this.chatElements.templateToggleBtn?.classList.remove('active');
        }
    }
    
    /**
     * 加载聊天历史记录
     */
    loadChatHistory() {
        const characterId = this.currentCharacter?.id;
        const history = window.CHAT_DEMO_HISTORY?.[characterId] || [];
        this.chatMessages = history.map(msg => ({ ...msg }));
        this.renderChatViews();
    }
    
    /**
     * 渲染聊天视图
     */
    renderChatViews() {
        const elements = this.chatElements || {};
        const characterImageUrl = this.currentCharacter?.backgroundImage || this.currentCharacter?.imagePath || '';
        
        if (elements.recentMessages) {
            const recentMessages = this.chatMessages.slice(-this.chatRecentLimit);
            elements.recentMessages.innerHTML = recentMessages.map(msg => this.renderVoiceMessage(msg, characterImageUrl)).join('');
            elements.recentMessages.scrollTop = elements.recentMessages.scrollHeight;
            // 绑定音频播放按钮事件
            this.setupVoicePlayButtons(elements.recentMessages);
        }
        
        if (elements.historyMessages) {
            elements.historyMessages.innerHTML = this.chatMessages.map(msg => this.renderVoiceMessage(msg, characterImageUrl)).join('');
            elements.historyMessages.scrollTop = elements.historyMessages.scrollHeight;
            // 绑定音频播放按钮事件
            this.setupVoicePlayButtons(elements.historyMessages);
        }
        
        this.updateMediaPreview();
    }
    
    /**
     * 设置音频播放按钮事件监听
     */
    setupVoicePlayButtons(container) {
        if (!container) return;
        
        container.querySelectorAll('.voice-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const messageId = btn.getAttribute('data-message-id');
                const message = this.chatMessages.find(msg => 
                    (msg.timestamp || '').toString() === messageId || 
                    (msg.timestamp || Date.now()).toString() === messageId
                );
                if (message) {
                    this.playAIMessageVoice(message);
                }
            });
        });
    }
    
    /**
     * 渲染语音消息
     */
    renderVoiceMessage(message, characterImageUrl = '') {
        const isUser = message.sender === 'user';
        const avatarStyle = !isUser && characterImageUrl ? ` style="background-image: url('${characterImageUrl}')" ` : '';
        const transcript = message.transcript || message.text;
        
        const durationDisplay = message.duration ? `<span>${message.duration}"</span>` : '';
        
        // AI消息添加音频播放按钮
        const voicePlayBtn = !isUser && (message.voiceText || message.text) ? 
            `<button class="voice-play-btn" data-message-id="${message.timestamp || Date.now()}" title="播放语音">🔊</button>` : '';
        
        return `
            <div class="voice-message ${isUser ? 'user' : 'ai'}" data-message-id="${message.timestamp || Date.now()}">
                <div class="voice-avatar"${avatarStyle}></div>
                <div class="voice-bubble">
                    <div class="voice-waveform">${this.renderVoiceBars()}</div>
                    ${message.media ? this.renderMediaContent(message.media) : ''}
                    <div class="voice-transcript">${transcript}</div>
                    <div class="voice-meta">
                        ${durationDisplay}
                        <span>${message.timestamp}</span>
                        ${voicePlayBtn}
                        ${message.hasRhythm ? '<span class="rhythm-indicator">🌊</span>' : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderVoiceBars() {
        return Array.from({ length: 5 }).map(() => '<span class="voice-bar"></span>').join('');
    }
    
    /**
     * 渲染媒体内容到消息气泡
     */
    renderMediaContent(media) {
        if (media.type === 'image') {
            return `<div class="message-media"><img src="${media.url}" alt="图片" loading="lazy" onclick="window.open('${media.url}', '_blank')"></div>`;
        }
        if (media.type === 'video') {
            const posterAttr = media.poster ? ` poster="${media.poster}"` : '';
            return `<div class="message-media"><video src="${media.url}" controls preload="metadata"${posterAttr} playsinline muted></video></div>`;
        }
        return '';
    }
    
    /**
     * 更新媒体预览
     */
    updateMediaPreview(forceHide = false) {
        const previewContainer = this.chatElements?.mediaPreview;
        const contentContainer = this.chatElements?.mediaContent;
        if (!previewContainer || !contentContainer) return;
        
        this.chatMediaPreviewEnabled = false;
        previewContainer.classList.remove('active');
        contentContainer.innerHTML = '';
    }
    
    renderMediaPreview(media) {
        if (media.type === 'image') {
            return `<div class="chat-media-card"><img src="${media.url}" alt="预览" onclick="window.open('${media.url}', '_blank')"></div>`;
        }
        if (media.type === 'video') {
            return `<div class="chat-media-card"><video src="${media.url}" preload="none" controls poster="${media.poster || ''}"></video></div>`;
        }
        return '';
    }
    
    /**
     * 渲染快捷模板按钮
     */
    renderQuickTemplates() {
        const container = this.chatElements?.templatesContainer;
        if (!container || !window.QUICK_MESSAGE_TEMPLATES) return;
        
        const commonTemplates = window.QUICK_MESSAGE_TEMPLATES.common || [];
        const scenarioId = this.currentScenario?.id || this.currentCharacter?.id;
        const scenarioTemplates = window.QUICK_MESSAGE_TEMPLATES.scenarios?.[scenarioId] || [];
        
        const allTemplates = [
            ...commonTemplates.map(t => t.text),
            ...scenarioTemplates
        ];
        
        container.innerHTML = allTemplates.map(text => `<button class="quick-template-btn">${text}</button>`).join('');
        container.classList.toggle('collapsed', this.chatTemplatesCollapsed);
        this.chatElements?.templateToggleBtn?.classList.toggle('active', !this.chatTemplatesCollapsed);
        
        container.querySelectorAll('.quick-template-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.textContent.trim();
                if (text) {
                    this.sendChatMessage(text, { source: 'template' });
                }
            });
        });
    }
    
    /**
     * 发送聊天消息（语音转写或快捷用语）
     */
    sendChatMessage(text, options = {}) {
        if (!text) return;
        
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const userMessage = {
            sender: 'user',
            text,
            timestamp,
            source: options.source || 'voice'
        };
        
        this.appendMessage(userMessage);
        this.updateChatStatus('AI正在回应中…');
        
        setTimeout(() => {
            const aiReply = this.generateAIReply(text);
            this.appendMessage(aiReply);
            this.updateChatStatus('等待语音交互');
            
            if (aiReply.hasRhythm) {
                console.log('[Chat] AI调整节奏指令');
            }
            
            // 自动播放AI回复的语音
            if (aiReply.voiceText && this.checkSpeechSynthesisSupport()) {
                setTimeout(() => {
                    this.playAIMessageVoice(aiReply);
                }, 500); // 延迟500ms播放，让消息先显示
            }
        }, 1000);
    }
    
    /**
     * 添加单条消息
     */
    appendMessage(message) {
        message.channel = message.channel || 'voice';
        if (typeof message.duration !== 'number') {
            message.duration = message.sender === 'ai' ? 3 : 2;
        }
        if (!message.transcript) {
            message.transcript = message.text;
        }
        this.chatMessages.push(message);
        this.renderChatViews();
        
        if (this.chatState === 'compact') {
            this.setChatState('recent');
        }
    }
    
    updateChatStatus(text) {
        if (this.chatElements?.characterState) {
            this.chatElements.characterState.textContent = text;
        }
    }
    
    startVoiceRecordingDemo() {
        if (this.chatRecording) return;
        
        if (!this.checkSpeechRecognitionSupport()) {
            this.showToast('当前浏览器不支持语音识别，请使用Chrome或Edge浏览器', 'warning');
            return;
        }
        
        this.chatRecording = true;
        this.isAIModeListening = true;
        this.updateChatStatus('正在聆听，请继续说话…');
        
        if (this.chatRecordingTimer) {
            clearTimeout(this.chatRecordingTimer);
            this.chatRecordingTimer = null;
        }
        
        this.chatElements?.voiceRecordBtn?.classList.add('recording');
        this.chatElements?.voiceStopBtn?.classList.add('active');
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.aiModeRecognition = new SpeechRecognition();
            
            this.aiModeRecognition.lang = 'zh-CN';
            this.aiModeRecognition.continuous = false;
            this.aiModeRecognition.interimResults = true;
            
            this.aiModeRecognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // 实时显示临时结果
                if (interimTranscript) {
                    this.updateChatStatus(`正在识别: ${interimTranscript}`);
                }
                
                // 最终结果
                if (finalTranscript) {
                    this.stopVoiceRecordingDemo(false, finalTranscript.trim());
                }
            };
            
            this.aiModeRecognition.onerror = (event) => {
                console.error('AI模式语音识别错误:', event.error);
                if (event.error === 'no-speech') {
                    this.updateChatStatus('未检测到语音，请重试');
                    setTimeout(() => {
                        this.stopVoiceRecordingDemo(true);
                    }, 2000);
                } else if (event.error === 'network') {
                    this.showToast('网络错误，请检查网络连接', 'error');
                    this.stopVoiceRecordingDemo(true);
                } else {
                    this.showToast('语音识别出错: ' + event.error, 'error');
                    this.stopVoiceRecordingDemo(true);
                }
            };
            
            this.aiModeRecognition.onend = () => {
                if (this.chatRecording && !this.aiModeRecognition.finalTranscript) {
                    // 如果没有最终结果，可能是超时或错误
                    this.updateChatStatus('等待语音交互');
                }
            };
            
            this.aiModeRecognition.start();
        } catch (error) {
            console.error('初始化AI模式语音识别失败:', error);
            this.showToast('无法启动语音识别，请检查麦克风权限', 'error');
            this.chatRecording = false;
            this.isAIModeListening = false;
            this.chatElements?.voiceRecordBtn?.classList.remove('recording');
            this.chatElements?.voiceStopBtn?.classList.remove('active');
        }
    }
    
    stopVoiceRecordingDemo(forceCancel = false, transcript = null) {
        if (!this.chatRecording && !forceCancel && !transcript) {
            this.showToast('当前没有进行中的录音', 'info');
            return;
        }
        
        if (this.chatRecordingTimer) {
            clearTimeout(this.chatRecordingTimer);
            this.chatRecordingTimer = null;
        }
        
        const wasRecording = this.chatRecording;
        this.chatRecording = false;
        this.isAIModeListening = false;
        
        if (this.aiModeRecognition) {
            try {
                this.aiModeRecognition.stop();
            } catch (e) {
                console.error('停止AI模式语音识别失败:', e);
            }
            this.aiModeRecognition = null;
        }
        
        this.chatElements?.voiceRecordBtn?.classList.remove('recording');
        this.chatElements?.voiceStopBtn?.classList.remove('active');
        
        if (forceCancel) {
            this.updateChatStatus('等待语音交互');
            return;
        }
        
        if (transcript && transcript.trim()) {
            this.sendChatMessage(transcript.trim(), { source: 'voice' });
        } else if (wasRecording && !transcript) {
            // 如果没有识别到文本，提示用户
            this.updateChatStatus('未识别到语音，请重试');
            setTimeout(() => {
                this.updateChatStatus('等待语音交互');
            }, 2000);
        } else {
            this.updateChatStatus('等待语音交互');
        }
    }
    
    /**
     * 生成AI回复（基于关键词匹配）
     */
    generateAIReply(userText) {
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const text = userText.toLowerCase();
        const autoReplies = window.AI_AUTO_REPLIES || {};
        
        let replyData = null;
        
        // 关键词匹配
        if (text.includes('你好') || text.includes('hello') || text.includes('hi')) {
            replyData = this.getRandomReply(autoReplies.greetings);
        } else if (text.includes('表情') || text.includes('视频')) {
            replyData = this.getRandomReply(autoReplies.see_you_video);
        } else if (text.includes('想你的模样') || text.includes('看看你') || text.includes('照片')) {
            replyData = this.getRandomReply(autoReplies.see_you_photo);
        } else if (text.includes('想') || text.includes('miss')) {
            replyData = this.getRandomReply(autoReplies.miss);
        } else if (text.includes('刺激') || text.includes('exciting') || text.includes('快点') || text.includes('快一点')) {
            replyData = this.getRandomReply(autoReplies.exciting);
        } else if (text.includes('温柔') || text.includes('gentle') || text.includes('轻点')) {
            replyData = this.getRandomReply(autoReplies.gentle);
        } else if (text.includes('快') || text.includes('faster') || text.includes('加速')) {
            replyData = this.getRandomReply(autoReplies.faster);
        } else if (text.includes('慢') || text.includes('slower')) {
            replyData = this.getRandomReply(autoReplies.slower);
        } else {
            replyData = this.getRandomReply(autoReplies.default);
        }
        
        // 如果replyData是字符串，转换为对象
        if (typeof replyData === 'string') {
            replyData = { text: replyData, hasRhythm: false };
        }
        
        // 如果需要媒体，添加随机媒体
        if (replyData.needMedia) {
            const characterMedia = this.getCharacterMedia();
            if (characterMedia && characterMedia.length > 0) {
                const preferredType = replyData.mediaType;
                let mediaPool = characterMedia;
                
                if (preferredType) {
                    const filtered = characterMedia.filter(item => item.type === preferredType);
                    if (filtered.length > 0) {
                        mediaPool = filtered;
                    }
                }
                
                const selected = mediaPool[Math.floor(Math.random() * mediaPool.length)];
                const randomMedia = { ...selected };
                
                if (randomMedia.type === 'video' && !randomMedia.poster) {
                    const fallbackImage = characterMedia.find(item => item.type === 'image');
                    if (fallbackImage) {
                        randomMedia.poster = fallbackImage.url;
                    } else if (this.currentCharacter?.imagePath) {
                        randomMedia.poster = this.currentCharacter.imagePath;
                    } else if (this.currentCharacter?.backgroundImage) {
                        randomMedia.poster = this.currentCharacter.backgroundImage;
                    }
                }
                
                replyData.media = randomMedia;
            }
        }
        
        return {
            sender: 'ai',
            text: replyData.text || '嗯嗯，我明白了~',
            timestamp: timestamp,
            hasRhythm: replyData.hasRhythm || false,
            media: replyData.media || null,
            voiceText: replyData.text || '嗯嗯，我明白了~' // 用于TTS播放的文本
        };
    }
    
    /**
     * 从数组中随机选择一个元素
     */
    getRandomReply(replies) {
        if (!replies || replies.length === 0) return '嗯嗯~';
        return replies[Math.floor(Math.random() * replies.length)];
    }
    
    /**
     * 获取当前角色的媒体资源
     */
    getCharacterMedia() {
        const characterId = this.currentCharacter?.id;
        return window.CHARACTER_MEDIA?.[characterId] || [];
    }
    
    /**
     * 检查浏览器是否支持语音识别
     */
    checkSpeechRecognitionSupport() {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }
    
    /**
     * 检查浏览器是否支持语音合成
     */
    checkSpeechSynthesisSupport() {
        return 'speechSynthesis' in window;
    }
    
    /**
     * 开始自由模式语音识别
     */
    startFreeModeVoiceRecognition() {
        if (!this.checkSpeechRecognitionSupport()) {
            this.showToast('当前浏览器不支持语音识别，请使用Chrome或Edge浏览器', 'warning');
            return;
        }
        
        if (this.isFreeModeListening) return;
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.freeModeRecognition = new SpeechRecognition();
            
            this.freeModeRecognition.lang = 'zh-CN';
            this.freeModeRecognition.continuous = true;
            this.freeModeRecognition.interimResults = true;
            
            this.freeModeRecognition.onstart = () => {
                this.isFreeModeListening = true;
                const voiceCommandBtn = document.getElementById('voiceCommandBtn');
                if (voiceCommandBtn) {
                    voiceCommandBtn.classList.add('listening');
                }
            };
            
            this.freeModeRecognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                let confidence = 0;
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    const transcript = result[0].transcript;
                    const resultConfidence = result[0].confidence || 0;
                    
                    if (result.isFinal) {
                        finalTranscript += transcript;
                        confidence = Math.max(confidence, resultConfidence);
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                // 处理最终识别结果
                if (finalTranscript) {
                    const trimmedTranscript = finalTranscript.trim();
                    // 对于"慢点"和"轻点"这类短词，提高识别要求
                    const isShortCommand = trimmedTranscript.length <= 3;
                    const minConfidence = isShortCommand ? 0.7 : 0.5;
                    
                    // 如果置信度足够高，或者不是短命令，则处理
                    if (confidence >= minConfidence || !isShortCommand) {
                        const commandId = this.classifyVoiceCommand(trimmedTranscript);
                        if (commandId) {
                            console.log(`[Voice] 识别到指令: ${commandId}, 文本: ${trimmedTranscript}, 置信度: ${confidence.toFixed(2)}`);
                            this.handleFreeModeVoiceCommand(commandId);
                        } else {
                            console.log(`[Voice] 未识别到指令, 文本: ${trimmedTranscript}, 置信度: ${confidence.toFixed(2)}`);
                        }
                    } else {
                        console.log(`[Voice] 置信度过低，忽略识别结果: ${trimmedTranscript}, 置信度: ${confidence.toFixed(2)}`);
                    }
                }
            };
            
            this.freeModeRecognition.onerror = (event) => {
                console.error('语音识别错误:', event.error);
                if (event.error === 'no-speech') {
                    // 无语音输入，继续监听
                    return;
                } else if (event.error === 'network') {
                    this.showToast('网络错误，请检查网络连接', 'error');
                } else {
                    this.showToast('语音识别出错: ' + event.error, 'error');
                }
                this.stopFreeModeVoiceRecognition();
            };
            
            this.freeModeRecognition.onend = () => {
                // 如果仍在监听状态，自动重启
                if (this.isFreeModeListening) {
                    try {
                        this.freeModeRecognition.start();
                    } catch (e) {
                        console.error('重启语音识别失败:', e);
                        this.stopFreeModeVoiceRecognition();
                    }
                }
            };
            
            this.freeModeRecognition.start();
        } catch (error) {
            console.error('初始化语音识别失败:', error);
            this.showToast('无法启动语音识别，请检查麦克风权限', 'error');
        }
    }
    
    /**
     * 停止自由模式语音识别
     */
    stopFreeModeVoiceRecognition() {
        if (!this.isFreeModeListening) return;
        
        this.isFreeModeListening = false;
        
        if (this.freeModeRecognition) {
            try {
                this.freeModeRecognition.stop();
            } catch (e) {
                console.error('停止语音识别失败:', e);
            }
            this.freeModeRecognition = null;
        }
        
        const voiceCommandBtn = document.getElementById('voiceCommandBtn');
        if (voiceCommandBtn) {
            voiceCommandBtn.classList.remove('listening');
        }
    }
    
    /**
     * 分类语音指令
     * 优化识别逻辑，提高"慢点"和"轻点"的识别准确性
     * 采用精确匹配优先策略，减少误识别
     */
    classifyVoiceCommand(transcript) {
        if (!transcript) return null;
        
        const text = transcript.toLowerCase().trim();
        
        // 策略1: 精确匹配优先（最高优先级）
        const exactMatches = {
            '继续': 'resume',
            '接着': 'resume',
            '暂停': 'pause',
            '停止': 'pause',
            '慢点': 'slower',
            '慢一点': 'slower',
            '轻点': 'gentle',
            '轻一点': 'gentle',
            '用力': 'tighter',
            '快点': 'faster',
            '快一点': 'faster'
        };
        
        // 首先检查精确匹配
        if (exactMatches[text]) {
            return exactMatches[text];
        }
        
        // 策略2: 完整短语匹配（高优先级）
        // 继续相关
        if (text === '继续' || text === '继续运行' || text.includes('继续') || text.includes('接着')) {
            return 'resume';
        }
        
        // 暂停相关
        if (text === '暂停' || text === '停止' || text.includes('暂停') || text.includes('停止')) {
            return 'pause';
        }
        
        // 策略3: 明确的慢点相关词汇（提高优先级，避免被其他词误匹配）
        const slowerKeywords = ['慢点', '慢一点', '放慢', '减速', '慢下来', '慢一些', '慢速'];
        const hasSlowerKeyword = slowerKeywords.some(keyword => text === keyword || text.includes(keyword));
        if (hasSlowerKeyword) {
            // 排除包含"快"的情况
            if (!text.includes('快') && !text.includes('加速') && !text.includes('加快')) {
                return 'slower';
            }
        }
        
        // 策略4: 明确的轻点相关词汇（提高优先级，避免被其他词误匹配）
        const gentleKeywords = ['轻点', '轻一点', '轻一些', '轻柔', '温柔'];
        const hasGentleKeyword = gentleKeywords.some(keyword => text === keyword || text.includes(keyword));
        if (hasGentleKeyword) {
            // 排除包含"用力"、"紧"的情况
            if (!text.includes('用力') && !text.includes('紧') && !text.includes('加强') && !text.includes('力度')) {
                return 'gentle';
            }
        }
        
        // 策略5: 用力相关（在轻点之后检查，避免冲突）
        const tighterKeywords = ['用力', '紧一点', '加强', '力度', '更紧'];
        const hasTighterKeyword = tighterKeywords.some(keyword => text.includes(keyword));
        if (hasTighterKeyword) {
            return 'tighter';
        }
        
        // 策略6: 快点相关（在慢点之后检查，避免冲突）
        const fasterKeywords = ['快点', '快一点', '加速', '加快', '提速'];
        const hasFasterKeyword = fasterKeywords.some(keyword => text.includes(keyword));
        if (hasFasterKeyword) {
            return 'faster';
        }
        
        // 策略7: 单字匹配（最低优先级，仅作为后备）
        // 只对单字进行匹配，避免误识别
        if (text.length === 1) {
            if (text === '慢') {
                return 'slower';
            } else if (text === '轻') {
                return 'gentle';
            } else if (text === '快') {
                return 'faster';
            } else if (text === '紧') {
                return 'tighter';
            }
        }
        
        return null;
    }
    
    /**
     * 处理自由模式语音指令
     */
    handleFreeModeVoiceCommand(commandId) {
        console.log(`[handleFreeModeVoiceCommand] 处理指令: ${commandId}, 当前状态: ${this.freeModeState}`);
        const command = window.VOICE_COMMANDS?.find(cmd => cmd.id === commandId);
        if (!command) {
            console.warn(`[handleFreeModeVoiceCommand] 未找到指令: ${commandId}`);
            return;
        }
        
        // 对于 pause 和 resume 指令，先处理状态变更，不发送额外的MQTT命令
        // 因为这些指令已经在 pauseFreeMode() 或 startFreeMode() 中发送了命令
        if (commandId === 'pause' || commandId === 'resume') {
            console.log(`[handleFreeModeVoiceCommand] 处理暂停/继续指令: ${commandId}`);
            // 这些指令在 adjustSliderByVoiceCommand 中处理状态变更
            this.adjustSliderByVoiceCommand(commandId);
            // 播放语音反馈
            this.speakFreeModeFeedback(commandId);
            return;
        }
        
        // 对于其他指令（速度/力度调整），调整滑块值
        this.adjustSliderByVoiceCommand(commandId);
        
        // 发送MQTT命令到设备
        const mqttCommand = DeviceCommands.sendVoiceCommand(command.action, {
            commandId: commandId,
            timestamp: Date.now()
        });
        this.sendCommand(mqttCommand);
        
        // 播放语音反馈
        this.speakFreeModeFeedback(commandId);
    }
    
    /**
     * 根据语音指令调整滑块值
     */
    adjustSliderByVoiceCommand(commandId) {
        const ADJUSTMENT = 20; // 每次调整20%
        
        switch (commandId) {
            case 'faster':
                // 快点：增加伸缩速度和旋转速度
                this.adjustSlider('strokeSpeedSlider', ADJUSTMENT);
                this.adjustSlider('rotationSpeedSlider', ADJUSTMENT);
                break;
            case 'slower':
                // 慢点：减少伸缩速度和旋转速度
                this.adjustSlider('strokeSpeedSlider', -ADJUSTMENT);
                this.adjustSlider('rotationSpeedSlider', -ADJUSTMENT);
                break;
            case 'tighter':
                // 用力：增加夹吸力度
                this.adjustSlider('suctionIntensitySlider', ADJUSTMENT);
                break;
            case 'gentle':
                // 轻点：减少夹吸力度
                this.adjustSlider('suctionIntensitySlider', -ADJUSTMENT);
                break;
            case 'pause':
                // 暂停：调用暂停方法
                if (this.freeModeState === 'running') {
                    this.pauseFreeMode();
                }
                break;
            case 'resume':
                // 继续：如果处于暂停状态，则继续运行
                console.log(`[Voice Resume] 当前状态: ${this.freeModeState}`);
                if (this.freeModeState === 'paused') {
                    console.log(`[Voice Resume] 调用 startFreeMode() 恢复运行`);
                    this.startFreeMode();
                } else if (this.freeModeState === 'stopped') {
                    // 如果处于停止状态，也允许继续运行
                    console.log(`[Voice Resume] 当前为停止状态，启动自由模式`);
                    this.startFreeMode();
                } else {
                    console.log(`[Voice Resume] 当前状态不是暂停或停止，无法继续: ${this.freeModeState}`);
                }
                break;
        }
    }
    
    /**
     * 调整滑块值
     */
    adjustSlider(sliderId, delta) {
        const slider = document.getElementById(sliderId);
        const valueElement = document.getElementById(sliderId.replace('Slider', 'Value'));
        
        if (!slider || !valueElement) return;
        
        const currentValue = parseInt(slider.value) || 0;
        const newValue = Math.max(0, Math.min(100, currentValue + delta));
        
        // 更新滑块值
        slider.value = newValue;
        valueElement.textContent = `${newValue}%`;
        
        // 触发input事件，确保发送MQTT命令
        const event = new Event('input', { bubbles: true });
        slider.dispatchEvent(event);
    }
    
    /**
     * 请求麦克风权限
     */
    async requestMicrophonePermission() {
        if (!this.checkSpeechRecognitionSupport()) {
            return;
        }
        
        try {
            // 使用getUserMedia请求麦克风权限
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // 立即停止流，我们只需要权限
            stream.getTracks().forEach(track => track.stop());
            console.log('麦克风权限已获取');
        } catch (error) {
            console.warn('麦克风权限请求失败:', error);
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                this.showToast('需要麦克风权限才能使用语音指令功能', 'warning');
            } else if (error.name === 'NotFoundError') {
                this.showToast('未检测到麦克风设备', 'warning');
            }
        }
    }
    
    /**
     * 播放自由模式语音反馈
     */
    speakFreeModeFeedback(commandId) {
        if (!this.checkSpeechSynthesisSupport()) {
            return;
        }
        
        const responses = window.VOICE_RESPONSES?.general?.[commandId];
        if (!responses || responses.length === 0) {
            return;
        }
        
        // 停止当前播放
        if (this.currentFreeModeUtterance) {
            window.speechSynthesis.cancel();
        }
        
        const feedbackText = responses[Math.floor(Math.random() * responses.length)];
        
        try {
            const utterance = new SpeechSynthesisUtterance(feedbackText);
            utterance.lang = 'zh-CN';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // 选择中文女声
            const voices = window.speechSynthesis.getVoices();
            const chineseFemaleVoice = voices.find(voice => 
                voice.lang.startsWith('zh') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.startsWith('zh-CN')) || null;
            
            if (chineseFemaleVoice) {
                utterance.voice = chineseFemaleVoice;
            }
            
            utterance.onstart = () => {
                const broadcastIcon = document.getElementById('freeBroadcastIcon');
                if (broadcastIcon) {
                    broadcastIcon.classList.add('playing');
                    broadcastIcon.textContent = '🔊';
                }
            };
            
            utterance.onend = () => {
                const broadcastIcon = document.getElementById('freeBroadcastIcon');
                if (broadcastIcon) {
                    broadcastIcon.classList.remove('playing');
                    broadcastIcon.textContent = '🔇';
                }
                this.currentFreeModeUtterance = null;
            };
            
            utterance.onerror = (event) => {
                console.error('语音播放错误:', event.error);
                const broadcastIcon = document.getElementById('freeBroadcastIcon');
                if (broadcastIcon) {
                    broadcastIcon.classList.remove('playing');
                    broadcastIcon.textContent = '🔇';
                }
                this.currentFreeModeUtterance = null;
            };
            
            this.currentFreeModeUtterance = utterance;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('语音合成失败:', error);
        }
    }
    
    /**
     * 播放AI消息的语音
     */
    playAIMessageVoice(message) {
        if (!this.checkSpeechSynthesisSupport()) {
            this.showToast('当前浏览器不支持语音播放', 'warning');
            return;
        }
        
        const voiceText = message.voiceText || message.text;
        if (!voiceText) return;
        
        // 停止当前播放
        if (this.currentAIModeUtterance) {
            window.speechSynthesis.cancel();
        }
        
        try {
            const utterance = new SpeechSynthesisUtterance(voiceText);
            utterance.lang = 'zh-CN';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // 选择中文女声
            const voices = window.speechSynthesis.getVoices();
            const chineseFemaleVoice = voices.find(voice => 
                voice.lang.startsWith('zh') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.startsWith('zh-CN')) || null;
            
            if (chineseFemaleVoice) {
                utterance.voice = chineseFemaleVoice;
            }
            
            // 更新播放按钮状态
            const messageId = message.timestamp || Date.now();
            const playBtn = document.querySelector(`.voice-play-btn[data-message-id="${messageId}"]`);
            
            utterance.onstart = () => {
                if (playBtn) {
                    playBtn.classList.add('playing');
                    playBtn.textContent = '🔊';
                }
            };
            
            utterance.onend = () => {
                if (playBtn) {
                    playBtn.classList.remove('playing');
                    playBtn.textContent = '🔊';
                }
                this.currentAIModeUtterance = null;
            };
            
            utterance.onerror = (event) => {
                console.error('AI消息语音播放错误:', event.error);
                if (playBtn) {
                    playBtn.classList.remove('playing');
                    playBtn.textContent = '🔊';
                }
                this.currentAIModeUtterance = null;
            };
            
            this.currentAIModeUtterance = utterance;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('AI消息语音合成失败:', error);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartControlApp = new SmartControlApp();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}