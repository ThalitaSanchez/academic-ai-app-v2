'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import { courses, sharedSubjects, radiologyShared, assessmentThresholds } from '@/lib/courses'

export default function CourseDashboard() {
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const router = useRouter()
  const params = useParams()
  const courseId = params.course as string
  const course = courses[courseId]
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('progress_' + courseId)
        if (saved) setProgress(JSON.parse(saved))
      }
    }
    init()
  }, [courseId])

  if (!course) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Curso não encontrado</div>
  if (!user) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Carregando...</div>

  const allSubjects = [
    ...sharedSubjects,
    ...(courseId === 'radiologia' ? radiologyShared : []),
    ...course.specific,
  ]

  const totalProgress = Math.round(
    allSubjects.reduce((acc, s) => acc + (progress[s.id] || 0), 0) / allSubjects.length
  )

  const getAssessmentDone = (sid: string, t: number) => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('assessment_done_' + courseId + '_' + sid + '_' + t)
  }

  const pendingAssessments = allSubjects.filter(s => {
    const p = progress[s.id] || 0
    return assessmentThresholds.some(t => p >= t && !getAssessmentDone(s.id, t))
  })

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#f9fafb'}}>
      <aside style={{width:'220px',background:'white',borderRight:'1px solid #f3f4f6',padding:'1rem',position:'fixed',height:'100%',overflowY:'auto'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'1.5rem'}}>
          <span style={{fontSize:'1.5rem'}}>{course.icon}</span>
          <spa