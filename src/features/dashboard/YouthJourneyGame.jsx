import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Medal,
  Music2,
  Play,
  RotateCcw,
  Trophy,
  VolumeX,
} from 'lucide-react';
import unionLogo from '../../../img/img2.png';
import gameMusic from '../../../music/music01.mp3';
import {
  createYouthJourneyResult,
  getYouthJourneyLeaderboard,
} from '../../lib/supabase';
import DashboardFooter from './DashboardFooter';
import './YouthJourneyGame.css';

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 560;
const PLAYER_Y = 482;
const GAME_DURATION = 60_000;
const LEADERBOARD_KEY = 'youth-journey-leaderboard';

const COLLECTIBLES = [
  { id: 'unity', symbol: '⭐', label: 'Đoàn kết', points: 12, color: '#ffd84c' },
  { id: 'creative', symbol: '💡', label: 'Sáng tạo', points: 15, color: '#58e7ff' },
  { id: 'volunteer', symbol: '❤️', label: 'Tình nguyện', points: 14, color: '#ff647d' },
  { id: 'pioneer', symbol: '🚀', label: 'Tiên phong', points: 18, color: '#a58cff' },
];

const INITIAL_COLLECTION = Object.fromEntries(COLLECTIBLES.map((item) => [item.id, 0]));

function loadLeaderboard() {
  try {
    const cachedResults = JSON.parse(window.localStorage.getItem(LEADERBOARD_KEY)) || [];
    return buildYouthLeaderboard(cachedResults);
  } catch {
    return [];
  }
}

function compareYouthResults(first, second) {
  const scoreDifference = (Number(second.score) || 0) - (Number(first.score) || 0);
  if (scoreDifference !== 0) return scoreDifference;

  for (const collectible of COLLECTIBLES) {
    const countDifference = (Number(second.collection?.[collectible.id]) || 0)
      - (Number(first.collection?.[collectible.id]) || 0);
    if (countDifference !== 0) return countDifference;
  }

  return new Date(first.playedAt || 0).getTime() - new Date(second.playedAt || 0).getTime();
}

function buildYouthLeaderboard(results, limit = 10) {
  const delegates = new Set();

  return [...results]
    .sort(compareYouthResults)
    .filter((entry) => {
      const delegateKey = entry.delegateId || `legacy-name:${entry.name}`;
      if (delegates.has(delegateKey)) return false;
      delegates.add(delegateKey);
      return true;
    })
    .slice(0, limit);
}

function getYouthTitle(score) {
  if (score >= 450) return 'Thủ lĩnh Tuổi trẻ';
  if (score >= 300) return 'Chiến binh Tiên phong';
  if (score >= 180) return 'Thanh niên Sáng tạo';
  return 'Mầm xanh Cống hiến';
}

function calculateScore(collection, obstacleHits) {
  const collectedPoints = COLLECTIBLES.reduce(
    (total, item) => total + collection[item.id] * item.points,
    0,
  );
  return Math.max(0, collectedPoints - obstacleHits * 20);
}

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function getRoadBounds(y) {
  const progress = Math.max(0, Math.min(1, (y - 82) / (CANVAS_HEIGHT - 82)));
  return {
    left: 108 - progress * 100,
    right: 252 + progress * 100,
    progress,
  };
}

function getLaneX(lane, y) {
  const { left, right } = getRoadBounds(y);
  return left + ((lane + 0.5) * (right - left)) / 3;
}

