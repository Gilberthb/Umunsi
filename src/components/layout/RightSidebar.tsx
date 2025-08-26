import { useState } from 'react';

const RightSidebar = () => {
  // Trending news for the sidebar
  const trendingNews = [
    {
      id: 'trend-1',
      title: 'U Rwanda rwizihije umunsi w\'ubumwe bw\'abatutsi',
      category: 'Politiki',
      time: 'Amasaha 2 ashize',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=120&fit=crop'
    },
    {
      id: 'trend-2',
      title: 'Inyigisho z\'umwaka ushize: Abanyeshuri b\'amashuri yisumbuye barangije neza',
      category: 'Amashuri',
      time: 'Amasaha 3 ashize',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&h=120&fit=crop'
    },
    {
      id: 'trend-3',
      title: 'Imodoka zishya zo mu Rwanda: Ikirango cya Volkswagen',
      category: 'Tekinoroji',
      time: 'Amasaha 4 ashize',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=120&fit=crop'
    },
    {
      id: 'trend-4',
      title: 'Umukino wa Nyuma: APR yegukana igikombe',
      category: 'Siporo',
      time: 'Amasaha 5 ashize',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=200&h=120&fit=crop'
    },
    {
      id: 'trend-5',
      title: 'Artiste mashya w\'u Rwanda azana album nshya',
      category: 'Umuziki',
      time: 'Amasaha 6 ashize',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=120&fit=crop'
    }
  ];

  // Advertisements data
  const advertisements = [
    {
      id: 'ad-1',
      title: 'Imodoka Nshya',
      description: 'Gura imodoka yawe ya buri munsi',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
      cta: 'Gura Nonaha',
      link: '#'
    },
    {
      id: 'ad-2',
      title: 'Amashuri y\'Amahanga',
      description: 'Fata amashuri yo mu mahanga',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?w=300&h=200&fit=crop',
      cta: 'Menya Byinshi',
      link: '#'
    },
    {
      id: 'ad-3',
      title: 'Ubwishingizi',
      description: 'Uwishingizi wawe wa buri munsi',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
      cta: 'Shakisha',
      link: '#'
    }
  ];

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Trending News Section */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          Amakuru Yakunzwe
        </h2>
        <div className="space-y-4">
          {trendingNews.map((news, index) => (
            <div key={news.id} className="flex space-x-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{news.category}</span>
                  <span className="text-xs text-gray-500">{news.time}</span>
                </div>
                <h3 className="font-medium text-gray-800 hover:text-green-600 cursor-pointer text-sm leading-tight">
                  {news.title}
                </h3>
              </div>
              <div className="flex-shrink-0">
                <img src={news.image} alt={news.title} className="w-16 h-12 object-cover rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advertisements Section */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
          Itangazo
        </h2>
        <div className="space-y-4">
          {advertisements.map((ad) => (
            <div key={ad.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="font-bold text-gray-800 mb-1">{ad.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{ad.description}</p>
              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                {ad.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-5">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8 12.967 17.256a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2 11.033 2.744A1 1 0 0112 2z" clipRule="evenodd" />
          </svg>
          Igihe
        </h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold">24°C</div>
            <div className="text-sm">Kigali</div>
          </div>
          <div className="text-4xl">☀️</div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-blue-400/30 p-2 rounded">
            <div className="text-xs">15:00</div>
            <div className="text-lg">🌤️</div>
            <div className="text-xs">25°</div>
          </div>
          <div className="bg-blue-400/30 p-2 rounded">
            <div className="text-xs">18:00</div>
            <div className="text-lg">🌤️</div>
            <div className="text-xs">23°</div>
          </div>
          <div className="bg-blue-400/30 p-2 rounded">
            <div className="text-xs">21:00</div>
            <div className="text-lg">🌙</div>
            <div className="text-xs">20°</div>
          </div>
          <div className="bg-blue-400/30 p-2 rounded">
            <div className="text-xs">00:00</div>
            <div className="text-lg">🌙</div>
            <div className="text-xs">18°</div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">Urupapuro Rusheshe</h2>
        <div className="space-y-2">
          <a href="/tv" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            📺 Televiziyo
          </a>
          <a href="/movies" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            🎬 Amashusho
          </a>
          <a href="/music" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            🎵 Umuziki
          </a>
          <a href="/sports" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            ⚽ Siporo
          </a>
          <a href="/politics" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            🏛️ Politiki
          </a>
          <a href="/health" className="block text-gray-700 hover:text-green-600 py-2 px-3 rounded-lg hover:bg-green-50 transition-colors">
            🏥 Ubuzima
          </a>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
