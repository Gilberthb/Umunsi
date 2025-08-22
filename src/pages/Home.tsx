import HeroSection from '../components/sections/HeroSection';
import NewsSection from '../components/sections/NewsSection';
import Sidebar from '../components/layout/Sidebar';

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
    },
    {
      id: 'sport-4',
      title: 'Abakinnyi b\'volleyball bateguye shampiyona',
      excerpt: 'Ikipe y\'u Rwanda mu volleyball iragiye gukina shampiyona z\'akarere.',
      image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop',
      category: 'Siporo',
      author: 'Emmanuel Habimana',
      publishedAt: 'Umunsi 1 ushize'
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
    },
    {
      id: 'ent-3',
      title: 'Festival y\'umuziki izabera i Kigali muri Kamena',
      excerpt: 'Abakinnyi benshi bo mu karere bazaza gukina mu gikorwa cy\'umuziki.',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=300&fit=crop',
      category: 'Umuziki',
      author: 'Vestine Mukamana',
      publishedAt: 'Amasaha 7 ashize'
    },
    {
      id: 'ent-4',
      title: 'Igitaramo cy\'imyenda gishya kizabera mu Rwanda',
      excerpt: 'Abacuruzi b\'imyenda babanza kugaragaza ibicuruzwa byabo bishya.',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
      category: 'Imyenda',
      author: 'Aline Kayitesi',
      publishedAt: 'Umunsi 1 ushize'
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
    },
    {
      id: 'health-3',
      title: 'Amashuri azigishwa imyitwarire myiza y\'ubuzima',
      excerpt: 'Abanyeshuri bazigishwa uko bagomba kwibigisha ubuzima bwabo.',
      image: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=400&h=300&fit=crop',
      category: 'Ubuzima',
      author: 'Nurse Agnes Mutesi',
      publishedAt: 'Amasaha 6 ashize'
    },
    {
      id: 'health-4',
      title: 'Ibiro bishya by\'ubuvuzi bizahugura mu ntara',
      excerpt: 'Biro nshya by\'ubuvuzi bizongera kugira uruhare mu kugabanya ingorane.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop',
      category: 'Ubuzima',
      author: 'Dr. Francine Nyirahabimana',
      publishedAt: 'Amasaha 8 ashize'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar - Left */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Sidebar />
          </div>

          {/* Main Content - Right */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-12">
            {/* Hero Section */}
            <HeroSection />

            {/* Must Reads Section */}
            <NewsSection
              title="Amakuru Akomeye"
              subtitle="Amakuru akomeye kandi y'ingenzi y'u Rwanda n'isi"
              sectionType="must-reads"
              articles={mustReadArticles}
              viewAllLink="/must-reads"
              layout="grid"
              backgroundColor="bg-white"
            />

            {/* Sports Section */}
            <NewsSection
              title="Siporo"
              subtitle="Amakuru y'siporo yo mu Rwanda no mu mahanga"
              sectionType="sports"
              articles={sportsArticles}
              viewAllLink="/sports"
              layout="mixed"
              backgroundColor="bg-green-50"
            />

            {/* Entertainment Section */}
            <NewsSection
              title="Ibikorwa by'Imyidagaduro"
              subtitle="Umuziki, amashusho n'ibikorwa by'imyidagaduro"
              sectionType="entertainment"
              articles={entertainmentArticles}
              viewAllLink="/entertainment"
              layout="grid"
              backgroundColor="bg-white"
            />

            {/* Health Section */}
            <NewsSection
              title="Ubuzima"
              subtitle="Amakuru y'ubuzima n'ubuvuzi"
              sectionType="health"
              articles={healthArticles}
              viewAllLink="/health"
              layout="list"
              backgroundColor="bg-yellow-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
