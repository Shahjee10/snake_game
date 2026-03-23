import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile row for a given user id
  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data ?? null)
  }, [])

  // On mount — restore session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ── Sign Up ────────────────────────────────────────────────
  const signUp = useCallback(async (email, password, username) => {
    // Check username taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) return { error: { message: 'Username already taken' } }

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    // Create profile row
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, username })

    if (profileError) return { error: profileError }
    return { data }
  }, [])

  // ── Sign In ────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  // ── Sign Out ───────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  // ── Save Score ─────────────────────────────────────────────
  const saveScore = useCallback(async (score, level) => {
    if (!user || !profile) return { error: { message: 'Not logged in' } }
    const { error } = await supabase
      .from('scores')
      .insert({ user_id: user.id, username: profile.username, score, level })
    return { error }
  }, [user, profile])

  return { user, profile, loading, signUp, signIn, signOut, saveScore }
}