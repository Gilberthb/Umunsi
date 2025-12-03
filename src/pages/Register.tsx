import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { apiClient } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Izina ryambere rirakenewe');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Izina ryanyuma rirakenewe');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Imeyili irakenewe');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Imeyili ntiyanditse neza');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Ijambo ry\'ibanga rigomba kuba nibura inyuguti 6');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Amagambo y\'ibanga ntabwo ahura');
      return false;
    }
    if (!acceptTerms) {
      setError('Ugomba kwemera amabwiriza n\'ibanga');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.register({
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.email.split('@')[0],
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (response.success || response.user) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Habaye ikibazo mu kwiyandikisha. Ongera ugerageze.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen theme-bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="theme-bg-secondary rounded-2xl border theme-border-primary p-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold theme-text-primary mb-2">Kwiyandikisha Byagenze Neza!</h2>
            <p className="theme-text-tertiary mb-4">
              Konti yawe yashyizweho. Reba imeyili yawe kugira ngo wemeze konti yawe.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-[#fcd535] text-[#0b0e11] font-semibold rounded-xl hover:bg-[#f0b90b] transition-colors"
            >
              Injira Muri Konti
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg-primary flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0b0e11] via-[#181a20] to-[#0b0e11] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#fcd535] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link to="/" className="flex items-center mb-8">
            <div className="w-16 h-16 bg-[#fcd535] rounded-xl flex items-center justify-center">
              <span className="text-[#0b0e11] font-bold text-3xl">U</span>
            </div>
            <span className="ml-3 text-4xl font-bold text-white">Umunsi</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Injira mu muryango wacu
          </h1>
          <p className="text-gray-400 text-center max-w-md mb-8">
            Iyandikishe kugira ngo ubone amakuru mashya, usige igitekerezo, kandi wisanga mu banyamakuru bacu.
          </p>

          <div className="space-y-4 text-left max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#fcd535]/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#fcd535]" />
              </div>
              <span className="text-gray-300">Akura amakuru y'ibanze</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#fcd535]/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#fcd535]" />
              </div>
              <span className="text-gray-300">Siga ibitekerezo ku nkuru</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#fcd535]/20 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#fcd535]" />
              </div>
              <span className="text-gray-300">Bika inkuru ukunda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center mb-4">
              <div className="w-12 h-12 bg-[#fcd535] rounded-xl flex items-center justify-center">
                <span className="text-[#0b0e11] font-bold text-xl">U</span>
              </div>
              <span className="ml-2 text-2xl font-bold theme-text-primary">Umunsi</span>
            </Link>
          </div>

          <div className="theme-bg-secondary rounded-2xl border theme-border-primary p-6 md:p-8">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center theme-text-tertiary hover:text-[#fcd535] transition-colors text-sm mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Subira Ahabanza
              </Link>
              <h2 className="text-2xl font-bold theme-text-primary">Iyandikishe</h2>
              <p className="theme-text-tertiary mt-1">Fungura konti nshya kuri Umunsi</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-1">
                    Izina ry'Ambere
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                      placeholder="Jean"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium theme-text-secondary mb-1">
                    Izina ry'Umuryango
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                      placeholder="Mutsinzi"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-1">
                  Izina ry'Ukoresha (Ntibigenewe)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                    placeholder="jeanmutsinzi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-1">
                  Imeyili
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-1">
                  Ijambo ry'Ibanga
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-1">
                  Emeza Ijambo ry'Ibanga
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 theme-text-muted" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 theme-bg-tertiary border theme-border-primary rounded-xl theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[#fcd535]/50"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded theme-bg-tertiary theme-border-primary text-[#fcd535] focus:ring-[#fcd535]"
                />
                <label htmlFor="terms" className="text-sm theme-text-tertiary">
                  Nemera <Link to="/terms" className="text-[#fcd535] hover:underline">Amabwiriza</Link> n'<Link to="/privacy" className="text-[#fcd535] hover:underline">Ibanga ry'Amakuru</Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#fcd535] to-[#f0b90b] text-[#0b0e11] font-semibold rounded-xl hover:from-[#f0b90b] hover:to-[#d4a00a] transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Iyandikishe</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="theme-text-tertiary text-sm">
                Usanzwe ufite konti?{' '}
                <Link to="/login" className="text-[#fcd535] font-medium hover:underline">
                  Injira Hano
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

