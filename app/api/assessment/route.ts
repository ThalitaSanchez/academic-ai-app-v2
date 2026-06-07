import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { course, subject, threshold } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Você é um professor de ${course}. Gere exatamente 4 questões de múltipla escolha sobre ${subject} para uma avaliação de ${threshold}% do conteúdo. 
Responda APENAS com JSON válido neste formato, sem texto adicional:
{
  "questions": [
    {
      "question": "texto da pergunta",
      "options": ["A) opção1", "B) opção2", "C) opção3", "D) opção4"],
      "correct": "A) opção1"
    }
  ]
}`,
        },
        { role: 'user', content: 'Gere as questões.' },
      ],
      max_tokens: 1500,
    }),
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || '{}'
  
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json({ questions: [] })
  }
}