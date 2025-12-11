'use client';

/**
 * 主模拟器页面组件
 */

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useSimulator, Companion, Scenario } from '@/hooks/useSimulator';
import CompanionSelector from './CompanionSelector';
import ScenarioSelector from './ScenarioSelector';
import RhythmCanvas from './RhythmCanvas';
import StrokeTimelineChart from './StrokeTimelineChart';
import RotationTimelineChart from './RotationTimelineChart';

// Companion 数据映射
const companionData: Record<Companion, { image: string; role?: string }> = {
  'Serena': {
    image: '/assets/images/companion-serena.png',
    role: 'Nurse'
  },
  'Victoria': {
    image: '/assets/images/companion-victoria.jpg',
    role: 'Therapist'
  },
  'Maya': {
    image: '/assets/images/companion-maya.jpg',
    role: 'Fitness Coach'
  },
  'Tsubasa Mai': {
    image: '/assets/images/character-tsubasa-mai.png',
  }
};

export default function SimulatorPage() {
  const searchParams = useSearchParams();
  const initialCompanion = (searchParams.get('companion') as Companion) || undefined;

  const {
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
  } = useSimulator({
    companion: initialCompanion,
    useWebSocket: false, // 默认使用 mock 模式，可以通过环境变量或配置启用
    wsUrl: process.env.NEXT_PUBLIC_WS_URL
  });

  // 从 URL 参数初始化伴侣选择
  useEffect(() => {
    if (initialCompanion) {
      setSelectedCompanion(initialCompanion);
    }
  }, [initialCompanion, setSelectedCompanion]);

  // 获取当前选中companion的图片
  const currentCompanionImage = useMemo(() => {
    return companionData[selectedCompanion]?.image || companionData['Serena'].image;
  }, [selectedCompanion]);

  return (
    <div className="min-h-screen bg-[#0c0e12] py-8 md:py-16">
      <div className="max-w-[1920px] mx-auto px-4 md:px-[120px]">
        {/* 标题 */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-[52px] leading-normal text-white font-normal mb-4 tracking-[-1.04px]">
            Virtual Device Rhythm Simulator
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-[28px]">
            Experience the rhythm engine in real-time. Select a companion and scenario to begin.
          </p>
        </div>

        {/* 主内容区域 - 控制面板和3D可视化并排显示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          {/* 控制面板 - 左侧 */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-6">
              <CompanionSelector
                value={selectedCompanion}
                onChange={setSelectedCompanion}
              />
              <ScenarioSelector
                value={selectedScenario}
                onChange={setSelectedScenario}
              />
            </div>

            {/* 状态信息 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isRunning ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                />
                <span className="text-sm text-white/70">
                  {isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              {isWSConnected ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-white/70">WebSocket Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-white/70">Mock Mode</span>
                </div>
              )}
            </div>

            {/* 角色图片显示 */}
            <div className="mb-6">
              <div className="relative w-full aspect-[2/3] max-h-[300px] rounded-lg overflow-hidden bg-white/5 border border-white/10">
                <Image
                  src={currentCompanionImage}
                  alt={selectedCompanion}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* 开始/停止按钮 */}
            <button
              onClick={isRunning ? stop : start}
              disabled={false}
              className={`w-full px-8 py-3 rounded-lg font-semibold text-base transition-colors ${
                isRunning
                  ? 'bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30'
                  : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              {isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </button>
          </div>

          {/* 3D 可视化 - 右侧 */}
          <div className="bg-white/5 rounded-lg border border-white/10 p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl text-white font-medium">
                3D Device Visualization 
              </h2>
              <button
                onClick={isRunning ? stop : start}
                disabled={false}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all whitespace-nowrap shadow-lg ${
                  isRunning
                    ? 'bg-red-500/40 border-2 border-red-400 text-white hover:bg-red-500/50'
                    : 'bg-blue-500/30 border-2 border-blue-400/60 text-white hover:bg-blue-500/40'
                }`}
              >
                auto run
              </button>
            </div>
            
            {/* 3D场景和图表并排显示 */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* 左侧：3D场景 */}
              <div className="w-full h-[500px] md:h-[600px] lg:h-full lg:min-h-[500px]">
                <RhythmCanvas frame={currentFrame} />
              </div>
              
              {/* 右侧：时间轴图表 */}
              <div className="flex flex-col gap-4">
                {/* Stroke 时间轴图表 */}
                <div className="h-[200px] md:h-[250px] lg:h-[280px] flex flex-col">
                  <h3 className="text-sm text-white/70 mb-2 flex-shrink-0">Stroke Timeline</h3>
                  <div className="flex-1 min-h-0">
                    <StrokeTimelineChart data={strokeHistory} />
                  </div>
                </div>
                
                {/* Rotation 时间轴图表 */}
                <div className="h-[200px] md:h-[250px] lg:h-[280px] flex flex-col">
                  <h3 className="text-sm text-white/70 mb-2 flex-shrink-0">Rotation Timeline</h3>
                  <div className="flex-1 min-h-0">
                    <RotationTimelineChart data={rotationHistory} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 实时参数显示 - 在画布下方，与左侧控制面板对齐，始终显示 */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/50">Stroke:</span>
                  <span className="text-white ml-2">
                    {currentFrame ? currentFrame.stroke.toFixed(3) : '0.000'}
                  </span>
                </div>
                <div>
                  <span className="text-white/50">Rotation:</span>
                  <span className="text-white ml-2">
                    {currentFrame ? currentFrame.rotation.toFixed(3) : '0.000'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

