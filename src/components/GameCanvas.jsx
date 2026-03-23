import { useEffect, useRef } from 'react'
import { drawFrame }          from '../game/renderer'
import { CANVAS_SIZE }        from '../game/constants'

export default function GameCanvas({ gameState }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) drawFrame(ctx, gameState)
  }, [gameState])

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}