function drawDigitalWorld(context, elapsed) {
  const background = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  background.addColorStop(0, '#020d3a');
  background.addColorStop(0.48, '#063f96');
  background.addColorStop(1, '#020b31');
  context.fillStyle = background;
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const horizonGlow = context.createRadialGradient(180, 95, 5, 180, 95, 175);
  horizonGlow.addColorStop(0, 'rgba(35, 225, 255, 0.65)');
  horizonGlow.addColorStop(0.4, 'rgba(0, 119, 255, 0.22)');
  horizonGlow.addColorStop(1, 'rgba(0, 30, 90, 0)');
  context.fillStyle = horizonGlow;
  context.fillRect(0, 0, CANVAS_WIDTH, 260);

  context.fillStyle = 'rgba(30, 212, 255, 0.68)';
  for (let index = 0; index < 30; index += 1) {
    const x = (index * 67 + 19) % CANVAS_WIDTH;
    const y = (index * 43 + elapsed * 0.012) % 210;
    const size = index % 4 === 0 ? 2 : 1;
    context.globalAlpha = 0.28 + (index % 5) * 0.1;
    context.fillRect(x, y, size, size);
  }
  context.globalAlpha = 1;

  for (let index = 0; index < 15; index += 1) {
    const width = 12 + (index % 4) * 6;
    const height = 32 + (index % 5) * 13;
    const leftSide = index % 2 === 0;
    const x = leftSide ? index * 8 - 8 : CANVAS_WIDTH - index * 8 - width + 8;
    const y = 105 - height;
    context.fillStyle = `rgba(2, ${45 + index * 3}, ${105 + index * 5}, 0.72)`;
    context.fillRect(x, y, width, height);
    context.fillStyle = 'rgba(50, 221, 255, 0.55)';
    for (let row = y + 7; row < 100; row += 10) {
      context.fillRect(x + 4, row, 2, 4);
    }
  }

  const roadGradient = context.createLinearGradient(0, 82, 0, CANVAS_HEIGHT);
  roadGradient.addColorStop(0, 'rgba(1, 34, 91, 0.7)');
  roadGradient.addColorStop(1, 'rgba(1, 8, 35, 0.95)');
  context.beginPath();
  context.moveTo(108, 82);
  context.lineTo(252, 82);
  context.lineTo(352, CANVAS_HEIGHT);
  context.lineTo(8, CANVAS_HEIGHT);
  context.closePath();
  context.fillStyle = roadGradient;
  context.fill();
  context.strokeStyle = 'rgba(42, 226, 255, 0.75)';
  context.lineWidth = 2;
  context.stroke();

  context.lineWidth = 1;
  context.strokeStyle = 'rgba(39, 211, 255, 0.3)';
  for (let lane = 1; lane <= 2; lane += 1) {
    context.beginPath();
    context.moveTo(108 + (lane * 144) / 3, 82);
    context.lineTo(8 + (lane * 344) / 3, CANVAS_HEIGHT);
    context.stroke();
  }

  const gridOffset = (elapsed * 0.16) % 62;
  for (let index = 0; index < 11; index += 1) {
    const rawY = 82 + ((index * 62 + gridOffset) % 520);
    const normalized = Math.max(0, Math.min(1, (rawY - 82) / 478));
    const curvedProgress = normalized ** 1.55;
    const y = 82 + curvedProgress * 478;
    const { left, right } = getRoadBounds(y);
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.strokeStyle = `rgba(42, 221, 255, ${0.08 + normalized * 0.25})`;
    context.stroke();
  }
}

function drawGameItem(context, item) {
  const x = getLaneX(item.lane, item.y);
  const { progress } = getRoadBounds(item.y);
  const scale = 0.5 + progress * 0.62;

  context.save();
  context.translate(x, item.y);
  context.scale(scale, scale);

  if (item.kind === 'obstacle') {
    context.shadowColor = '#ff5c6f';
    context.shadowBlur = 12;
    roundedRect(context, -21, -18, 42, 36, 8);
    context.fillStyle = '#a62045';
    context.fill();
    context.strokeStyle = '#ff8899';
    context.lineWidth = 2;
    context.stroke();
    context.fillStyle = '#fff';
    context.font = '700 19px "Segoe UI", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('!', 0, 1);
  } else {
    context.shadowColor = item.color;
    context.shadowBlur = 18;
    context.beginPath();
    context.arc(0, 0, 23, 0, Math.PI * 2);
    context.fillStyle = 'rgba(2, 31, 91, 0.9)';
    context.fill();
    context.strokeStyle = item.color;
    context.lineWidth = 2;
    context.stroke();
    context.font = '24px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#fff';
    context.fillText(item.symbol, 0, 1);
  }

  context.restore();
}

