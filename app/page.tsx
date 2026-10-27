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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

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
        throw new Error(data.error || 'Gagal mengambil resep.');
      }

      setRecipes(data.recipes || []);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan pada sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-3xl">👨‍🍳</span>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            AI Recipe Generator
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Ketik bahan makanan yang ada di kulkasmu, biarkan AI racik resep lezat!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Bahan Makanan
              </label>
              <textarea
                rows={3}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Contoh: Ayam, Telur, Bawang Putih, Cabai..."
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3.5 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Kategori Masakan
                </label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full sm:w-48 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="Sarapan">Sarapan</option>
                  <option value="Makan Siang">Makan Siang</option>
                  <option value="Makan Malam">Makan Malam</option>
                  <option value="Camilan">Camilan / Dessert</option>
                  <option value="Diet / Sehat">Diet / Sehat</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !ingredients.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-orange-500/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Racik Resep...</span>
                  </>
                ) : (
                  <span>✨ Buatkan Resep</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Recipe Results */}
        {recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg flex flex-col justify-between hover:border-orange-500/50 transition duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h2 className="text-xl font-bold text-slate-100 leading-snug">
                      {item.title}
                    </h2>
                    {item.time && (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                        ⏱️ {item.time}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                      Bahan-Bahan:
                    </h3>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                      {item.ingredients?.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
                      Langkah Pembuatan:
                    </h3>
                    <ol className="list-decimal list-inside text-sm text-slate-300 space-y-1.5">
                      {item.steps?.map((step, s) => (
                        <li key={s} className="leading-relaxed">{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}