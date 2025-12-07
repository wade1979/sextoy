'use client';

/**
 * R3F 3D 设备场景组件
 * 可视化圆柱形设备的节奏运动
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { RhythmFrame } from '@/lib/rhythm/mockGenerator';

interface RhythmDeviceSceneProps {
  frame: RhythmFrame | null;
}

export default function RhythmDeviceScene({ frame }: RhythmDeviceSceneProps) {
  const innerCoreRef = useRef<Mesh>(null); // 内芯 - 细圆柱体，静态
  const ringGroupRef = useRef<Group>(null); // 环组 - 包含环和箭头标记

  // 默认值
  const defaultStroke = 0.5;
  const defaultRotation = 0;
  const defaultIntensity = 0.3;

  useFrame(() => {
    const stroke = frame?.stroke ?? defaultStroke;
    const rotation = frame?.rotation ?? defaultRotation;

    // 更新环的位置（上下移动）和旋转（绕 Y 轴旋转）
    if (ringGroupRef.current) {
      // 伸缩：根据 stroke 值上下移动
      // stroke 0 时在底部，stroke 1 时在顶部
      const minY = -1.2; // 最低位置
      const maxY = 1.2;  // 最高位置
      ringGroupRef.current.position.y = minY + stroke * (maxY - minY);
      
      // 旋转：环在 XZ 平面（水平），绕 Y 轴旋转（垂直轴）
      // rotation: -1 to 1 映射到旋转角度: -360° to 360° (2π)
      ringGroupRef.current.rotation.y = rotation * Math.PI * 2;
    }
  });

  return (
    <group>
      {/* 内芯 - 细圆柱体，静态不移动 - 蓝色系 */}
      <mesh ref={innerCoreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 2.8, 32]} />
        <meshStandardMaterial
          color="#4a8ab8"
          metalness={0.5}
          roughness={0.3}
          emissive="#3a6a98"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 环组 - 包含环和箭头标记，可以上下移动和绕 Y 轴旋转 */}
      {/* 环水平放置在 XZ 平面，中心与内芯中心重合，只根据 stroke 上下移动 */}
      <group 
        ref={ringGroupRef} 
        position={[0, defaultStroke * 2.4 - 1.2, 0]} 
        rotation={[0, defaultRotation * Math.PI * 2, 0]}
      >
        {/* 环 - 水平圆环（XZ 平面），中心与内芯重合 - 橙色/金色系 */}
        {/* torus 默认在 XY 平面（垂直），需要绕 X 轴旋转 90 度到 XZ 平面（水平） */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.12, 16, 32]} />
          <meshStandardMaterial
            color="#d4a574"
            metalness={0.7}
            roughness={0.2}
            emissive="#b48554"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* 箭头标记 - 在环的平面上（XZ 平面），指向切线方向，显示旋转 */}
        <group position={[0.9, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          {/* 箭头头部 - 在 XZ 平面，指向切线方向（Z 方向） */}
          <mesh position={[0, 0, 0.2]} rotation={[0, 0, Math.PI / 2]}>
            <coneGeometry args={[0.12, 0.3, 8]} />
            <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={0.8} />
          </mesh>
          {/* 箭头杆 - 在 XZ 平面 */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.04, 0.04, 0.15]} />
            <meshStandardMaterial color="#ff6b9d" emissive="#ff6b9d" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

