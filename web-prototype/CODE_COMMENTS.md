# 代码注释说明文档

本文档详细说明了各个文件的功能模块和关键代码段的作用。

## 文件结构

```
web-prototype/
├── index.html          # 主HTML文件，包含所有界面结构
├── app.js             # 主应用逻辑，页面切换和业务逻辑
├── characters.js      # 角色和场景配置数据
├── voice.js           # 语音交互模块
├── waveform.js        # 波形动画模块
├── mqtt.js            # MQTT通信模块
├── styles.css         # 样式文件
└── demo.html          # 演示页面
```

---

## 1. index.html - 主界面结构

### 整体架构
单页面应用（SPA），所有功能页面都在同一个HTML文件中，通过CSS的`display`属性控制显示/隐藏。

### 主要页面说明

#### 1.1 首页 (id="home")
- **位置**: 行 48-76
- **功能**: 三个功能入口
  - 设备连接 (data-action="wifiSetup")
  - AI模式配置 (data-action="characterBrowse")
  - 智能模式启动 (data-action="modeSelection")

#### 1.2 WiFi配置流程 (id="wifiSetup")
- **位置**: 行 78-180
- **4个步骤**:
  - 步骤1 (id="setupStep1"): 切换到设备热点说明
  - 步骤2 (id="setupStep2"): 检测设备连接
  - 步骤3 (id="setupStep3"): WiFi网络配置
  - 步骤4 (id="setupStep4"): 配置结果确认

#### 1.3 角色浏览 (id="characterBrowse")
- **位置**: 行 182-193
- **功能**: 从首页"AI模式配置"进入，浏览所有角色
- **动态生成**: 角色卡片通过 `renderCharactersForBrowse()` 生成

#### 1.4 角色场景浏览 (id="characterScenarios")
- **位置**: 行 195-206
- **功能**: 显示某个角色的所有场景
- **触发**: 在角色浏览页面点击某角色后进入

#### 1.5 角色选择 (id="characterSelection")
- **位置**: 行 208-219
- **功能**: AI模式流程中的角色选择步骤
- **触发**: 从模式选择页面选择"AI模式"后进入

#### 1.6 场景选择 (id="scenarioSelection")
- **位置**: 行 221-232
- **功能**: AI模式流程中的场景选择步骤
- **触发**: 选择角色后进入

#### 1.7 模式选择 (id="modeSelection")
- **位置**: 行 234-248
- **功能**: 选择"自由模式"或"AI模式"
- **两种模式**:
  - 自由模式: 直接进入控制面板
  - AI模式: 先选择角色和场景

#### 1.8 自由模式 (id="freeMode")
- **位置**: 行 267-338
- **组成部分**:
  - 波形显示区 (waveform-section): 显示CSS动画波形
  - 手动控制区 (manual-controls): 三个滑动条（伸缩速度、旋转速度、夹吸力度）
  - 语音交互区 (voice-section): bo
    - 语音指令按钮
    - 停止按钮
    - 语音播报状态图标 (id="freeBroadcastIcon")
    - 语音响应显示区 (id="voiceResponseContainer")

#### 1.9 AI模式 (id="aiMode")
- **位置**: 行 340-428
- **组成部分**:
  - 角色背景 (ai-background): 半透明背景图
  - AI控制区 (ai-controls): 角色信息和控制按钮
  - 即时反馈面板 (ai-feedback-panel): 6个反馈按钮
    - 喜欢、跳过、快点、慢点、用力、轻点
  - 语音响应显示区 (id="aiVoiceResponseContainer")

#### 1.10 AI偏好学习 (WhatsApp
- **位置**: 行 430-448
- **状态**: 功能开发中，预留位置

---

## 2. app.js - 主应用逻辑

### 核心类: SmartControlApp

#### 构造函数 (constructor)
- **初始化组件**: mqttClient, voiceInteraction, waveformAnimation
- **状态变量**:
  - `currentScreen`: 当前页面
  - `currentCharacter`: 当前选中角色
  - `currentScenario`: 当前选中场景
  - `currentMode`: 当前模式
  - `setupStep`: WiFi配置步骤
  - `isRunning`: 设备运行状态

#### 关键方法说明

##### 2.1 页面管理
- `switchScreen(screenName)`: 切换页面（行 274-304）
- `handleScreenEnter(screenName)`: 页面进入时的初始化（行 306-328）
- `handleHomeAction(action)`: 处理首页卡片点击（行 330-344）

