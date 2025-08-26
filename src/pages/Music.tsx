import { useState } from 'react';
import { Link } from 'react-router-dom';

const Music = () => {
  // Featured music articles
  const featuredMusic = [
    {
      id: 'feat-1',
      title: 'Artiste mashya w\'u Rwanda azana album nshya y\'umuziki wa kinyarwanda',
      excerpt: 'Artiste mashya w\'u Rwanda yatangije album nshya izazana urwenya rw\'umuziki wa kinyarwanda mu buryo bushya.',
      image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Umuziki',
      author: 'Grace Uwase',
      publishedAt: 'Amasaha 2 ashize',
      featured: true
    },
    {
      id: 'feat-2',
      title: 'Inyandiko z\'umuziki zerekana amateka n\'umuco wa Rwanda',
      excerpt: 'Ubushakashatsi bushya bw\'inyandiko z\'umuziki z\'ikinyagihugu bizafasha kumenya amateka n\'umuco wa Rwanda.',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Umuziki',
      author: 'Dr. Marie Claire Uwimana',
      publishedAt: 'Amasaha 5 ashize',
      featured: true
    }
  ];

  // Latest music news
  const latestMusic = [
    {
      id: 'music-1',
      title: 'Umuziki wa kinyarwanda ukomeje guteza imbere',
      excerpt: 'Umuziki wa kinyarwanda ukomeje guteza imbere mu mahanga n\'abantu benshi bakunzwe.',
      image: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Umuziki',
      author: 'Patrick Uwimana',
      publishedAt: 'Amasaha 1 ashize'
    },
    {
      id: 'music-2',
      title: 'Abahanzi b\'u Rwanda bateguye concert nshya',
      excerpt: 'Abahanzi b\'u Rwanda bateguye concert nshya izaba vuba mu Kigali.',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Umuziki',
      author: 'Claude Mujyanama',
      publishedAt: 'Amasaha 3 ashize'
    },
    {
      id: 'music-3',
      title: 'Album nshya y\'umuziki wa gospel yatangijwe',
      excerpt: 'Album nshya y\'umuziki wa gospel yatangijwe mu Rwanda izafasha abantu gufata amahoro.',
      image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Umuziki',
      author: 'Sylvie Murekatete',
      publishedAt: 'Amasaha 6 ashize'
    },
    {
      id: 'music-4',
      title: 'Umuziki wa traditional ukomeje gufashwa',
      excerpt: 'Umuziki wa traditional ukomeje gufashwa n\'abantu benshi mu Rwanda.',
      image: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'Umuziki',
      author: 'Olivier Niyonshuti',
      publishedAt: 'Amasaha 8 ashize'
    }
  ];

  // Music images gallery
  const musicImages = [
    {
      id: 'img-1',
      title: 'Umuziki wa Kinyarwanda',
      image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Umuziki wa kinyarwanda ukomeje guteza imbere mu mahanga'
    },
    {
      id: 'img-2',
      title: 'Abahanzi b\'u Rwanda',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Abahanzi b\'u Rwanda bafasha guteza imbere umuziki'
    },
    {
      id: 'img-3',
      title: 'Umuziki wa Gospel',
      image: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Umuziki wa gospel ufasha abantu gufata amahoro'
    },
    {
      id: 'img-4',
      title: 'Umuziki wa Traditional',
      image: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Umuziki wa traditional ukomeje gufashwa'
    },
    {
      id: 'img-5',
      title: 'Concert yo mu Rwanda',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Concert yo mu Rwanda izaba vuba'
    },
    {
      id: 'img-6',
      title: 'Album nshya',
      image: 'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Album nshya y\'umuziki wa kinyarwanda'
    }
  ];

  // Trending music topics
  const trendingMusic = [
    {
      id: 'trend-1',
      title: 'Umuziki wa Kinyarwanda',
      count: 245
    },
    {
      id: 'trend-2',
      title: 'Abahanzi b\'u Rwanda',
      count: 189
    },
    {
      id: 'trend-3',
      title: 'Umuziki wa Gospel',
      count: 156
    },
    {
      id: 'trend-4',
      title: 'Concert yo mu Rwanda',
      count: 203
    },
    {
      id: 'trend-5',
      title: 'Album nshya',
      count: 134
    }
  ];

  // Quick links
  const quickLinks = [
    { name: 'Umuziki wa Kinyarwanda', href: '/music/kinyarwanda' },
    { name: 'Umuziki wa Gospel', href: '/music/gospel' },
    { name: 'Umuziki wa Traditional', href: '/music/traditional' },
    { name: 'Abahanzi b\'u Rwanda', href: '/music/artists' },
    { name: 'Concert yo mu Rwanda', href: '/music/concerts' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Music Image Background */}
      <div className="relative bg-gradient-to-r from-green-600 to-yellow-500 text-white overflow-hidden">
        {/* Background Music Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1200" 
            alt="Music Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-yellow-500/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Umuziki</h1>
            <p className="text-xl mb-8">Amakuru y\'umuziki wa kinyarwanda, gospel n\'ibikorwa by\'abahanzi</p>
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
            {/* Featured Music Articles */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Amakuru Akomeye</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredMusic.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
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

            {/* Music Images Gallery */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Amashusho y\'Umuziki</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {musicImages.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative group">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium transition-opacity duration-300">
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

            {/* Latest Music News */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Amakuru Mashya</h2>
                <Link to="/music/news" className="text-green-600 font-semibold hover:text-green-800">
                  Reba yose →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestMusic.map((article) => (
                  <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">
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
            <section className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ibikorwa By\'Umuziki</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Umuziki wa Kinyarwanda</h3>
                  <p className="text-gray-600 text-sm">Umuziki wa kinyarwanda ukomeje guteza imbere</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Umuziki wa Gospel</h3>
                  <p className="text-gray-600 text-sm">Umuziki wa gospel ufasha abantu gufata amahoro</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Concert yo mu Rwanda</h3>
                  <p className="text-gray-600 text-sm">Concert yo mu Rwanda izaba vuba</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar - Right */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Music Topics */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ibintu Bikunzwe</h3>
              <div className="space-y-3">
                {trendingMusic.map((topic, index) => (
                  <div key={topic.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-yellow-500">#{index + 1}</span>
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
            <div className="bg-gradient-to-r from-green-600 to-yellow-500 text-white rounded-lg p-5">
              <h3 className="text-xl font-bold mb-4">Kwakira Amakuru</h3>
              <p className="text-green-100 mb-4">Kwakira amakuru y\'umuziki wa kinyarwanda</p>
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
                  <h4 className="font-semibold text-gray-800">Concert yo mu Rwanda</h4>
                  <p className="text-sm text-gray-600">Kuwa 25 Ukuboza 2024</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Album nshya</h4>
                  <p className="text-sm text-gray-600">Kuwa 30 Ukuboza 2024</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Umuziki wa Gospel</h4>
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

export default Music;
