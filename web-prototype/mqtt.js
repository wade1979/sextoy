// MQTT Client for Web Browser
class MQTTClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.brokerUrl = '';
        this.deviceId = '';
        this.topics = {
            control: 'device/control',
            status: 'device/status',
            heartbeat: 'device/heartbeat'
        };
        this.callbacks = {
            onConnect: null,
            onDisconnect: null,
            onMessage: null,
            onError: null
        };
    }

    // Initialize MQTT connection
    async connect(brokerUrl, deviceId, options = {}) {
        try {
            this.brokerUrl = brokerUrl;
            this.deviceId = deviceId;
            
            // Use MQTT.js for browser
            const mqtt = await import('https://unpkg.com/mqtt@5.3.4/dist/mqtt.min.js');
            
            const connectOptions = {
                clientId: `web_client_${Date.now()}`,
                clean: true,
                connectTimeout: 10000,
                reconnectPeriod: 5000,
                ...options
            };

            this.client = mqtt.connect(brokerUrl, connectOptions);

            // Connection event handlers
            this.client.on('connect', () => {
                console.log('MQTT Connected');
                this.isConnected = true;
                this.subscribeToTopics();
                if (this.callbacks.onConnect) {
                    this.callbacks.onConnect();
                }
            });

            this.client.on('disconnect', () => {
                console.log('MQTT Disconnected');
                this.isConnected = false;
                if (this.callbacks.onDisconnect) {
                    this.callbacks.onDisconnect();
                }
            });

            this.client.on('message', (topic, message) => {
                console.log('MQTT Message received:', topic, message.toString());
                if (this.callbacks.onMessage) {
                    this.callbacks.onMessage(topic, message.toString());
                }
            });

            this.client.on('error', (error) => {
                console.error('MQTT Error:', error);
                if (this.callbacks.onError) {
                    this.callbacks.onError(error);
                }
            });

        } catch (error) {
            console.error('Failed to initialize MQTT client:', error);
            throw error;
        }
    }

    // Subscribe to device topics
    subscribeToTopics() {
        if (!this.client || !this.isConnected) return;

        const deviceTopics = [
            `${this.topics.status}/${this.deviceId}`,
            `${this.topics.heartbeat}/${this.deviceId}`
        ];

        deviceTopics.forEach(topic => {
            this.client.subscribe(topic, (error) => {
                if (error) {
                    console.error(`Failed to subscribe to ${topic}:`, error);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
        });
    }

    // Send control command to device
    sendCommand(command) {
        if (!this.client || !this.isConnected) {
            throw new Error('MQTT client not connected');
        }

        const topic = `${this.topics.control}/${this.deviceId}`;
        const message = JSON.stringify({
            timestamp: Date.now(),
            command: command
        });

        this.client.publish(topic, message, (error) => {
            if (error) {
                console.error('Failed to send command:', error);
                throw error;
            } else {
                console.log('Command sent:', command);
            }
        });
    }

    // Send heartbeat to device
    sendHeartbeat() {
        if (!this.client || !this.isConnected) return;

        const topic = `${this.topics.heartbeat}/${this.deviceId}`;
        const message = JSON.stringify({
            timestamp: Date.now(),
            clientId: this.client.options.clientId
        });

        this.client.publish(topic, message);
    }

    // Disconnect from MQTT broker
    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.isConnected = false;
        }
    }

    // Set event callbacks
    onConnect(callback) {
        this.callbacks.onConnect = callback;
    }

    onDisconnect(callback) {
        this.callbacks.onDisconnect = callback;
    }

    onMessage(callback) {
        this.callbacks.onMessage = callback;
    }

    onError(callback) {
        this.callbacks.onError = callback;
    }

    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            brokerUrl: this.brokerUrl,
            deviceId: this.deviceId
        };
    }
}

// Device Control Commands
class DeviceCommands {
    static createCommand(type, parameters = {}) {
        return {
            type: type,
            parameters: parameters,
            timestamp: Date.now()
        };
    }

    // Basic control commands
    static stop() {
        return this.createCommand('stop');
    }

