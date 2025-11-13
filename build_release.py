#!/usr/bin/env python3
"""
发布脚本 - 构建项目发布包
将web-prototype目录下的必要文件打包，生成发布版本
"""

import os
import shutil
import zipfile
import datetime
from pathlib import Path

# 配置
PROJECT_NAME = "smart-control-prototype"
VERSION = "1.0.0"
SOURCE_DIR = "web-prototype"
RELEASE_DIR = "release"
BUILD_DIR = f"{RELEASE_DIR}/{PROJECT_NAME}-v{VERSION}"

# 需要包含的文件和目录
INCLUDE_FILES = [
    "index.html",
    "demo.html",
    "USER_FLOW.html",
    "styles.css",
    "app.js",
    "characters.js",
    "voice.js",
    "waveform.js",
    "mqtt.js",
    "manifest.json",
    "sw.js",
    "README.md",
]

INCLUDE_DIRS = [
    "resource",
]

# 需要从项目根目录额外复制的文件和目录
ROOT_INCLUDE_FILES = [
    "technical-architecture.md",
    "AI_PROTOTYPE_SUMMARY.md",
    "README_SERVER.md",
    "server.py",
]

ROOT_INCLUDE_DIRS = [
    "requirements",
]

# 需要排除的文件模式
EXCLUDE_PATTERNS = [
    ".DS_Store",
    "__pycache__",
    "*.pyc",
    ".git",
    "node_modules",
]

def clean_dir(directory):
    """清理目录"""
    if os.path.exists(directory):
        shutil.rmtree(directory)
    os.makedirs(directory, exist_ok=True)

def should_exclude(path):
    """检查文件是否应该被排除"""
    for pattern in EXCLUDE_PATTERNS:
        if pattern in path:
            return True
    return False

def copy_file(src, dst):
    """复制文件，保持目录结构"""
    dst_dir = os.path.dirname(dst)
    os.makedirs(dst_dir, exist_ok=True)
    shutil.copy2(src, dst)
    print(f"  ✓ {src} -> {dst}")

def copy_directory(src, dst):
    """复制整个目录"""
    if not os.path.exists(src):
        print(f"  ⚠ 目录不存在: {src}")
        return
    
    shutil.copytree(src, dst, dirs_exist_ok=True)
    print(f"  ✓ 复制目录: {src} -> {dst}")

def create_release():
    """创建发布包"""
    print("=" * 60)
    print(f"构建发布包: {PROJECT_NAME} v{VERSION}")
    print(f"构建时间: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # 检查源目录
    if not os.path.exists(SOURCE_DIR):
        print(f"❌ 错误: 源目录不存在: {SOURCE_DIR}")
        return False
    
    # 清理并创建构建目录
    print(f"\n1. 清理构建目录: {BUILD_DIR}")
    clean_dir(BUILD_DIR)
    
    # 复制文件
    print(f"\n2. 复制文件到: {BUILD_DIR}")
    copied_count = 0
    
    for filename in INCLUDE_FILES:
        src = os.path.join(SOURCE_DIR, filename)
        if os.path.exists(src):
            dst = os.path.join(BUILD_DIR, filename)
            copy_file(src, dst)
            copied_count += 1
        else:
            print(f"  ⚠ 文件不存在: {src}")
    
    # 复制目录
    for dirname in INCLUDE_DIRS:
        src = os.path.join(SOURCE_DIR, dirname)
        dst = os.path.join(BUILD_DIR, dirname)
        copy_directory(src, dst)
    
    # 复制根目录的文档与文件
    print(f"\n3. 复制项目文档与脚本")
    for doc in ROOT_INCLUDE_FILES:
        if os.path.exists(doc):
            dst = os.path.join(BUILD_DIR, doc)
            copy_file(doc, dst)
        else:
            print(f"  ⚠ 文件不存在: {doc}")

    for directory in ROOT_INCLUDE_DIRS:
        dst = os.path.join(BUILD_DIR, directory)
        copy_directory(directory, dst)
    
    # 创建发布说明
    print(f"\n4. 创建发布说明")
    release_notes = f"""# {PROJECT_NAME} v{VERSION}

## 发布日期
{datetime.datetime.now().strftime('%Y年%m月%d日 %H:%M')}

## 版本信息
- 版本号: {VERSION}
- 构建时间: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## 包含内容

### 核心文件
- index.html - 主应用页面
- demo.html - 演示页面
- USER_FLOW.html - 用户流程说明文档
- styles.css - 样式文件
- app.js - 主应用逻辑
- characters.js - 角色和场景配置
- voice.js - 语音交互模块
- waveform.js - 波形动画模块
- mqtt.js - MQTT客户端

### PWA支持
- manifest.json - Web App清单
- sw.js - Service Worker

### 资源文件
- resource/ - 角色背景图片

### 文档
- README.md - 项目说明
- technical-architecture.md - 技术架构文档
- AI_PROTOTYPE_SUMMARY.md - AI原型摘要

## 使用说明

1. 解压文件到Web服务器目录
2. 确保服务器支持HTTPS（PWA要求）
3. 在浏览器中访问 index.html
4. 参考 USER_FLOW.html 了解使用流程

## 技术栈

- HTML5 + CSS3 + JavaScript ES6+
- MQTT.js (物联网通信)
- PWA (Progressive Web App)

## 浏览器要求

- Chrome 80+
- Safari 13+
- Firefox 75+
- Edge 80+

## 联系信息

如有问题请联系开发团队。
"""
    
    release_notes_path = os.path.join(BUILD_DIR, "RELEASE_NOTES.md")
    with open(release_notes_path, "w", encoding="utf-8") as f:
        f.write(release_notes)
    print(f"  ✓ 创建发布说明: RELEASE_NOTES.md")
    
    print(f"\n✅ 构建完成! 已复制 {copied_count} 个文件")
    print(f"📦 构建目录: {BUILD_DIR}")
    
    return True

def create_zip():
    """创建ZIP压缩包"""
    print(f"\n5. 创建ZIP压缩包")
    zip_filename = f"{RELEASE_DIR}/{PROJECT_NAME}-v{VERSION}.zip"
    
    if os.path.exists(zip_filename):
        os.remove(zip_filename)
    
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(BUILD_DIR):
            # 排除系统文件
            dirs[:] = [d for d in dirs if not should_exclude(d)]
            
            for file in files:
                if should_exclude(file):
                    continue
                
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, BUILD_DIR)
                zipf.write(file_path, arcname)
                print(f"  ✓ 添加: {arcname}")
    
    file_size = os.path.getsize(zip_filename) / (1024 * 1024)  # MB
    print(f"\n✅ ZIP包创建完成: {zip_filename} ({file_size:.2f} MB)")
    
    return zip_filename

def main():
    """主函数"""
    try:
        # 创建发布包
        if not create_release():
            return
        
        # 创建ZIP压缩包
        zip_file = create_zip()
        
        print("\n" + "=" * 60)
        print("🎉 发布包构建完成!")
        print(f"📦 ZIP文件: {zip_file}")
        print(f"📁 解压目录: {BUILD_DIR}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ 错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
