import { useState } from 'react';
import RightSidebar from '../components/layout/RightSidebar';

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
      {/* Main Content Layout - Left Content, Right Sidebars */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3 order-1 lg:order-1 space-y-8">
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

          {/* Right Sidebars */}
          <div className="lg:col-span-2 order-2 lg:order-2 space-y-6">
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

            {/* Right Sidebar Component */}
            <RightSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;