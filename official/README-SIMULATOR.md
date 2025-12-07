# Virtual Device Rhythm Simulator

虚拟设备节奏模拟器功能说明文档。

## 功能概述

当用户点击 AI Companion 或 Real Character Avatar 卡片时，会打开独立的模拟器页面，展示：
1. 伴侣选择器
2. 场景选择器（Wake, Relax, Train, Lead, Care）
3. "Start Simulation" 按钮
4. 3D 节奏模拟器，可视化圆柱形设备的运动

## 技术架构

```
算法服务 (protobuf stream)
    ↓
Node.js API 路由 (/api/rhythm/stream)
    ↓
解码 protobuf → 标准化 JSON
    ↓
WebSocket 服务器
    ↓
前端 WebSocket 客户端
    ↓
R3F 3D 动画
```

## 安装依赖

```bash
npm install
```

已安装的依赖：
- `@react-three/fiber` - React Three.js 渲染器
- `@react-three/drei` - R3F 工具库
- `three` - Three.js 3D 库
- `protobufjs` - Protobuf 编解码
- `ws` - WebSocket 服务器（开发依赖）

## 运行方式

### 1. 开发模式（Mock 数据）

直接运行 Next.js 开发服务器，使用内置的 mock 数据生成器：

```bash
npm run dev
```

访问：`http://localhost:3000/simulator`

### 2. 启用 WebSocket 模式

#### 启动 WebSocket 服务器

在单独的终端中运行：

```bash
node server/websocketServer.ts
```

或者使用 ts-node：

```bash
npx ts-node server/websocketServer.ts
```

WebSocket 服务器默认运行在：`ws://localhost:3001/ws/rhythm`

#### 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws/rhythm
```

#### 在模拟器中启用 WebSocket

修改 `src/components/simulator/SimulatorPage.tsx`：

```typescript
useSimulator({
  companion: initialCompanion,
  useWebSocket: true, // 改为 true
  wsUrl: process.env.NEXT_PUBLIC_WS_URL
});
```

### 3. 集成真实算法服务

#### 配置 Protobuf 解码 API

算法服务应该向以下端点发送 POST 请求：

```
POST /api/rhythm/stream
Content-Type: application/x-protobuf
```

请求体应该是 protobuf 编码的 `DeviceFrame` 消息。

#### Protobuf Schema

参考 `src/lib/protobuf/device.proto`：

```protobuf
syntax = "proto3";
message DeviceFrame {
  double t = 1;           // 时间戳
  double stroke = 2;      // 0-1 归一化冲程值
  double rotation = 3;    // -1 to 1 归一化旋转值
  double intensity = 4;   // 0-1 归一化强度值
  string mode = 5;       // 模式字符串
}
```

## 使用说明

### 从产品页面跳转

1. 访问产品页面：`http://localhost:3000/product`
2. 滚动到 "AI Companions" 部分
3. 点击任意 AI Companion 或 Real Character Avatar 卡片
4. 自动跳转到模拟器页面，并预选对应的伴侣

### 模拟器操作

1. **选择伴侣**：从下拉菜单中选择 AI Companion
2. **选择场景**：选择节奏场景（Wake, Relax, Train, Lead, Care）
3. **开始模拟**：点击 "Start Simulation" 按钮
4. **查看动画**：观察 3D 设备的实时运动
5. **停止模拟**：点击 "Stop Simulation" 按钮

## 数据格式

### WebSocket 消息格式

```json
{
  "t": 1234567890,
  "stroke": 0.75,
  "rotation": 0.5,
  "intensity": 0.8,
  "mode": "demo"
}
```

### 数值范围

- `stroke`: 0-1（垂直冲程，0 = 最低，1 = 最高）
- `rotation`: -1 to 1（旋转，-1 = 逆时针最大，1 = 顺时针最大）
- `intensity`: 0-1（强度/光晕，0 = 无，1 = 最大）
- `mode`: 字符串（模式标识）

## 3D 模型说明

模拟器包含以下 3D 组件：

1. **OuterShell（外壳）**：静态圆柱体，设备外框
2. **InnerCore（内芯）**：根据 `stroke` 值垂直缩放
3. **RotationRing（旋转环）**：根据 `rotation` 值旋转
4. **GlowWave（光晕）**：根据 `intensity` 值调整发光强度

## 故障排除

### WebSocket 连接失败

- 检查 WebSocket 服务器是否运行
- 确认 `NEXT_PUBLIC_WS_URL` 环境变量正确
- 查看浏览器控制台的错误信息
- 模拟器会自动降级到 mock 模式

### Protobuf 解码错误

- 确认算法服务发送的数据格式正确
- 检查 `device.proto` schema 是否匹配
- 查看服务器日志中的错误信息

### 3D 动画不显示

- 检查浏览器是否支持 WebGL
- 查看浏览器控制台是否有 Three.js 错误
- 确认 R3F 组件正确加载

## 开发说明

### 文件结构

```
src/
├── app/
│   ├── simulator/
│   │   └── page.tsx              # 模拟器路由
│   └── api/
│       └── rhythm/
│           └── stream/
│               └── route.ts     # Protobuf 解码 API
├── components/
│   ├── product/
│   │   ├── AICompanions.tsx     # 修改：添加点击跳转
│   │   └── RhythmDeviceScene.tsx # R3F 3D 场景
│   └── simulator/
│       ├── SimulatorPage.tsx    # 主页面组件
│       ├── CompanionSelector.tsx
│       ├── ScenarioSelector.tsx
│       └── RhythmCanvas.tsx
├── hooks/
│   ├── useWebSocket.ts          # WebSocket 客户端
│   └── useSimulator.ts         # 模拟器状态管理
└── lib/
    ├── protobuf/
    │   ├── device.proto         # Protobuf schema
    │   └── decoder.ts          # 解码工具
    └── rhythm/
        ├── mockGenerator.ts     # Mock 数据生成
        └── normalizeFrame.ts   # 数据标准化
server/
└── websocketServer.ts          # WebSocket 服务器
```

### 自定义 Mock 数据

修改 `src/lib/rhythm/mockGenerator.ts` 中的 `mockRhythm` 函数来调整模拟节奏模式。

### 自定义 3D 模型

修改 `src/components/product/RhythmDeviceScene.tsx` 来调整设备的外观和动画。

## 生产部署

1. 确保 WebSocket 服务器在生产环境中运行
2. 配置正确的 `NEXT_PUBLIC_WS_URL` 环境变量
3. 使用 HTTPS/WSS 确保安全连接
4. 考虑使用 Redis Pub/Sub 来管理多服务器场景下的 WebSocket 连接

## 许可证

与主项目相同。

