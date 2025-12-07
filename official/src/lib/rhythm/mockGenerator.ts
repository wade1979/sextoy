/**
 * Mock 节奏生成器
 * 当 WebSocket 未连接时，使用此函数生成模拟的节奏数据
 */

export interface RhythmFrame {
  t: number;        // 时间戳
  stroke: number;   // 0-1
  rotation: number; // -1 to 1
  intensity: number; // 0-1
  mode: string;
}

/**
 * 生成模拟节奏数据
 * @param t 时间戳（毫秒）
 * @returns 节奏帧数据
 */
export function mockRhythm(t: number): RhythmFrame {
  // 使用正弦波生成平滑的节奏变化
  // 不同的频率和相位创建不同的运动模式
  
  // stroke: 0-1 的垂直运动 - 使用更快的频率和更大的变化范围
  const stroke = (Math.sin(t / 300) + 1) / 2;
  
  // rotation: -1 to 1 的旋转运动 - 增加幅度使旋转更明显
  const rotation = Math.sin(t / 500) * 0.8; // 从 0.5 增加到 0.8，使旋转更明显
  
  // intensity: 0-1 的强度/光晕 - 使用更快的频率
  const intensity = (Math.sin(t / 250) + 1) / 2;
  
  return {
    t,
    stroke,
    rotation,
    intensity,
    mode: "demo"
  };
}

