import { GRID_SIZE, DIR } from './constants'

export function createInitialState() {
  const head = { x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }
  return {
    snake:     [head, { x: head.x - 1, y: head.y }, { x: head.x - 2, y: head.y }],
    direction: DIR.RIGHT,
    nextDir:   DIR.RIGHT,
    food:      spawnFood([head]),
    score:     0,
    highScore: 0,
    status:    'idle',   // 'idle' | 'running' | 'paused' | 'dead'
    tick:      0,
  }
}

export function spawnFood(snake) {
  const occupied = new Set(snake.map(s => `${s.x},${s.y}`))
  let pos
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (occupied.has(`${pos.x},${pos.y}`))
  return pos
}

export function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}

export function step(state) {
  const { snake, nextDir, direction, food, score, highScore } = state
  const dir   = isOpposite(nextDir, direction) ? direction : nextDir
  const head  = snake[0]
  const next  = { x: head.x + dir.x, y: head.y + dir.y }

  // Wall collision
  if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
    return { ...state, status: 'dead' }
  }

  // Self collision (skip tail tip — it moves away)
  const body = snake.slice(0, -1)
  if (body.some(s => s.x === next.x && s.y === next.y)) {
    return { ...state, status: 'dead' }
  }

  const ateFood = next.x === food.x && next.y === food.y
  const newSnake = ateFood
    ? [next, ...snake]                    // grow
    : [next, ...snake.slice(0, -1)]       // move

  const newScore     = ateFood ? score + 10 : score
  const newHighScore = Math.max(newScore, highScore)
  const newFood      = ateFood ? spawnFood(newSnake) : food

  return {
    ...state,
    snake:     newSnake,
    direction: dir,
    food:      newFood,
    score:     newScore,
    highScore: newHighScore,
    status:    'running',
    tick:      state.tick + 1,
    ateFood,
  }
}