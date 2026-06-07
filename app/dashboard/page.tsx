'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-700">🎓 AcademicAI</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">{user.email}</span>
          <button onClick={handleLogout} className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-200 transition">
            Sair
          </button>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda, {user.email}! 👋</h2>
        <p className="text-gray-500 mb-8">O que você quer estudar hoje?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['🧬 Biomedicina', '🩺 Medicina', '🔬 Radiologia', '💉 Enfermagem', '⚗️ Química', '💊 Farmácia'].map(area => (
            <div key={area} className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:shadow-md hover:scale-105 transition">
              <p className="text-lg font-semibold text-gray-700">{area}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}