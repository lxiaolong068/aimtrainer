# AIM Trainer

## 概述
AIM Trainer 是一个基于 React 和 TypeScript 开发的网络应用，旨在帮助用户提高瞄准技能，适用于游戏训练和反应速度练习。项目通过多种游戏模式呈现不同的挑战，并提供直观的反馈以提升玩家的体验。

## 主要功能
- **多种游戏模式**：包括 challenge、precision、reflex 以及 moving 模式，各自具备不同的目标生成和行为策略。
- **目标生成机制**：使用 Canvas 渲染目标，目标生成速度随着游戏时间平滑提高，采用对数函数实现增速平稳。
- **生命扣除与冷却机制**：未击中的目标过期后会扣除生命，但引入了 1 秒冷却期，防止连续多帧扣分过快。
- **音效优化**：击中目标时播放音效，通过复用全局 Audio 对象实现高效音频播放，避免重复创建音效实例。

## 项目结构
- `src/pages/Home.tsx`：主页，展示应用介绍及入口。
- `src/pages/Game.tsx`：核心游戏逻辑，包含目标生成、移动、碰撞检测和状态更新的实现。
- `src/App.tsx`：根组件，用于整合路由和全局状态管理。
- `README.md`：当前文件，详细说明项目功能、结构及开发指南。

## 游戏机制
- **目标生成**：目标在 Canvas 上随机出现，大小和生成速度根据游戏模式和难度动态调整。目标生成速度采用对数平滑增长，使游戏难度逐步提高。
- **生命管理**：玩家初始拥有固定生命值，未击中的目标在过期时触发生命扣除，但系统设置冷却间隔以平衡扣分频率。
- **响应与反馈**：点击目标标记为击中后会触发音效和视觉效果；未命中时生命减少，同时目标可能会触发动态移动效果（在 moving 模式下）。

## 快速开始
1. 克隆项目仓库。
2. 安装依赖项（例如使用 npm 或 yarn）。
3. 启动开发服务器并在浏览器中访问应用。

## 开发与架构
- **技术栈**：使用 React、TypeScript 和 HTML5 Canvas 构建，遵循组件化、模块化设计原则，并采用 SOLID 设计模式。
- **状态管理**：利用 React 的 Hooks（如 useState、useEffect、useRef）实现游戏状态及动画的管理。
- **优化措施**：引入生命扣除冷却机制以及音效对象复用，提升性能和用户体验。

## 未来改进
- 增加更多游戏模式和难度级别。
- 引入排行榜和成绩记录功能。
- 增强视觉和音效效果。

## 版权信息
本项目遵循 MIT 许可协议，开源且免费。

## 技术栈

*   React
*   TypeScript
*   Vite
*   Tailwind CSS
*   React Router
*   lucide-react (用于图标)

## 依赖

### Dependencies

*   `lucide-react`: "^0.344.0"
*   `react`: "^18.3.1"
*   `react-dom`: "^18.3.1"
*   `react-router-dom`: "^6.22.3"

### DevDependencies

*   `@eslint/js`: "^9.9.1"
*   `@types/react`: "^18.3.5"
*   `@types/react-dom`: "^18.3.0"
*   `@vitejs/plugin-react`: "^4.3.1"
*   `autoprefixer`: "^10.4.18"
*   `eslint`: "^9.9.1"
*   `eslint-plugin-react-hooks`: "^5.1.0-rc.0"
*   `eslint-plugin-react-refresh`: "^0.4.11"
*   `globals`: "^15.9.0"
*   `postcss`: "^8.4.35"
*   `tailwindcss`: "^3.4.1"
*   `typescript`: "^5.5.3"
*   `typescript-eslint`: "^8.3.0"
*   `vite`: "^5.4.2"

## 使用方法

1.  克隆项目到本地。
2.  使用`pnpm install`安装依赖。
3.  使用`pnpm run dev`启动开发服务器。
4.  在浏览器中访问`http://localhost:5173` (端口可能会有所不同)。

## 页面介绍

### 主页（Home）

主页展示项目介绍和游戏入口。

### 游戏（Game）

游戏页面提供一个打靶游戏。

### 联系我们（Contact）

联系页面提供联系方式。

### 隐私政策（Privacy）

隐私页面展示隐私政策。
