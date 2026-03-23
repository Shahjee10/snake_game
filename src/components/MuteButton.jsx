import { useState } from 'react'
import { isMuted, setMuted as saveMuted } from '../game/settings'

export default function MuteButton() {
  const [muted, setLocalMuted] = useState(() => isMuted())

  const handleToggle = () => {
    const next = !muted
    setLocalMuted(next)
    saveMuted(next)
  }

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Unmute' : 'Mute'}
      className="font-retro text-[9px] px-2 py-1 border border-neon/20 text-neon/40 hover:text-neon hover:border-neon/60 transition-all tracking-widest"
    >
      {muted ? '🔇 OFF' : '🔊 ON'}
    </button>
  )
}