import { Link } from 'react-router-dom';
import { Clock, User, Share2, Bookmark, PlayCircle, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const featuredArticle = {
    id: 'featured-1',
    title: 'Perezida Kagame yasubije abakunzi b\'amahanga ko u Rwanda rukomeje kwihangana mu bibazo by\'isi',
    excerpt: 'Mu kiganiro n\'inyandiko z\'amakuru z\'amahanga, Perezida w\'u Rwanda yagaragaje ko igihugu cyacu gikurikirana politiki yo kubana neza n\'abandi bose mu karere no ku isi.',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop',
    category: 'Politiki',
    author: 'Jean Baptiste Habimana',
    publishedAt: 'Saa sita z\'uyu munsi',
    readTime: '5 iminota',
    isTopStory: true
  };

  const relatedStories = [
    {
      id: 'related-1',
      title: 'Inama Nkuru y\'u Rwanda isabira amajambere y\'ibikorwa by\'amajyambere',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      category: 'Ubukungu'
    },
    {
      id: 'related-2',
      title: 'Abakunzi b\'ubucuruzi bw\'amahanga bashimye inyubako z\'u Rwanda',
      image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=200&fit=crop',
      category: 'Ubucuruzi'
    },
    {
      id: 'related-3',
      title: 'Inama y\'abaminisitiri yemeje gahunda y\'amajyambere 2025',
      image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=300&h=200&fit=crop',
      category: 'Politiki'
    }
  ];

  return (
    <section className="bg-white">
      <div className="relative">
        {/* Top Story Badge */}
        {featuredArticle.isTopStory && (
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Inkuru Nkuru</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Featured Article */}
        <Link to={`/article/${featuredArticle.id}`} className="block relative group">
          <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <PlayCircle size={48} className="text-white" />
              </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-white">
              {/* Category and Meta */}
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {featuredArticle.category}
                </span>
                <div className="flex items-center space-x-6 text-sm text-gray-200">
                  <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span>{featuredArticle.publishedAt}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <User size={14} />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">
                    {featuredArticle.readTime}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight group-hover:text-yellow-200 transition-colors">
                {featuredArticle.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg lg:text-xl text-gray-200 mb-6 line-clamp-2 leading-relaxed">
                {featuredArticle.excerpt}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-8 py-3 rounded-full font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <div className="flex items-center space-x-2">
                    <span>Soma Byose</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
                <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                  <Share2 size={18} />
                </button>
                <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200 hover:scale-110">
                  <Bookmark size={18} />
                </button>
              </div>
            </div>
          </div>
        </Link>

        {/* Related Stories */}
        <div className="mt-12">
          <div className="flex items-center mb-6">
            <span className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-700 mr-4 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">Amakuru Ajyanye</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedStories.map((story, index) => (
              <Link
                key={story.id}
                to={`/article/${story.id}`}
                className="group block"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2 text-lg leading-relaxed">
                  {story.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
