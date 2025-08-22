import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';

interface NewsCardProps {
  id: string;
  title: string;
  excerpt?: string;
  image: string;
  category: string;
  author: string;
  publishedAt: string;
  size?: 'small' | 'medium' | 'large';
  layout?: 'horizontal' | 'vertical';
}

const NewsCard = ({
  id,
  title,
  excerpt,
  image,
  category,
  author,
  publishedAt,
  size = 'medium',
  layout = 'vertical'
}: NewsCardProps) => {

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Televiziyo': 'bg-blue-100 text-blue-800',
      'Amashusho': 'bg-purple-100 text-purple-800',
      'Umuziki': 'bg-pink-100 text-pink-800',
      'Siporo': 'bg-orange-100 text-orange-800',
      'Politiki': 'bg-red-100 text-red-800',
      'Ubuzima': 'bg-green-100 text-green-800',
      'Abakinnyi': 'bg-yellow-100 text-yellow-800',
      'Ibikorwa': 'bg-indigo-100 text-indigo-800'
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  const sizeClasses = {
    small: layout === 'horizontal' ? 'flex space-x-3' : 'block',
    medium: layout === 'horizontal' ? 'flex space-x-4' : 'block',
    large: 'block'
  };

  const imageClasses = {
    small: layout === 'horizontal' ? 'w-20 h-16' : 'w-full h-32',
    medium: layout === 'horizontal' ? 'w-24 h-20' : 'w-full h-48',
    large: 'w-full h-64'
  };

  const titleClasses = {
    small: 'text-sm font-semibold',
    medium: 'text-base font-semibold',
    large: 'text-xl font-bold'
  };

  return (
    <article className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${sizeClasses[size]}`}>
      <Link to={`/article/${id}`} className="block">
        {/* Image */}
        <div className={`${imageClasses[size]} ${layout === 'horizontal' ? 'flex-shrink-0' : ''} bg-gray-200 overflow-hidden`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Content */}
        <div className={`p-3 ${layout === 'horizontal' ? 'flex-1' : ''}`}>
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
              {category}
            </span>
            {size === 'large' && (
              <div className="flex items-center text-xs text-gray-500 space-x-2">
                <Clock size={12} />
                <span>{publishedAt}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`${titleClasses[size]} text-gray-900 line-clamp-2 hover:text-green-600 transition-colors mb-2`}>
            {title}
          </h3>

          {/* Excerpt - only for medium and large */}
          {excerpt && (size === 'medium' || size === 'large') && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User size={12} />
              <span>{author}</span>
            </div>
            {size !== 'large' && (
              <span>{publishedAt}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;
