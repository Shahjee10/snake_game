import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export default function LeaderboardPage({ onNav, user, profile }) {
  const [scores,  setScores]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [tab,     setTab]     = useState('global')  // 'global' | 'mine'

  const fetchGlobal = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(20)

    if (error) setError(error.message)
    else setScores(data ?? [])
    setLoading(false)
  }, [])

  const fetchMine = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user.id)
      .order('score', { ascending: false })
      .limit(20)

    if (error) setError(error.message)
    else setScores(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    let t = setTimeout(() => {
      if (tab === 'global') fetchGlobal()
      else fetchMine()
    }, 0)
    return () => clearTimeout(t)
  }, [tab, fetchGlobal, fetchMine])

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{ minHeight: '100vh', justifyContent: 'center' }}
    >
      <div
        style={{
          width:      540,
          padding:    '24px',
          background: '#0D1117',
          border:     '2px solid #FFE600',
          boxShadow:  '0 0 24px #FFE60033',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div
              className="font-retro text-neon-yellow text-lg tracking-widest"
              style={{ textShadow: '0 0 12px #FFE600' }}
            >
              LEADERBOARD
            </div>
            <div className="font-mono text-neon/30 text-[9px] mt-1 tracking-widest">
              TOP PLAYERS WORLDWIDE
            </div>
          </div>
          <button
            onClick={() => onNav('game')}
            className="font-retro text-[9px] text-neon/30 hover:text-neon transition-colors tracking-widest"
          >
            ← BACK
          </button>
        </div>

        {/* Tabs */}
        <div className="flex w-full mb-5 border border-neon-yellow/20">
          {['global', 'mine'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              disabled={t === 'mine' && !user}
              className={`flex-1 font-retro text-[9px] py-3 tracking-widest transition-all
                disabled:opacity-20 disabled:cursor-not-allowed
                ${tab === t
                  ? 'bg-neon-yellow/10 text-neon-yellow border-b-2 border-neon-yellow'
                  : 'text-neon/30 hover:text-neon/60'}`}
            >
              {t === 'global' ? '🌐 GLOBAL' : '👤 MY SCORES'}
            </button>
          ))}
        </div>

        {/* Table header */}
        <div className="grid font-mono text-[9px] text-neon/30 tracking-widest mb-2 px-2"
          style={{ gridTemplateColumns: '40px 1fr 80px 60px 100px' }}
        >
          <span>#</span>
          <span>PLAYER</span>
          <span className="text-right">SCORE</span>
          <span className="text-right">LVL</span>
          <span className="text-right">DATE</span>
        </div>

        <div className="border-t border-neon/10 mb-2" />

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="font-retro text-[9px] text-neon/40 tracking-widest animate-pulse">
              LOADING...
            </div>
            <div className="flex gap-1">
              {[0,1,2,3].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-neon/40"
                  style={{ animation: `pulse 1s ease ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 font-mono text-[10px] text-neon-pink">
            ⚠ {error}
          </div>
        )}

        {!loading && !error && scores.length === 0 && (
          <div className="text-center py-12">
            <div className="font-retro text-[9px] text-neon/20 tracking-widest">NO SCORES YET</div>
            <div className="font-mono text-[9px] text-neon/10 mt-2">BE THE FIRST TO PLAY</div>
          </div>
        )}

        {/* Rows */}
        {!loading && !error && scores.map((row, i) => (
          <ScoreRow
            key={row.id}
            rank={i + 1}
            row={row}
            isMe={profile && row.username === profile.username}
          />
        ))}

        {/* Footer */}
        <div className="border-t border-neon/10 mt-4 pt-4 flex items-center justify-between">
          <span className="font-mono text-[9px] text-neon/20 tracking-widest">
            {scores.length} ENTRIES
          </span>
          <button
            onClick={() => tab === 'global' ? fetchGlobal() : fetchMine()}
            className="font-retro text-[9px] text-neon/30 hover:text-neon transition-colors tracking-widest"
          >
            ↺ REFRESH
          </button>
        </div>

        {/* Login nudge */}
        {!user && (
          <div className="mt-4 text-center border border-neon/10 py-3">
            <span className="font-mono text-[9px] text-neon/30">LOGIN TO SAVE YOUR SCORES → </span>
            <button
              onClick={() => onNav('auth')}
              className="font-retro text-[9px] text-neon hover:text-neon/60 transition-colors tracking-widest"
            >
              LOGIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreRow({ rank, row, isMe }) {
  const rankColor = rank === 1
    ? '#FFE600' : rank === 2
    ? '#C0C0C0' : rank === 3
    ? '#CD7F32' : '#39FF1444'

  const rankLabel = rank === 1 ? '🥇'
    : rank === 2 ? '🥈'
    : rank === 3 ? '🥉'
    : String(rank).padStart(2, '0')

  return (
    <div
      className="grid items-center px-2 py-2 mb-1 transition-all"
      style={{
        gridTemplateColumns: '40px 1fr 80px 60px 100px',
        background: isMe ? '#39FF1408' : 'transparent',
        border:     isMe ? '1px solid #39FF1422' : '1px solid transparent',
        animation:  `fadeIn 0.3s ease ${Math.min(rank * 0.05, 0.5)}s both`,
      }}
    >
      {/* Rank */}
      <span
        className="font-retro text-[10px]"
        style={{ color: rankColor, textShadow: rank <= 3 ? `0 0 8px ${rankColor}` : 'none' }}
      >
        {rankLabel}
      </span>

      {/* Username */}
      <span className={`font-mono text-xs tracking-wide truncate ${isMe ? 'text-neon' : 'text-neon/60'}`}>
        {isMe ? '▶ ' : ''}{row.username}
      </span>

      {/* Score */}
      <span
        className="font-retro text-[10px] text-right"
        style={{ color: isMe ? '#39FF14' : '#39FF1499' }}
      >
        {String(row.score).padStart(6, '0')}
      </span>

      {/* Level */}
      <span className="font-mono text-[9px] text-neon/40 text-right">
        LV.{String(row.level).padStart(2, '0')}
      </span>

      {/* Date */}
      <span className="font-mono text-[9px] text-neon/20 text-right">
        {new Date(row.created_at).toLocaleDateString('en-GB', {
          day: '2-digit', month: 'short', year: '2-digit'
        })}
      </span>
    </div>
  )
}