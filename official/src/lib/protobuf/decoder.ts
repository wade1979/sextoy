/**
 * Protobuf 解码工具
 * 用于将 protobuf 二进制数据解码为 JSON 格式
 */

import protobuf from 'protobufjs';
import { RhythmFrame } from '../rhythm/mockGenerator';
import { readFileSync } from 'fs';
import { join } from 'path';

let DeviceFrameType: protobuf.Type | null = null;

/**
 * 初始化 protobuf schema
 * 加载 device.proto 文件并编译
 */
export async function initProtobuf(): Promise<void> {
  if (DeviceFrameType) {
    return; // 已经初始化
  }

  try {
    // 尝试从文件系统加载
    let protoContent: string;
    try {
      const protoPath = join(process.cwd(), 'src/lib/protobuf/device.proto');
      protoContent = readFileSync(protoPath, 'utf-8');
    } catch (fileError) {
      // 如果文件加载失败，使用内联 schema
      protoContent = `
        syntax = "proto3";
        message DeviceFrame {
          double t = 1;
          double stroke = 2;
          double rotation = 3;
          double intensity = 4;
          string mode = 5;
        }
      `;
    }

    const root = protobuf.parse(protoContent).root;
    DeviceFrameType = root.lookupType('DeviceFrame');
  } catch (error) {
    console.error('Failed to load protobuf schema:', error);
    throw error;
  }
}

/**
 * 解码 protobuf 二进制数据
 * @param buffer protobuf 二进制数据
 * @returns 解码后的节奏帧数据
 */
export function decodeDeviceFrame(buffer: Buffer): RhythmFrame {
  if (!DeviceFrameType) {
    throw new Error('Protobuf schema not initialized. Call initProtobuf() first.');
  }

  try {
    const message = DeviceFrameType.decode(buffer);
    const decoded = DeviceFrameType.toObject(message, {
      longs: String,
      enums: String,
      bytes: String,
      defaults: true,
      arrays: true,
      objects: true,
      oneofs: true
    });

    return {
      t: decoded.t || Date.now(),
      stroke: decoded.stroke || 0,
      rotation: decoded.rotation || 0,
      intensity: decoded.intensity || 0,
      mode: decoded.mode || 'unknown'
    };
  } catch (error) {
    console.error('Failed to decode protobuf message:', error);
    throw error;
  }
}

