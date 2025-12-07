/**
 * WebSocket 服务器
 * 独立运行，管理客户端连接并转发节奏数据
 * 
 * 运行方式：
 * 1. 开发环境：node server/websocketServer.ts
 * 2. 生产环境：使用 PM2 或其他进程管理器
 * 
 * 端口：默认 3001（可通过环境变量 WS_PORT 配置）
 */

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3001;
const HOST = process.env.WS_HOST || 'localhost';

// 创建 HTTP 服务器（用于 WebSocket 升级）
const server = createServer();

// 创建 WebSocket 服务器
const wss = new WebSocketServer({
  server,
  path: '/ws/rhythm'
});

// 客户端连接池
const clients = new Set<WebSocket>();

// 连接统计
let connectionCount = 0;

// 处理新连接
wss.on('connection', (ws: WebSocket, req) => {
  const clientId = ++connectionCount;
  clients.add(ws);
  
  console.log(`[WS] Client ${clientId} connected. Total clients: ${clients.size}`);

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'connected',
    clientId,
    timestamp: Date.now()
  }));

  // 处理消息
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      // 处理不同类型的消息
      switch (message.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        case 'subscribe':
          // 客户端订阅节奏数据
          console.log(`[WS] Client ${clientId} subscribed to rhythm data`);
          break;
        default:
          console.log(`[WS] Unknown message type from client ${clientId}:`, message.type);
      }
    } catch (error) {
      console.error(`[WS] Failed to parse message from client ${clientId}:`, error);
    }
  });

  // 处理错误
  ws.on('error', (error) => {
    console.error(`[WS] Error on client ${clientId}:`, error);
  });

  // 处理断开连接
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`[WS] Client ${clientId} disconnected. Total clients: ${clients.size}`);
  });
});

/**
 * 广播节奏数据到所有连接的客户端
 * 此函数应该由 API 路由或其他服务调用
 */
export function broadcastRhythmData(frame: {
  t: number;
  stroke: number;
  rotation: number;
  intensity: number;
  mode: string;
}) {
  const message = JSON.stringify(frame);
  let sentCount = 0;

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
        sentCount++;
      } catch (error) {
        console.error('[WS] Failed to send to client:', error);
        clients.delete(client);
      }
    }
  });

  return sentCount;
}

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log(`[WS] WebSocket server listening on ws://${HOST}:${PORT}/ws/rhythm`);
  console.log(`[WS] Ready to accept connections`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('[WS] SIGTERM received, closing server...');
  wss.close(() => {
    console.log('[WS] WebSocket server closed');
    server.close(() => {
      console.log('[WS] HTTP server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('[WS] SIGINT received, closing server...');
  wss.close(() => {
    console.log('[WS] WebSocket server closed');
    server.close(() => {
      console.log('[WS] HTTP server closed');
      process.exit(0);
    });
  });
});

// 导出服务器实例（用于测试或其他用途）
export { wss, server };

