# 智能飞机杯控制APP - 技术架构文档

## 项目概述
本文档详细描述了智能飞机杯控制APP的技术架构设计，包括前端、后端、设备通信、AI集成等各个技术层面的实现方案。

## 技术栈选择

### 前端技术栈
- **开发语言**: Swift 5.0+
- **UI框架**: SwiftUI + UIKit
- **最低支持**: iOS 14.0+
- **架构模式**: MVVM + Combine
- **状态管理**: @StateObject + @ObservedObject

### 后端技术栈
- **开发语言**: Python 3.9+
- **Web框架**: FastAPI
- **数据库**: PostgreSQL + Redis
- **消息队列**: Celery + RabbitMQ
- **AI服务**: OpenAI GPT-4 + Whisper

### 设备通信
- **蓝牙通信**: Core Bluetooth (BLE)
- **WiFi通信**: WebSocket + HTTP
- **协议**: 自定义二进制协议

## 系统架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   iOS Client    │    │   Backend API   │    │  Smart Device   │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   SwiftUI   │ │    │ │  FastAPI    │ │    │ │   MCU       │ │
│ │   Views     │ │    │ │  Server     │ │    │ │ Controller  │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ ViewModels  │ │◄──►│ │  Database   │ │    │ │   Sensors   │ │
│ │             │ │    │ │  Layer      │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   Services  │ │    │ │   AI/ML     │ │    │ │   Actuators │ │
│ │             │ │    │ │  Services   │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 核心模块设计

### 1. 设备管理模块

#### 设备连接服务
```swift
class DeviceConnectionService: ObservableObject {
    @Published var connectionStatus: ConnectionStatus = .disconnected
    @Published var deviceInfo: DeviceInfo?
    
    private var centralManager: CBCentralManager?
    private var peripheral: CBPeripheral?
    
    func connectToDevice(deviceId: String) async throws {
        // 实现设备连接逻辑
    }
    
    func disconnectDevice() {
        // 实现设备断开逻辑
    }
}
```

#### 设备信息模型
```swift
struct DeviceInfo: Codable {
    let deviceId: String
    let deviceName: String
    let firmwareVersion: String
    let batteryLevel: Int
    let signalStrength: SignalStrength
    let wifiInfo: WiFiInfo
    let userEmail: String
}

struct WiFiInfo: Codable {
    let ssid: String
    let password: String
    let signalStrength: Int
}
```

### 2. 数字人管理模块

#### 数字人模型
```swift
struct DigitalHuman: Codable, Identifiable {
    let id: UUID
    let name: String
    let avatar: String
    let style: CharacterStyle
    let appearance: Appearance
    let personality: Personality
    let voiceSettings: VoiceSettings
}

struct CharacterStyle: Codable {
    let type: StyleType
    let description: String
    let tags: [String]
}

enum StyleType: String, CaseIterable, Codable {
    case gentleTeacher = "温柔老师"
    case sweetLover = "甜蜜恋人"
    case professionalMasseur = "专业按摩师"
    case mysteriousQueen = "神秘女王"
    case cuteStudent = "可爱学生"
    case custom = "定制角色"
}
```

#### 数字人设置视图
```swift
struct DigitalHumanSetupView: View {
    @StateObject private var viewModel = DigitalHumanSetupViewModel()
    @State private var selectedStyle: CharacterStyle?
    
    var body: some View {
        ScrollView {
            LazyVGrid(columns: gridItems, spacing: 20) {
                ForEach(CharacterStyle.allCases, id: \.self) { style in
                    CharacterCard(style: style, isSelected: selectedStyle == style)
                        .onTapGesture {
                            selectedStyle = style
                        }
                }
            }
        }
    }
}
```

### 3. 剧本系统模块

#### 剧本模型
```swift
struct Script: Codable, Identifiable {
    let id: UUID
    let name: String
    let description: String
    let duration: TimeInterval
    let intensity: IntensityLevel
    let characterStyle: CharacterStyle
    let rhythmPattern: RhythmPattern
    let audioSettings: AudioSettings
}

struct RhythmPattern: Codable {
    let phases: [RhythmPhase]
    let transitions: [Transition]
    let intensityCurve: [Double]
}

struct RhythmPhase: Codable {
    let duration: TimeInterval
    let actions: [DeviceAction]
    let intensity: Double
}
```

