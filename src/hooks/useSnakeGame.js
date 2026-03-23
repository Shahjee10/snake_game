import { useState, useCallback, useEffect, useRef } from 'react'
import { createInitialState, step }    from '../game/engine'
import { DIR }                          from '../game/constants'
import { useGameLoop }                  from './useGameLoop'
import { Sounds }                       from '../game/sounds'
import { isMuted }                      from '../game/settings'

const KEY_MAP = {
  ArrowUp: DIR.UP, w: DIR.UP, W: DIR.UP,
  ArrowDown: DIR.DOWN, s: DIR.DOWN, S: DIR.DOWN,
  ArrowLeft: DIR.LEFT, a: DIR.LEFT, A: DIR.LEFT,
  ArrowRight: DIR.RIGHT, d: DIR.RIGHT, D: DIR.RIGHT,
}

const sound = (fn) => { if (!isMuted()) fn() }

export function useSnakeGame(onEat, onDie) {
  const [gameState, setGameState] = useState(() => createInitialState())
  const stateRef   = useRef(gameState)

  useEffect(() => {
    stateRef.current = gameState
  }, [gameState])

  const tick = useCallback(() => {
    const next = step(stateRef.current)

    if (next.ateFood) {
      sound(Sounds.eat)
      onEat?.()
      if (next.score % 50 === 0 && next.score > 0) sound(Sounds.levelUp)
    }

    if (next.status === 'dead') {
      sound(Sounds.die)
      // Pass final score + level directly from next state (not stale closure)
      onDie?.(next.score, Math.floor(next.score / 50) + 1)
    }

    setGameState(next)
  }, [onEat, onDie])

  useGameLoop(tick, gameState.status, gameState.score)

  useEffect(() => {
    const handler = (e) => {
      const dir = KEY_MAP[e.key]
      if (dir) {
        e.preventDefault()
        setGameState(s => ({ ...s, nextDir: dir }))
      }
      if (e.key === ' ') {
        e.preventDefault()
        setGameState(s => {
          if (s.status === 'running') { sound(Sounds.pause); return { ...s, status: 'paused' } }
          if (s.status === 'paused')  { sound(Sounds.pause); return { ...s, status: 'running' } }
          return s
        })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const start = useCallback(() => {
    sound(Sounds.start)
    setGameState(s => ({
      ...createInitialState(),
      highScore: s.highScore,
      status: 'running',
    }))
  }, [])

  const pause = useCallback(() => {
    sound(Sounds.pause)
    setGameState(s => ({
      ...s,
      status: s.status === 'running' ? 'paused' : 'running',
    }))
  }, [])

  return { gameState, start, pause }
}