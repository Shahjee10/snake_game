import { useRef, useEffect } from 'react'
import { INITIAL_SPEED, SPEED_INCREMENT } from '../game/constants'

export function useGameLoop(onTick, status, score) {
  const rafRef       = useRef(null)
  const lastTickRef  = useRef(0)
  const speedRef     = useRef(INITIAL_SPEED)

  // Speed increases every 50 points
  useEffect(() => {
    const level = Math.floor(score / 50)
    speedRef.current = Math.max(60, INITIAL_SPEED - level * SPEED_INCREMENT * 5)
  }, [score])

  useEffect(() => {
    if (status !== 'running') return

    let nextFrame
    const loop = (timestamp) => {
      if (timestamp - lastTickRef.current >= speedRef.current) {
        lastTickRef.current = timestamp
        onTick()
      }
      nextFrame = requestAnimationFrame(loop)
      rafRef.current = nextFrame
    }
    
    nextFrame = requestAnimationFrame(loop)
    rafRef.current = nextFrame

    return () => cancelAnimationFrame(nextFrame)
  }, [status, onTick])
}