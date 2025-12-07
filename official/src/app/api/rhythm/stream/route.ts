/**
 * Protobuf 解码 API 路由
 * 接收算法服务的 protobuf 二进制数据，解码后通过 WebSocket 广播
 */

import { NextRequest, NextResponse } from 'next/server';
import { decodeDeviceFrame, initProtobuf } from '@/lib/protobuf/decoder';

// WebSocket 客户端连接池
// 注意：在生产环境中，应该使用 Redis 或专门的 WebSocket 服务器来管理连接
const wsClients = new Set<WebSocket>();

// 初始化 protobuf（在服务器启动时）
let protobufInitialized = false;

async function ensureProtobufInitialized() {
  if (!protobufInitialized) {
    try {
      await initProtobuf();
      protobufInitialized = true;
    } catch (error) {
      console.error('Failed to initialize protobuf:', error);
    }
  }
}

/**
 * POST /api/rhythm/stream
 * 接收 protobuf 二进制数据并解码
 * 
 * 集成说明：
 * 1. 算法服务应该向此端点发送 POST 请求
 * 2. 请求体应该是 protobuf 编码的 DeviceFrame 消息
 * 3. Content-Type: application/x-protobuf
 * 4. 解码后的数据会通过 WebSocket 广播给所有连接的客户端
 */
export async function POST(request: NextRequest) {
  try {
    await ensureProtobufInitialized();

    // 获取请求体（protobuf 二进制数据）
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 解码 protobuf
    const frame = decodeDeviceFrame(buffer);

    // 将解码后的数据广播给所有 WebSocket 客户端
    // 注意：在实际实现中，应该通过 WebSocket 服务器来广播
    // 这里只是示例，实际应该调用 WebSocket 服务器的广播方法
    const jsonData = JSON.stringify(frame);
    
    // 广播给所有连接的客户端
    wsClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(jsonData);
        } catch (error) {
          console.error('Failed to send to WebSocket client:', error);
          wsClients.delete(client);
        }
      }
    });

    return NextResponse.json({
      success: true,
      frame,
      clientsCount: wsClients.size
    });
  } catch (error) {
    console.error('Failed to process protobuf stream:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/rhythm/stream
 * 获取 WebSocket 连接信息
 */
export async function GET() {
  return NextResponse.json({
    clientsCount: wsClients.size,
    protobufInitialized
  });
}

/**
 * 注意：
 * 
 * 1. WebSocket 服务器集成：
 *    - 在生产环境中，应该使用独立的 WebSocket 服务器（如 server/websocketServer.ts）
 *    - API 路由应该通过 HTTP 请求或消息队列与 WebSocket 服务器通信
 *    - WebSocket 服务器负责管理客户端连接和广播消息
 * 
 * 2. 算法服务集成：
 *    - 算法服务应该持续向此端点发送 protobuf 数据流
 *    - 可以使用 HTTP POST 或 WebSocket 连接
 *    - 建议使用 WebSocket 以支持双向通信
 * 
 * 3. Mock 模式：
 *    - 如果算法服务不可用，前端会自动降级到 mock 模式
 *    - Mock 模式使用本地生成的节奏数据
 * 
 * 4. 性能优化：
 *    - 对于高频率数据流，考虑使用消息队列（如 Redis Pub/Sub）
 *    - 实现数据缓冲和批处理
 *    - 考虑使用二进制 WebSocket 消息以减少带宽
 */

