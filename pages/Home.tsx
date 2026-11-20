
import React, { useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, BedDouble, Bath, Square, Bot, Heart, ArrowLeftRight, CheckCircle2 } from 'lucide-react';
import { INITIAL_FILTERS } from '../constants';
import { Location, PropertyType } from '../types';
import { useAppContext } from '../App';

export const HomePage: React.FC = () => {
  const { properties, filters, setFilters, toggleChat, favorites, toggleFavorite, toggleCompare, compareList, t, language } = useAppContext();
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchType = filters.type === 'all' || p.type === filters.type;
      const matchLocation = filters.location === 'all' || p.location === filters.location;
      const matchPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
      const matchArea = p.area >= filters.minArea;
      return matchType && matchLocation && matchPrice && matchArea;
    });
  }, [filters, properties]);

  const handleSearchClick = () => {
     resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handler to select type and scroll automatically
  const handleTypeSelect = (type: string) => {
    setFilters({ ...filters, type });
    // Small timeout to allow the UI to update visually before scrolling
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Mapping Property Types to Images for the Visual Filter
  const TYPE_IMAGES: Record<string, string> = {
    [PropertyType.APARTMENT]: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400',
    [PropertyType.VILLA]: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=400',
    [PropertyType.DUPLEX]: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=400',
    [PropertyType.PENTHOUSE]: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400',
    'all': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-40 pb-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nile-950/90 via-nile-900/80 to-gray-50/95"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-gold-400 font-bold tracking-[0.3em] uppercase mb-6 text-sm md:text-base">
                {language === 'ar' ? 'استثمارك الآمن في مصر' : 'Your Safe Investment in Egypt'}
            </h2>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-lg">
              {language === 'ar' ? 'أرقى المنازل' : 'Finest Homes'} <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 drop-shadow-sm">
                 {language === 'ar' ? 'تليق بمكانتك' : 'Worthy of You'}
              </span>
            </h1>
            <div className="flex justify-center gap-4 mb-12">
               <p className="text-lg md:text-2xl text-gray-200 max-w-2xl font-light hidden md:block leading-relaxed">
               {language === 'ar' 
                 ? 'نجمع لك بين روعة التصميم وعبقرية الموقع في القاهرة الجديدة والشيخ زايد.'
                 : 'We combine magnificent design with genius locations in New Cairo and Sheikh Zayed.'}
               </p>
            </div>
            
            <button 
              onClick={() => toggleChat(true)}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-gold-500/50 hover:bg-gold-500 hover:border-gold-500 hover:text-nile-900 text-gold-400 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl mb-12 group"
            >
               <Bot size={24} className="group-hover:animate-bounce" />
               <span className="text-lg">{language === 'ar' ? 'اسأل المستشار الذكي' : 'Ask Smart Agent'}</span>
            </button>
          </div>

          {/* Premium Visual Filter Bar */}
          <div className="glass-panel p-2 rounded-[3rem] shadow-2xl max-w-6xl mx-auto animate-fade-in-up border-none bg-white/10 backdrop-blur-xl" style={{animationDelay: '0.2s'}}>
            <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-inner">
               <div className="flex flex-col gap-8">
                  
                  {/* Visual Property Types */}
                  <div className="text-start">
                     <label className="text-xs font-bold text-gray-400 mb-4 block px-2 tracking-wider uppercase flex items-center gap-2">
                        <span className="w-2 h-2 bg-gold-500 rounded-full"></span>
                        {language === 'ar' ? 'اختر نوع العقار' : 'Select Property Type'}
                     </label>
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <button 
                           onClick={() => handleTypeSelect('all')}
                           className={`relative h-28 rounded-2xl overflow-hidden group transition-all duration-300 ${filters.type === 'all' ? 'ring-4 ring-gold-500 ring-offset-2 scale-105' : 'hover:shadow-lg hover:-translate-y-1'}`}
                        >
                           <img src={TYPE_IMAGES['all']} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="All" />
                           <div className={`absolute inset-0 flex items-center justify-center transition duration-300 ${filters.type === 'all' ? 'bg-nile-900/80' : 'bg-nile-900/60 group-hover:bg-nile-900/50'}`}>
                              <span className={`text-white font-bold ${filters.type === 'all' ? 'text-lg' : 'text-sm'} shadow-lg`}>{language === 'ar' ? 'الكل' : 'All'}</span>
                           </div>
                           {filters.type === 'all' && <div className="absolute top-2 right-2 bg-gold-500 text-white rounded-full p-1 shadow-md"><CheckCircle2 size={12} /></div>}
                        </button>
                        
                        {Object.values(PropertyType).map(t => (
                           <button 
                              key={t}
                              onClick={() => handleTypeSelect(t)}
                              className={`relative h-28 rounded-2xl overflow-hidden group transition-all duration-300 ${filters.type === t ? 'ring-4 ring-gold-500 ring-offset-2 scale-105' : 'hover:shadow-lg hover:-translate-y-1'}`}
                           >
                              <img src={TYPE_IMAGES[t] || TYPE_IMAGES['all']} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={t} />
                              <div className={`absolute inset-0 flex items-center justify-center transition duration-300 ${filters.type === t ? 'bg-nile-900/80' : 'bg-nile-900/60 group-hover:bg-nile-900/50'}`}>
                                 <span className={`text-white font-bold ${filters.type === t ? 'text-lg' : 'text-sm'} shadow-lg`}>{t}</span>
                              </div>
                              {filters.type === t && <div className="absolute top-2 right-2 bg-gold-500 text-white rounded-full p-1 shadow-md"><CheckCircle2 size={12} /></div>}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Location & Price Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end bg-gray-50 p-6 rounded-3xl border border-gray-100">
                     
                     {/* Location */}
                     <div className="md:col-span-5 text-start">
                        <label className="text-xs font-bold text-gray-400 mb-3 block px-1 tracking-wider uppercase">
                           {language === 'ar' ? 'الموقع المفضل' : 'Preferred Location'}
                        </label>
                         <div className="flex flex-wrap gap-2">
                           <button 
                              onClick={() => setFilters({...filters, location: 'all'})}
                              className={`px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 border ${filters.location === 'all' ? 'bg-nile-900 text-white border-nile-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gold-400'}`}
                           >
                              {language === 'ar' ? 'كل المناطق' : 'Any'}
                           </button>
                           {Object.values(Location).map(l => (
                              <button 
                                 key={l}
                                 onClick={() => setFilters({...filters, location: l})}
                                 className={`px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 border ${filters.location === l ? 'bg-nile-900 text-white border-nile-900 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gold-400'}`}
                              >
                                 {l}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Price Range */}
                     <div className="md:col-span-4 text-start">
                        <div className="flex justify-between items-center mb-3 px-1">
                           <label className="text-xs font-bold text-gray-400 uppercase">{language === 'ar' ? 'ميزانية حتى' : 'Max Budget'}</label>
                           <span className="text-sm font-black text-nile-900 bg-white shadow-sm px-3 py-1 rounded-lg border border-gray-100">{filters.maxPrice.toLocaleString()}</span>
                        </div>
                        <div className="relative pt-2">
                           <input 
                              type="range" 
                              min="1000000" 
                              max="50000000" 
                              step="1000000"
                              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold-500 hover:accent-gold-600 transition-all"
                              value={filters.maxPrice}
                              onChange={e => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                           />
                        </div>
                     </div>

                     {/* Search Button */}
                     <div className="md:col-span-3">
                        <button 
                           onClick={handleSearchClick}
                           className="w-full bg-nile-900 hover:bg-nile-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-nile-900/20 transition transform hover:-translate-y-1 flex justify-center items-center gap-2 group"
                        >
                           <Search size={20} className="group-hover:scale-110 transition" /> 
                           {language === 'ar' ? 'عرض النتائج' : 'Show Results'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div ref={resultsRef} className="container mx-auto px-4 py-20 scroll-mt-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-4">
          <div>
            <span className="text-gold-500 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                <span className="w-8 h-px bg-gold-500"></span>
                {language === 'ar' ? 'اكتشف الفرص' : 'Discover Opportunities'}
            </span>
            <h2 className="text-4xl font-bold text-nile-900 mt-2">
                {language === 'ar' ? 'عقارات مميزة للبيع' : 'Featured Properties'}
            </h2>
          </div>
          <div className="mt-4 md:mt-0">
             <span className="bg-nile-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
               {filteredProperties.length} {language === 'ar' ? 'نتيجة بحث' : 'Results'}
             </span>
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-500">
                {language === 'ar' ? 'عفواً، لا توجد عقارات مطابقة لبحثك.' : 'Sorry, no properties match your search.'}
            </h3>
            <button onClick={() => setFilters(INITIAL_FILTERS)} className="mt-4 text-gold-600 font-bold hover:underline">
              {language === 'ar' ? 'إعادة تعيين الفلتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, idx) => (
              <div 
                key={property.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 border border-gray-100 flex flex-col block relative"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                {/* Favorite Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.id); }}
                  className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition"
                  title={t.favorites}
                >
                  <Heart size={20} className={favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"} />
                </button>

                {/* Compare Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(property.id); }}
                  className={`absolute top-16 left-4 z-20 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition ${compareList.includes(property.id) ? 'bg-gold-500 text-nile-900' : 'text-gray-400 hover:text-nile-900'}`}
                  title={t.compare}
                >
                  <ArrowLeftRight size={20} />
                </button>

                <Link to={`/property/${property.id}`} className="flex-grow flex flex-col">
                  {/* Image Area */}
                  <div className="relative h-72 overflow-hidden">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
                    
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-nile-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {property.category}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="text-white">
                          <p className="text-lg font-bold flex items-center gap-1">
                            <MapPin size={16} className="text-gold-400" /> {property.location}
                          </p>
                      </div>
                      <div className="bg-gold-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          {property.type}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-nile-900 mb-2 line-clamp-1 group-hover:text-gold-600 transition-colors">
                      {property.title}
                    </h3>
                    
                    <div className="flex gap-4 my-4 text-gray-500 text-sm bg-gray-50 p-3 rounded-xl justify-around">
                      <div className="flex flex-col items-center gap-1">
                        <Square size={18} className="text-nile-400" />
                        <span className="font-bold">{property.area} m²</span>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="flex flex-col items-center gap-1">
                        <BedDouble size={18} className="text-nile-400" />
                        <span className="font-bold">{property.bedrooms}</span>
                      </div>
                      <div className="w-px bg-gray-200"></div>
                      <div className="flex flex-col items-center gap-1">
                        <Bath size={18} className="text-nile-400" />
                        <span className="font-bold">{property.bathrooms}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="block text-xs text-gray-400 font-bold mb-0.5">
                            {language === 'ar' ? 'السعر المطلوب' : 'Asking Price'}
                        </span>
                        <span className="text-2xl font-extrabold text-nile-800">
                          {property.price.toLocaleString()} <span className="text-sm font-normal text-gray-400">EGP</span>
                        </span>
                      </div>
                      <div
                        className={`bg-nile-900 group-hover:bg-gold-500 group-hover:text-nile-900 text-white p-3 rounded-full transition-all duration-300 transform shadow-lg ${language === 'ar' ? 'group-hover:rotate-[-45deg]' : 'group-hover:rotate-[45deg]'}`}
                      >
                        <ArrowRight size={20} className={language === 'en' ? 'transform rotate-180' : ''} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
