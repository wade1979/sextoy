# AI Control Prototype

智能控制原型 - 基于Web Speech API的语音交互控制面板

## 项目简介

这是一个智能设备控制原型，支持自由模式和AI模式两种控制方式：

- **自由模式**：手动控制设备参数（伸缩速度、旋转速度、夹吸力度），支持语音指令控制
- **AI模式**：基于角色和场景的智能交互，支持AI聊天和语音对话

## 功能特性

### 自由模式
- 语音指令控制（快点/慢点/用力/轻点/暂停/继续）
- 实时波形图显示
- 手动滑块控制
- 语音反馈

### AI模式
- AI角色选择（5个AI角色）
- 场景选择（5个场景）
- AI聊天互动
- 语音对话
- 实时波形图显示
- 快捷反馈按钮

## 技术栈

- HTML5 / CSS3 / JavaScript (ES6+)
- Web Speech API (语音识别和语音合成)
- Canvas API (波形图动画)
- MQTT (设备通信)
- PWA (渐进式Web应用)

## 项目结构

```
sextoy/
├── web-prototype/          # Web原型代码
│   ├── index.html          # 主页面
│   ├── app.js              # 主应用逻辑
│   ├── characters.js       # 角色和场景配置
│   ├── idols.js            # 女优分身配置
│   ├── chat-demo.js        # 聊天演示数据
│   ├── mqtt.js             # MQTT通信模块
│   ├── voice.js            # 语音交互模块
│   ├── waveform.js         # 波形图动画模块
│   ├── styles.css          # 样式文件
│   └── resource/           # 资源文件（图片、视频）
├── release/                # 发布版本
└── README.md               # 项目说明
```

## 快速开始

### 1. 启动本地服务器

```bash
# 使用Python启动HTTP服务器
python3 server.py

# 或使用start_server.py
python3 start_server.py
```

### 2. 打开浏览器

访问 `http://localhost:8000/web-prototype/`

### 3. 功能测试

- **自由模式**：点击"智能模式启动" → 选择"自由模式" → 点击"开始"按钮
- **AI模式**：点击"智能模式启动" → 选择"AI模式" → 选择角色和场景 → 点击"开始"按钮

## 浏览器要求

- Chrome/Edge (推荐，支持Web Speech API)
- 需要HTTPS环境（localhost除外）
- 需要麦克风权限

## 开发说明

### 主要文件说明

- `app.js`：主应用逻辑，包含模式控制、语音识别、聊天功能等
- `characters.js`：角色和场景数据配置
- `mqtt.js`：MQTT设备通信协议
- `voice.js`：语音交互模块
- `styles.css`：所有样式定义

### 语音功能

- **自由模式**：支持语音指令识别（快点/慢点/用力/轻点/暂停/继续）
- **AI模式**：支持自由语音对话，AI自动回复

## 许可证

私有项目

## 更新日志

详见 `AI_PROTOTYPE_SUMMARY.md`

