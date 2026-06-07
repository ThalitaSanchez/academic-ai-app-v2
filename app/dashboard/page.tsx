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

  if (!user) return <div>Carregando...</div>

  return (
    <div style={{minHeight:'100vh',background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'24px',padding:'2rem',width:'100%',maxWidth:'600px'}}>
        <h1 style={{textAlign:'center',color:'#4f46e5',marginBottom:'8px'}}>AcademicAI</h1>
        <p style={{textAlign:'center',color:'#9ca3af',marginBottom:'2rem'}}>Qual o seu curso?</p>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem'}}>
          {Object.entries(courses).map(([id, c]) => (
            <button key={id} onClick={() => router.push('/dashboard/' + id)}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'8px',background:'#eef2ff',border:'1px solid #e0e7ff',borderRadius:'16px',padding:'1.5rem',cursor:'pointer'}}>
              <span style={{fontSize:'2rem'}}>{c.icon}</span>
              <span style={{fontSize:'14px',fontWeight:'500',color:'#4f46e5',textAlign:'center'}}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}