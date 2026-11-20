
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, MapPin, ArrowRight, Square, BedDouble, Bath } from 'lucide-react';
import { useAppContext } from '../App';

export const FavoritesPage: React.FC = () => {
  const { properties, favorites, toggleFavorite } = useAppContext();
  
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-nile-900 text-white py-16 relative">
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
           <h1 className="text-4xl font-extrabold mb-2 flex items-center justify-center gap-3">
             <Heart className="text-red-500 fill-red-500" size={40} />
             وحداتك المفضلة
           </h1>
           <p className="text-lg text-gray-300">قائمة بأرقى العقارات التي نالت إعجابك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        {favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-gray-100 flex flex-col items-center">
            <Heart size={64} className="text-gray-200 mb-6" />
            <h3 className="text-2xl font-bold text-gray-500 mb-2">القائمة فارغة حالياً</h3>
            <p className="text-gray-400 mb-8">لم تقم بإضافة أي عقارات للمفضلة بعد.</p>
            <Link to="/" className="bg-gold-500 text-nile-900 px-8 py-3 rounded-xl font-bold hover:bg-gold-600 transition shadow-lg">
              تصفح العقارات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteProperties.map((property, idx) => (
              <div 
                key={property.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-500 border border-gray-100 flex flex-col block relative animate-fade-in-up"
                style={{animationDelay: `${idx * 100}ms`}}
              >
                {/* Remove from Favorite Button */}
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(property.id); }}
                  className="absolute top-4 left-4 z-20 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition text-red-500"
                  title="إزالة من المفضلة"
                >
                  <Heart size={20} className="fill-red-500" />
                </button>

                <Link to={`/property/${property.id}`} className="flex-grow flex flex-col">
                  {/* Image Area */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition duration-300"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-lg font-bold flex items-center gap-1">
                          <MapPin size={16} className="text-gold-400" /> {property.location}
                        </p>
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
                        <span className="font-bold">{property.area} م²</span>
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
                        <span className="block text-xs text-gray-400 font-bold mb-0.5">السعر المطلوب</span>
                        <span className="text-2xl font-extrabold text-nile-800">
                          {property.price.toLocaleString()} <span className="text-sm font-normal text-gray-400">ج.م</span>
                        </span>
                      </div>
                      <div className="bg-nile-900 group-hover:bg-gold-500 group-hover:text-nile-900 text-white p-3 rounded-full transition-all duration-300 transform group-hover:rotate-[-45deg] shadow-lg">
                        <ArrowRight size={20} />
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
