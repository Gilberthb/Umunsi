import React from 'react';
import NewsCard from '../common/NewsCard';

interface Article {
  id: string;
  imageUrl: string;
  category: string;
  link: string;
  author?: string;
  date?: string;
}

interface ReligionProps {
  // Define props if needed
}

const Religion: React.FC<ReligionProps> = () => {
  const articles: Article[] = [
    {
      id: '1',
      title: 'Faith leaders discuss community support and interfaith dialogue',
      imageUrl: 'https://images.unsplash.com/photo-1462965326608-53f731553790?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVsaWdpb258ZW58MHx8MHx8fDA%3D',
      category: 'Iyobokamana',
      link: '/articles/1',
      author: 'John Doe',
      date: 'Amasaha 3 ashize',
    },
    {
      id: '2',
      title: 'Ancient religious texts reveal new historical and cultural insights',
      imageUrl: 'https://images.unsplash.com/photo-1478115617857-537b11303729?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJlbGlnaW9ufGVufDB8fDB8fHww%3D',
      category: 'Iyobokamana',
      link: '/articles/2',
      author: 'Jane Smith',
      date: 'Amasaha 7 ashize',
    },
    {
      id: '3',
      title: 'Religious organizations launch new charitable initiatives to help the needy',
      imageUrl: 'https://images.unsplash.com/photo-1619683684416-f65836586e0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlbGlnaW9ufGVufDB8fDB8fHww%3D',
      category: 'Iyobokamana',
      link: '/articles/3',
      author: 'Peter Jones',
      date: 'Umunsi 1 ushize',
    },
    {
      id: '4',
      title: 'Exploring the role of faith in promoting peace and understanding',
      imageUrl: 'https://images.unsplash.com/photo-1494178270175-ef09cf2ed2fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHJlbGlnaW9ufGVufDB8fDB8fHww%3D',
      category: 'Iyobokamana',
      link: '/articles/4',
      author: 'Sarah Brown',
      date: 'Umunsi 2 ushize',
    },
    {
      id: '5',
      title: 'Religious holidays and their cultural significance around the world',
      imageUrl: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHJlbGlnaW9ufGVufDB8fDB8fHww%3D',
      category: 'Iyobokamana',
      link: '/articles/5',
      author: 'David Green',
      date: 'Ibyumweru 2 bishize',
    }
  ]);

  return (
    <section className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 lg:mb-8">Iyobokamana</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article} // Pass the entire article object
            size="medium"
            layout="vertical"
          />
        ))}
      </div>
      </div>
    </section>
  );
};

export default Religion;