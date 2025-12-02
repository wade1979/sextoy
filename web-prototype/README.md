# Smart Control AI Prototype

## 项目概述

这是一个基于Web浏览器的智能男用自慰飞机杯控制原型，专为移动端设计，采用简洁明快的现代UI风格，目标用户为欧美市场。原型实现了完整的AI角色场景系统、WiFi配置流程、双模式控制面板和语音交互功能。

## 技术特性

- **纯Web技术**: HTML5 + CSS3 + JavaScript (ES6+)
- **响应式设计**: 专为手机浏览器优化
- **MQTT通信**: 通过物联网协议与设备通信
- **PWA支持**: 可安装的Web应用
- **现代UI**: 简洁明快的设计风格
- **AI角色系统**: 5个角色 × 5个场景 = 25种体验组合
- **语音交互**: 模拟语音指令和角色化语音播报
- **波形可视化**: CSS动画实现的实时波形效果

## 项目结构

```
web-prototype/
├── index.html          # 主应用页面
├── demo.html           # 演示页面
├── styles.css          # 样式文件
├── app.js             # 主应用逻辑
├── characters.js      # 角色和场景配置
├── voice.js           # 语音交互模块
├── waveform.js        # 波形动画模块
├── mqtt.js            # MQTT客户端
├── manifest.json      # PWA清单文件
├── sw.js              # Service Worker
├── resource/          # 角色背景图片
│   ├── background_nurse.png
│   ├── background_queen.png
│   ├── background_girlfriend.png
│   ├── background_coach.png
│   └── background_ol.png
└── README.md          # 项目说明
```

## 核心功能

### 1. 首页功能入口
- 卡片式视觉化设计
- 三个主要功能模块：设备连接、AI模式配置、智能模式启动
- 直观的图标和描述

### 2. WiFi设备配置流程
- **步骤1**: SoftAP说明和引导
- **步骤2**: 设备连接检测
- **步骤3**: WiFi网络配置
- **步骤4**: 配置结果确认
- 完整的4步式配置流程

### 3. AI角色场景系统
- **5个AI角色**: 护理师、御姐、女友、教练、白领女性
- **5个体验场景**: 私密唤醒、休息放松、节奏训练、温柔照护、主控调戏
- **25种组合**: 每个角色都有独特的个性和背景图片
- 卡片式浏览和选择界面

### 4. 双模式控制面板
- **自由模式**: 手动控制伸缩速度、旋转速度、夹吸力度
- **AI模式**: 智能角色陪伴，沉浸式体验
- 实时波形可视化效果
- 语音指令和语音播报系统

### 5. 语音交互系统
- **语音指令**: 快点、慢点、紧一点、跳过、暂停
- **语音播报**: 角色化的响应内容
- **场景语音**: 运行过程中的角色话术
- 文字显示配合语音效果

## 设计特色

### 视觉设计
- **色彩方案**: 现代紫色主题 (#6366f1)
- **字体**: Inter字体，清晰易读
- **布局**: 移动优先的响应式设计
- **交互**: 流畅的动画和过渡效果

### 用户体验
- **简洁界面**: 减少认知负担
- **直观操作**: 大按钮，易于触摸
- **即时反馈**: 实时状态更新和通知
- **错误处理**: 友好的错误提示

## MQTT通信协议

### 主题结构
```
device/control/{deviceId}    # 发送控制命令
device/status/{deviceId}     # 接收设备状态
device/heartbeat/{deviceId}  # 心跳检测
```

### 命令格式
```json
{
  "timestamp": 1640995200000,
  "command": {
    "type": "speed",
    "parameters": {
      "value": 75
    }
  }
}
```

## 部署说明

### 本地开发
1. 使用HTTP服务器运行项目
2. 配置MQTT代理地址
3. 在手机浏览器中访问

### 生产部署
1. 部署到Web服务器
2. 配置HTTPS（PWA要求）
3. 注册Service Worker

## 浏览器兼容性

- Chrome Mobile 80+
- Safari Mobile 13+
- Firefox Mobile 75+
- Edge Mobile 80+

## 开发计划

- [x] 基础UI框架
- [x] MQTT客户端集成
- [x] 设备控制功能
- [ ] 音视频同步
- [ ] 高级模式定制
- [ ] 用户账户系统
- [ ] 数据统计和分析

## 技术栈

- **前端**: HTML5, CSS3, JavaScript ES6+
- **通信**: MQTT.js
- **UI框架**: 原生CSS + CSS Grid/Flexbox
- **PWA**: Service Worker, Web App Manifest
- **构建**: 无需构建工具，纯原生开发

## 安全考虑

- HTTPS通信
- 设备认证
- 数据加密
- 隐私保护

## 性能优化

- 懒加载
- 资源压缩
- 缓存策略
- 响应式图片

## 未来扩展

- 多设备支持
- 云端同步
- AI智能推荐
- 社交功能
- VR/AR集成
