export default function GameOverlay({ status, score, highScore, onStart, onPause }) {
  if (status === 'running') return null

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/85 backdrop-blur-sm z-10">
      {status === 'idle' && (
        <>
          <div className="font-retro text-neon text-3xl animate-flicker mb-2 tracking-widest">SNAKE</div>
          <div className="font-mono text-neon/50 text-xs mb-8 tracking-widest">INSERT COIN</div>
          <Kbd>WASD / ARROWS</Kbd>
          <span className="font-mono text-neon/40 text-xs my-2">TO MOVE</span>
          <Kbd>SPACE</Kbd>
          <span className="font-mono text-neon/40 text-xs my-2">TO PAUSE</span>
          <button onClick={onStart} className="mt-8 font-retro text-xs px-8 py-3 border-2 border-neon text-neon hover:bg-neon hover:text-dark-900 transition-all shadow-neon animate-pulse-fast">
            PRESS START
          </button>
        </>
      )}

      {status === 'dead' && (
        <>
          <div className="font-retro text-neon-pink text-2xl mb-1 tracking-widest" style={{ textShadow: '0 0 12px #FF2D78' }}>GAME OVER</div>
          <div className="font-mono text-neon/60 text-sm mt-4">SCORE</div>
          <div className="font-retro text-neon text-3xl my-1">{String(score).padStart(6, '0')}</div>
          <div className="font-mono text-neon/40 text-xs mt-3">BEST: {String(highScore).padStart(6, '0')}</div>
          <button onClick={onStart} className="mt-8 font-retro text-xs px-8 py-3 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-dark-900 transition-all" style={{ boxShadow: '0 0 12px #FF2D7866' }}>
            TRY AGAIN
          </button>
        </>
      )}

      {status === 'paused' && (
        <>
          <div className="font-retro text-neon-cyan text-2xl mb-6 tracking-widest" style={{ textShadow: '0 0 12px #00FFFF' }}>PAUSED</div>
          <button onClick={onPause} className="font-retro text-xs px-8 py-3 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all">
            RESUME
          </button>
        </>
      )}
    </div>
  )
}

function Kbd({ children }) {
  return (
    <span className="font-mono text-xs px-3 py-1 border border-neon/40 text-neon/70 bg-dark-700 rounded">
      {children}
    </span>
  )
}