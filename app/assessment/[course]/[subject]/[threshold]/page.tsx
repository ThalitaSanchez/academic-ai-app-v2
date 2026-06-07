'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courses, sharedSubjects, radiologyShared } from '@/lib/courses'

export default function AssessmentPage() {
  const [questions, setQuestions] = useState<any[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [openAnswer, setOpenAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [score, setScore] = useState(0)
  const params = useParams()
  const router = useRouter()
  const courseId = params.course as string
  const subjectId = params.subject as string
  const threshold = params.threshold as string
  const course = courses[courseId]
  const allSubjects = [...sharedSubjects, ...(courseId === 'radiologia' ? radiologyShared : []), ...(course?.specific || [])]
  const subject = allSubjects.find(s => s.id === subjectId)

  useEffect(() => { generateQuestions() }, [])

  const generateQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course: course?.name, subject: subject?.name, threshold }),
      })
      const data = await res.json()
      setQuestions(data.questions)
    } catch { setQuestions([]) }
    setLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/assessment/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions, answers, openAnswer, course: course?.name, subject: subject?.name }),
      })
      const data = await res.json()
      setScore(data.score)
      setFeedback(data.feedback)
      setSubmitted(true)
      localStorage.setItem('assessment_done_' + courseId + '_' + subjectId + '_' + threshold, 'true')
    } catch { setFeedback('Erro ao corrigir. Tente novamente.') }
    setLoading(false)
  }

  if (loading) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f9fafb'}}>
      <div style={{textAlign:'center'}}>
        <p style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🤖</p>
        <p style={{color:'#6b7280'}}>Gerando sua avaliação...</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{minHeight:'100vh',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'white',borderRadius:'1rem',padding:'2rem',maxWidth:'32rem',width:'100%',textAlign:'center',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'}}>
        <p style={{fontSize:'3rem',marginBottom:'1rem'}}>{score >= 7 ? '🎉' : '📚'}</p>
        <h2 style={{fontSize:'1.5rem',fontWeight:'700',color:'#1f2937',marginBottom:'0.5rem'}}>Nota: {score}/10</h2>
        <p style={{color:'#6b7280',marginBottom:'1.5rem'}}>{score >= 7 ? 'Parabéns! Você foi muito bem!' : 'Continue estudando, você vai melhorar!'}</p>
        <div style={{background:'#f9fafb',borderRadius:'0.75rem',padding:'1rem',textAlign:'left',fontSize:'0.875rem',color:'#4b5563',marginBottom:'1.5rem',lineHeight:'1.6'}}>
          {feedback}
        </div>
        <button onClick={() => router.push('/dashboard/' + courseId)}
          style={{width:'100%',background:'#4f46e5',color:'white',borderRadius:'0.75rem',padding:'0.75rem',fontWeight:'600',border:'none',cursor:'pointer'}}>
          Voltar ao dashboard
        </button>
      </div>
    </div>
  )

  const allAnswered = Object.keys(answers).length >= questions.length && openAnswer.trim().length > 0

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'white',borderBottom:'1px solid #f3f4f6',padding:'1rem 1.5rem',display:'flex',alignItems:'center',gap:'1rem'}}>
        <button onClick={() => router.back()} style={{color:'#9ca3af',background:'none',border:'none',cursor:'pointer'}}>← Voltar</button>
        <h1 style={{fontWeight:'600',color:'#4f46e5'}}>📝 Avaliação {threshold}% — {subject?.name}</h1>
      </nav>
      <main style={{maxWidth:'42rem',margin:'0 auto',padding:'1.5rem'}}>
        <p style={{fontSize:'0.875rem',color:'#9ca3af',marginBottom:'1.5rem'}}>Responda todas as questões e clique em enviar.</p>
        {questions.map((q, i) => (
          <div key={i} style={{background:'white',border:'1px solid #f3f4f6',borderRadius:'1rem',padding:'1.5rem',marginBottom:'1rem'}}>
            <p style={{fontWeight:'500',color:'#1f2937',marginBottom:'1rem'}}>{i + 1}. {q.question}</p>
            <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
              {q.options.map((opt: string, j: number) => (
                <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                  style={{textAlign:'left',padding:'0.75rem 1rem',borderRadius:'0.75rem',fontSize:'0.875rem',border: answers[i] === opt ? '2px solid #6366f1' : '1px solid #f3f4f6',background: answers[i] === opt ? '#eef2ff' : 'white',color: answers[i] === opt ? '#4f46e5' : '#4b5563',cursor:'pointer',fontWeight: answers[i] === opt ? '500' : '400'}}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{background:'white',border:'1px solid #f3f4f6',borderRadius:'1rem',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <p style={{fontWeight:'500',color:'#1f2937',marginBottom:'0.75rem'}}>Questão dissertativa</p>
          <p style={{fontSize:'0.875rem',color:'#6b7280',marginBottom:'0.75rem'}}>Explique com suas palavras um conceito importante de {subject?.name}.</p>
          <textarea value={openAnswer} onChange={e => setOpenAnswer(e.target.value)} rows={5}
            placeholder="Digite sua resposta aqui..."
            style={{width:'100%',border:'1px solid #e5e7eb',borderRadius:'0.75rem',padding:'0.75rem 1rem',fontSize:'0.875rem',resize:'none',outline:'none',boxSizing:'border-box'}} />
        </div>
        <button onClick={handleSubmit} disabled={!allAnswered}
          style={{width:'100%',background:'#4f46e5',color:'white',borderRadius:'0.75rem',padding:'1rem',fontWeight:'600',border:'none',cursor: allAnswered ? 'pointer' : 'not-allowed',opacity: allAnswered ? 1 : 0.5}}>
          Enviar avaliação
        </button>
      </main>
    </div>
  )
}