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

  if (!user) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-2">🎓 AcademicAI</h1>
        <p className="text-center text-gray-500 mb-8">Qual é o seu curso?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(courses).map(([id, course]) => (
            <button
              key={id}
              onClick={() => router.push(`/dashboard/${id}`)}
              className="flex flex-col items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl p-6 transition hover:scale-105">
              <span className="text-4xl">{course.icon}</span>
              <span className="text-sm font-medium text-indigo-700 text-center">{course.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}