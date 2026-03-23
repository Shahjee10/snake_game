export default function LeaderboardPage({ onNav }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-retro text-neon-yellow text-xl">SCORES — STEP 6</h2>
      <button onClick={() => onNav('game')} className="font-retro text-xs text-neon/60 hover:text-neon">← BACK</button>
    </div>
  )
}