export default function ScoreBoard({ score, highScore, level }) {
  return (
    <div className="w-full flex justify-between items-center px-1 py-3 border-b border-neon/20 mb-3">
      <ScoreBlock label="SCORE" value={score} color="text-neon" />
      <div className="font-retro text-xs text-neon/30 tracking-widest">
        LV.{String(level).padStart(2, '0')}
      </div>
      <ScoreBlock label="BEST" value={highScore} color="text-neon-cyan" right />
    </div>
  )
}

function ScoreBlock({ label, value, color, right }) {
  return (
    <div className={`flex flex-col ${right ? 'items-end' : 'items-start'}`}>
      <span className="font-mono text-[9px] text-neon/40 tracking-widest">{label}</span>
      <span className={`font-retro text-sm ${color}`}>
        {String(value).padStart(6, '0')}
      </span>
    </div>
  )
}