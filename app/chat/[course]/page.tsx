'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courses } from '@/lib/courses'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const courseId = params.course as string
  const course = courses[courseId]

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user' as const, content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, course: course.name }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Erro ao conectar com a IA. Tente novamente.' }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push(`/dashboard/${courseId}`)} className="text-gray-400 hover:text-gray-600 transition">← Voltar</button>
        <h1 className="font-semibold text-indigo-700">🤖 IA Tutora — {course?.name}</h1>
      </nav>

      <div className="flex-1 overflow-y-auto p-6 max-w-3xl w-full mx-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-4xl mb-4">🤖</p>
            <p className="text-lg font-medium text-gray-500">Olá! Sou sua tutora de {course?.name}.</p>
            <p className="text-sm mt-2">Pode me perguntar qualquer coisa sobre as disciplinas do curso!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-white border border-gray-100 text-gray-700 rounded-bl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-gray-400">
              Digitando...
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-100 p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Digite sua dúvida..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50">
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}