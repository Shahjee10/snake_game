import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) console.error("fetchProfile error [RLS issue?]:", error)

    // Fetch absolute best score mathematically from the server
    const { data: scoreData } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (profileData) {
      profileData.best_score = scoreData?.score || 0
      setProfile(profileData)
    } else {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null) }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const signUp = useCallback(async (email, password, username) => {
  // Check username taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) return { error: { message: 'Username already taken' } }

  // Sign up — trigger creates profile row automatically server-side
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }  // trigger reads this from raw_user_meta_data
    }
  })

  if (error) return { error }

  // Wait briefly for trigger to fire, then fetch profile
  await new Promise(r => setTimeout(r, 500))
  setUser(data.user)
  localStorage.removeItem('snakeHighScore')
  await fetchProfile(data.user.id)

  return { data }
}, [fetchProfile])

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error && data.user) {
      localStorage.removeItem('snakeHighScore')
      await fetchProfile(data.user.id)
    }
    return { data, error }
  }, [fetchProfile])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    localStorage.removeItem('snakeHighScore')
  }, [])

  const saveScore = useCallback(async (score, level) => {
    if (!user || !profile) return { error: { message: 'Not logged in' } }
    const { error } = await supabase
      .from('scores')
      .insert({ user_id: user.id, username: profile.username, score, level })
    if (error) console.error("saveScore error [RLS issue?]:", error)
    else {
      if (score > (profile.best_score || 0)) {
        setProfile(p => ({ ...p, best_score: score }))
      }
    }
    return { error }
  }, [user, profile])

  return { user, profile, loading, signUp, signIn, signOut, saveScore }
}