import React, { useState, useRef, useEffect } from 'react';
import { Settings, Play, Maximize } from 'lucide-react';

class Target {
  x: number;
  y: number;
  radius: number;
  hit: boolean;
  createdAt: number;
  color: string;
  scale: number;
  rotation: number;
  speed: number;
  dx: number;
  dy: number;
  lastDirectionChange: number;
  directionChangeInterval: number;

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hit = false;
    this.createdAt = Date.now();
    this.color = this.generateColor();
    this.scale = 0;
    this.rotation = Math.random() * Math.PI * 2;
    // 降低基础速度，使目标更容易追踪
    this.speed = Math.random() * 1.5 + 0.8;
    this.dx = Math.cos(this.rotation) * this.speed;
    this.dy = Math.sin(this.rotation) * this.speed;
    this.lastDirectionChange = Date.now();
    // 增加方向变化间隔，使运动更平滑
    this.directionChangeInterval = Math.random() * 3000 + 2000;
  }

  move(ctx: CanvasRenderingContext2D) {
    if (!this.hit) {
      const now = Date.now();
      
      // 使用更平滑的方向变化
      if (now - this.lastDirectionChange > this.directionChangeInterval) {
        // 减小角度变化范围，使运动更可预测
        const angleChange = (Math.random() - 0.5) * Math.PI / 4;
        this.rotation += angleChange;
        // 平滑过渡到新方向
        const targetDx = Math.cos(this.rotation) * this.speed;
        const targetDy = Math.sin(this.rotation) * this.speed;
        this.dx = this.dx * 0.8 + targetDx * 0.2;
        this.dy = this.dy * 0.8 + targetDy * 0.2;
        this.lastDirectionChange = now;
        this.directionChangeInterval = Math.random() * 3000 + 2000;
      }

      // 更新位置
      this.x += this.dx;
      this.y += this.dy;

      // 边界碰撞检测和处理
      if (this.x - this.radius <= 0 || this.x + this.radius >= ctx.canvas.width) {
        this.dx = -this.dx;
        this.rotation = Math.atan2(this.dy, this.dx);
      }
      if (this.y - this.radius <= 0 || this.y + this.radius >= ctx.canvas.height) {
        this.dy = -this.dy;
        this.rotation = Math.atan2(this.dy, this.dx);
      }
    }
  }

  generateColor(): string {
    const colors = [
      ['#FF9A9E', '#FAD0C4'],  // Pink gradient
      ['#A18CD1', '#FBC2EB'],  // Purple gradient
      ['#FF9A9E', '#FECFEF'],  // Peach gradient
      ['#84FAB0', '#8FD3F4'],  // Green-blue gradient
      ['#FFD1FF', '#FAD0C4'],  // Light pink gradient
    ];
    return colors[Math.floor(Math.random() * colors.length)].join(',');
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    if (this.scale < 1) {
      this.scale = Math.min(1, this.scale + 0.1);
    }
    ctx.scale(this.scale, this.scale);
    
    ctx.rotate(this.rotation);
    this.rotation += 0.02;

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    const [color1, color2] = this.color.split(',');
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);

    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.hit ? 'rgba(255,255,255,0.5)' : gradient;
    ctx.fill();

    if (!this.hit) {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();

      const sparkleSize = this.radius * 0.2;
      const sparkleOffset = this.radius * 0.6;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      
      for (let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        ctx.beginPath();
        ctx.arc(
          Math.cos(angle) * sparkleOffset,
          Math.sin(angle) * sparkleOffset,
          sparkleSize,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    ctx.restore();
  }

  isHit(x: number, y: number): boolean {
    const distance = Math.hypot(x - this.x, y - this.y);
    return distance <= this.radius;
  }

  isExpired(): boolean {
    return Date.now() - this.createdAt > 2000;
  }
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const deciseconds = Math.floor((ms % 1000) / 100);
  return `00:${String(seconds).padStart(2, '0')}:${deciseconds}`;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22.903" height="20.232" viewBox="0 0 22.903 20.232">
    <path d="M20.84,4.61a5.5,5.5,0,0,0-7.78,0L12,5.67,10.94,4.61a5.5,5.5,0,0,0-7.78,7.78l1.06,1.06L12,21.23l7.78-7.78,1.06-1.06a5.5,5.5,0,0,0,0-7.78Z" 
      transform="translate(-0.549 -1.998)" 
      style={{
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        fill: filled ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'
      }}
    />
  </svg>
);

interface GameProps {
  mode?: 'challenge' | 'precision' | 'reflex' | 'moving' | 'doubleshot';
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface CrosshairSettings {
  opacity: number;
  mainColor: string;
  showLines: boolean;
  gap: number;
  length: number;
  thickness: number;
  tStyle: boolean;
  showDot: boolean;
  dotRadius: number;
}

const defaultSettings: CrosshairSettings = {
  opacity: 100,
  mainColor: '#FFEB3B', // 黄色
  showLines: true,
  gap: 9,
  length: 20,
  thickness: 4,
  tStyle: false,
  showDot: true,
  dotRadius: 2,
};

const presets = [
  { 
    id: 'default',
    name: 'Default',
    settings: { ...defaultSettings }  // 黄色
  },
  { 
    id: 'dot',
    name: 'Dot Only',
    settings: { ...defaultSettings, showLines: false, showDot: true, dotRadius: 3, mainColor: '#4CAF50' }  // 绿色
  },
  { 
    id: 'cross',
    name: 'Cross',
    settings: { ...defaultSettings, showDot: false, mainColor: '#FF5252' }  // 红色
  },
  { 
    id: 'tStyle',
    name: 'T-Style',
    settings: { ...defaultSettings, tStyle: true, mainColor: '#FFEB3B' }  // 黄色
  },
  { 
    id: 'thick',
    name: 'Thick',
    settings: { ...defaultSettings, thickness: 6, mainColor: '#FF5252' }  // 红色
  },
  { 
    id: 'minimal',
    name: 'Minimal',
    settings: { ...defaultSettings, showLines: false, dotRadius: 4, mainColor: '#4CAF50' }  // 绿色
  },
];

interface CrosshairPreviewProps {
  settings: CrosshairSettings;
  size?: number;
}

const CrosshairPreview: React.FC<CrosshairPreviewProps> = ({ settings, size = 64 }) => {
  const center = size / 2;
  const scale = size / 100; // 将所有尺寸标准化到100x100的视图中
  
  const lineLength = settings.length * scale;
  const gap = settings.gap * scale;
  const thickness = settings.thickness * scale;
  const dotRadius = settings.dotRadius * scale;
  const opacity = settings.opacity / 100;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {settings.showLines && (
        <g opacity={opacity}>
          {/* 水平线 */}
          <rect
            x={center - lineLength - gap}
            y={center - thickness / 2}
            width={lineLength}
            height={thickness}
            fill={settings.mainColor}
          />
          <rect
            x={center + gap}
            y={center - thickness / 2}
            width={lineLength}
            height={thickness}
            fill={settings.mainColor}
          />
          
          {/* 垂直线 */}
          {settings.tStyle ? (
            <rect
              x={center - thickness / 2}
              y={center - lineLength - gap}
              width={thickness}
              height={lineLength}
              fill={settings.mainColor}
            />
          ) : (
            <>
              <rect
                x={center - thickness / 2}
                y={center - lineLength - gap}
                width={thickness}
                height={lineLength}
                fill={settings.mainColor}
              />
              <rect
                x={center - thickness / 2}
                y={center + gap}
                width={thickness}
                height={lineLength}
                fill={settings.mainColor}
              />
            </>
          )}
        </g>
      )}
      
      {settings.showDot && (
        <circle
          cx={center}
          cy={center}
          r={dotRadius}
          fill={settings.mainColor}
          opacity={opacity}
        />
      )}
    </svg>
  );
};

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CrosshairSettings;
  onSave: (settings: CrosshairSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<CrosshairSettings>({ ...settings });

  const handleReset = () => {
    setLocalSettings({ ...defaultSettings });
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#001524] text-white rounded-lg w-[600px] max-h-[90vh] flex flex-col">
        {/* 固定的头部 */}
        <div className="p-6 pb-2">
          <h2 className="text-2xl">Presets:</h2>
        </div>

        {/* 可滚动的内容区域 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6">
          <div className="space-y-6">
            {/* 预设网格 - 调整大小和间距 */}
            <div className="grid grid-cols-6 gap-6 mb-6">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  className="w-20 h-20 border border-blue-500 rounded flex items-center justify-center hover:border-blue-400 relative group"
                  onClick={() => setLocalSettings(preset.settings)}
                >
                  <CrosshairPreview settings={preset.settings} size={56} />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {preset.name}
                  </div>
                </button>
              ))}
            </div>

            {/* Basic Options 部分 */}
            <div>
              <h2 className="text-xl mb-4">Basic Options:</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-base min-w-[100px]">Opacity</span>
                  <div className="flex items-center gap-3 flex-1 ml-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={localSettings.opacity}
                      onChange={(e) => setLocalSettings({ ...localSettings, opacity: Number(e.target.value) })}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">-</button>
                      <span className="w-12 text-center">{localSettings.opacity}</span>
                      <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">+</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base min-w-[100px]">Main Color</span>
                  <div className="flex-1 ml-4 flex justify-end">
                    <input
                      type="color"
                      value={localSettings.mainColor}
                      onChange={(e) => setLocalSettings({ ...localSettings, mainColor: e.target.value })}
                      className="w-20 h-8 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lines 部分 */}
            <div>
              <h2 className="text-xl mb-4">Lines:</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-base min-w-[100px]">Show Lines</span>
                  <div className="flex-1 ml-4 flex justify-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.showLines}
                        onChange={(e) => setLocalSettings({ ...localSettings, showLines: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>

                {localSettings.showLines && (
                  <>
                    {['gap', 'length', 'thickness'].map((setting) => (
                      <div key={setting} className="flex items-center justify-between">
                        <span className="text-base min-w-[100px] capitalize">{setting}</span>
                        <div className="flex items-center gap-3 flex-1 ml-4">
                          <input
                            type="range"
                            min={setting === 'thickness' ? 1 : 0}
                            max={setting === 'length' ? 40 : setting === 'thickness' ? 10 : 20}
                            value={localSettings[setting as keyof typeof localSettings]}
                            onChange={(e) => setLocalSettings({ ...localSettings, [setting]: Number(e.target.value) })}
                            className="flex-1"
                          />
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">-</button>
                            <span className="w-12 text-center">{localSettings[setting as keyof typeof localSettings]}</span>
                            <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">+</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between">
                      <span className="text-base min-w-[100px]">T-Style</span>
                      <div className="flex-1 ml-4 flex justify-end">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={localSettings.tStyle}
                            onChange={(e) => setLocalSettings({ ...localSettings, tStyle: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Dot 部分 */}
            <div>
              <h2 className="text-xl mb-4">Dot:</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-base min-w-[100px]">Show Dot</span>
                  <div className="flex-1 ml-4 flex justify-end">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.showDot}
                        onChange={(e) => setLocalSettings({ ...localSettings, showDot: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>

                {localSettings.showDot && (
                  <div className="flex items-center justify-between">
                    <span className="text-base min-w-[100px]">Dot Radius</span>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={localSettings.dotRadius}
                        onChange={(e) => setLocalSettings({ ...localSettings, dotRadius: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">-</button>
                        <span className="w-12 text-center">{localSettings.dotRadius}</span>
                        <button className="px-3 py-1 bg-blue-900 rounded hover:bg-blue-800">+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 固定的底部按钮区域 */}
        <div className="p-6 border-t border-gray-700 mt-4">
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Save
            </button>
            <button
              onClick={handleReset}
              className="px-8 py-2 text-orange-500 hover:text-orange-400"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-8 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface GameProps {
  mode?: 'challenge' | 'precision' | 'reflex' | 'moving' | 'doubleshot' | 'tracking';
  difficulty?: 'easy' | 'medium' | 'hard';
}

function Game({ mode = 'challenge', difficulty: initialDifficulty = 'medium' }: GameProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [stats, setStats] = useState({
    hits: 0,
    accuracy: 0,
    speed: 2.00,
    time: 0,
    totalShots: 0,
    averageReactionTime: 0,
    consecutiveHits: 0,
    lastHitReactionTime: 0,
    trackingAccuracy: mode === 'tracking' ? 100 : 0 // 追踪模式的准确度统计
  });
  const [lives, setLives] = useState(mode === 'reflex' ? 1 : mode === 'tracking' ? 5 : 3); // 追踪模式给予更多生命值
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [showSettings, setShowSettings] = useState(false);
  const [crosshairSettings, setCrosshairSettings] = useState<CrosshairSettings>({ ...defaultSettings });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitSoundRef = useRef(new Audio('/hit-sound.mp3'));
  const gameRef = useRef<{
    targets: Target[];
    startTime: number;
    animationFrame: number;
    lastTargetTime: number;
    isRunning: boolean;
    lastLifeDeduction: number;
  }>({
    targets: [],
    startTime: 0,
    animationFrame: 0,
    lastTargetTime: 0,
    isRunning: false,
    lastLifeDeduction: 0
  });

  const generateTarget = (ctx: CanvasRenderingContext2D) => {
    const padding = 40;
    let radius = Math.random() * 20 + 15;
    
    // 根据模式调整目标大小
    if (mode === 'precision') {
      radius = 12; // 设置一个固定的小尺寸
    } else if (mode === 'reflex') {
      radius = Math.random() * 15 + 20; // 较大的目标
    } else if (mode === 'tracking') {
      radius = 25; // 追踪模式使用较大的目标
    }
    
    const x = Math.random() * (ctx.canvas.width - padding * 2) + padding;
    const y = Math.random() * (ctx.canvas.height - padding * 2) + padding;
    const target = new Target(x, y, radius);
    
    // 在追踪模式下调整目标速度和运动方式
    if (mode === 'tracking') {
      target.speed = difficulty === 'easy' ? 1.5 : 
                    difficulty === 'medium' ? 2.5 : 3.5;
      target.dx = Math.cos(target.rotation) * target.speed;
      target.dy = Math.sin(target.rotation) * target.speed;
      target.isExpired = () => false; // 追踪模式下目标永不过期
    }
    
    // 在追踪模式下只保留一个目标
    if (mode === 'tracking') {
      gameRef.current.targets = [target];
    } else {
      gameRef.current.targets.push(target);
    }

    // 在Doubleshot模式下生成第二个目标
    if (mode === 'doubleshot') {
      const x2 = Math.random() * (ctx.canvas.width - padding * 2) + padding;
      const y2 = Math.random() * (ctx.canvas.height - padding * 2) + padding;
      const target2 = new Target(x2, y2, radius);
      gameRef.current.targets.push(target2);
    }

    gameRef.current.lastTargetTime = Date.now();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameRef.current.isRunning) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const now = Date.now();
    const cooldown = 1000; // 1000ms = 1秒冷却

    // 在非追踪模式下检查目标过期
    if (mode !== 'tracking') {
      const expiredTargets = gameRef.current.targets.filter(target => !target.hit && target.isExpired());
      if (expiredTargets.length > 0 && now - gameRef.current.lastLifeDeduction >= cooldown) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            gameRef.current.isRunning = false;
            setGameState('finished');
            return 0;
          }
          return newLives;
        });
        gameRef.current.lastLifeDeduction = now;
      }
      // 保留未过期的目标
      gameRef.current.targets = gameRef.current.targets.filter(target => !(!target.hit && target.isExpired()));
    }

    // 移动目标
    if (mode === 'moving' || mode === 'tracking') {
      gameRef.current.targets.forEach(target => target.move(ctx));
    }

    gameRef.current.targets.forEach(target => target.draw(ctx));

    // 绘制准星
    const drawCrosshair = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.strokeStyle = crosshairSettings.mainColor;
      ctx.fillStyle = crosshairSettings.mainColor;
      ctx.globalAlpha = crosshairSettings.opacity / 100;
      ctx.lineWidth = crosshairSettings.thickness;
      
      // 使用鼠标位置作为准星中心
      const center = {
        x: mousePositionRef.current.x,
        y: mousePositionRef.current.y
      };
      
      // 绘制十字线
      if (crosshairSettings.showLines) {
        const gap = crosshairSettings.gap;
        const length = crosshairSettings.length;
        
        // 水平线
        ctx.beginPath();
        ctx.moveTo(center.x - length - gap, center.y);
        ctx.lineTo(center.x - gap, center.y);
        ctx.moveTo(center.x + gap, center.y);
        ctx.lineTo(center.x + length + gap, center.y);
        ctx.stroke();
        
        // 垂直线
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - length - gap);
        ctx.lineTo(center.x, center.y - gap);
        ctx.moveTo(center.x, center.y + gap);
        ctx.lineTo(center.x, center.y + length + gap);
        ctx.stroke();
        
        // T型准星
        if (crosshairSettings.tStyle) {
          ctx.beginPath();
          ctx.moveTo(center.x - length/2, center.y - gap);
          ctx.lineTo(center.x + length/2, center.y - gap);
          ctx.stroke();
        }
      }
      
      // 绘制中心点
      if (crosshairSettings.showDot) {
        ctx.beginPath();
        ctx.arc(center.x, center.y, crosshairSettings.dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };

    // 在所有目标之上绘制准星
    drawCrosshair(ctx);

    const timeDiff = (now - gameRef.current.startTime) / 1000;
    const baseSpeed = mode === 'doubleshot' 
      ? (difficulty === 'easy' ? 0.25 : difficulty === 'medium' ? 0.50 : 0.75)
      : mode === 'reflex'
        ? (difficulty === 'easy' ? 0.20 : difficulty === 'medium' ? 0.35 : 0.50)
        : (difficulty === 'easy' ? 0.50 : difficulty === 'medium' ? 1.00 : 1.50);
    const increment = Math.log(timeDiff + 1) * 0.1;
    const currentSpeed = mode === 'reflex' ? baseSpeed : baseSpeed + increment;
    const targetSpawnInterval = mode === 'reflex'
      ? Math.random() * 2000 + 1000 // 1-3秒的随机间隔
      : 500 / currentSpeed;

    if (now - gameRef.current.lastTargetTime >= targetSpawnInterval) {
      generateTarget(ctx);
      gameRef.current.lastTargetTime = now;
    }

    if (gameRef.current.isRunning) {
      setStats(prev => {
        const timeDiff = (now - gameRef.current.startTime) / 1000;
        return {
          ...prev,
          time: now - gameRef.current.startTime,
          speed: baseSpeed + increment
        };
      });
    }

    gameRef.current.animationFrame = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    setGameState('playing');
    setStats({
      hits: 0,
      accuracy: 0,
      speed: difficulty === 'easy' ? 0.50 : difficulty === 'medium' ? 1.00 : 1.50,
      time: 0,
      totalShots: 0,
      averageReactionTime: 0,
      lastHitReactionTime: 0
    });
    setLives(mode === 'reflex' ? 1 : 3);
    
    gameRef.current = {
      targets: [],
      startTime: Date.now(),
      animationFrame: 0,
      lastTargetTime: 0,
      isRunning: true,
      lastLifeDeduction: 0
    };

    generateTarget(ctx);
    requestAnimationFrame(gameLoop);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameRef.current.isRunning) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStats(prev => ({
      ...prev,
      totalShots: prev.totalShots + 1
    }));

    let hitTarget = false;
    gameRef.current.targets.forEach(target => {
      if (!target.hit && target.isHit(x, y)) {
        target.hit = true;
        hitTarget = true;
        hitSoundRef.current.currentTime = 0;
        hitSoundRef.current.play().catch(e => console.log('Error playing sound:', e));
        
        const reactionTime = Date.now() - target.createdAt;
        
        setStats(prev => {
          const newHits = prev.hits + 1;
          const newConsecutiveHits = mode === 'precision' ? prev.consecutiveHits + 1 : prev.consecutiveHits;
          const newAverageReactionTime = 
            ((prev.averageReactionTime * prev.hits) + reactionTime) / newHits;
          
          // 在Reflex模式下达到8个目标时结束游戏
          if (mode === 'reflex' && newHits === 8) {
            gameRef.current.isRunning = false;
            setGameState('finished');
          }
          
          return {
            ...prev,
            hits: newHits,
            consecutiveHits: newConsecutiveHits,
            accuracy: Math.round((newHits / (prev.totalShots + 1)) * 100),
            averageReactionTime: Math.round(newAverageReactionTime),
            lastHitReactionTime: Math.round(reactionTime)
          };
        });
      }
    });

    if (!hitTarget && mode !== 'reflex') {
      if (mode === 'precision') {
        setStats(prev => ({
          ...prev,
          consecutiveHits: 0
        }));
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives === 0) {
            gameRef.current.isRunning = false;
            setGameState('finished');
          }
          return newLives;
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const pos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    mousePositionRef.current = pos;
    setMousePosition(pos);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 480;

    return () => {
      gameRef.current.isRunning = false;
      cancelAnimationFrame(gameRef.current.animationFrame);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4">
      <div className="max-w-[800px] mx-auto">
        <div className="game">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-6">
              <div className="text-sm">Mode: <span className="capitalize">{mode}</span></div>
              <div className="text-sm">Difficulty: <span className="capitalize">{difficulty}</span></div>
              <div className="text-sm">Time: <span>{formatTime(stats.time)}</span></div>
              {mode === 'reflex' ? (
                <>
                  <div className="text-sm">Hits: <span>{stats.hits}/8</span></div>
                  <div className="text-sm">Avg Reaction: <span>{stats.averageReactionTime.toFixed(2)} ms</span></div>
                  <div className="text-sm">Last Hit: <span>{stats.lastHitReactionTime} ms</span></div>
                </>
              ) : (
                <>
                  <div className="text-sm">Hits: <span>{stats.hits}</span></div>
                  <div className="text-sm">Speed: <span>{stats.speed.toFixed(2)} t/s</span></div>
                </>
              )}
            </div>
            {mode !== 'reflex' && (
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <HeartIcon key={i} filled={i < lives} />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              className="bg-[#242424] rounded border border-[#333] cursor-none"
              style={{ cursor: 'none' }}
            />
            
            <div className="absolute top-4 right-4 flex gap-2 z-50">
              <button onClick={() => setShowSettings(true)} className="p-2 bg-white bg-opacity-10 rounded hover:bg-opacity-20">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white bg-opacity-10 rounded hover:bg-opacity-20">
                <Maximize className="w-5 h-5" />
              </button>
            </div>

            {gameState === 'finished' && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="bg-[#2d3436] p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
                  <ul className="mb-6 space-y-2">
                    <li>Total Hits: <span className="font-bold">{stats.hits}{mode === 'reflex' && '/8'}</span></li>
                    {mode === 'reflex' ? (
                      <>
                        <li>Average Reaction Time: <span className="font-bold">{stats.averageReactionTime.toFixed(2)} ms</span></li>
                        <li>Last Hit: <span className="font-bold">{stats.lastHitReactionTime} ms</span></li>
                      </>
                    ) : (
                      <>
                        <li>Accuracy: <span className="font-bold">{stats.accuracy}%</span></li>
                        <li>Final Speed: <span className="font-bold">{stats.speed.toFixed(2)} t/s</span></li>
                      </>
                    )}
                  </ul>

                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={startGame}
                      className="bg-[#ff4757] hover:bg-[#ff5e6c] px-8 py-3 rounded text-lg font-bold flex items-center gap-2 w-full justify-center"
                    >
                      <Play className="w-5 h-5" />
                      Play Again
                    </button>

                    <div className="flex flex-col items-center gap-4 mt-4">
                      <h3 className="text-lg">Select Difficulty</h3>
                      <div className="flex gap-3">
                        <button
                          className={`px-6 py-2 rounded-lg text-sm ${
                            difficulty === 'easy'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => setDifficulty('easy')}
                        >
                          Easy
                        </button>
                        <button
                          className={`px-6 py-2 rounded-lg text-sm ${
                            difficulty === 'medium'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => setDifficulty('medium')}
                        >
                          Medium
                        </button>
                        <button
                          className={`px-6 py-2 rounded-lg text-sm ${
                            difficulty === 'hard'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => setDifficulty('hard')}
                        >
                          Hard
                        </button>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Initial Speed: {difficulty === 'easy' ? '0.50' : difficulty === 'medium' ? '1.00' : '1.50'} t/s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState === 'menu' && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                <div className="flex flex-col items-center gap-8">
                  <h1 className="text-4xl font-bold mb-8">Aim Trainer</h1>
                  
                  <div className="flex flex-col items-center gap-4">
                    <h2 className="text-2xl mb-4">Select Difficulty</h2>
                    <div className="flex gap-4">
                      <button
                        className={`px-8 py-3 rounded-lg ${
                          difficulty === 'easy'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setDifficulty('easy')}
                      >
                        Easy
                      </button>
                      <button
                        className={`px-8 py-3 rounded-lg ${
                          difficulty === 'medium'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setDifficulty('medium')}
                      >
                        Medium
                      </button>
                      <button
                        className={`px-8 py-3 rounded-lg ${
                          difficulty === 'hard'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => setDifficulty('hard')}
                      >
                        Hard
                      </button>
                    </div>
                    <div className="text-gray-400 mt-2">
                      Initial Speed: {difficulty === 'easy' ? '0.50' : difficulty === 'medium' ? '1.00' : '1.50'} t/s
                    </div>
                  </div>

                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full text-xl font-bold mt-8"
                    onClick={startGame}
                  >
                    Start Game
                  </button>
                </div>
              </div>
            )}
            
            {showSettings && (
              <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={crosshairSettings}
                onSave={(settings) => setCrosshairSettings(settings)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;