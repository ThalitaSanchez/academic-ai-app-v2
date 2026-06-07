'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { courses } from '@/lib/courses'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else setUser(user)
    }
    getUser()
  }, [])

  if (!user) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Carregando...</div>

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #eff6ff, #eef2ff)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'1.5rem',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',padding:'2rem',width:'100%',maxWidth:'40rem'}}>
        <h1 style={{fontSize:'1.5rem',fontWeight:'700',textAlign:'center',color:'#4f46e5',marginBottom:'0.5rem'}}>🎓 AcademicAI</h1>
        <p style={{textAlign:'center',color