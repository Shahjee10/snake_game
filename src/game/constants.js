export const GRID_SIZE    = 20      // cells per row/col
export const CELL_SIZE    = 28      // px per cell
export const CANVAS_SIZE  = GRID_SIZE * CELL_SIZE  // 560px
export const INITIAL_SPEED = 150   // ms per tick
export const SPEED_INCREMENT = 3   // ms faster per food eaten

export const DIR = {
  UP:    { x: 0,  y: -1 },
  DOWN:  { x: 0,  y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x: 1,  y:  0 },
}

export const COLORS = {
  bg:           '#060810',
  grid:         '#0D1117',
  snakeHead:    '#39FF14',
  snakeBody:    '#2BC810',
  snakeGlow:    '#39FF1488',
  food:         '#FF2D78',
  foodGlow:     '#FF2D7888',
  foodInner:    '#FF6BA8',
  scoreText:    '#00FFFF',
  border:       '#39FF14',
}