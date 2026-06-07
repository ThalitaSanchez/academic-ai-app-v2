import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { messages, course } = await req.json()

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
          content: `Você é uma tutora acadêmica especialista em ${course}. 
Responda sempre em português brasileiro de forma clara, didática e encorajadora.
Use exemplos práticos quando possível.
Se a pergunta não for relacionada ao curso, redirecione gentilmente para o tema acadêmico.`,
        },
        ...messages,
      ],
      max_tokens: 1000,
    }),
  })

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content || 'Não consegui gerar uma resposta.'

  return NextResponse.json({ reply })
}