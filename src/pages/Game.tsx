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

  constructor(x: number, y: number, radius: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hit = false;
    this.createdAt = Date.now();
    this.color = this.generateColor();
    this.scale = 0;
    this.rotation = Math.random() * Math.PI * 2;
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
  mode?: 'challenge' | 'precision' | 'reflex' | 'moving';
  difficulty?: 'easy' | 'medium' | 'hard';
}

function Game({ mode = 'challenge', difficulty: initialDifficulty = 'medium' }: GameProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [stats, setStats] = useState({
    hits: 0,
    accuracy: 0,
    speed: 2.00,
    time: 0,
    totalShots: 0
  });
  const [lives, setLives] = useState(3);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
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
      radius = Math.random() * 10 + 10; // 更小的目标
    } else if (mode === 'reflex') {
      radius = Math.random() * 15 + 20; // 较大的目标，更容易击中
    }
    
    const x = Math.random() * (ctx.canvas.width - padding * 2) + padding;
    const y = Math.random() * (ctx.canvas.height - padding * 2) + padding;
    const target = new Target(x, y, radius);
    gameRef.current.targets.push(target);
    gameRef.current.lastTargetTime = Date.now();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameRef.current.isRunning) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const now = Date.now();
    const cooldown = 1000; // 1000ms = 1秒冷却
    // 检查所有未击中且过期的目标
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
    gameRef.current.targets = gameRef.current.targets.filter(target => !( !target.hit && target.isExpired() ));

    // 移动目标模式下更新目标位置
    if (mode === 'moving') {
      gameRef.current.targets.forEach(target => {
        if (!target.hit) {
          target.x += Math.cos(target.rotation) * 2;
          target.y += Math.sin(target.rotation) * 2;
          
          // 边界检查
          if (target.x < target.radius) target.x = target.radius;
          if (target.x > ctx.canvas.width - target.radius) target.x = ctx.canvas.width - target.radius;
          if (target.y < target.radius) target.y = target.radius;
          if (target.y > ctx.canvas.height - target.radius) target.y = ctx.canvas.height - target.radius;
        }
      });
    }

    gameRef.current.targets.forEach(target => target.draw(ctx));

    const timeDiff = (now - gameRef.current.startTime) / 1000;
    const baseSpeed = difficulty === 'easy' ? 0.50 : difficulty === 'medium' ? 1.00 : 1.50;
    const increment = Math.log(timeDiff + 1) * 0.1; // 使用对数函数平滑增长
    const currentSpeed = baseSpeed + increment;
    const targetSpawnInterval = 500 / currentSpeed;

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
      totalShots: 0
    });
    setLives(3);
    
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
        setStats(prev => {
          const newHits = prev.hits + 1;
          return {
            ...prev,
            hits: newHits,
            accuracy: Math.round((newHits / (prev.totalShots + 1)) * 100)
          };
        });
      }
    });

    if (hitTarget) {
      hitSoundRef.current.currentTime = 0;
      hitSoundRef.current.play();
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
              <div className="text-sm">Hits: <span>{stats.hits}</span></div>
              <div className="text-sm">Speed: <span>{stats.speed.toFixed(2)} t/s</span></div>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <HeartIcon key={i} filled={i < lives} />
              ))}
            </div>
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="bg-[#242424] rounded border border-[#333]"
              style={{
                cursor: gameRef.current.isRunning ? 'crosshair' : 'default'
              }}
            />
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white bg-opacity-10 rounded hover:bg-opacity-20">
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
                    <li>Total Hits: <span className="font-bold">{stats.hits}</span></li>
                    <li>Accuracy: <span className="font-bold">{stats.accuracy}%</span></li>
                    <li>Final Speed: <span className="font-bold">{stats.speed.toFixed(2)} t/s</span></li>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;