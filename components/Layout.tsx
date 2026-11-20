
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Home, Phone, Menu, X, Users, ChevronDown, Bot, Heart, ArrowLeftRight, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../App';
import { PropertyType } from '../types';
import { INITIAL_FILTERS } from '../constants';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setFilters, toggleChat, favorites, compareList, clearCompare, language, toggleLanguage, t, isAdminLoggedIn, companySettings } = useAppContext();
  const brandTitle = companySettings?.name || 'النيل';
  const brandSlogan = companySettings?.nameEn || 'Real Estate Investment';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsPropertiesDropdownOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path ? 'text-gold-400 font-bold bg-white/10' : 'text-gray-200 hover:text-white hover:bg-white/5';

  const handlePropertyTypeClick = (type: string) => {
    setFilters({ ...INITIAL_FILTERS, type });
    navigate('/');
    setIsPropertiesDropdownOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 font-sans ${language === 'en' ? 'font-sans-en' : ''}`}>
      {/* Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/5 ${
          isScrolled 
            ? 'glass-dark shadow-lg py-2' 
            : 'bg-nile-900 py-4 border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setFilters(INITIAL_FILTERS)}>
            <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-2.5 rounded-xl text-nile-900 shadow-lg transform group-hover:rotate-6 transition duration-300">
              <Building2 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white leading-none tracking-tight">{brandTitle}</h1>
              <span className="text-[10px] text-gold-400 font-bold tracking-[0.15em] uppercase block mt-0.5">{brandSlogan}</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
            <Link to="/" className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive('/')}`} onClick={() => setFilters(INITIAL_FILTERS)}>
              <Home size={18} /> <span className="text-sm">{t.home}</span>
            </Link>
            
            {/* Properties Dropdown */}
            <div className="relative group">
               <button className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 text-gray-200 hover:text-white hover:bg-white/5`}>
                 <Building2 size={18} /> <span className="text-sm">{t.properties}</span> <ChevronDown size={14} />
               </button>
               <div className={`absolute top-full mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${language === 'ar' ? 'right-0' : 'left-0'}`}>
                  <div className="p-1">
                     <button onClick={() => handlePropertyTypeClick('all')} className="block w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg">{language === 'ar' ? 'الكل' : 'All'}</button>
                     {Object.values(PropertyType).map(type => (
                        <button key={type} onClick={() => handlePropertyTypeClick(type)} className="block w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-600 rounded-lg">
                           {type}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <Link to="/about" className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive('/about')}`}>
              <Users size={18} /> <span className="text-sm">{t.about}</span>
            </Link>
            
            <Link to="/contact" className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ${isActive('/contact')}`}>
              <Phone size={18} /> <span className="text-sm">{t.contact}</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage} 
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-black text-gold-400 hover:bg-gold-500 hover:text-nile-900 transition hover:border-gold-500" 
                title={language === 'ar' ? 'Switch to English' : 'تغيير للعربية'}
             >
               {language === 'ar' ? 'EN' : 'AR'}
             </button>

             {/* Favorites Icon */}
             <Link to="/favorites" className="relative p-2 text-white hover:text-gold-400 transition group">
                <Heart size={24} className={favorites.length > 0 ? 'fill-gold-500 text-gold-500' : ''} />
                {favorites.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-nile-900 animate-bounce">
                    {favorites.length}
                  </span>
                )}
             </Link>

             <button 
                onClick={() => toggleChat(true)}
                className="hidden md:flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-nile-900 font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-gold-500/20 transform hover:-translate-y-0.5"
             >
                <Bot size={20} /> {t.smartConsultant}
             </button>

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 glass-dark border-t border-white/10 p-4 shadow-2xl animate-slide-down max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
               <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive('/')}`}>
                  <Home size={20} /> {t.home}
               </Link>
               
               <button onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-white/5 w-full">
                  <span className="flex items-center gap-3"><Building2 size={20} /> {t.properties}</span>
                  <ChevronDown size={16} className={`transform transition ${isPropertiesDropdownOpen ? 'rotate-180' : ''}`} />
               </button>
               {isPropertiesDropdownOpen && (
                 <div className="bg-white/5 rounded-xl mx-2 p-2">
                    <button onClick={() => handlePropertyTypeClick('all')} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:text-gold-400">{language === 'ar' ? 'الكل' : 'All'}</button>
                    {Object.values(PropertyType).map(type => (
                        <button key={type} onClick={() => handlePropertyTypeClick(type)} className="block w-full text-start px-4 py-2 text-sm text-gray-300 hover:text-gold-400">
                           {type}
                        </button>
                     ))}
                 </div>
               )}

               <Link to="/favorites" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive('/favorites')}`}>
                  <Heart size={20} className={favorites.length > 0 ? 'fill-gold-500 text-gold-500' : ''} /> 
                  {t.favorites} 
                  {favorites.length > 0 && <span className="bg-gold-500 text-nile-900 text-xs px-2 py-0.5 rounded-full font-bold">{favorites.length}</span>}
               </Link>

               <Link to="/about" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive('/about')}`}>
                  <Users size={20} /> {t.about}
               </Link>
               <Link to="/contact" className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isActive('/contact')}`}>
                  <Phone size={20} /> {t.contact}
               </Link>
               
               <button onClick={() => toggleChat(true)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold-400 hover:bg-white/5 w-full font-bold">
                  <Bot size={20} /> {t.smartConsultant}
               </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Spacer */}
      <div className={`${isScrolled ? 'h-[72px]' : 'h-[88px]'} transition-all duration-300`}></div>

      {/* Floating Admin Button (Only if Logged In) */}
      {isAdminLoggedIn && (
         <Link 
            to="/admin" 
            className="fixed bottom-6 left-6 z-50 bg-nile-900 text-white p-4 rounded-full shadow-2xl hover:bg-nile-800 transition transform hover:scale-110 group border border-white/10"
            title={t.dashboard}
         >
            <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse-slow"></div>
            <LayoutDashboard size={24} />
         </Link>
      )}

      {/* Compare Floating Bar */}
      {compareList.length > 0 && (
         <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gold-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] p-4 animate-slide-up">
            <div className="container mx-auto flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <span className="bg-nile-900 text-gold-400 px-3 py-1 rounded-lg font-bold text-sm">
                    {compareList.length} / 3
                  </span>
                  <span className="text-nile-900 font-bold hidden md:inline">{t.compare}</span>
               </div>
               <div className="flex gap-3">
                  <button onClick={clearCompare} className="text-gray-500 hover:text-red-500 text-sm font-bold px-4 py-2">
                     {language === 'ar' ? 'إلغاء' : 'Clear'}
                  </button>
                  <Link to="/compare" className="bg-gold-500 text-nile-900 px-6 py-2 rounded-lg font-bold hover:bg-gold-600 transition flex items-center gap-2 shadow-lg">
                     <ArrowLeftRight size={18} /> {t.compare} ({compareList.length})
                  </Link>
               </div>
            </div>
         </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-nile-900 text-gray-300 py-12 relative overflow-hidden mt-20">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-nile-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-start border-b border-white/10 pb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-8 bg-gold-500 rounded-full inline-block"></span>
              {t.about}
            </h3>
            <p className="text-sm leading-8 text-gray-400">
              {language === 'ar' 
                 ? 'نحن نعيد تعريف مفهوم السكن الفاخر في مصر. شركة النيل للاستثمار العقاري تقدم لك بوابتك نحو حياة الرفاهية في أرقى المجتمعات العمرانية.'
                 : 'Redefining luxury living in Egypt. Nile Real Estate Investment offers you a gateway to a life of luxury in the finest urban communities.'}
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">{language === 'ar' ? 'روابط هامة' : 'Important Links'}</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-gold-400 hover:translate-x-2 transition-transform inline-block">{t.properties}</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 hover:translate-x-2 transition-transform inline-block">{t.about}</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 hover:translate-x-2 transition-transform inline-block">{t.contact}</Link></li>
              <li><Link to="/admin" className="hover:text-gold-400 hover:translate-x-2 transition-transform inline-block">{t.dashboard}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">{t.contact}</h3>
            <div className="flex flex-col items-center md:items-start gap-4">
              <a href={`tel:${companySettings?.phone || '19999'}`} className="flex items-center gap-3 bg-white/5 hover:bg-gold-500 hover:text-nile-900 px-6 py-3 rounded-2xl transition duration-300 group border border-white/10">
                <Phone size={20} className="text-gold-500 group-hover:text-nile-900 transition-colors" /> 
                <span className="font-bold text-lg tracking-wider">{companySettings?.phone || '19999'}</span>
              </a>
              <p className="text-gray-400">{companySettings?.address || (language === 'ar' ? 'القاهرة الجديدة، التجمع الخامس، شارع التسعين' : 'New Cairo, 5th Settlement')}</p>
              {(companySettings?.commercialRegister || companySettings?.taxCardNumber) && (
                <div className="text-xs text-gold-300 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  {companySettings.commercialRegister && <div>سجل تجاري: <span className="font-mono">{companySettings.commercialRegister}</span></div>}
                  {companySettings.taxCardNumber && <div>بطاقة ضريبية: <span className="font-mono">{companySettings.taxCardNumber}</span></div>}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {brandTitle}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             {/* Social placeholders */}
             <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold-500 hover:text-nile-900 flex items-center justify-center transition cursor-pointer">FB</div>
             <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold-500 hover:text-nile-900 flex items-center justify-center transition cursor-pointer">IG</div>
             <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-gold-500 hover:text-nile-900 flex items-center justify-center transition cursor-pointer">IN</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
