
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { MapPin, Home, Check, PlayCircle, ArrowRight, BedDouble, Bath, Square, Share2, Heart, Satellite } from 'lucide-react';
import { BookingForm } from '../components/BookingForm';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, favorites, toggleFavorite, language, companySettings } = useAppContext();
  const property = properties.find(p => p.id === id);
  const [showBooking, setShowBooking] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [downPaymentPct, setDownPaymentPct] = useState<number>(companySettings?.defaultDownPaymentPct || 20);
  const [installmentYears, setInstallmentYears] = useState<number>(Math.min(5, companySettings?.maxInstallmentYears || 8));

  if (!property) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-4xl font-bold text-gray-300 mb-4">404</h2>
            <p className="text-xl text-gray-500 mb-6">عفواً، العقار غير متاح حالياً</p>
            <Link to="/" className="bg-gold-500 text-white px-6 py-3 rounded-full font-bold hover:bg-gold-600 transition">العودة للرئيسية</Link>
        </div>
    );
  }

  const isFav = favorites.includes(property.id);

  // Default coords if none set
  const lat = property.mapCoordinates?.lat || 30.0444;
  const lng = property.mapCoordinates?.lng || 31.2357;
  // Google Maps Iframe Params: t=k (Satellite), t=m (Map), z=zoom
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header Image */}
      <div className="relative h-[50vh] md:h-[60vh] w-full">
         <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-nile-900 via-nile-900/40 to-transparent"></div>
         
         <div className={`absolute top-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-10`}>
            <Link to="/" className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/40 transition flex items-center justify-center">
               <ArrowRight size={24} className={language === 'en' ? 'transform rotate-180' : ''} />
            </Link>
         </div>

         <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12 text-white">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="animate-fade-in-up">
                    <span className="bg-gold-500 text-nile-900 font-bold px-3 py-1 rounded-lg text-sm mb-3 inline-block shadow-lg">
                        {property.type} • {property.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 leading-tight">{property.title}</h1>
                    <p className="text-gray-200 text-lg flex items-center gap-2">
                        <MapPin size={20} className="text-gold-400" /> {property.location}
                    </p>
                </div>
                <div className="flex gap-3 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <button className="bg-white/10 backdrop-blur p-3 rounded-full hover:bg-white/20 transition"><Share2 size={24} /></button>
                    <button 
                      onClick={() => toggleFavorite(property.id)}
                      className={`backdrop-blur p-3 rounded-full transition ${isFav ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      <Heart size={24} className={isFav ? "fill-red-500" : ""} />
                    </button>
                </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 flex justify-between items-center text-center animate-fade-in-up">
              <div className="flex-1">
                 <Square className="mx-auto text-nile-500 mb-2" size={24} />
                 <span className="block text-2xl font-bold text-nile-900">{property.area}</span>
                 <span className="text-xs text-gray-500 font-bold">m²</span>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div className="flex-1">
                 <BedDouble className="mx-auto text-nile-500 mb-2" size={24} />
                 <span className="block text-2xl font-bold text-nile-900">{property.bedrooms}</span>
                 <span className="text-xs text-gray-500 font-bold">{language === 'ar' ? 'غرف' : 'Beds'}</span>
              </div>
              <div className="w-px h-12 bg-gray-100"></div>
              <div className="flex-1">
                 <Bath className="mx-auto text-nile-500 mb-2" size={24} />
                 <span className="block text-2xl font-bold text-nile-900">{property.bathrooms}</span>
                 <span className="text-xs text-gray-500 font-bold">{language === 'ar' ? 'حمام' : 'Baths'}</span>
              </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-nile-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span> {language === 'ar' ? 'تفاصيل الوحدة' : 'Details'}
            </h2>
            <p className="text-gray-600 leading-8 text-lg mb-8">{property.description}</p>
            
            <h3 className="text-xl font-bold text-nile-900 mb-4">{language === 'ar' ? 'مميزات إضافية' : 'Features'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installment & Financing Calculator */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-nile-900 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
              {language === 'ar' ? 'حاسبة التقسيط والتمويل العقاري' : 'Installment Calculator'}
            </h2>
            {(() => {
              const downPaymentAmount = Math.round((property.price * downPaymentPct) / 100);
              const baseFinanced = Math.max(0, property.price - downPaymentAmount);
              const annualRate = Number(companySettings?.annualInterestPct || 0) / 100;
              const totalWithInterest = Math.round(baseFinanced * (1 + annualRate * installmentYears));
              const totalMonths = Math.max(1, installmentYears * 12);
              const monthlyInstallment = Math.round(totalWithInterest / totalMonths);
              const quarterlyInstallment = Math.round(totalWithInterest / (installmentYears * 4));
              const waDigits = String(companySettings?.whatsapp || companySettings?.phone || '').replace(/\D/g, '');
              const waNormalized = waDigits.startsWith('01') ? `2${waDigits}` : waDigits;
              const waMsg = `مرحباً ${companySettings?.name || ''}، أرغب في حجز وتفاصيل سداد الوحدة: ${property.title}\nالسعر: ${property.price.toLocaleString()} ج.م\nالمقدم (${downPaymentPct}%): ${downPaymentAmount.toLocaleString()} ج.م\nالمدة: ${installmentYears} سنوات\nالقسط الشهري التقريبي: ${monthlyInstallment.toLocaleString()} ج.م`;

              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-nile-900 mb-2">
                        <span>{language === 'ar' ? 'نسبة المقدم' : 'Down Payment'}</span>
                        <span className="text-gold-600">{downPaymentPct}% ({downPaymentAmount.toLocaleString()} ج.م)</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={70}
                        step={5}
                        value={downPaymentPct}
                        onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                        className="w-full accent-nile-900 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-nile-900 mb-2">
                        <span>{language === 'ar' ? 'مدة التقسيط' : 'Installment Period'}</span>
                        <span className="text-gold-600">{installmentYears} {language === 'ar' ? 'سنوات' : 'Years'}</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={Math.max(10, companySettings?.maxInstallmentYears || 10)}
                        step={1}
                        value={installmentYears}
                        onChange={(e) => setInstallmentYears(Number(e.target.value))}
                        className="w-full accent-nile-900 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 font-bold mb-1">قيمة المقدم</span>
                      <span className="text-lg font-black text-nile-900">{downPaymentAmount.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="block text-xs text-gray-500 font-bold mb-1">المتبقي</span>
                      <span className="text-lg font-black text-nile-900">{totalWithInterest.toLocaleString()}</span>
                    </div>
                    <div className="bg-gold-50 p-4 rounded-2xl border border-gold-200 text-center">
                      <span className="block text-xs text-gold-700 font-bold mb-1">القسط الشهري</span>
                      <span className="text-lg font-black text-nile-900">{monthlyInstallment.toLocaleString()} ج.م</span>
                    </div>
                    <div className="bg-nile-50 p-4 rounded-2xl border border-nile-100 text-center">
                      <span className="block text-xs text-nile-700 font-bold mb-1">القسط الربع سنوي</span>
                      <span className="text-lg font-black text-nile-900">{quarterlyInstallment.toLocaleString()} ج.م</span>
                    </div>
                  </div>

                  {waNormalized && (
                    <a
                      href={`https://wa.me/${waNormalized}?text=${encodeURIComponent(waMsg)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-md"
                    >
                      📲 اطلب خطة السداد الرسمية وتفاصيل التعاقد عبر واتساب
                    </a>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Media & Map */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-nile-900 text-lg">{language === 'ar' ? 'الموقع الجغرافي' : 'Location Map'}</h3>
                  <button 
                    onClick={() => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition ${mapType === 'satellite' ? 'bg-nile-900 text-white' : 'bg-gray-100 text-nile-900 hover:bg-gray-200'}`}
                  >
                     <Satellite size={16} />
                     {mapType === 'roadmap' ? (language === 'ar' ? 'عرض قمر صناعي' : 'Satellite View') : (language === 'ar' ? 'عرض خريطة' : 'Map View')}
                  </button>
               </div>
               <div className="bg-gray-100 h-80 rounded-2xl overflow-hidden relative shadow-inner">
                  <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }}
                      src={mapUrl} 
                      allowFullScreen
                  ></iframe>
               </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="glass-panel bg-white/80 p-6 rounded-3xl shadow-2xl border border-white/50 backdrop-blur-xl">
              <div className="text-center mb-6">
                 <p className="text-gray-500 text-sm font-bold mb-1">{language === 'ar' ? 'سعر الوحدة' : 'Property Price'}</p>
                 <div className="text-4xl font-black text-nile-900">
                    {property.price.toLocaleString()} <span className="text-lg font-bold text-gray-500">EGP</span>
                 </div>
              </div>
              
              {!showBooking ? (
                <button 
                  onClick={() => setShowBooking(true)}
                  className="w-full bg-nile-900 text-gold-400 font-bold py-4 rounded-xl hover:bg-nile-800 transition shadow-lg shadow-nile-900/20 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {language === 'ar' ? 'حجز معاينة الآن' : 'Book Viewing Now'} <ArrowRight size={20} className={language === 'en' ? 'transform rotate-180' : ''} />
                </button>
              ) : (
                <div className="animate-fade-in-up">
                   <BookingForm property={property} onClose={() => setShowBooking(false)} />
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                 <div className="flex items-center justify-center gap-2 text-nile-900 font-bold mb-2">
                    <img src="https://ui-avatars.com/api/?name=RE+Agent&background=f59e0b&color=fff" className="w-8 h-8 rounded-full" alt="Agent" />
                    {companySettings?.name || (language === 'ar' ? 'مستشارك العقاري' : 'Your Agent')}
                 </div>
                 <a href={`tel:${companySettings?.phone || '19999'}`} className="text-gray-500 hover:text-gold-600 text-sm transition">{companySettings?.phone || '19999'}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