##### 2.2 WiFi配置流程
- `nextSetupStep(step)`: 进入下一步（行 346-375）
- `checkDeviceConnection()`: 检测设备连接（行 391-411）
- `scanWiFiNetworks()`: 扫描WiFi网络（行 413-443）
- `startWiFiConfiguration()`: 开始WiFi配置（行 469-504）

##### 2.3 角色和场景管理
- `renderCharactersForBrowse()`: 渲染角色浏览页面（行 512-534）
- `renderCharacterScenarios()`: 渲染某角色的场景（行 537-555）
- `renderCharactersForSelection()`: 渲染角色选择页面（行 557-578）
- `renderScenarios()`: 渲染场景选择页面（行 599-626）

##### 2.4 模式控制
- `selectMode(mode)`: 选择模式（行 648-671）
- `startFreeMode()`: 启动自由模式（行 673-684）
- `stopDevice()`: 停止设备（行 686-697）
- `startAIMode()`: 启动AI模式（行 700-723）
- `stopAIMode()`: 停止AI模式（行 725-736）

##### 2.5 设备控制
- `sendCommand(command)`: 发送MQTT命令（行 764-775）
- `setupSliderControls()`: 设置滑动条控制（行 210-249）
- `setupFeedbackButtons()`: 设置反馈按钮（行 158-174）

##### 2.6 UI辅助函数
- `showToast(message, type)`: 显示Toast通知（行 831-851）
- `updateConnectionStatus()`: 更新连接状态（行 799-812）
- `updateModeStatus(isRunning)`: 更新模式状态（行 814-829）

---

## 3. characters.js - 角色和场景数据

### 数据结构

#### CHARACTERS - 角色定义
```javascript
const CHARACTERS = {
    nurse: {        // 护理师
        id, name, description, personality,
        backgroundImage, voiceStyle, color
    },
    queen: { ... },  // 御姐
    girlfriend: { ... },  // 女友
    coach: { ... },  // 教练
    ol: { ... }      // 白领女性
}
```

#### SCENARIOS - 场景定义
```javascript
const SCENARIOS = {
    intimate: {     // 私密唤醒
        id, name, description, duration,
        intensity, icon, color
    },
    relaxation: { ... },  // 休息放松
    training: { ... },    // 节奏训练
    care: { ... },        // 温柔照护
    tease: { ... }        // 主控调戏
}
```

#### VOICE_COMMANDS - 语音指令
```javascript
const VOICE_COMMANDS = [
    { id: 'faster', text: '快点', ... },
    { id: 'slower', text: '慢点', ... },
    { id: 'tighter', text: '紧一点', ... },
    { id: 'skip', text: '跳过', ... },
    { id: 'pause', text: '暂停', ... }
]
```

#### VOICE_RESPONSES - 语音响应模板
- `general`: 通用响应
- 每个角色特定的响应: `nurse`, `queen`, `girlfriend`, `coach`, `ol`

#### SCENARIO_VOICE_PLAYBOOK - 场景语音播报剧本
- 每个场景的4个阶段: `start`, `progress`, `climax`, `end`
- 每个阶段有多个播报内容

---

## 4. voice.js - 语音交互模块

### 核心类: VoiceInteraction

#### 主要方法

##### 4.1 语音指令
- `showVoiceCommands()`: 显示语音指令模态框（行 22-30）
- `createVoiceCommandModal()`: 创建语音指令UI（行 33-81）
- `handleVoiceCommand(commandId)`: 处理语音指令（行 92-106）
- `sendVoiceCommand(command)`: 发送语音指令到设备（行 108-124）

##### 4.2 语音播报
- `displayVoiceResponse(text, mode)`: 显示语音播报内容（行 144-186）
- `updateBroadcastIcon(state, mode)`: 更新播报图标状态（行 189-203）
- `getVoiceResponses(commandId)`: 获取语音响应内容（行 136-141）

##### 4.3 场景语音播报
- `playScenarioVoice(phase, progress)`: 播放场景语音（行 206-222）
- `startScenarioPlayback()`: 开始场景播报（行 225-236）
- `stopScenarioPlayback()`: 停止场景播报（行 239-245）
- `playClimaxVoice()`: 播放高潮语音（行 248-250）
- `playEndVoice()`: 播放结束语音（行 253-256）

---

## 5. mqtt.js - MQTT通信模块

### 核心类

