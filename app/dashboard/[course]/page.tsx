'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { courses, sharedSubjects, radiologyShared } from '@/lib/courses'

export default function CourseDashboard() {
  const [email, setEmail] = useState('')
  const [progress, setProgress] = useState<Record<string, number>>({})
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const params = useParams()
  const courseId = params.course as string
  const course = courses[courseId]
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.push('/login'); return }
      setEmail(data.session.user.email || '')
      const saved = localStorage.getItem('progress_' + courseId)
      if (saved) setProgress(JSON.parse(saved))
      setReady(true)
    })
  }, [courseId])

  if (!course || !ready) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Carregando...</div>

  const allSubjects = [...sharedSubjects, ...(courseId === 'radiologia' ? radiologyShared : []), ...course.specific]
  const totalProgress = Math.round(allSubjects.reduce((acc, s) => acc + (progress[s.id] || 0), 0) / allSubjects.length)
  const thresholds = [30, 60, 100]
  const isDone = (sid: string, t: number) => !!localStorage.getItem('assessment_done_' + courseId + '_' + sid + '_' + t)
  const pending = allSubjects.filter(s => thresholds.some(t => (progress[s.id] || 0) >= t && !isDone(s.id, t)))

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f9fafb'}}>
      <aside style={{width:'220px',background:'white',borderRight:'1px solid #f3f4f6',padding:'1rem',position:'fixed',height:'100%',overflowY:'auto',zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'1.5rem'}}>
          <span style={{fontSize:'1.5rem'}}>{course.icon}</span>
          <span style={{fontWeight:'600',color:'#4f46e5',fontSize:'14px'}}>{course.name}</span>
        </div>
        <div style={{background:'#eef2ff',borderRadius:'12px',padding:'12px',marginBottom:'1rem'}}>
          <p style={{fontSize:'12px',color:'#818cf8',marginBottom:'4px'}}>Progresso geral</p>
          <p style={{fontSize:'24px',fontWeight:'600',color:'#4f46e5'}}>{totalProgress}%</p>
          <div style={{background:'#c7d2fe',borderRadius:'99px',height:'6px',marginTop:'8px'}}>
            <div style={{background:'#4f46e5',height:'6px',borderRadius:'99px',width:totalProgress+'%'}} />
          </div>
        </div>
        <p style={{fontSize:'11px',color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',margin:'1rem 0 0.5rem'}}>Base comum</p>
        {sharedSubjects.map(s => (
          <button key={s.id} onClick={() => router.push('/study/'+courseId+'/'+s.id)}
            style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',fontSize:'13px',color:'#4b5563',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left',marginBottom:'2px'}}>
            {s.icon} {s.name}
          </button>
        ))}
        {courseId === 'radiologia' && radiologyShared.map(s => (
          <button key={s.id} onClick={() => router.push('/study/'+courseId+'/'+s.id)}
            style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',fontSize:'13px',color:'#4b5563',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left',marginBottom:'2px'}}>
            {s.icon} {s.name}
          </button>
        ))}
        <p style={{fontSize:'11px',color:'#9ca3af',textTransform:'uppercase',letterSpacing:'0.05em',margin:'1rem 0 0.5rem'}}>Específicas</p>
        {course.specific.map(s => (
          <button key={s.id} onClick={() => router.push('/study/'+courseId+'/'+s.id)}
            style={{display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',fontSize:'13px',color:'#4b5563',background:'none',border:'none',cursor:'pointer',width:'100%',textAlign:'left',marginBottom:'2px'}}>
            {s.icon} {s.name}
          </button>
        ))}
        <div style={{marginTop:'2rem',paddingTop:'1rem',borderTop:'1px solid #f3f4f6'}}>
          <p style={{fontSize:'12px',color:'#9ca3af',marginBottom:'8px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{email}</p>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            style={{fontSize:'12px',color:'#ef4444',background:'none',border:'none',cursor:'pointer'}}>Sair</button>
        </div>
      </aside>
      <main style={{marginLeft:'220px',flex:1,padding:'1.5rem'}}>
        <h1 style={{fontSize:'20px',fontWeight:'600',color:'#1f2937',marginBottom:'4px'}}>Bem-vinda, {email.split('@')[0]}! 👋</h1>
        <p style={{color:'#9ca3af',fontSize:'14px',marginBottom:'1.5rem'}}>O que você quer estudar hoje?</p>
        {pending.length > 0 && (
          <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:'12px',padding:'1rem',marginBottom:'1.5rem'}}>
            <p style={{fontWeight:'600',color:'#b45309',marginBottom:'0.5rem'}}>📝 Avaliações disponíveis!</p>
            <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>
              {pending.map(s => {
                const t = thresholds.find(t => (progress[s.id]||0) >= t && !isDone(s.id, t))
                return <button key={s.id} onClick={() => router.push('/assessment/'+courseId+'/'+s.id+'/'+t)}
                  style={{background:'#fef3c7',color:'#b45309',padding:'6px 12px',borderRadius:'8px',fontSize:'13px',border:'none',cursor:'pointer'}}>
                  {s.icon} {s.name} — {t}%
                </button>
              })}
            </div>
          </div>
        )}
        <p style={{fontSize:'14px',fontWeight:'500',color:'#6b7280',marginBottom:'12px'}}>Progresso por disciplina</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'1rem',marginBottom:'1.5rem'}}>
          {allSubjects.map(s => {
            const p = progress[s.id] || 0
            const hasAssessment = thresholds.some(t => p >= t && !isDone(s.id, t))
            return (
              <button key={s.id} onClick={() => router.push('/study/'+courseId+'/'+s.id)}
                style={{background:'white',border:'1px solid #f3f4f6',borderRadius:'16px',padding:'1rem',textAlign:'left',cursor:'pointer',width:'100%'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'12px'}}>
                  <span style={{fontSize:'24px'}}>{s.icon}</span>
                  <span style={{fontSize:'12px',color:'#4f46e5',fontWeight:'500'}}>{p}%</span>
                </div>
                <p style={{fontSize:'14px',fontWeight:'500',color:'#374151',marginBottom:'8px'}}>{s.name}</p>
                <div style={{background:'#f3f4f6',borderRadius:'99px',height:'4px'}}>
                  <div style={{background:'#4f46e5',height:'4px',borderRadius:'99px',width:p+'%'}} />
                </div>
                {hasAssessment && <p style={{fontSize:'12px',color:'#f59e0b',marginTop:'8px'}}>📝 Avaliação disponível</p>}
              </button>
            )
          })}
        </div>
        <button onClick={() => router.push('/chat/'+courseId)}
          style={{width:'100%',background:'#4f46e5',color:'white',borderRadius:'12px',padding:'1rem',fontWeight:'600',border:'none',cursor:'pointer',fontSize:'16px'}}>
          🤖 Tirar dúvidas com a IA
        </button>
      </main>
    </div>
  )
}