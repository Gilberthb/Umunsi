import { useState } from 'react';
import { Link } from 'react-router-dom';

const Entertainment = () => {
  const featuredArticles = [
    {
      id: 'feat-1',
      title: 'Artiste mashya w\'u Rwanda azana album nshya y\'umuziki wa kinyarwanda',
      excerpt: 'Album nshya izazana urwenya rw\'umuziki wa kinyarwanda mu buryo bushya.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Umuziki',
      author: 'Grace Uwase',
      publishedAt: 'Amasaha 2 ashize'
    },
    {
      id: 'feat-2',
      title: 'Ikinamico gishya cyerekana ubwoba bw\'imyambarire yo mu Rwanda',
      excerpt: 'Ikinamico gishya kizerekanwa muri cinema mu cyumweru kizaza.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Amashusho',
      author: 'Olivier Niyonshuti',
      publishedAt: 'Amasaha 5 ashize'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Ibikorwa by'Imyidagaduro</h1>
            <p className="text-xl mb-8">Amakuru y'umuziki, ikinamico, amashusho n'ibikorwa by'imyidagaduro yo mu Rwanda</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Soma Amakuru
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors">
                Menya Byinshi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Amakuru Akomeye</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-green-600 cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Special Features */}
            <section className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ibikorwa by'Imyidagaduro</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Umuziki wa Kinyarwanda</h3>
                  <p className="text-gray-600 text-sm">Guteza imbere umuziki wa kinyarwanda</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ikinamico n'Amashusho</h3>
                  <p className="text-gray-600 text-sm">Guteza imbere ikinamico n'amashusho</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Abahanzi b'u Rwanda</h3>
                  <p className="text-gray-600 text-sm">Gufasha abahanzi b'u Rwanda</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-lg p-5">
              <h3 className="text-xl font-bold mb-4">Kwakira Amakuru</h3>
              <p className="text-green-100 mb-4">Kwakira amakuru y'ibikorwa by'imyidagaduro</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Imeyili yawe"
                  className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Kwiyandikisha
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ibikorwa Bizaza</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Umunsi w'Umuziki wa Kinyarwanda</h4>
                  <p className="text-sm text-gray-600">Kuwa 25 Ukuboza 2024</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Ikinamico gishya</h4>
                  <p className="text-sm text-gray-600">Kuwa 30 Ukuboza 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entertainment;
