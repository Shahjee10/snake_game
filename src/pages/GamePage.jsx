import { useCallback, useState, useEffect } from 'react'
import GameCanvas    from '../components/GameCanvas'
import GameOverlay   from '../components/GameOverlay'
import ScoreBoard    from '../components/ScoreBoard'
import MuteButton    from '../components/MuteButton'
import { useSnakeGame } from '../hooks/useSnakeGame'
import { CANVAS_SIZE }  from '../game/constants'

export default function GamePage({ onNav, user, profile, saveScore }) {
  const [flash, setFlash]             = useState(false)
  const [levelBanner, setLevelBanner] = useState(null)
  const [saving, setSaving]           = useState(false)

  const handleEat = useCallback(() => {
    setFlash(true)
    setTimeout(() => setFlash(false), 80)
  }, [])

  // Receives final score + level directly from engine (no stale state)
  const handleDie = useCallback(async (finalScore, finalLevel) => {
    if (user && saveScore && finalScore > 0) {
      setSaving(true)
      await saveScore(finalScore, finalLevel)
      setSaving(false)
    }
  }, [user, saveScore])

  const { gameState, start, pause } = useSnakeGame(handleEat, handleDie)

  const level = Math.floor(gameState.score / 50) + 1

  // Level-up banner
  useEffect(() => {
    if (level > 1) {
      let t2;
      const t1 = setTimeout(() => {
        setLevelBanner(`LEVEL ${level}`)
        t2 = setTimeout(() => setLevelBanner(null), 1200)
      }, 0)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [level])

  return (
    <div className="flex flex-col items-center select-none" style={{ minHeight: '100vh', justifyContent: 'center' }}>

      {/* Nav bar */}
      <div className="flex gap-6 mb-4 items-center">
        <NavBtn color="neon-cyan"   onClick={() => onNav('leaderboard')} label="⟁ SCORES" />
        <NavBtn
          color="neon-yellow"
          onClick={() => onNav('auth')}
          label={profile ? `⟁ ${profile.username.toUpperCase()}` : '⟁ LOGIN'}
        />
        <MuteButton />
      </div>

      {/* Game container */}
      <div
        className="relative"
        style={{
          width:   CANVAS_SIZE + 32,
          padding: '16px',
          background: '#0D1117',
          border:  '2px solid #39FF14',
          boxShadow: flash
            ? '0 0 60px #39FF14, 0 0 120px #39FF1444'
            : '0 0 16px #39FF1444',
          transition: 'box-shadow 0.08s',
        }}
      >
        <ScoreBoard
          score={gameState.score}
          highScore={gameState.highScore}
          status={gameState.status}
          level={level}
        />

        {/* Canvas + overlay */}
        <div className="relative" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          <GameCanvas gameState={gameState} />
          <GameOverlay
            status={gameState.status}
            score={gameState.score}
            highScore={gameState.highScore}
            onStart={start}
            onPause={pause}
          />

          {/* Level-up banner */}
          {levelBanner && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
              <div
                className="font-retro text-neon-yellow text-lg px-6 py-3 tracking-widest"
                style={{
                  background: '#060810cc',
                  border:     '1px solid #FFE600',
                  boxShadow:  '0 0 24px #FFE60066',
                  animation:  'fadeInOut 1.2s ease forwards',
                }}
              >
                {levelBanner}
              </div>
            </div>
          )}

          {/* Saving indicator */}
          {saving && (
            <div className="absolute bottom-2 right-2 font-mono text-[9px] text-neon/40 animate-pulse">
              SAVING...
            </div>
          )}
        </div>

        {/* Controls hint */}
        <div className="flex justify-center gap-6 mt-3 pt-3 border-t border-neon/10">
          <Hint keys="WASD / ↑↓←→" label="MOVE" />
          <Hint keys="SPACE"        label="PAUSE" />
        </div>
      </div>
    </div>
  )
}

function NavBtn({ color, onClick, label }) {
  const cls = {
    'neon-cyan':   'border-neon-cyan   text-neon-cyan   hover:bg-neon-cyan/10',
    'neon-yellow': 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10',
  }[color]
  return (
    <button onClick={onClick} className={`font-retro text-[9px] px-3 py-2 border ${cls} transition-colors tracking-widest`}>
      {label}
    </button>
  )
}

function Hint({ keys, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] px-2 py-0.5 border border-neon/20 text-neon/40">{keys}</span>
      <span className="font-mono text-[9px] text-neon/20">{label}</span>
    </div>
  )
}