function drawPlayer(context, lane, elapsed, isHit) {
  const x = getLaneX(lane, PLAYER_Y);
  const runningOffset = Math.sin(elapsed * 0.014) * 4;

  context.save();
  context.translate(x, PLAYER_Y);
  context.shadowColor = isHit ? '#ff566d' : '#22dcff';
  context.shadowBlur = isHit ? 24 : 16;

  context.strokeStyle = '#1679d9';
  context.lineWidth = 7;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(-5, 31);
  context.lineTo(-10 - runningOffset, 48);
  context.moveTo(5, 31);
  context.lineTo(10 + runningOffset, 48);
  context.stroke();

  roundedRect(context, -18, -10, 36, 45, 11);
  context.fillStyle = isHit ? '#d53355' : '#0869c9';
  context.fill();
  context.strokeStyle = '#54ddff';
  context.lineWidth = 2;
  context.stroke();

  context.strokeStyle = '#1591e7';
  context.lineWidth = 6;
  context.beginPath();
  context.moveTo(-14, 0);
  context.lineTo(-24 + runningOffset, 18);
  context.moveTo(14, 0);
  context.lineTo(24 - runningOffset, 18);
  context.stroke();

  context.beginPath();
  context.arc(0, -22, 12, 0, Math.PI * 2);
  context.fillStyle = '#f5c5a2';
  context.fill();
  context.fillStyle = '#182238';
  context.beginPath();
  context.arc(0, -25, 12, Math.PI, Math.PI * 2);
  context.fill();

  context.fillStyle = '#fff';
  context.beginPath();
  context.arc(0, 7, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#e5243f';
  context.beginPath();
  context.moveTo(-3, 5);
  context.lineTo(4, 7);
  context.lineTo(-3, 10);
  context.closePath();
  context.fill();
  context.restore();
}

function drawScene(context, { elapsed, items, playerLane, isHit, status }) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawDigitalWorld(context, elapsed);
  items.forEach((item) => drawGameItem(context, item));
  drawPlayer(context, playerLane, elapsed, isHit);

  if (status !== 'playing') {
    context.fillStyle = 'rgba(0, 10, 45, 0.36)';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    roundedRect(context, 38, 232, 284, 88, 16);
    context.fillStyle = 'rgba(0, 36, 104, 0.9)';
    context.fill();
    context.strokeStyle = 'rgba(56, 218, 255, 0.65)';
    context.stroke();
    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.font = '800 20px "Segoe UI", sans-serif';
    context.fillText(status === 'finished' ? 'HÀNH TRÌNH HOÀN THÀNH!' : 'HÀNH TRÌNH TUỔI TRẺ', 180, 267);
    context.fillStyle = '#aeeaff';
    context.font = '12px "Segoe UI", sans-serif';
    context.fillText(status === 'finished' ? 'Xem kết quả ở phía dưới' : 'Sẵn sàng vượt thử thách 60 giây?', 180, 294);
  }
}

