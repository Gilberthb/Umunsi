import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  FileText,
  Calendar,
  User,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Zap
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  isFeatured: boolean;
  isBreaking: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  createdAt: string;
  author: {
    username: string;
    firstName: string;
    lastName: string;
  };
  category: {
    name: string;
    color: string;
  };
  tags: Array<{
    name: string;
    slug: string;
  }>;
}

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  const fetchArticles = async () => {
    try {
      // Mock data for demonstration
      const mockArticles: Article[] = [
        {
          id: '1',
          title: 'Umunsi wa Kinyarwanda 2024: Abanyarwanda basanze mu minsi 30',
          slug: 'umunsi-wa-kinyarwanda-2024',
          excerpt: 'U Rwanda rwizihije umunsi w\'ubumwe n\'ubwiyongere. Abanyarwanda bose basanze mu minsi 30 bashimishwa kwizihiza umunsi w\'ubumwe n\'ubwiyongere.',
          status: 'PUBLISHED',
          isFeatured: true,
          isBreaking: true,
          viewCount: 1250,
          likeCount: 89,
          commentCount: 23,
          publishedAt: '2024-01-15T10:30:00Z',
          createdAt: '2024-01-15T08:00:00Z',
          author: { username: 'author1', firstName: 'John', lastName: 'Doe' },
          category: { name: 'Siporo', color: '#EF4444' },
          tags: [{ name: 'Breaking News', slug: 'breaking-news' }, { name: 'Featured', slug: 'featured' }]
        },
        {
          id: '2',
          title: 'Imyemeramikire yo mu Rwanda ikomeje guteza imbere amahoro n\'ubumwe',
          slug: 'imyemeramikire-yo-mu-rwanda',
          excerpt: 'Imyemeramikire yo mu Rwanda ikomeje guteza imbere amahoro n\'ubumwe. Abantu b\'imyemeramikire bose bakomeje gusangira amahoro n\'ubumwe mu Rwanda.',
          status: 'PUBLISHED',
          isFeatured: true,
          isBreaking: false,
          viewCount: 856,
          likeCount: 67,
          commentCount: 15,
          publishedAt: '2024-01-14T15:45:00Z',
          createdAt: '2024-01-14T12:00:00Z',
          author: { username: 'author2', firstName: 'Jane', lastName: 'Smith' },
          category: { name: 'Iyobokamana', color: '#3B82F6' },
          tags: [{ name: 'Gospel', slug: 'gospel' }, { name: 'Featured', slug: 'featured' }]
        },
        {
          id: '3',
          title: 'Umuziki wa Kinyarwanda 2024: Abahanzi bashya bakomeje guturuka',
          slug: 'umuziki-wa-kinyarwanda-2024',
          excerpt: 'Umuziki wa Kinyarwanda ukomeje gutera imbere. Abahanzi bashya bakomeje guturuka kandi bakomeje gutanga umuziki mwiza.',
          status: 'PUBLISHED',
          isFeatured: false,
          isBreaking: false,
          viewCount: 654,
          likeCount: 45,
          commentCount: 12,
          publishedAt: '2024-01-13T09:20:00Z',
          createdAt: '2024-01-13T07:00:00Z',
          author: { username: 'editor1', firstName: 'Mike', lastName: 'Johnson' },
          category: { name: 'Umuziki', color: '#EC4899' },
          tags: [{ name: 'Modern', slug: 'modern' }]
        },
        {
          id: '4',
          title: 'Draft Article: New Technology Trends in Rwanda',
          slug: 'draft-article-new-technology-trends',
          excerpt: 'This is a draft article about new technology trends in Rwanda...',
          status: 'DRAFT',
          isFeatured: false,
          isBreaking: false,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          publishedAt: '',
          createdAt: '2024-01-12T16:00:00Z',
          author: { username: 'author3', firstName: 'Sarah', lastName: 'Wilson' },
          category: { name: 'Technology', color: '#8B5CF6' },
          tags: [{ name: 'Technology', slug: 'technology' }]
        }
      ];

      setArticles(mockArticles);
      setTotalPages(1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800';
      case 'DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT': return <Clock className="w-4 h-4" />;
      case 'ARCHIVED': return <FileText className="w-4 h-4" />;
      case 'DELETED': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('rw-RW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      // API call to update article status
      console.log(`Updating article ${articleId} status to ${newStatus}`);
      
      // Update local state
      setArticles(articles.map(article => 
        article.id === articleId ? { ...article, status: newStatus as any } : article
      ));
    } catch (error) {
      console.error('Error updating article status:', error);
    }
  };

  const handleFeatureToggle = async (articleId: string, currentFeatured: boolean) => {
    try {
      // API call to toggle featured status
      console.log(`Toggling featured status for article ${articleId}`);
      
      // Update local state
      setArticles(articles.map(article => 
        article.id === articleId ? { ...article, isFeatured: !currentFeatured } : article
      ));
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        // API call to delete article
        console.log(`Deleting article ${articleId}`);
        
        // Update local state
        setArticles(articles.filter(article => article.id !== articleId));
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Article Management</h1>
            <p className="text-gray-600">Manage articles, content, and publishing</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
            <option value="DELETED">Deleted</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Categories</option>
            <option value="Siporo">Siporo</option>
            <option value="Iyobokamana">Iyobokamana</option>
            <option value="Umuziki">Umuziki</option>
            <option value="Technology">Technology</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {article.title}
                          </h3>
                          {article.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500" title="Featured" />
                          )}
                          {article.isBreaking && (
                            <Zap className="w-4 h-4 text-red-500" title="Breaking News" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag.slug}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {article.author.firstName.charAt(0)}{article.author.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {article.author.firstName} {article.author.lastName}
                        </div>
                        <div className="text-sm text-gray-500">@{article.author.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(article.status)}`}>
                      {getStatusIcon(article.status)}
                      <span className="ml-1">{article.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: article.category.color }}
                      ></div>
                      <span className="text-sm text-gray-900">{article.category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{article.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{article.likeCount}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{article.commentCount}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {article.publishedAt ? formatDate(article.publishedAt) : 'Not published'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {/* View article */}}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View Article"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit article */}}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit Article"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleFeatureToggle(article.id, article.isFeatured)}
                        className={`p-1 ${article.isFeatured ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-600 hover:text-gray-900'}`}
                        title={article.isFeatured ? 'Unfeature' : 'Feature'}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{articles.length}</span> of{' '}
                  <span className="font-medium">{articles.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Articles;