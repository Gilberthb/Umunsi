import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and basic info */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <Link to="/" className="inline-block mb-2">
              <img src="/images/logo.png" alt="Umunsi Logo" className="h-8" />
            </Link>
            <p className="text-green-100 text-xs">
              Amakuru y'ukuri, y'igihe
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            <Link to="/about" className="text-green-100 hover:text-white text-xs transition-colors">
              Twebwe
            </Link>
            <Link to="/contact" className="text-green-100 hover:text-white text-xs transition-colors">
              Twandikire
            </Link>
            <Link to="/privacy" className="text-green-100 hover:text-white text-xs transition-colors">
              Amabanga
            </Link>
            <Link to="/terms" className="text-green-100 hover:text-white text-xs transition-colors">
              Amategeko
            </Link>
          </div>

          {/* Social media */}
          <div className="flex items-center space-x-2">
            <a
              href="https://facebook.com/umunsi"
              className="p-2 text-green-100 hover:text-white hover:bg-green-700 transition-all duration-200 rounded"
              aria-label="Facebook"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://twitter.com/umunsi"
              className="p-2 text-green-100 hover:text-white hover:bg-green-700 transition-all duration-200 rounded"
              aria-label="Twitter"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://instagram.com/umunsi"
              className="p-2 text-green-100 hover:text-white hover:bg-green-700 transition-all duration-200 rounded"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://youtube.com/umunsi"
              className="p-2 text-green-100 hover:text-white hover:bg-green-700 transition-all duration-200 rounded"
              aria-label="YouTube"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-4 border-t border-green-700/50">
          <p className="text-green-200 text-xs flex items-center justify-center">
            © {currentYear} Umunsi 
            <Heart size={10} className="mx-1 text-yellow-300" /> 
            Uburenganzira bwose bucunguwe
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;