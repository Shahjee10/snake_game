import { useState } from 'react'
import { useAuth }  from '../hooks/useAuth'

export default function AuthPage({ onNav }) {
  const [mode, setMode]       = useState('login')   // 'login' | 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const { signIn, signUp, user, profile, signOut } = useAuth()

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else { setSuccess('Welcome back!'); setTimeout(() => onNav('game'), 1000) }
    } else {
      if (username.length < 3) { setError('Username must be 3+ characters'); setLoading(false); return }
      if (password.length < 6) { setError('Password must be 6+ characters'); setLoading(false); return }
      const { error } = await signUp(email, password, username)
      if (error) setError(error.message)
      else { setSuccess('Account created! You can now play.'); setTimeout(() => onNav('game'), 1200) }
    }

    setLoading(false)
  }

  // ── Already logged in view ─────────────────────────────────
  if (user && profile) {
    return (
      <PageShell onNav={onNav}>
        <div className="flex flex-col items-center gap-6">
          <div className="font-mono text-neon/50 text-xs tracking-widest">LOGGED IN AS</div>
          <div className="font-retro text-neon text-lg" style={{ textShadow: '0 0 12px #39FF14' }}>
            {profile.username}
          </div>
          <div className="font-mono text-neon/30 text-xs">{user.email}</div>
          <button
            onClick={signOut}
            className="mt-4 font-retro text-[9px] px-6 py-3 border-2 border-neon-pink text-neon-pink hover:bg-neon-pink/10 transition-all tracking-widest"
            style={{ boxShadow: '0 0 10px #FF2D7844' }}
          >
            SIGN OUT
          </button>
        </div>
      </PageShell>
    )
  }

  // ── Auth form ──────────────────────────────────────────────
  return (
    <PageShell onNav={onNav}>
      {/* Tab toggle */}
      <div className="flex w-full mb-6 border border-neon/20">
        {['login', 'signup'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setError(null); setSuccess(null) }}
            className={`flex-1 font-retro text-[9px] py-3 tracking-widest transition-all
              ${mode === m
                ? 'bg-neon/10 text-neon border-b-2 border-neon'
                : 'text-neon/30 hover:text-neon/60'}`}
          >
            {m === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {mode === 'signup' && (
          <Field
            label="USERNAME"
            value={username}
            onChange={setUsername}
            placeholder="player_one"
            maxLength={20}
          />
        )}
        <Field
          label="EMAIL"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />
        <Field
          label="PASSWORD"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />
      </div>

      {/* Error / success */}
      {error   && <div className="font-mono text-[10px] text-neon-pink mt-4 text-center">{error}</div>}
      {success && <div className="font-mono text-[10px] text-neon mt-4 text-center animate-pulse">{success}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full font-retro text-[10px] py-4 border-2 border-neon text-neon
          hover:bg-neon hover:text-dark-900 transition-all tracking-widest
          disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 12px #39FF1444' }}
      >
        {loading ? 'LOADING...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
      </button>
    </PageShell>
  )
}

// ── Sub-components ─────────────────────────────────────────────

function PageShell({ children, onNav }) {
  return (
    <div className="flex flex-col items-center" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      <div
        className="flex flex-col items-center w-full"
        style={{
          width: 380,
          padding: 32,
          background: '#0D1117',
          border: '2px solid #39FF14',
          boxShadow: '0 0 24px #39FF1433',
        }}
      >
        <div className="font-retro text-neon text-xl mb-1 tracking-widest animate-flicker">SNAKE</div>
        <div className="font-mono text-neon/30 text-[9px] mb-8 tracking-widest">PLAYER IDENTITY</div>

        {children}

        <button
          onClick={() => onNav('game')}
          className="mt-6 font-retro text-[9px] text-neon/30 hover:text-neon transition-colors tracking-widest"
        >
          ← BACK TO GAME
        </button>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, maxLength }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[9px] text-neon/50 tracking-widest">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={e => e.key === 'Enter' && e.target.blur()}
        className="bg-dark-800 border border-neon/20 text-neon font-mono text-xs px-3 py-3
          placeholder-neon/20 outline-none focus:border-neon/60 focus:shadow-neon
          transition-all tracking-wide"
      />
    </div>
  )
}