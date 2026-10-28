import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, '');
const groq = new Groq({ apiKey });

export async function POST(req: Request) {
  try {
    const { ingredients, filter } = await req.json();

    if (!ingredients) {
      return NextResponse.json(
        { error: 'Bahan makanan wajib diisi!' },
        { status: 400 }
      );
    }

    const promptText = `Bahan: ${ingredients}. Kategori: ${filter || 'Semua'}. Buatkan 2 resep ringkas.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Kamu adalah chef profesional. Kembalikan HANYA format JSON valid. Struktur wajib: {"recipes": [{"title": "Nama Resep", "time": "30 menit", "ingredients": ["bahan 1"], "steps": ["langkah 1"]}]}',
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      model: 'openai/gpt-oss-20b',
      response_format: { type: 'json_object' },
    });

    let rawText = completion.choices[0]?.message?.content || '{}';
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(rawText);
    const recipes = Array.isArray(parsedData)
      ? parsedData
      : parsedData.recipes || Object.values(parsedData)[0] || [];

    return NextResponse.json({ recipes }, { status: 200 });
  } catch (error: any) {
    console.error('Groq API Error Detail:', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Gagal memproses resep dari AI.' },
      { status: 500 }
    );
  }
}