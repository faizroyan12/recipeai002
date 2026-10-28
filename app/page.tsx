'use client';
import { useState } from 'react';

interface Recipe {
  title: string;
  time: string;
  ingredients: string[];
  steps: string[];
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) {
      setError('Masukkan bahan makanan terlebih dahulu!');
      return;
    }

    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, filter }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan pada server.');
      }

      setRecipes(data.recipes || []);
    } catch (err: any) {
      setError(err.message || 'Gagal menghasilkan resep.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (recipe: Recipe, index: number) => {
    const text = `🍳 *${recipe.title}*\n⏱️ Waktu: ${recipe.time}\n\n🛒 *Bahan-bahan:*\n${recipe.ingredients.map(i => `- ${i}`).join('\n')}\n\n👩‍🍳 *Langkah-langkah:*\n${recipe.steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            AI Recipe Assistant 🍳
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mt-3">
            Mau Masak Apa Hari Ini?
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Ketik bahan makanan yang ada di dapurmu, biarkan AI meracik resep lezatnya!
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-orange-100 mb-8">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bahan Makanan (pisahkan dengan koma):
              </label>
              <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Contoh: Ayam, bawang putih, kecap manis"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Masakan:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition bg-white text-gray-800"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Berkuah">Berkuah / Sup</option>
                <option value="Goreng / Tumis">Goreng / Tumis</option>
                <option value="Sehat / Diet">Sehat / Diet</option>
                <option value="Cepat saji (< 15 menit)">Cepat Saji (&lt; 15 menit)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Chef AI Sedang Meracik Resep...</span>
                </>
              ) : (
                <span>✨ Buat Resep Sekarang</span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}
        </div>

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🍲</span> Pilihan Resep Untukmu:
            </h2>

            {recipes.map((recipe, index) => (
              <div key={index} className="bg-white shadow-lg rounded-2xl p-6 sm:p-7 border border-orange-100 relative transition hover:shadow-xl">
                
                {/* Header Resep & Tombol Salin */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{recipe.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md mt-1">
                      ⏱️ Estimasi Waktu: {recipe.time}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(recipe, index)}
                    className="text-xs bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-700 font-medium px-3 py-2 rounded-lg transition flex items-center gap-1.5 shrink-0"
                  >
                    {copiedIndex === index ? '✅ Tersalin!' : '📋 Salin Resep'}
                  </button>
                </div>

                {/* Bahan-bahan */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Bahan-bahan:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </div>

                {/* Langkah-langkah */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Cara Memasak:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                    {recipe.steps.map((step, sIdx) => (
                      <li key={sIdx} className="pl-1 leading-relaxed">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}