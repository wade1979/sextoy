// Voice Interaction Module
// 语音交互模块

class VoiceInteraction {
    constructor() {
        this.isListening = false;
        this.currentCharacter = null;
        this.currentScenario = null;
        this.voiceResponses = VOICE_RESPONSES;
        this.scenarioPlaybook = SCENARIO_VOICE_PLAYBOOK;
        this.responseQueue = [];
        this.isPlaying = false;
    }

    // 设置当前角色和场景
    setContext(character, scenario) {
        this.currentCharacter = character;
        this.currentScenario = scenario;
    }

    // 显示语音指令选择界面
    showVoiceCommands() {
        const modal = this.createVoiceCommandModal();
        document.body.appendChild(modal);
        
        // 添加动画效果
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    // 创建语音指令模态框
    createVoiceCommandModal() {
        const modal = document.createElement('div');
        modal.className = 'voice-command-modal';
        modal.innerHTML = `
            <div class="voice-modal-content">
                <div class="voice-modal-header">
                    <h3>语音指令</h3>
                    <button class="voice-modal-close">&times;</button>
                </div>
                <div class="voice-commands-grid">
                    ${VOICE_COMMANDS.map(cmd => `
                        <button class="voice-command-btn" data-command="${cmd.id}">
                            <div class="voice-command-icon">${cmd.icon}</div>
                            <div class="voice-command-text">${cmd.text}</div>
                        </button>
                    `).join('')}
                </div>
                <div class="voice-modal-footer">
                    <button class="voice-modal-cancel">取消</button>
                </div>
            </div>
        `;

        // 添加事件监听器
        modal.querySelector('.voice-modal-close').addEventListener('click', () => {
            this.hideVoiceCommandModal(modal);
        });

        modal.querySelector('.voice-modal-cancel').addEventListener('click', () => {
            this.hideVoiceCommandModal(modal);
        });

        modal.querySelectorAll('.voice-command-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const command = e.currentTarget.dataset.command;
                this.handleVoiceCommand(command);
                this.hideVoiceCommandModal(modal);
            });
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideVoiceCommandModal(modal);
            }
        });

        return modal;
    }

    // 隐藏语音指令模态框
    hideVoiceCommandModal(modal) {
        modal.classList.add('hide');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }

    // 处理语音指令
    handleVoiceCommand(commandId) {
        const command = VOICE_COMMANDS.find(cmd => cmd.id === commandId);
        if (!command) return;

        // 发送MQTT命令
        this.sendVoiceCommand(command);

        // 判断当前模式（通过检查页面元素的可见性）
        const aiMode = document.getElementById('aiMode');
        const isAIMode = aiMode && aiMode.classList.contains('active');
        const mode = isAIMode ? 'ai' : 'free';

        // 显示语音响应
        this.showVoiceResponse(commandId, mode);
    }

    // 发送语音指令到设备
    sendVoiceCommand(command) {
        if (window.smartControlApp && window.smartControlApp.mqttClient.isConnected) {
            const commandData = {
                type: 'voice_command',
                command: command.action,
                timestamp: Date.now()
            };
            
            try {
                window.smartControlApp.mqttClient.sendCommand(commandData);
                console.log('Voice command sent:', command);
            } catch (error) {
                console.error('Failed to send voice command:', error);
            }
        }
    }

    // 显示语音响应
    showVoiceResponse(commandId, mode = 'free') {
        const responses = this.getVoiceResponses(commandId);
        if (responses && responses.length > 0) {
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.displayVoiceResponse(response, mode);
        }
    }

    // 获取语音响应内容
    getVoiceResponses(commandId) {
        if (this.currentCharacter && this.voiceResponses[this.currentCharacter.id]) {
            return this.voiceResponses[this.currentCharacter.id][commandId];
        }
        return this.voiceResponses.general[commandId];
    }

    // 显示语音播报内容
    displayVoiceResponse(text, mode = 'free') {
        // 更新播报图标状态
        this.updateBroadcastIcon('playing', mode);
        
        // 确定使用哪个容器
        const containerId = mode === 'ai' ? 'aiVoiceResponseContainer' : 'voiceResponseContainer';
        const responseContainer = document.getElementById(containerId);
        if (!responseContainer) return;

        // 创建响应元素
        const responseElement = document.createElement('div');
        responseElement.className = 'voice-response-item';
        responseElement.innerHTML = `
            <div class="voice-response-icon">🎤</div>
            <div class="voice-response-text">${text}</div>
        `;

        // 添加到容器
        responseContainer.appendChild(responseElement);

        // 滚动到底部
        responseContainer.scrollTop = responseContainer.scrollHeight;

        // 添加动画效果
        setTimeout(() => {
            responseElement.classList.add('show');
        }, 10);

        // 自动移除（可选）
        setTimeout(() => {
            responseElement.classList.add('fade-out');
            setTimeout(() => {
                if (responseElement.parentNode) {
                    responseElement.remove();
                }
            }, 300);
        }, 5000);
        
        // 3秒后恢复静音状态
        setTimeout(() => {
            this.updateBroadcastIcon('muted', mode);
        }, 3000);
    }
    
    // 更新播报图标状态
    updateBroadcastIcon(state, mode = 'free') {
        const iconId = mode === 'ai' ? 'aiBroadcastIcon' : 'freeBroadcastIcon';
        const icon = document.getElementById(iconId);
        if (!icon) return;
        
        if (state === 'playing') {
            icon.textContent = '🔊';
            icon.classList.remove('muted');
            icon.classList.add('playing');
        } else {
            icon.textContent = '🔇';
            icon.classList.remove('playing');
            icon.classList.add('muted');
        }
    }

    // 场景运行中的语音播报
    playScenarioVoice(phase, progress = 0) {
        if (!this.currentScenario || !this.scenarioPlaybook[this.currentScenario.id]) {
            return;
        }

        const playbook = this.scenarioPlaybook[this.currentScenario.id];
        const phaseMessages = playbook[phase];
        
        if (phaseMessages && phaseMessages.length > 0) {
            // 根据进度选择消息
            const messageIndex = Math.floor((progress / 100) * phaseMessages.length);
            const message = phaseMessages[Math.min(messageIndex, phaseMessages.length - 1)];
            
            // AI模式使用ai模式标识
            this.displayVoiceResponse(message, 'ai');
        }
    }

    // 开始场景语音播报
    startScenarioPlayback() {
        this.isPlaying = true;
        this.playScenarioVoice('start');
        
        // 定时播报进度消息
        this.scenarioInterval = setInterval(() => {
            if (this.isPlaying) {
                const progress = this.getCurrentProgress();
                this.playScenarioVoice('progress', progress);
            }
        }, 30000); // 每30秒播报一次
    }

    // 停止场景语音播报
    stopScenarioPlayback() {
        this.isPlaying = false;
        if (this.scenarioInterval) {
            clearInterval(this.scenarioInterval);
            this.scenarioInterval = null;
        }
    }

    // 播放场景高潮语音
    playClimaxVoice() {
        this.playScenarioVoice('climax');
    }

    // 播放场景结束语音
    playEndVoice() {
        this.playScenarioVoice('end');
        this.stopScenarioPlayback();
    }

    // 获取当前进度（模拟）
    getCurrentProgress() {
        // 这里应该从实际的设备状态获取
        // 暂时返回随机进度
        return Math.floor(Math.random() * 100);
    }

    // 清除所有语音响应
    clearAllResponses() {
        const responseContainer = document.getElementById('voiceResponseContainer');
        if (responseContainer) {
            responseContainer.innerHTML = '';
        }
    }

    // 设置语音播报音量（模拟）
    setVolume(volume) {
        // 这里可以集成Web Audio API来控制音量
        console.log('Voice volume set to:', volume);
    }

    // 设置语音播报速度（模拟）
    setSpeed(speed) {
        // 这里可以集成Web Speech API来控制语速
        console.log('Voice speed set to:', speed);
    }
}

// 导出语音交互模块
window.VoiceInteraction = VoiceInteraction;
