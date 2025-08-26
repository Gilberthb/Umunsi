import { useState } from 'react';

const Home = () => {
  // Sample news data for different sections
  const mustReadArticles = [
    {
      id: 'must-1',
      title: 'Inama Nkuru y\'u Rwanda yemeje politiki nshya y\'ubukungu',
      excerpt: 'Politiki nshya izagira ingaruka ku bakunzi b\'amahanga n\'ubukungu bw\'igihugu mu gihe kiri imbere.',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
      category: 'Politiki',
      author: 'Marie Claire Uwimana',
      publishedAt: 'Amasaha 4 ashize'
    },
    {
      id: 'must-2',
      title: 'APR FC yaronse amashampiyona mu rukino rukomeye',
      excerpt: 'Ikipe ya APR yaronse amashampiyona y\'akarere nyuma yo gutsinda ku makipe menshi.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
      category: 'Siporo',
      author: 'Jean Paul Nzeyimana',
      publishedAt: 'Amasaha 6 ashize'
    },
    {
      id: 'must-3',
      title: 'Igikorwa gishya cyo kuraguza ubwoba bw\'indwara',
      excerpt: 'Minisitere y\'ubuzima yatangije gahunda yo kuraguza ubwoba bw\'indwara mu baturage.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      category: 'Ubuzima',
      author: 'Dr. Jeanne Ndayisenga',
      publishedAt: 'Amasaha 8 ashize'
    },
    {
      id: 'must-4',
      title: 'Tekinoroji nshya y\'ubuhinga izashyirwa mu bikorwa',
      excerpt: 'Abahinzi bazabona amahirwe yo gukoresha tekinoroji nshya mu buzima bwabo bwa buri munsi.',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop',
      category: 'Tekinoroji',
      author: 'Eric Nsabimana',
      publishedAt: 'Umunsi 1 ushize'
    }
  ];

  const sportsArticles = [
    {
      id: 'sport-1',
      title: 'Rayon Sports itegura urugendo rwa CAF Champions League',
      excerpt: 'Ikipe ya Rayon Sports irateguye kurugendo rwa CAF Champions League mu gihe kiri imbere.',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      category: 'Siporo',
      author: 'Patrick Uwimana',
      publishedAt: 'Amasaha 5 ashize'
    },
    {
      id: 'sport-2',
      title: 'Abakinnyi b\'u Rwanda bateguye Nyuma Afrika',
      excerpt: 'Ikipe y\'igihugu irateguye gukina mu mukino wa Nyuma Afrika uzabera vuba.',
      image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop',
      category: 'Siporo',
      author: 'Claude Mujyanama',
      publishedAt: 'Amasaha 7 ashize'
    },
    {
      id: 'sport-3',
      title: 'Basketball: Patriots yatsinze ku mukino wa nyuma',
      excerpt: 'Ikipe ya Patriots yagaragaje imyitozo myiza mu mukino wa basketball.',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      category: 'Siporo',
      author: 'Sylvie Murekatete',
      publishedAt: 'Amasaha 9 ashize'
    }
  ];

  const entertainmentArticles = [
    {
      id: 'ent-1',
      title: 'Artiste mashya w\'u Rwanda azana album nshya',
      excerpt: 'Album nshya izazana urwenya rw\'umuziki wa kinyarwanda mu buryo bushya.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      category: 'Umuziki',
      author: 'Grace Uwase',
      publishedAt: 'Amasaha 3 ashize'
    },
    {
      id: 'ent-2',
      title: 'Ikinamico gishya cyerekana ubwoba bw\'imyambarire',
      excerpt: 'Ikinamico gishya kizerekanwa muri cinema mu cyumweru kizaza.',
      image: 'https://images.unsplash.com/photo-1489599763687-2fb2d1bfff15?w=400&h=300&fit=crop',
      category: 'Amashusho',
      author: 'Olivier Niyonshuti',
      publishedAt: 'Amasaha 5 ashize'
    }
  ];

  const healthArticles = [
    {
      id: 'health-1',
      title: 'Ubuvuzi bushya bw\'indwara z\'umutima buzaza mu Rwanda',
      excerpt: 'Tekinoroji nshya y\'ubuvuzi izafasha abarwayi b\'umutima gukira vuba.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      category: 'Ubuzima',
      author: 'Dr. Christine Uwera',
      publishedAt: 'Amasaha 2 ashize'
    },
    {
      id: 'health-2',
      title: 'Gahunda yo kurinda indwara z\'amoko azatangira',
      excerpt: 'Minisitere y\'ubuzima itegura gahunda yo gukumira indwara z\'amoko.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      category: 'Ubuzima',
      author: 'Dr. Jean Baptiste Manzi',
      publishedAt: 'Amasaha 4 ashize'
    }
  ];

  // Sidebar news content
  const sidebarNews = [
    {
      id: 'side-1',
      title: 'Imisoro nshya yatangijwe mu Rwanda',
      category: 'Ubukungu',
      time: 'Amasaha 2 ashize'
    },
    {
      id: 'side-2',
      title: 'Abanyeshuri 5000 bahaye ibyo kwiga muri Kaminuza',
      category: 'Amashuri',
      time: 'Amasaha 3 ashize'
    },
    {
      id: 'side-3',
      title: 'Umuyobozi w\'ishami rya Banki y\'u Rwanda yisezeranwa',
      category: 'Imari',
      time: 'Amasaha 5 ashize'
    },
    {
      id: 'side-4',
      title: 'Inama y\'abaminisitiri yemeje gahunda yo guteza imbere ubuhinzi',
      category: 'Ubuhinzi',
      time: 'Amasaha 6 ashize'
    },
    {
      id: 'side-5',
      title: 'Igihe kizaza: Ingorane z\'ikirere zisabwe gutanga imyumvire',
      category: 'Ikirere',
      time: 'Amasaha 8 ashize'
    }
  ];

  const popularNews = [
    {
      id: 'pop-1',
      title: 'U Rwanda rwizihije umunsi w\'ubumwe bw\'abatutsi',
      comments: 245,
      shares: 120
    },
    {
      id: 'pop-2',
      title: 'Inyigisho z\'umwaka ushize: Abanyeshuri b\'amashuri yisumbuye barangije neza',
      comments: 189,
      shares: 95
    },
    {
      id: 'pop-3',
      title: 'Imodoka zishya zo mu Rwanda: Ikirango cya Volkswagen',
      comments: 156,
      shares: 87
    },
    {
      id: 'pop-4',
      title: 'Umukino wa Nyuma: APR yegukana igikombe',
      comments: 203,
      shares: 134
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Layout - No Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Sidebar - Left with News Content */}
          <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
            {/* Breaking News */}
            <div className="bg-red-600 text-white rounded-lg p-4">
              <h2 className="font-bold text-lg mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                Amakuru Yo Kuvanaho
              </h2>
              <div className="bg-white text-red-700 p-3 rounded-md">
                <p className="font-bold">U Rwanda rwizihije umunsi w'ubumwe: Abanyarwanda basanze mu minsi 30</p>
                <p className="text-sm mt-2 text-gray-600">Amasaha 1 ashize</p>
              </div>
            </div>

            {/* Latest News Sidebar */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Amakuru Mashya</h2>
              <div className="space-y-4">
                {sidebarNews.map((news) => (
                  <div key={news.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">{news.category}</span>
                    <h3 className="font-medium text-gray-800 hover:text-green-600 cursor-pointer">{news.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{news.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular News */}
            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Amakuru Yakunzwe</h2>
              <div className="space-y-4">
                {popularNews.map((news) => (
                  <div key={news.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <h3 className="font-medium text-gray-800 hover:text-green-600 cursor-pointer">{news.title}</h3>
                    <div className="flex text-xs text-gray-500 mt-2">
                      <span className="flex items-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {news.comments}
                      </span>
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {news.shares}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-5">
              <h2 className="text-xl font-bold mb-4">Igihe</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">24°C</div>
                  <div className="text-sm">Kigali</div>
                </div>
                <div className="text-4xl">☀️</div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                <div className="bg-blue-400/30 p-2 rounded">
                  <div>15:00</div>
                  <div className="text-xl">🌤️</div>
                  <div className="text-sm">25°</div>
                </div>
                <div className="bg-blue-400/30 p-2 rounded">
                  <div>18:00</div>
                  <div className="text-xl">🌤️</div>
                  <div className="text-sm">23°</div>
                </div>
                <div className="bg-blue-400/30 p-2 rounded">
                  <div>21:00</div>
                  <div className="text-xl">🌙</div>
                  <div className="text-sm">20°</div>
                </div>
                <div className="bg-blue-400/30 p-2 rounded">
                  <div>00:00</div>
                  <div className="text-xl">🌙</div>
                  <div className="text-sm">18°</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Right */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-4">Amakuru Mashya yo mu Rwanda</h1>
                <p className="text-lg mb-6">Soma amakuru y'igihe kandi y'ingenzi ku Rwanda n'isi yose</p>
                <button className="bg-white text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  Soma Amakuru
                </button>
              </div>
            </div>

            {/* Must Reads Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Amakuru Akomeye</h2>
                  <p className="text-gray-600">Amakuru akomeye kandi y'ingenzi y'u Rwanda n'isi</p>
                </div>
                <a href="/must-reads" className="text-green-600 font-medium hover:text-green-800">Reba yose →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {mustReadArticles.map((article) => (
                  <div key={article.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">{article.category}</span>
                      <h3 className="font-bold text-lg mb-2 hover:text-green-600 cursor-pointer">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sports Section */}
            <div className="bg-green-50 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-green-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Siporo</h2>
                  <p className="text-gray-600">Amakuru y'siporo yo mu Rwanda no mu mahanga</p>
                </div>
                <a href="/sports" className="text-green-600 font-medium hover:text-green-800">Reba yose →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {sportsArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">{article.category}</span>
                      <h3 className="font-bold text-lg mb-2 hover:text-green-600 cursor-pointer">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entertainment Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ibikorwa by'Imyidagaduro</h2>
                  <p className="text-gray-600">Umuziki, amashusho n'ibikorwa by'imyidagaduro</p>
                </div>
                <a href="/entertainment" className="text-green-600 font-medium hover:text-green-800">Reba yose →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {entertainmentArticles.map((article) => (
                  <div key={article.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-100 hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-2">{article.category}</span>
                      <h3 className="font-bold text-lg mb-2 hover:text-green-600 cursor-pointer">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Section */}
            <div className="bg-yellow-50 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-yellow-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Ubuzima</h2>
                  <p className="text-gray-600">Amakuru y'ubuzima n'ubuvuzi</p>
                </div>
                <a href="/health" className="text-green-600 font-medium hover:text-green-800">Reba yose →</a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {healthArticles.map((article) => (
                  <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <img src={article.image} alt={article.title} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">{article.category}</span>
                      <h3 className="font-bold text-lg mb-2 hover:text-green-600 cursor-pointer">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{article.excerpt}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{article.author}</span>
                        <span>{article.publishedAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <div className="text-xl font-bold mb-2">UMUNSI</div>
              <p className="text-green-100 text-sm">Amakuru y'ukuri, y'igihe</p>
            </div>
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-green-100 hover:text-white">Twebwe</a>
              <a href="#" className="text-green-100 hover:text-white">Twandikire</a>
              <a href="#" className="text-green-100 hover:text-white">Amabanga</a>
              <a href="#" className="text-green-100 hover:text-white">Amategeko</a>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c極 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 極 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.極-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.極 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-極.807-.058zM12 極.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 極.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-green-700">
            <p className="text-green-200 text-sm">© {new Date().getFullYear()} Umunsi. Uburenganzira bwose bucunguwe.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;