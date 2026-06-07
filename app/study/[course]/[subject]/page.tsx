'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courses, sharedSubjects, radiologyShared } from '@/lib/courses'

export default function StudyPage() {
  const [progress, setProgress] = useState(0)
  const [saved, setSaved] = useState(false)
  const params = useParams()
  const router = useRouter()
  const courseId = params.course as string
  const subjectId = params.subject as string
  const course = courses[courseId]

  const allSubjects = [
    ...sharedSubjects,
    ...(courseId === 'radiologia' ? radiologyShared : []),
    ...(course?.specific || []),
  ]
  const subject = allSubjects.find(s => s.id === subjectId)

  const saveProgress = () => {
    const saved = JSON.parse(localStorage.getItem(`progress_${courseId}`) || '{}')
    saved[subjectId] = progress
    localStorage.setItem(`progress_${courseId}`, JSON.stringify(saved))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push(`/dashboard/${courseId}`)} className="text-gray-400 hover:text-gray-600 transition">← Voltar</button>
        <h1 className="font-semibold text-indigo-700">{subject?.icon} {subject?.name}</h1>
      </nav>

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Conteúdo da disciplina</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            O conteúdo completo de <strong>{subject?.name}</strong> estará disponível em breve. 
            Por enquanto, use a IA tutora para estudar e tirar dúvidas sobre essa disciplina!
          </p>

          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-indigo-700 mb-3">Atualizar meu progresso nesta disciplina</p>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-1">
              <span>0%</span>
              <span className="font-semibold text-indigo-600">{progress}%</span>
              <span>100%</span>
            </div>
            <button
              onClick={saveProgress}
              className="mt-3 w-full bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-indigo-700 transition">
              {saved ? '✅ Salvo!' : 'Salvar progresso'}
            </button>
          </div>

          {[30, 60, 100].map(threshold => (
            progress >= threshold && (
              <div key={threshold} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-amber-700">
                  📝 Você atingiu {threshold}%! Avaliação disponível.
                </p>
                <button
                  onClick={() => router.push(`/assessment/${courseId}/${subjectId}/${threshold}`)}
                  className="mt-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition">
                  Fazer avaliação de {threshold}%
                </button>
              </div>
            )
          ))}
        </div>

        <button
          onClick={() => router.push(`/chat/${courseId}`)}
          className="w-full bg-indigo-600 text-white rounded-xl py-4 font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
          🤖 Tirar dúvidas com a IA sobre {subject?.name}
        </button>
      </main>
    </div>
  )
}