export default function YouthJourneyGame({ delegate, onBack, onNavigateFooter, onMenuAction }) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const statusRef = useRef('idle');
  const playerLaneRef = useRef(1);
  const itemsRef = useRef([]);
  const scoreRef = useRef(0);
  const collectionRef = useRef({ ...INITIAL_COLLECTION });
  const obstacleHitsRef = useRef(0);
  const itemIdRef = useRef(0);
  const hitUntilRef = useRef(0);
  const audioRef = useRef(null);

  const [status, setStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION / 1000);
  const [collection, setCollection] = useState({ ...INITIAL_COLLECTION });
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState(loadLeaderboard);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicPlaybackBlocked, setMusicPlaybackBlocked] = useState(false);
  const [resultSaving, setResultSaving] = useState(false);
  const [resultSaveError, setResultSaveError] = useState('');

  const delegateName = delegate?.name || 'Đại biểu';

  const renderStaticScene = useCallback((nextStatus = statusRef.current) => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    drawScene(context, {
      elapsed: 0,
      items: itemsRef.current,
      playerLane: playerLaneRef.current,
      isHit: false,
      status: nextStatus,
    });
  }, []);

  useEffect(() => {
    renderStaticScene('idle');
    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      audioRef.current?.pause();
    };
  }, [renderStaticScene]);

  useEffect(() => {
    let active = true;

    getYouthJourneyLeaderboard(10)
      .then((rows) => {
        if (!active || rows.length === 0) return;
        setLeaderboard(rows);
        window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(rows));
      })
      .catch(() => {
        // Giữ bảng xếp hạng cache trên máy nếu Supabase chưa sẵn sàng hoặc mất mạng.
      });

    return () => {
      active = false;
    };
  }, []);

  const movePlayer = useCallback((direction) => {
    if (statusRef.current !== 'playing') return;
    playerLaneRef.current = Math.max(0, Math.min(2, playerLaneRef.current + direction));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        movePlayer(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        movePlayer(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  const playBackgroundMusic = useCallback((restart = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (restart) audio.currentTime = 0;
    audio.volume = 0.6;
    audio.muted = false;

    const playback = audio.play();
    if (playback) {
      playback
        .then(() => setMusicPlaybackBlocked(false))
        .catch((playbackError) => {
          console.warn('Không thể tự động phát nhạc nền:', playbackError);
          setMusicPlaybackBlocked(true);
        });
    }
  }, []);

  const finishGame = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    statusRef.current = 'finished';
    setStatus('finished');
    setTimeLeft(0);
    audioRef.current?.pause();

    const finalScore = scoreRef.current;
    const title = getYouthTitle(finalScore);
    const entryId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const entry = {
      id: entryId,
      delegateId: delegate?.id,
      name: delegateName,
      collection: { ...collectionRef.current },
      obstacleHits: obstacleHitsRef.current,
      score: finalScore,
      title,
      playedAt: new Date().toISOString(),
    };
    const nextLeaderboard = buildYouthLeaderboard([...loadLeaderboard(), entry]);

    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(nextLeaderboard));
    setLeaderboard(nextLeaderboard);
    setResult({ score: finalScore, title, entryId });
    setResultSaving(true);
    setResultSaveError('');

    createYouthJourneyResult({
      delegateId: delegate?.id,
      collection: collectionRef.current,
      obstacleHits: obstacleHitsRef.current,
    })
      .then((savedResult) => {
        setResult({
          score: savedResult.score,
          title: savedResult.title,
          entryId: savedResult.id,
        });
        setResultSaveError('');

        return getYouthJourneyLeaderboard(10)
          .then((serverLeaderboard) => {
            setLeaderboard(serverLeaderboard);
            window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(serverLeaderboard));
          })
          .catch(() => {
            const leaderboardWithSavedResult = buildYouthLeaderboard([
              savedResult,
              ...nextLeaderboard.filter((entry) => entry.id !== entryId),
            ]);
            setLeaderboard(leaderboardWithSavedResult);
            window.localStorage.setItem(
              LEADERBOARD_KEY,
              JSON.stringify(leaderboardWithSavedResult),
            );
          });
      })
      .catch((saveError) => {
        console.error('Không thể lưu kết quả game lên Supabase:', saveError);
        setResultSaveError(
          saveError.message || 'Không thể lưu kết quả lên hệ thống. Kết quả đang được giữ trên thiết bị.',
        );
      })
      .finally(() => setResultSaving(false));

    const context = canvasRef.current?.getContext('2d');
    if (context) {
      drawScene(context, {
        elapsed: GAME_DURATION,
        items: [],
        playerLane: playerLaneRef.current,
        isHit: false,
        status: 'finished',
      });
    }
  }, [delegate?.id, delegateName]);

  const startGame = useCallback(() => {
    window.cancelAnimationFrame(animationFrameRef.current);
    statusRef.current = 'playing';
    playerLaneRef.current = 1;
    itemsRef.current = [];
    scoreRef.current = 0;
    collectionRef.current = { ...INITIAL_COLLECTION };
    obstacleHitsRef.current = 0;
    hitUntilRef.current = 0;
    itemIdRef.current = 0;
    setStatus('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION / 1000);
    setCollection({ ...INITIAL_COLLECTION });
    setResult(null);
    setResultSaving(false);
    setResultSaveError('');

    if (!musicMuted) playBackgroundMusic(true);

    const startedAt = performance.now();
    let previousFrame = startedAt;
    let previousSecond = GAME_DURATION / 1000;
    let spawnAccumulator = 0;

    const runFrame = (now) => {
      if (statusRef.current !== 'playing') return;

      const elapsed = now - startedAt;
      const delta = Math.min(50, now - previousFrame);
      previousFrame = now;

      if (elapsed >= GAME_DURATION) {
        finishGame();
        return;
      }

      const secondsLeft = Math.ceil((GAME_DURATION - elapsed) / 1000);
      if (secondsLeft !== previousSecond) {
        previousSecond = secondsLeft;
        setTimeLeft(secondsLeft);
      }

      const difficulty = elapsed / GAME_DURATION;
      const spawnInterval = 650 - difficulty * 220;
      spawnAccumulator += delta;
      if (spawnAccumulator >= spawnInterval) {
        spawnAccumulator = 0;
        const obstacleChance = 0.3 + difficulty * 0.14;
        const obstacle = Math.random() < obstacleChance;
        const collectible = COLLECTIBLES[Math.floor(Math.random() * COLLECTIBLES.length)];
        itemsRef.current.push({
          id: itemIdRef.current,
          lane: Math.floor(Math.random() * 3),
          y: 88,
          kind: obstacle ? 'obstacle' : 'collectible',
          ...(obstacle ? {} : collectible),
        });
        itemIdRef.current += 1;
      }

      const speed = 0.195 + difficulty * 0.075;
      const activeItems = [];
      itemsRef.current.forEach((item) => {
        item.y += delta * speed;
        const collision = item.lane === playerLaneRef.current
          && item.y >= PLAYER_Y - 28
          && item.y <= PLAYER_Y + 34;

        if (collision) {
          if (item.kind === 'obstacle') {
            obstacleHitsRef.current += 1;
            hitUntilRef.current = now + 360;
          } else {
            collectionRef.current = {
              ...collectionRef.current,
              [item.id]: collectionRef.current[item.id] + 1,
            };
            setCollection(collectionRef.current);
          }
          scoreRef.current = calculateScore(collectionRef.current, obstacleHitsRef.current);
          setScore(scoreRef.current);
          return;
        }

        if (item.y < CANVAS_HEIGHT + 36) activeItems.push(item);
      });
      itemsRef.current = activeItems;

      const context = canvasRef.current?.getContext('2d');
      if (context) {
        drawScene(context, {
          elapsed,
          items: itemsRef.current,
          playerLane: playerLaneRef.current,
          isHit: now < hitUntilRef.current,
          status: 'playing',
        });
      }

      animationFrameRef.current = window.requestAnimationFrame(runFrame);
    };

    animationFrameRef.current = window.requestAnimationFrame(runFrame);
  }, [finishGame, musicMuted, playBackgroundMusic]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!musicMuted && !musicPlaybackBlocked && !audio.paused) {
      audio.pause();
      setMusicMuted(true);
      return;
    }

    setMusicMuted(false);
    playBackgroundMusic(false);
  };

  const handleCanvasPointer = (event) => {
    if (statusRef.current !== 'playing') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    movePlayer(pointerX < bounds.width / 2 ? -1 : 1);
  };

  return (
    <section className="youth-game-page" aria-labelledby="youth-game-title">
      <audio
        ref={audioRef}
        src={gameMusic}
        loop
        preload="auto"
        playsInline
        onError={() => setMusicPlaybackBlocked(true)}
      />

      <header className="youth-game-header">
        <button type="button" onClick={onBack} aria-label="Quay lại Dashboard">
          <ArrowLeft />
        </button>
        <div>
          <span>TRÒ CHƠI ĐẠI HỘI</span>
          <h1 id="youth-game-title">HÀNH TRÌNH TUỔI TRẺ</h1>
        </div>
        <img src={unionLogo} alt="Đoàn TNCS Hồ Chí Minh" />
      </header>

      <div className="youth-game-intro">
        <Gamepad2 aria-hidden="true" />
        <div>
          <h2>Vượt thử thách trong 60 giây</h2>
          <p>Thu thập biểu tượng tuổi trẻ và tránh những chướng ngại vật trên hành trình số.</p>
        </div>
      </div>

      <section className="youth-game-shell">
        <div className="youth-game-hud">
          <div><span>Thời gian</span><strong>{timeLeft}s</strong></div>
          <div><span>Điểm</span><strong>{score}</strong></div>
          <button
            className="youth-game-sound"
            type="button"
            onClick={toggleMusic}
            aria-label={musicMuted || musicPlaybackBlocked ? 'Bật nhạc nền' : 'Tắt nhạc nền'}
            aria-pressed={musicMuted}
          >
            {musicMuted || musicPlaybackBlocked
              ? <VolumeX aria-hidden="true" />
              : <Music2 aria-hidden="true" />}
          </button>
        </div>

        {musicPlaybackBlocked && (
          <p className="youth-game-audio-notice" role="status">
            Trình duyệt đang chặn nhạc. Chạm nút âm thanh để phát lại.
          </p>
        )}

        <div className="youth-game-timer" aria-hidden="true">
          <i style={{ width: `${(timeLeft / (GAME_DURATION / 1000)) * 100}%` }} />
        </div>

        <canvas
          ref={canvasRef}
          className="youth-game-canvas"
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onPointerDown={handleCanvasPointer}
          tabIndex={0}
          aria-label="Đường chạy Hành trình Tuổi trẻ. Chạm nửa trái hoặc nửa phải để di chuyển."
        />

        {status === 'playing' && (
          <div className="youth-game-controls" aria-label="Điều khiển nhân vật">
            <button type="button" onPointerDown={() => movePlayer(-1)} aria-label="Di chuyển sang trái">
              <ChevronLeft />
              <span>Trái</span>
            </button>
            <button type="button" onPointerDown={() => movePlayer(1)} aria-label="Di chuyển sang phải">
              <span>Phải</span>
              <ChevronRight />
            </button>
          </div>
        )}

        {status !== 'playing' && (
          <button className="youth-game-start" type="button" onClick={startGame}>
            {status === 'finished' ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />}
            <span>{status === 'finished' ? 'Chơi lại' : 'Bắt đầu hành trình'}</span>
          </button>
        )}
      </section>

      <section className="youth-game-symbols" aria-label="Biểu tượng cần thu thập">
        {COLLECTIBLES.map((item) => (
          <article key={item.id}>
            <span>{item.symbol}</span>
            <strong>{item.label}</strong>
            <small>{collection[item.id]}</small>
          </article>
        ))}
      </section>

      {result && (
        <section className="youth-game-result" aria-live="polite">
          <Trophy aria-hidden="true" />
          <span>Kết quả của đồng chí {delegateName}</span>
          <strong>{result.score} điểm</strong>
          <h2>{result.title}</h2>
          {resultSaving && <small className="saving">Đang lưu kết quả lên hệ thống...</small>}
          {!resultSaving && !resultSaveError && (
            <small className="saved">Đã lưu kết quả trên Supabase</small>
          )}
          {resultSaveError && <small className="save-error">{resultSaveError}</small>}
        </section>
      )}

      {result && (
        <section className="youth-game-leaderboard">
          <header>
            <Medal aria-hidden="true" />
            <h2>Bảng xếp hạng</h2>
          </header>
          <ol>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <li className={entry.id === result.entryId ? 'current' : ''} key={entry.id}>
                <span>{index + 1}</span>
                <div><strong>{entry.name}</strong><small>{entry.title}</small></div>
                <b>{entry.score}</b>
              </li>
            ))}
          </ol>
        </section>
      )}

      <DashboardFooter
        activeItem="activities"
        onNavigate={onNavigateFooter}
        onMenuAction={onMenuAction}
      />
    </section>
  );
}
