
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, X, Check, MapPin, BedDouble, Bath, Square, Search } from 'lucide-react';
import { useAppContext } from '../App';
import { Property } from '../types';

export const ComparePage: React.FC = () => {
  const { properties, compareList, toggleCompare, clearCompare, language, t } = useAppContext();
  
  const selectedProperties = properties.filter(p => compareList.includes(p.id));

  if (selectedProperties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-lg">
            <div className="bg-gold-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ArrowLeftRight size={32} className="text-gold-600" />
            </div>
            <h2 className="text-2xl font-bold text-nile-900 mb-2">{language === 'ar' ? 'لا توجد عقارات للمقارنة' : 'No properties to compare'}</h2>
            <p className="text-gray-500 mb-8">{language === 'ar' ? 'قم بإضافة عقارات لقائمة المقارنة من الصفحة الرئيسية.' : 'Add properties to the comparison list from the home page.'}</p>
            <Link to="/" className="bg-nile-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-nile-800 transition">
               {t.properties}
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-nile-900 flex items-center gap-3">
                <ArrowLeftRight className="text-gold-500" /> {t.compare}
            </h1>
            <button onClick={clearCompare} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition text-sm">
                {language === 'ar' ? 'مسح الكل' : 'Clear All'}
            </button>
        </div>

        <div className="overflow-x-auto pb-6">
            <div className="min-w-[800px] bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                <div className="grid" style={{ gridTemplateColumns: `200px repeat(${selectedProperties.length}, 1fr)` }}>
                    
                    {/* Header Row (Images & Titles) */}
                    <div className="p-4 md:p-6 border-b border-r border-gray-100 bg-gray-50/80 backdrop-blur-sm sticky left-0 right-0 z-10 flex items-end font-bold text-gray-400">
                        {language === 'ar' ? 'العقار' : 'Property'}
                    </div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 md:p-6 border-b border-l border-gray-100 relative text-center bg-white">
                            <button onClick={() => toggleCompare(p.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1"><X size={20}/></button>
                            <img src={p.imageUrl} className="w-full h-24 md:h-32 object-cover rounded-xl mb-3 shadow-sm" alt={p.title}/>
                            <h3 className="font-bold text-nile-900 text-xs md:text-sm mb-1">{p.title}</h3>
                            <Link to={`/property/${p.id}`} className="text-gold-600 text-xs font-bold hover:underline">{t.viewDetails}</Link>
                        </div>
                    ))}

                    {/* Price Row */}
                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'السعر' : 'Price'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center font-black text-sm md:text-lg text-nile-800 bg-white">
                            {p.price.toLocaleString()} <span className="text-xs font-normal text-gray-500">EGP</span>
                        </div>
                    ))}

                    {/* Location Row */}
                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'الموقع' : 'Location'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center text-xs md:text-sm text-gray-600 bg-white">
                            {p.location}
                        </div>
                    ))}

                     {/* Type Row */}
                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'النوع' : 'Type'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center text-xs md:text-sm text-gray-600 bg-white">
                            {p.type} <span className="text-xs bg-gray-100 px-2 rounded block md:inline mt-1 md:mt-0">{p.category}</span>
                        </div>
                    ))}

                    {/* Stats Rows */}
                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'المساحة' : 'Area'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center flex items-center justify-center gap-1 bg-white text-sm">
                             <Square size={16} className="text-gold-500"/> {p.area} m²
                        </div>
                    ))}

                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'الغرف' : 'Bedrooms'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center flex items-center justify-center gap-1 bg-white text-sm">
                             <BedDouble size={16} className="text-gold-500"/> {p.bedrooms}
                        </div>
                    ))}

                    <div className="p-4 border-b border-r border-gray-100 bg-gray-50 sticky left-0 z-10 font-bold text-nile-900 text-sm md:text-base">{language === 'ar' ? 'الحمامات' : 'Bathrooms'}</div>
                    {selectedProperties.map(p => (
                        <div key={p.id} className="p-4 border-b border-l border-gray-100 text-center flex items-center justify-center gap-1 bg-white text-sm">
                             <Bath size={16} className="text-gold-500"/> {p.bathrooms}
                        </div>
                    ))}

                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4 md:hidden">اسحب الجدول يميناً ويساراً للمقارنة</p>
        </div>
      </div>
    </div>
  );
};
