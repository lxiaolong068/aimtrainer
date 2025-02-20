import React, { useState, useRef, useEffect } from 'react';
import { Target } from '../types/game';
import { Settings, Play, Maximize } from 'lucide-react';

class WarningTarget extends Target {
  constructor(x: number, y: number, radius: number) {
    super(x, y, radius);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
  }
}

interface RefexGameProps {
  onGameEnd?: (stats: GameStats) => void;
}

interface GameStats {
  hits: number;
  totalShots: number;
  averageReactionTime: number;
  lastHitReactionTime: number;
  accuracy: number;
  misses: number;
}

const RefexGame: React.FC<RefexGameProps> = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [stats, setStats] = useState<GameStats>({
    hits: 0,
    totalShots: 0,
    averageReactionTime: 0,
    lastHitReactionTime: 0,
    accuracy: 0,
    misses: 0
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitSoundRef = useRef(new Audio('/hit-sound.mp3'));
  const gameRef = useRef<{
    targets: Target[];
    startTime: number;
    animationFrame: number;
    lastTargetTime: number;
    isRunning: boolean;
  }>({
    targets: [],
    startTime: 0,
    animationFrame: 0,
    lastTargetTime: 0,
    isRunning: false
  });

  const generateTarget = (ctx: CanvasRenderingContext2D) => {
    const padding = 40;
    const radius = Math.random() * 15 + 20;
    const x = Math.random() * (ctx.canvas.width - padding * 2) + padding;
    const y = Math.random() * (ctx.canvas.height - padding * 2) + padding;
    
    // 先创建预警目标
    const warningTarget = new WarningTarget(x, y, radius);
    gameRef.current.targets.push(warningTarget);
    
    // 200ms后创建真实目标
    setTimeout(() => {
      if (gameRef.current.isRunning) {
        const index = gameRef.current.targets.indexOf(warningTarget);
        if (index > -1) {
          gameRef.current.targets.splice(index, 1);
          const target = new Target(x, y, radius);
          gameRef.current.targets.push(target);
        }
      }
    }, 200);
    
    gameRef.current.lastTargetTime = Date.now();
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameRef.current.isRunning) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // 移除过期的目标
    gameRef.current.targets = gameRef.current.targets.filter(target => !target.isExpired());

    // 绘制所有目标
    gameRef.current.targets.forEach(target => target.draw(ctx));

    // 生成新目标的逻辑
    const now = Date.now();
    // 根据玩家的平均反应时间动态调整目标生成间隔
    const baseInterval = 1500;
    const minInterval = 800;
    const maxInterval = 2000;
    let targetSpawnInterval = baseInterval;
    
    if (stats.hits > 0) {
      targetSpawnInterval = Math.max(minInterval,
        Math.min(maxInterval, stats.averageReactionTime * 1.5));
    }

    if (now - gameRef.current.lastTargetTime >= targetSpawnInterval) {
      generateTarget(ctx);
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
      totalShots: 0,
      averageReactionTime: 0,
      lastHitReactionTime: 0,
      accuracy: 0
    });

    // 如果没有命中目标，增加失误计数
    if (!hitTarget) {
      setStats(prev => ({
        ...prev,
        misses: prev.misses + 1
      }));
      // 播放失误音效
      const missSound = new Audio('/miss-sound.mp3');
      missSound.play().catch(e => console.log('Error playing sound:', e));
    }
    
    gameRef.current = {
      targets: [],
      startTime: Date.now(),
      animationFrame: 0,
      lastTargetTime: 0,
      isRunning: true
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
      if (target instanceof WarningTarget) return; // 忽略预警目标
      if (!target.hit && target.isHit(x, y)) {
        target.hit = true;
        hitTarget = true;
        hitSoundRef.current.currentTime = 0;
        hitSoundRef.current.play().catch(e => console.log('Error playing sound:', e));
        
        const reactionTime = Date.now() - target.createdAt;
        
        setStats(prev => {
          const newHits = prev.hits + 1;
          const newAverageReactionTime = 
            ((prev.averageReactionTime * prev.hits) + reactionTime) / newHits;
          
          // 当失误次数达到3次时结束游戏
          if (stats.misses >= 3) {
            gameRef.current.isRunning = false;
            setGameState('finished');
            if (onGameEnd) {
              onGameEnd({
                hits: newHits,
                totalShots: prev.totalShots + 1,
                averageReactionTime: Math.round(newAverageReactionTime),
                lastHitReactionTime: Math.round(reactionTime),
                accuracy: Math.round((newHits / (prev.totalShots + 1)) * 100)
              });

    // 如果没有命中目标，增加失误计数
    if (!hitTarget) {
      setStats(prev => ({
        ...prev,
        misses: prev.misses + 1
      }));
      // 播放失误音效
      const missSound = new Audio('/miss-sound.mp3');
      missSound.play().catch(e => console.log('Error playing sound:', e));
    }
            }
          }
          
          return {
            ...prev,
            hits: newHits,
            accuracy: Math.round((newHits / (prev.totalShots + 1)) * 100),
            averageReactionTime: Math.round(newAverageReactionTime),
            lastHitReactionTime: Math.round(reactionTime)
          };
        });

    // 如果没有命中目标，增加失误计数
    if (!hitTarget) {
      setStats(prev => ({
        ...prev,
        misses: prev.misses + 1
      }));
      // 播放失误音效
      const missSound = new Audio('/miss-sound.mp3');
      missSound.play().catch(e => console.log('Error playing sound:', e));
    }
      }
    });

    // 如果没有命中目标，增加失误计数
    if (!hitTarget) {
      setStats(prev => ({
        ...prev,
        misses: prev.misses + 1
      }));
      // 播放失误音效
      const missSound = new Audio('/miss-sound.mp3');
      missSound.play().catch(e => console.log('Error playing sound:', e));
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
    <div className="relative">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="bg-[#242424] rounded border border-[#333] cursor-crosshair"
      />
      
      {gameState === 'menu' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-full text-xl font-bold"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-[#2d3436] p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <ul className="mb-6 space-y-2">
              <li>Total Hits: <span className="font-bold">{stats.hits}/8</span></li>
              <li>Average Reaction Time: <span className="font-bold">{stats.averageReactionTime.toFixed(2)} ms</span></li>
              <li>Last Hit: <span className="font-bold">{stats.lastHitReactionTime} ms</span></li>
              <li>Accuracy: <span className="font-bold">{stats.accuracy}%</span></li>
            </ul>
            <button
              onClick={startGame}
              className="bg-[#ff4757] hover:bg-[#ff5e6c] px-8 py-3 rounded text-lg font-bold flex items-center gap-2 w-full justify-center"
            >
              <Play className="w-5 h-5" />
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefexGame;