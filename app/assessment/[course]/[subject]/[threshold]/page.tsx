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

  useEffect(() => {
    generateQuestions()
  }, [])

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
    } catch {
      setQuestions([])
    }
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
      localStorage.setItem(`assessment_done_${courseId}_${subjectId}_${threshold}`, 'true')
    } catch {
      setFeedback('Erro ao corrigir. Tente novamente.')
    }
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-4xl mb-4">🤖</p>
        <p className="text-gray-500">Gerando sua avaliação...</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        <p className="text-5xl mb-4">{score >= 7 ? '🎉' : '📚'}</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Nota: {score}/10
        </h2>
        <p className="text-gray-500 mb-6">{score >= 7 ? 'Parabéns! Você foi muito bem!' : 'Continue estudando, você vai melhorar!'}</p>
        <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6 leading-relaxed">
          {feedback}
        </div>
        <button onClick={() => router.push(`/dashboard/${courseId}`)}
          className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition">
          Voltar ao dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">← Voltar</button>
        <h1 className="font-semibold text-indigo-700">📝 Avaliação {threshold}% — {subject?.name}</h1>
      </nav>

      <main className="max-w-2xl mx-auto p-6">
        <p className="text-sm text-gray-400 mb-6">Responda todas as questões e clique em enviar.</p>

        {questions.map((q, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
            <p className="font-medium text-gray-800 mb-4">{i + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt: string, j: number) => (
                <button key={j}
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition ${
                    answers[i] === opt
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-medium'
                      : 'border-gray-100 hover:bg-gray-50 text-gray-600'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <p className="font-medium text-gray-800 mb-3">Questão dissertativa</p>
          <p className="text-sm text-gray-500 mb-3">Explique com suas próprias palavras um conceito importante de {subject?.name}.</p>
          <textarea
            value={openAnswer}
            onChange={e => setOpenAnswer(e.target.value)}
            rows={5}
            placeholder="Digite sua resposta aqui..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length || !openAnswer.trim()}
          className="w-full bg-indigo-600 text-white rounded-xl py-4 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"