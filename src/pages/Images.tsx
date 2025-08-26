import { useState } from 'react';

const Images = () => {
  // All images from the news content
  const allImages = [
    {
      id: 'must-1',
      src: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=300&fit=crop',
      title: 'Inama Nkuru y\'u Rwanda yemeje politiki nshya y\'ubukungu',
      category: 'Politiki',
      description: 'Politiki nshya izagira ingaruka ku bakunzi b\'amahanga n\'ubukungu bw\'igihugu mu gihe kiri imbere.'
    },
    {
      id: 'must-2',
      src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop',
      title: 'APR FC yaronse amashampiyona mu rukino rukomeye',
      category: 'Siporo',
      description: 'Ikipe ya APR yaronse amashampiyona y\'akarere nyuma yo gutsinda ku makipe menshi.'
    },
    {
      id: 'must-3',
      src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      title: 'Igikorwa gishya cyo kuraguza ubwoba bw\'indwara',
      category: 'Ubuzima',
      description: 'Minisitere y\'ubuzima yatangije gahunda yo kuraguza ubwoba bw\'indwara mu baturage.'
    },
    {
      id: 'must-4',
      src: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=400&h=300&fit=crop',
      title: 'Tekinoroji nshya y\'ubuhinga izashyirwa mu bikorwa',
      category: 'Tekinoroji',
      description: 'Abahinzi bazabona amahirwe yo gukoresha tekinoroji nshya mu buzima bwabo bwa buri munsi.'
    },
    {
      id: 'sport-1',
      src: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
      title: 'Rayon Sports itegura urugendo rwa CAF Champions League',
      category: 'Siporo',
      description: 'Ikipe ya Rayon Sports irateguye kurugendo rwa CAF Champions League mu gihe kiri imbere.'
    },
    {
      id: 'sport-2',
      src: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop',
      title: 'Abakinnyi b\'u Rwanda bateguye Nyuma Afrika',
      category: 'Siporo',
      description: 'Ikipe y\'igihugu irateguye gukina mu mukino wa Nyuma Afrika uzabera vuba.'
    },
    {
      id: 'sport-3',
      src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      title: 'Basketball: Patriots yatsinze ku mukino wa nyuma',
      category: 'Siporo',
      description: 'Ikipe ya Patriots yagaragaje imyitozo myiza mu mukino wa basketball.'
    },
    {
      id: 'ent-1',
      src: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      title: 'Artiste mashya w\'u Rwanda azana album nshya',
      category: 'Umuziki',
      description: 'Album nshya izazana urwenya rw\'umuziki wa kinyarwanda mu buryo bushya.'
    },
    {
      id: 'ent-2',
      src: 'https://images.unsplash.com/photo-1489599763687-2fb2d1bfff15?w=400&h=300&fit=crop',
      title: 'Ikinamico gishya cyerekana ubwoba bw\'imyambarire',
      category: 'Amashusho',
      description: 'Ikinamico gishya kizerekanwa muri cinema mu cyumweru kizaza.'
    },
    {
      id: 'health-1',
      src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      title: 'Ubuvuzi bushya bw\'indwara z\'umutima buzaza mu Rwanda',
      category: 'Ubuzima',
      description: 'Tekinoroji nshya y\'ubuvuzi izafasha abarwayi b\'umutima gukira vuba.'
    },
    {
      id: 'health-2',
      src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      title: 'Gahunda yo kurinda indwara z\'amoko azatangira',
      category: 'Ubuzima',
      description: 'Minisitere y\'ubuzima itegura gahunda yo gukumira indwara z\'amoko.'
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(allImages.map(img => img.category)))];

  // Filter images based on category and search term
  const filteredImages = allImages.filter(img => {
    const matchesCategory = selectedCategory === 'All' || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         img.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         img.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Amashusho Yose</h1>
          <p className="text-lg text-gray-600">Reba amashusho yose yo mu makuru y'Umunsi</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Shaka
              </label>
              <input
                type="text"
                id="search"
                placeholder="Shaka amashusho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Ubwoko
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredImages.length} amashusho {selectedCategory !== 'All' && `yo mu bwoko bwa ${selectedCategory}`}
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative group">
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transition-opacity duration-300">
                    Reba
                  </button>
                </div>
              </div>
              <div className="p-4">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                  {image.category}
                </span>
                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">
                  {image.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nta mashusho yabonetse</h3>
            <p className="text-gray-600">Gerageza guhindura amahitamo yawe cyangwa ijambo ry'ushaka</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;
