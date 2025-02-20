# Aim Trainer

中文 | [English](./README.en.md)

一个基于Web的FPS游戏瞄准训练工具，帮助玩家提升在各类FPS游戏中的瞄准能力。

## 功能特点

- **多种训练模式**：包含挑战模式、目标追踪、移动目标、精确训练和双击训练等多种专业训练模式
- **实时反馈**：提供实时的命中率、反应时间等数据统计
- **自定义设置**：可调整准星样式、难度等级等个性化设置
- **响应式设计**：完美支持各种设备尺寸

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite

## Vercel部署指南

### 1. 准备工作

- 确保你有一个[GitHub](https://github.com)账号
- 确保你有一个[Vercel](https://vercel.com)账号
- Fork本项目到你的GitHub仓库

### 2. 部署步骤

1. 登录Vercel平台
2. 点击 "New Project" 按钮
3. 从你的GitHub仓库列表中选择已fork的项目
4. 配置项目：
   - Framework Preset: 选择 "Vite"
   - Build Command: 修改为 `pnpm build`
   - Output Directory: 保持默认 `dist`
5. 点击 "Deploy" 按钮

部署完成后，Vercel会自动生成一个域名供访问。你也可以在项目设置中添加自定义域名。

### 3. 自动部署

Vercel会自动监听你的GitHub仓库变更：
- 当main/master分支有新的提交时，会自动触发重新部署
- 每个Pull Request都会生成一个预览环境

## 本地开发

```bash
# 克隆项目
git clone [你的仓库地址]

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 许可证

MIT License