#### 5.1 MQTTClient - MQTT客户端
- `connect()`: 连接MQTT服务器（行 22-76）
- `subscribeToTopics()`: 订阅主题（行 79-96）
- `sendCommand()`: 发送控制命令（行 99-118）
- `sendHeartbeat()`: 发送心跳（行 121-131）
- `onConnect/onDisconnect/onMessage/onError`: 事件回调设置

#### 5.2 DeviceCommands - 设备命令定义
所有设备控制命令的静态方法：
- 基础控制: `stop()`, `setSpeed()`, `setIntensity()`
- WiFi配置: `startWiFiConfig()`, `sendWiFiCredentials()`
- AI模式: `startAIMode()`, `stopAIMode()`
- 自由模式: `startFreeMode()`, `stopFreeMode()`
- 参数控制: `setStrokeSpeed()`, `setRotationSpeed()`, `setSuctionIntensity()`
- 语音控制: `sendVoiceCommand()`, `sendVoiceFeedback()`

---

## 6. waveform.js - 波形动画模块

### 核心类: WaveformAnimation
- CSS动画实现的波形效果
- 根据控制参数（速度、强度）动态调整动画

---

## 7. demo.html - 演示页面

### 功能
- 展示产品特性和功能
- 角色和场景预览
- 交互流程说明
- 链接到主原型

---

## 主要交互流程

### 1. WiFi配置流程
```
首页 → wifiSetup → 步骤1 → 步骤2 → 步骤3 → 步骤4 → 首页
```

### 2. 角色浏览流程
```
首页 → characterBrowse → characterScenarios
```

### 3. AI模式启动流程
```
首页 → modeSelection → characterSelection → scenarioSelection → aiMode
```

### 4. 自由模式启动流程
```
首页 → modeSelection → freeMode (直接进入)
```

---

## 关键UI元素ID说明

### 页面元素
- `home`, `wifiSetup`, `characterBrowse`, `characterScenarios`
- `characterSelection`, `scenarioSelection`, `modeSelection`
- `freeMode`, `aiMode`, `aiPreference`

### WiFi配置
- `setupStep1/2/3/4`: 配置步骤
- `hotspotStatus`, `deviceStatus`: 连接状态
- `wifiList`: WiFi列表
- `wifiPassword`: WiFi密码输入

### 自由模式
- `waveformContainer`: 波形显示区
- `strokeSpeedSlider/Value`: 伸缩速度
- `rotationSpeedSlider/Value`: 旋转速度
- `suctionIntensitySlider/Value`: 夹吸力度
- `voiceCommandBtn`, `stopBtn`: 控制按钮
- `freeBroadcastIcon`: 语音播报图标
- `voiceResponseContainer`: 语音响应显示区

### AI模式
- `aiBackground`: 角色背景
- `aiCharacterAvatar`, `aiCharacterName`, `aiScenarioName`: 角色信息
- `aiProgress`, `aiProgressText`: 进度显示
- `aiVoiceCommandBtn`, `aiStopBtn`: 控制按钮
- `aiBroadcastIcon`: 角色语音播报图标
- `aiVoiceResponseContainer`: AI语音响应显示区
- `feedbackLike/Skip/Fast/Slow/Hard/Soft`: 反馈按钮

---

## 样式说明

主要使用 `styles.css` 中的类名：
- `.screen`: 页面容器
- `.screen.active`: 当前激活页面
- `.home-card`, `.character-card`, `.scenario-card`: 卡片样式
- `.btn`, `.voice-btn`, `.feedback-btn`: 按钮样式
- `.waveform-container`: 波形动画容器
- `.voice-command-modal`: 语音指令模态框
- `.broadcast-icon`: 语音播报图标（`.muted`静音，`.playing`播放中）

---

## 调试技巧

1. **查看当前页面**: 在浏览器控制台输入 `window.smartControlApp.currentScreen`
2. **查看当前角色**: `window.smartControlApp.currentCharacter`
3. **查看当前场景**: `window.smartControlApp.currentScenario`
4. **MQTT连接状态**: `window.smartControlApp.mqttClient.isConnected`
5. **手动切换页面**: `window.smartControlApp.switchScreen('screenName')`

---

## 扩展功能建议

1. **实时波形**: 使用Canvas或WebGL实现真实波形
2. **语音识别**: 集成Web Speech API实现真实语音识别
3. **离线缓存**: 使用Service Worker实现离线功能
4. **数据分析**: 记录用户使用数据用于AI偏好学习
5. **多语言支持**: 国际化支持
6. **主题切换**: 深色模式支持

