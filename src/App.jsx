import { useState } from 'react'
import GamePage        from './pages/GamePage'
import AuthPage        from './pages/AuthPage'
import LeaderboardPage from './pages/LeaderboardPage'
import { useAuth }     from './hooks/useAuth'

export default function App() {
  const [page, setPage] = useState('game')
  const auth = useAuth()   // ← ONE instance, passed to all pages

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center">
      {page === 'game' && (
        <GamePage
          onNav={setPage}
          user={auth.user}
          profile={auth.profile}
          saveScore={auth.saveScore}
          signOut={auth.signOut}
        />
      )}
      {page === 'auth' && (
        <AuthPage
          onNav={setPage}
          user={auth.user}
          profile={auth.profile}
          signIn={auth.signIn}
          signUp={auth.signUp}
          signOut={auth.signOut}
        />
      )}
      {page === 'leaderboard' && (
        <LeaderboardPage onNav={setPage} user={auth.user} profile={auth.profile} />
      )}
    </div>
  )
}