import { useState } from 'react'
import GamePage        from './pages/GamePage'
import AuthPage        from './pages/AuthPage'
import LeaderboardPage from './pages/LeaderboardPage'
import { useAuth }     from './hooks/useAuth'

export default function App() {
  const [page, setPage]         = useState('game')
  const { user, profile, saveScore } = useAuth()

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center">
      {page === 'game' && (
        <GamePage
          onNav={setPage}
          user={user}
          profile={profile}
          saveScore={saveScore}
        />
      )}
      {page === 'auth'        && <AuthPage        onNav={setPage} />}
      {page === 'leaderboard' && <LeaderboardPage onNav={setPage} user={user} profile={profile} />}
    </div>
  )
}