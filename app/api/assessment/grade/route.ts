import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { questions, answers, openAnswer, course, subject } = body
  const correctCount = questions.filter((q: any, i: number) => answers[i] === q.correct).length

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Voce e professor de ' + course + ' corrigindo avaliacao de ' + subject + '. Aluno acertou ' + correctCount + ' de ' + questions.length + ' questoes. Avalie a dissertativa e retorne APENAS JSON: {"score": 8, "feedback": "texto em portugues"}',
        },
        { role: 'user', content: 'Dissertativa: ' + openAnswer },
      ],
      max_tokens: 500,
    }),
  })

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ score: correctCount * 2.5, feedback: 'Avaliacao concluida!' })
  }
}