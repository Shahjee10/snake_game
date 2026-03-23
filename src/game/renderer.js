import { CELL_SIZE, GRID_SIZE, COLORS } from './constants'

export function drawFrame(ctx, state) {
  const { snake, food } = state
  const S = CELL_SIZE

  // ── Background ─────────────────────────────────────────────
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, GRID_SIZE * S, GRID_SIZE * S)

  // ── Grid dots ──────────────────────────────────────────────
  ctx.fillStyle = COLORS.grid
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      ctx.fillRect(x * S + S / 2 - 1, y * S + S / 2 - 1, 2, 2)
    }
  }

  // ── Food ───────────────────────────────────────────────────
  const fx = food.x * S + S / 2
  const fy = food.y * S + S / 2
  const pulse = 0.5 + 0.5 * Math.sin(Date.now() / 200)
  const radius = (S / 2 - 3) + pulse * 2

  ctx.shadowColor = COLORS.foodGlow
  ctx.shadowBlur  = 18 + pulse * 8
  ctx.beginPath()
  ctx.arc(fx, fy, radius, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.food
  ctx.fill()

  // Inner highlight
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.arc(fx - 2, fy - 2, radius * 0.35, 0, Math.PI * 2)
  ctx.fillStyle = COLORS.foodInner
  ctx.fill()

  // ── Snake ──────────────────────────────────────────────────
  snake.forEach((seg, i) => {
    const isHead   = i === 0
    const progress = i / snake.length
    const x = seg.x * S + 2
    const y = seg.y * S + 2
    const w = S - 4
    const h = S - 4
    const r = isHead ? 6 : 4

    // Glow on head
    if (isHead) {
      ctx.shadowColor = COLORS.snakeGlow
      ctx.shadowBlur  = 20
    } else {
      ctx.shadowBlur = 0
    }

    // Body fade from bright to dim
    const alpha = isHead ? 1 : 0.9 - progress * 0.4
    ctx.fillStyle = isHead
      ? COLORS.snakeHead
      : `rgba(43, 200, 16, ${alpha})`

    roundRect(ctx, x, y, w, h, r)
    ctx.fill()

    // Head eyes
    if (isHead) {
      ctx.shadowBlur = 0
      ctx.fillStyle  = COLORS.bg
      drawEyes(ctx, seg, state.direction, S)
    }
  })

  ctx.shadowBlur = 0
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function drawEyes(ctx, head, dir, S) {
  const cx = head.x * S + S / 2
  const cy = head.y * S + S / 2
  const eyeR = 2.5
  const dist = 5

  // Offset eyes based on direction
  const offsets = {
    '0,-1': [[-dist, -dist/2], [dist, -dist/2]],   // UP
    '0,1':  [[-dist,  dist/2], [dist,  dist/2]],   // DOWN
    '-1,0': [[-dist/2, -dist], [-dist/2, dist]],   // LEFT
    '1,0':  [[ dist/2, -dist], [ dist/2, dist]],   // RIGHT
  }

  const key = `${dir.x},${dir.y}`
  const eyes = offsets[key] || offsets['1,0']

  eyes.forEach(([ox, oy]) => {
    ctx.beginPath()
    ctx.arc(cx + ox, cy + oy, eyeR, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.bg
    ctx.fill()
  })
}