import { useState } from 'react';
import { Link } from 'react-router-dom';

const Religion = () => {
  // Featured articles
  const featuredArticles = [
    {
      id: 'feat-1',
      title: 'Abayobozi b\'Imyemeramikire bavugana ku buzima bwa buri munsi n\'ubumwe',
      excerpt: 'Abayobozi b\'imyemeramikire yo mu Rwanda basanze mu nama yo gusuzuma uko bashobora gufasha abaturage mu buzima bwabo bwa buri munsi.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Iyobokamana',
      author: 'Pasteur Jean Baptiste Ndayisenga',
      publishedAt: 'Amasaha 2 ashize',
      featured: true
    },
    {
      id: 'feat-2',
      title: 'Inyandiko z\'Imyemeramikire zerekana amakuru mashya y\'amateka n\'umuco',
      excerpt: 'Ubushakashatsi bushya bw\'inyandiko z\'imyemeramikire z\'ikinyagihugu bizafasha kumenya amateka n\'umuco wa Rwanda.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Iyobokamana',
      author: 'Dr. Marie Claire Uwimana',
      publishedAt: 'Amasaha 5 ashize',
      featured: true
    }
  ];

  // Latest news
  const latestNews = [
    {
      id: 'news-1',
      title: 'Imyemeramikire itangiza gahunda nshya zo gufasha abakeneye',
      excerpt: 'Imyemeramikire yo mu Rwanda itangije gahunda nshya zo gufasha abantu bakeneye mu buzima bwabo bwa buri munsi.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Iyobokamana',
      author: 'Pasteur Peter Nzeyimana',
      publishedAt: 'Amasaha 1 ashize'
    },
    {
      id: 'news-2',
      title: 'Gusuzuma uruhare rw\'Imyemeramikire mu guteza imbere amahoro n\'ubumwe',
      excerpt: 'Ubushakashatsi bushya busuzuma uko imyemeramikire ishobora gufasha guteza imbere amahoro n\'ubumwe hagati y\'abantu.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Iyobokamana',
      author: 'Dr. Sarah Uwase',
      publishedAt: 'Amasaha 3 ashize'
    },
    {
      id: 'news-3',
      title: 'Umunsi w\'Imyemeramikire n\'ubusobanura bw\'umuco ku Rwanda',
      excerpt: 'Umunsi w\'imyemeramikire uzaba vuba, aho abanyarwanda bazizihiza ubusobanura bw\'umuco n\'imyemeramikire.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Iyobokamana',
      author: 'Prof. David Niyonshuti',
      publishedAt: 'Amasaha 6 ashize'
    },
    {
      id: 'news-4',
      title: 'Abayobozi b\'Imyemeramikire bavugana ku buzima bwa buri munsi',
      excerpt: 'Abayobozi b\'imyemeramikire yo mu Rwanda basanze mu nama yo gusuzuma uko bashobora gufasha abaturage.',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Iyobokamana',
      author: 'Pasteur Jean Baptiste Ndayisenga',
      publishedAt: 'Amasaha 8 ashize'
    }
  ];

  // Religious images gallery
  const religiousImages = [
    {
      id: 'img-1',
      title: 'Imyemeramikire yo mu Rwanda',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Imyemeramikire yo mu Rwanda ikomeje guteza imbere amahoro n\'ubumwe'
    },
    {
      id: 'img-2',
      title: 'Inyandiko z\'Imyemeramikire',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Inyandiko z\'imyemeramikire zerekana amateka n\'umuco wa Rwanda'
    },
    {
      id: 'img-3',
      title: 'Abayobozi b\'Imyemeramikire',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Abayobozi b\'imyemeramikire bafasha abaturage mu buzima bwabo'
    },
    {
      id: 'img-4',
      title: 'Amahoro n\'Ubumwe',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Imyemeramikire ikomeje guteza imbere amahoro n\'ubumwe'
    },
    {
      id: 'img-5',
      title: 'Ubuzima bwa buri munsi',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Gufasha abantu mu buzima bwabo bwa buri munsi'
    },
    {
      id: 'img-6',
      title: 'Umunsi w\'Imyemeramikire',
      image: 'https://images.pexels.com/photos/1029243/pexels-photo-1029243.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Umunsi w\'imyemeramikire uzaba vuba'
    }
  ];

  // Trending topics
  const trendingTopics = [
    {
      id: 'trend-1',
      title: 'Umunsi w\'Imyemeramikire',
      count: 245
    },
    {
      id: 'trend-2',
      title: 'Amahoro n\'Ubumwe',
      count: 189
    },
    {
      id: 'trend-3',
      title: 'Ubuzima bwa buri munsi',
      count: 156
    },
    {
      id: 'trend-4',
      title: 'Inyandiko z\'Imyemeramikire',
      count: 203
    },
    {
      id: 'trend-5',
      title: 'Abayobozi b\'Imyemeramikire',
      count: 134
    }
  ];

  // Quick links
  const quickLinks = [
    { name: 'Amahoro n\'Ubumwe', href: '/religion/peace' },
    { name: 'Ubuzima bwa buri munsi', href: '/religion/life' },
    { name: 'Inyandiko z\'Imyemeramikire', href: '/religion/scriptures' },
    { name: 'Abayobozi b\'Imyemeramikire', href: '/religion/leaders' },
    { name: 'Umunsi w\'Imyemeramikire', href: '/religion/holidays' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Iyobokamana</h1>
            <p className="text-xl mb-8">Amakuru y\'imyemeramikire, amahoro n\'ubuzima bwa buri munsi</p>
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
                      <p className="text-gray-600 mb-4 line-clamp-3">
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

            {/* Religious Images Gallery */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Amashusho y\'Imyemeramikire</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {religiousImages.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative group">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-opacity duration-300">
                          Reba
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Latest News */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Amakuru Mashya</h2>
                <Link to="/religion/news" className="text-green-600 font-semibold hover:text-green-800">
                  Reba yose →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestNews.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                        {article.category}
                      </span>
                      <h3 className="font-bold text-lg mb-2 hover:text-green-600 cursor-pointer">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Special Features */}
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ibikorwa By\'Imyemeramikire</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Amahoro n\'Ubumwe</h3>
                  <p className="text-gray-600 text-sm">Gufasha guteza imbere amahoro n\'ubumwe hagati y\'abantu</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Inyandiko z\'Imyemeramikire</h3>
                  <p className="text-gray-600 text-sm">Gusuzuma n\'gusobanura inyandiko z\'imyemeramikire</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Ubuzima bwa buri munsi</h3>
                  <p className="text-gray-600 text-sm">Gufasha abantu mu buzima bwabo bwa buri munsi</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ibintu Bikunzwe</h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={topic.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-green-600">#{index + 1}</span>
                      <span className="font-medium text-gray-800 hover:text-green-600 cursor-pointer">
                        {topic.title}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Urupapuro Rusheshe</h3>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-5">
              <h3 className="text-xl font-bold mb-4">Kwakira Amakuru</h3>
              <p className="text-green-100 mb-4">Kwakira amakuru y\'imyemeramikire yo mu Rwanda</p>
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
                  <h4 className="font-semibold text-gray-800">Umunsi w\'Imyemeramikire</h4>
                  <p className="text-sm text-gray-600">Kuwa 25 Ukuboza 2024</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Inama y\'Abayobozi</h4>
                  <p className="text-sm text-gray-600">Kuwa 30 Ukuboza 2024</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Gahunda yo Gufasha</h4>
                  <p className="text-sm text-gray-600">Kuwa 5 Mutarama 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Religion;