#### 剧本生成服务
```swift
class ScriptGenerationService {
    private let openAIClient: OpenAIClient
    
    func generateScript(
        characterStyle: CharacterStyle,
        duration: TimeInterval,
        intensity: IntensityLevel,
        customSettings: ScriptCustomSettings? = nil
    ) async throws -> Script {
        let prompt = createScriptPrompt(characterStyle, duration, intensity, customSettings)
        let response = try await openAIClient.generateScript(prompt)
        return try parseScriptResponse(response)
    }
    
    private func createScriptPrompt(
        _ style: CharacterStyle,
        _ duration: TimeInterval,
        _ intensity: IntensityLevel,
        _ customSettings: ScriptCustomSettings?
    ) -> String {
        var prompt = """
        基于以下参数生成一个智能设备控制剧本：
        - 角色风格：\(style.description)
        - 体验时长：\(duration)分钟
        - 强度等级：\(intensity.rawValue)
        """
        
        if let settings = customSettings {
            prompt += """
            
            自定义设定：
            - 角色名称：\(settings.characterName)
            - 角色职业：\(settings.characterProfession)
            - 角色性格：\(settings.characterPersonality)
            - 背景故事：\(settings.backgroundStory)
            - 故事背景：\(settings.storyBackground)
            - 故事大纲：\(settings.storyOutline)
            - 互动风格：\(settings.interactionStyle)
            - 语音频率：\(settings.voiceFrequency)
            """
        }
        
        prompt += """
        
        请生成包含以下内容的剧本：
        1. 节奏模式（伸缩、旋转、吮吸、温度的变化）
        2. 时间轴（每个阶段的具体时长）
        3. 强度曲线（整体体验的强度变化）
        4. 音频配合（语音内容和背景音乐）
        5. 角色对话（基于自定义设定生成）
        """
        
        return prompt
    }
}

struct ScriptCustomSettings: Codable {
    let characterName: String
    let characterProfession: String
    let characterPersonality: String
    let backgroundStory: String
    let storyBackground: String
    let storyOutline: String
    let interactionStyle: String
    let voiceFrequency: String
    let keyDialogues: [String]
    let rhythmSettings: RhythmSettings
}

struct RhythmSettings: Codable {
    let openingRhythm: String
    let climaxRhythm: String
    let endingRhythm: String
}
```

### 4. 设备控制模块

#### 设备动作模型
```swift
struct DeviceAction: Codable {
    let type: ActionType
    let parameters: [String: Double]
    let duration: TimeInterval
    let transition: TransitionType
}

enum ActionType: String, Codable {
    case stretch = "伸缩"
    case rotate = "旋转"
    case suction = "吮吸"
    case temperature = "温度"
}

struct DeviceControlService {
    private let deviceConnection: DeviceConnectionService
    
    func executeAction(_ action: DeviceAction) async throws {
        let command = buildCommand(from: action)
        try await deviceConnection.sendCommand(command)
    }
    
    func executePattern(_ pattern: RhythmPattern) async throws {
        for phase in pattern.phases {
            for action in phase.actions {
                try await executeAction(action)
                try await Task.sleep(nanoseconds: UInt64(action.duration * 1_000_000_000))
            }
        }
    }
}
```

### 5. 音视频同步模块

#### 音视频分析服务
```swift
class MediaAnalysisService {
    private let audioAnalyzer: AudioAnalyzer
    private let videoAnalyzer: VideoAnalyzer
    
    func analyzeMedia(url: URL) async throws -> MediaAnalysis {
        async let audioAnalysis = audioAnalyzer.analyze(url: url)
        async let videoAnalysis = videoAnalyzer.analyze(url: url)
        
        let (audio, video) = try await (audioAnalysis, videoAnalysis)
        return MediaAnalysis(audio: audio, video: video)
    }
    
    func generateRhythmFromAnalysis(_ analysis: MediaAnalysis) -> RhythmPattern {
        // 基于音视频分析结果生成节奏模式
        return RhythmPattern(
            phases: analysis.audio.beats.map { beat in
                RhythmPhase(
                    duration: beat.duration,
                    actions: convertBeatToActions(beat),
                    intensity: beat.intensity
                )
            },
            transitions: analysis.video.sceneTransitions,
            intensityCurve: analysis.audio.intensityCurve
        )
    }
}
```

## 数据库设计

### 用户表
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 设备表
```sql
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    device_name VARCHAR(255),
    firmware_version VARCHAR(50),
    last_connected TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 数字人表
```sql
CREATE TABLE digital_humans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    style_type VARCHAR(50) NOT NULL,
    appearance_config JSONB,
    personality_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 剧本表
```sql
CREATE TABLE scripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    digital_human_id UUID REFERENCES digital_humans(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    intensity_level VARCHAR(20) NOT NULL,
    rhythm_pattern JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 剧本设定表
```sql
CREATE TABLE script_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_id UUID REFERENCES scripts(id),
    character_name VARCHAR(255),
    character_profession VARCHAR(100),
    character_personality TEXT,
    background_story TEXT,
    story_background TEXT,
    story_outline TEXT,
    interaction_style VARCHAR(50),
    voice_frequency VARCHAR(50),
    key_dialogues JSONB,
    rhythm_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API设计

### RESTful API端点

#### 设备管理
```
GET    /api/devices                    # 获取用户设备列表
POST   /api/devices                    # 注册新设备
GET    /api/devices/{id}               # 获取设备详情
PUT    /api/devices/{id}               # 更新设备信息
DELETE /api/devices/{id}               # 删除设备
POST   /api/devices/{id}/connect       # 连接设备
POST   /api/devices/{id}/disconnect    # 断开设备
```

