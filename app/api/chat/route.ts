import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, course } = body

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
          content: 'Voce e uma tutora academica especialista em ' + course + '. Responda sempre em portugues brasileiro de forma clara e didatica. Use exemplos praticos quando possivel.',
        },
        ...messages,
      ],
      max_tokens: 1000,
    }),
  })

  const data = await res.json()
  const reply = data.choices?.[0]?.message?.content || 'Nao consegui gerar uma resposta.'
  return NextResponse.json({ reply })
}