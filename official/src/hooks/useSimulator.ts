/**
 * 模拟器状态管理 Hook
 * 整合 WebSocket 和 mock 数据源
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { mockRhythm, RhythmFrame } from '@/lib/rhythm/mockGenerator';

export type Companion = 'Serena' | 'Victoria' | 'Maya' | 'Tsubasa Mai';
export type Scenario = 'Wake' | 'Relax' | 'Train' | 'Lead' | 'Care';

interface UseSimulatorOptions {
  companion?: Companion;
  scenario?: Scenario;
  useWebSocket?: boolean;
  wsUrl?: string;
}

export function useSimulator(options: UseSimulatorOptions = {}) {
  const { companion, scenario, useWebSocket: enableWS = false, wsUrl } = options;

  const [selectedCompanion, setSelectedCompanion] = useState<Companion>(
    companion || 'Serena'
  );
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(
    scenario || 'Relax'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<RhythmFrame | null>(null);
  const [strokeHistory, setStrokeHistory] = useState<Array<{ timestamp: number; value: number }>>([]);
  const [rotationHistory, setRotationHistory] = useState<Array<{ timestamp: number; value: number }>>([]);

  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // WebSocket 连接
  const {
    isConnected: isWSConnected,
    lastFrame: wsFrame,
    connect: connectWS,
    disconnect: disconnectWS
  } = useWebSocket({
    url: enableWS && wsUrl ? wsUrl : undefined,
    enabled: enableWS && isRunning,
    onMessage: (frame) => {
      setCurrentFrame(frame);
      // 记录历史数据 - 限制数组长度，避免内存泄漏
      const now = Date.now();
      setStrokeHistory(prev => {
        const newHistory = [...prev, { timestamp: now, value: frame.stroke }];
        // 限制最大长度为1000，超过则只保留最新的
        return newHistory.length > 1000 ? newHistory.slice(-1000) : newHistory;
      });
      setRotationHistory(prev => {
        const newHistory = [...prev, { timestamp: now, value: frame.rotation }];
        return newHistory.length > 1000 ? newHistory.slice(-1000) : newHistory;
      });
    },
    onError: (error) => {
      console.error('WebSocket error in simulator:', error);
    }
  });

  // Mock 数据生成循环
  const generateMockFrame = useCallback(() => {
    if (!isRunning) {
      return;
    }

    const now = Date.now();
    if (startTimeRef.current === null) {
      startTimeRef.current = now;
    }

    const elapsed = now - startTimeRef.current;
    const frame = mockRhythm(elapsed);
    setCurrentFrame(frame);
    
    // 记录历史数据 - 限制数组长度，避免内存泄漏
    setStrokeHistory(prev => {
      const newHistory = [...prev, { timestamp: now, value: frame.stroke }];
      // 限制最大长度为1000，超过则只保留最新的
      return newHistory.length > 1000 ? newHistory.slice(-1000) : newHistory;
    });
    setRotationHistory(prev => {
      const newHistory = [...prev, { timestamp: now, value: frame.rotation }];
      return newHistory.length > 1000 ? newHistory.slice(-1000) : newHistory;
    });

    animationFrameRef.current = requestAnimationFrame(generateMockFrame);
  }, [isRunning]);

  // 启动模拟
  const start = useCallback(() => {
    setIsRunning(true);
    startTimeRef.current = null;
    
    // 重置历史数据
    setStrokeHistory([]);
    setRotationHistory([]);

    if (enableWS && wsUrl) {
      connectWS();
    } else {
      // 使用 mock 数据
      generateMockFrame();
    }
  }, [enableWS, wsUrl, connectWS, generateMockFrame]);

  // 停止模拟
  const stop = useCallback(() => {
    setIsRunning(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    startTimeRef.current = null;
    disconnectWS();
    setCurrentFrame(null);
    
    // 清理历史数据，释放内存
    setStrokeHistory([]);
    setRotationHistory([]);
  }, [disconnectWS]);

  // 当 WebSocket 连接且有数据时，停止 mock 循环
  useEffect(() => {
    if (isWSConnected && wsFrame && isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else if (!isWSConnected && isRunning && !enableWS) {
      // WebSocket 未连接且未启用，使用 mock
      if (!animationFrameRef.current) {
        generateMockFrame();
      }
    }
  }, [isWSConnected, wsFrame, isRunning, enableWS, generateMockFrame]);

  // 清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      disconnectWS();
    };
  }, [disconnectWS]);

  // 清理旧数据（只保留最近10秒的数据）
  // 使用更激进的清理策略：限制数组最大长度，并定期清理
  useEffect(() => {
    if (!isRunning) return;

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const cutoff = now - 12000; // 12秒前（稍微多保留一点，避免边界问题）

      setStrokeHistory(prev => {
        // 限制最大长度，避免数组无限增长
        const filtered = prev.filter(point => point.timestamp >= cutoff);
        // 如果过滤后仍然很长，只保留最新的
        return filtered.length > 500 ? filtered.slice(-500) : filtered;
      });
      
      setRotationHistory(prev => {
        const filtered = prev.filter(point => point.timestamp >= cutoff);
        return filtered.length > 500 ? filtered.slice(-500) : filtered;
      });
    }, 500); // 每500ms清理一次，更频繁

    return () => clearInterval(cleanupInterval);
  }, [isRunning]);

  return {
    selectedCompanion,
    setSelectedCompanion,
    selectedScenario,
    setSelectedScenario,
    isRunning,
    currentFrame,
    isWSConnected,
    strokeHistory,
    rotationHistory,
    start,
    stop
  };
}

