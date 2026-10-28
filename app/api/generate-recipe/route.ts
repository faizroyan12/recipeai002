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

    // Prompt diperbarui agar langkah-langkah memasaknya lebih detail dan instruktif
    const promptMessage = `Kamu adalah chef profesional yang sangat detail mengajari pemula. Buatkan 2 resep lezat berdasarkan:
Bahan: ${ingredients}
Kategori: ${filter || 'Semua'}

PENTING: 
1. Bagian langkah-langkah (steps) harus dibuat SANGAT DETAIL, jelas, dan tidak boleh terlalu ringkas. Berikan panduan lengkap seperti besar api (kecil/sedang), tekstur atau aroma sebagai tanda matang, dan tips tambahan agar masakan enak.
2. Kembalikan HANYA format JSON valid tanpa teks lain di luar JSON dengan struktur wajib berikut:
{
  "recipes": [
    {
      "title": "Nama Resep",
      "time": "30 menit",
      "ingredients": ["bahan 1 dengan takaran", "bahan 2 dengan takaran"],
      "steps": [
        "Langkah 1 yang dijelaskan secara detail dan panjang...",
        "Langkah 2 yang dijelaskan secara detail dan panjang..."
      ]
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: promptMessage,
        },
      ],
      model: 'openai/gpt-oss-120b', // Menggunakan model aktif yang stabil
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