#### 数字人管理
```
GET    /api/digital-humans             # 获取数字人列表
POST   /api/digital-humans             # 创建数字人
GET    /api/digital-humans/{id}        # 获取数字人详情
PUT    /api/digital-humans/{id}        # 更新数字人
DELETE /api/digital-humans/{id}        # 删除数字人
```

#### 剧本管理
```
GET    /api/scripts                    # 获取剧本列表
POST   /api/scripts                    # 创建剧本
GET    /api/scripts/{id}               # 获取剧本详情
PUT    /api/scripts/{id}               # 更新剧本
DELETE /api/scripts/{id}               # 删除剧本
POST   /api/scripts/generate           # AI生成剧本
```

#### 剧本设定管理
```
GET    /api/scripts/{id}/settings      # 获取剧本设定
POST   /api/scripts/{id}/settings      # 创建剧本设定
PUT    /api/scripts/{id}/settings      # 更新剧本设定
DELETE /api/scripts/{id}/settings      # 删除剧本设定
POST   /api/scripts/{id}/customize     # 自定义剧本生成
```

#### 设备控制
```
POST   /api/devices/{id}/control       # 发送控制命令
POST   /api/devices/{id}/pattern       # 执行节奏模式
POST   /api/devices/{id}/media-sync    # 音视频同步控制
```

### WebSocket API
```javascript
// 连接WebSocket
const ws = new WebSocket('ws://api.example.com/ws/device/{deviceId}');

// 发送控制命令
ws.send(JSON.stringify({
    type: 'control',
    action: 'stretch',
    parameters: { speed: 75, depth: 60 }
}));

// 接收设备状态更新
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'status') {
        updateDeviceStatus(data.status);
    }
};
```

## 安全设计

### 数据加密
- **传输加密**: TLS 1.3
- **存储加密**: AES-256
- **敏感数据**: 使用Keychain存储

### 身份认证
- **JWT Token**: 用于API认证
- **OAuth 2.0**: 支持第三方登录
- **设备认证**: 基于证书的设备验证

### 隐私保护
- **数据脱敏**: 用户敏感信息脱敏处理
- **本地存储**: 关键数据本地存储
- **权限控制**: 细粒度权限管理

## 性能优化

### 前端优化
- **懒加载**: 图片和组件懒加载
- **缓存策略**: 本地数据缓存
- **内存管理**: 及时释放资源

### 后端优化
- **数据库索引**: 优化查询性能
- **缓存层**: Redis缓存热点数据
- **异步处理**: 使用Celery处理耗时任务

### 设备通信优化
- **连接池**: 复用设备连接
- **批量命令**: 减少通信次数
- **压缩传输**: 减少数据传输量

## 部署架构

### 开发环境
- **iOS模拟器**: 本地开发测试
- **Docker**: 后端服务容器化
- **本地数据库**: PostgreSQL + Redis

### 生产环境
- **iOS App Store**: 应用分发
- **云服务器**: AWS/GCP/Azure
- **CDN**: 静态资源加速
- **监控**: 应用性能监控

## 测试策略

### 单元测试
- **ViewModel测试**: 业务逻辑测试
- **Service测试**: 服务层测试
- **API测试**: 接口功能测试

### 集成测试
- **设备通信测试**: 蓝牙/WiFi通信测试
- **AI服务测试**: 剧本生成测试
- **端到端测试**: 完整流程测试

### 性能测试
- **压力测试**: 高并发测试
- **延迟测试**: 设备响应时间测试
- **内存测试**: 内存泄漏测试

## 监控和日志

### 应用监控
- **崩溃监控**: Crashlytics
- **性能监控**: Firebase Performance
- **用户行为**: Analytics

### 服务监控
- **服务器监控**: Prometheus + Grafana
- **日志管理**: ELK Stack
- **告警系统**: 异常情况自动告警

## 未来扩展

### 功能扩展
- **多设备支持**: 同时控制多个设备
- **社交功能**: 用户分享和推荐
- **AI助手**: 智能语音交互

### 技术扩展
- **AR/VR支持**: 增强现实体验
- **IoT集成**: 智能家居联动
- **区块链**: 数据安全和隐私保护

## 总结

本技术架构文档提供了智能飞机杯控制APP的完整技术实现方案，涵盖了前端、后端、设备通信、AI集成等各个技术层面。通过模块化设计和标准化接口，确保了系统的可扩展性和可维护性。

关键设计原则：
1. **模块化**: 各功能模块独立，便于开发和维护
2. **可扩展**: 支持新功能和新设备的快速集成
3. **安全性**: 多层次的安全保护机制
4. **性能**: 优化的架构设计确保良好的用户体验
5. **可维护**: 清晰的代码结构和完善的文档 