    static setSpeed(speed) {
        return this.createCommand('speed', { value: Math.max(0, Math.min(100, speed)) });
    }

    static setIntensity(intensity) {
        return this.createCommand('intensity', { value: Math.max(0, Math.min(100, intensity)) });
    }

    static setPattern(pattern) {
        return this.createCommand('pattern', { type: pattern });
    }

    // Preset mode commands
    static setPresetMode(mode) {
        return this.createCommand('preset', { mode: mode });
    }

    // Advanced control commands
    static setTemperature(temperature) {
        return this.createCommand('temperature', { value: Math.max(20, Math.min(45, temperature)) });
    }

    static setRhythm(rhythm) {
        return this.createCommand('rhythm', { pattern: rhythm });
    }

    // Custom pattern command
    static setCustomPattern(pattern) {
        return this.createCommand('custom_pattern', { pattern: pattern });
    }

    // Emergency stop
    static emergencyStop() {
        return this.createCommand('emergency_stop');
    }

    // WiFi Configuration Commands
    static startWiFiConfig() {
        return this.createCommand('wifi_config_start');
    }

    static sendWiFiCredentials(ssid, password) {
        return this.createCommand('wifi_config', {
            ssid: ssid,
            password: password
        });
    }

    static checkWiFiStatus() {
        return this.createCommand('wifi_status_check');
    }

    // AI Mode Commands
    static startAIMode(characterId, scenarioId) {
        return this.createCommand('ai_mode_start', {
            character: characterId,
            scenario: scenarioId
        });
    }

    static stopAIMode() {
        return this.createCommand('ai_mode_stop');
    }

    static pauseAIMode() {
        return this.createCommand('ai_mode_pause');
    }

    static resumeAIMode() {
        return this.createCommand('ai_mode_resume');
    }

    // Free Mode Commands
    static startFreeMode() {
        return this.createCommand('free_mode_start');
    }

    static stopFreeMode() {
        return this.createCommand('free_mode_stop');
    }

    static pauseFreeMode() {
        return this.createCommand('free_mode_pause');
    }

    static resumeFreeMode() {
        return this.createCommand('free_mode_resume');
    }

    static updateAIPreferences(preferences) {
        return this.createCommand('ai_preferences', preferences);
    }

    // Voice Command Commands
    static sendVoiceCommand(command, context = {}) {
        return this.createCommand('voice_command', {
            command: command,
            context: context,
            timestamp: Date.now()
        });
    }

    static sendVoiceFeedback(feedback) {
        return this.createCommand('voice_feedback', {
            feedback: feedback,
            timestamp: Date.now()
        });
    }

    // Free Mode Specific Commands
    static setStrokeSpeed(speed) {
        return this.createCommand('stroke_speed', { value: Math.max(0, Math.min(100, speed)) });
    }

    static setRotationSpeed(speed) {
        return this.createCommand('rotation_speed', { value: Math.max(0, Math.min(100, speed)) });
    }

    static setSuctionIntensity(intensity) {
        return this.createCommand('suction_intensity', { value: Math.max(0, Math.min(100, intensity)) });
    }

    // Waveform Control Commands
    static updateWaveformParams(params) {
        return this.createCommand('waveform_update', {
            speed: params.speed,
            intensity: params.intensity,
            pattern: params.pattern
        });
    }

    // Device Status Commands
    static requestDeviceStatus() {
        return this.createCommand('status_request');
    }

    static requestBatteryStatus() {
        return this.createCommand('battery_status');
    }

    static requestSignalStrength() {
        return this.createCommand('signal_strength');
    }

    // Learning and Analytics Commands
    static sendUsageData(data) {
        return this.createCommand('usage_data', {
            data: data,
            timestamp: Date.now()
        });
    }

    static sendPreferenceData(preferences) {
        return this.createCommand('preference_data', {
            preferences: preferences,
            timestamp: Date.now()
        });
    }
}

// Export for use in main app
window.MQTTClient = MQTTClient;
window.DeviceCommands = DeviceCommands;
