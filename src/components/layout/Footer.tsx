import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Send, Newspaper } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    categories: {
      title: 'Ibice by\'Amakuru',
      links: [
        { name: 'Politiki', href: '/politics' },
        { name: 'Ubukungu', href: '/economy' },
        { name: 'Siporo', href: '/sports' },
        { name: 'Umuziki', href: '/music' },
        { name: 'Televiziyo', href: '/tv' },
        { name: 'Amashusho', href: '/movies' },
        { name: 'Ubuzima', href: '/health' },
        { name: 'Tekinoroji', href: '/technology' }
      ]
    },
    services: {
      title: 'Serivisi',
      links: [
        { name: 'Inyandiko', href: '/newsletter' },
        { name: 'Kwishura', href: '/subscribe' },
        { name: 'Kureba Digital', href: '/digital' },
        { name: 'Amafoto', href: '/photos' },
        { name: 'Video', href: '/videos' },
        { name: 'Podcast', href: '/podcast' }
      ]
    },
    company: {
      title: 'Ikigo',
      links: [
        { name: 'Twebere', href: '/about' },
        { name: 'Abakozi', href: '/team' },
        { name: 'Akazi', href: '/careers' },
        { name: 'Kwamamaza', href: '/advertise' },
        { name: 'Ubufatanye', href: '/partnerships' },
        { name: 'Ibigenga', href: '/contact' }
      ]
    },
    legal: {
      title: 'Amategeko',
      links: [
        { name: 'Amabanga y\'Ubuzima', href: '/privacy' },
        { name: 'Ibikubiye', href: '/terms' },
        { name: 'Amabwiriza', href: '/guidelines' },
        { name: 'Inyandiko za RSS', href: '/rss' }
      ]
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Newspaper size={28} />
              </div>
              <h3 className="text-3xl font-bold">Kwandikisha Inyandiko</h3>
            </div>
            <p className="text-green-50 text-lg mb-8 font-medium">Bona amakuru mashya kuri email yawe buri munsi</p>

            <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-4">
              <input
                type="email"
                placeholder="Andika email yawe..."
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 font-medium shadow-lg"
              />
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-2">
                <span>Kwiyandikisha</span>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-3 rounded-xl shadow-lg">
                  <div className="w-6 h-6 bg-white rounded opacity-90"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Umunsi</h2>
                  <p className="text-sm text-gray-400">Amakuru y'u Rwanda</p>
                </div>
              </Link>

              <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Ikinyamakuru gikuru cy'u Rwanda gitanga amakuru y'ukuri, y'igihe n'y'ingenzi ku buryo busobanutse.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <div className="bg-green-600/20 p-2 rounded-lg">
                    <MapPin size={16} />
                  </div>
                  <span>KG 5 Ave, Kigali, Rwanda</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <div className="bg-green-600/20 p-2 rounded-lg">
                    <Phone size={16} />
                  </div>
                  <span>+250 788 123 456</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <div className="bg-green-600/20 p-2 rounded-lg">
                    <Mail size={16} />
                  </div>
                  <span>info@umunsi.rw</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="font-bold text-white mb-6 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-green-400 transition-colors text-sm font-medium hover:translate-x-1 transform duration-200 block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm mb-6 md:mb-0">
              © {currentYear} Umunsi. Uburenganzira bwose bucunguwe.
            </div>

            {/* Social Media */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-4 font-medium">Tukurikire:</span>
              <a
                href="https://facebook.com/umunsi"
                className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-green-600 transition-all duration-200 rounded-lg hover:scale-110"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com/umunsi"
                className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-green-600 transition-all duration-200 rounded-lg hover:scale-110"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com/umunsi"
                className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-green-600 transition-all duration-200 rounded-lg hover:scale-110"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://youtube.com/umunsi"
                className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-green-600 transition-all duration-200 rounded-lg hover:scale-110"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
