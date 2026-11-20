
import React from 'react';
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Linkedin } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
       <div className="bg-nile-900 text-white py-20 relative">
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
           <h1 className="text-5xl font-extrabold mb-4">اتصل بنا</h1>
           <p className="text-xl text-gray-300 max-w-2xl mx-auto">فريقنا جاهز للرد على استفساراتك ومساعدتك في اختيار منزلك الجديد.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-4">
               <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-nile-900 mb-6">بيانات التواصل</h3>
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <div className="bg-gold-100 p-3 rounded-xl text-gold-600"><Phone size={20} /></div>
                        <div>
                           <p className="text-sm text-gray-500 font-bold">اتصل بنا</p>
                           <p className="text-nile-900 font-bold text-lg dir-ltr text-right">19999</p>
                           <p className="text-nile-900 font-bold text-lg dir-ltr text-right">+20 100 000 0000</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-gold-100 p-3 rounded-xl text-gold-600"><Mail size={20} /></div>
                        <div>
                           <p className="text-sm text-gray-500 font-bold">البريد الإلكتروني</p>
                           <p className="text-nile-900 font-bold">info@nile-estate.com</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-gold-100 p-3 rounded-xl text-gold-600"><MapPin size={20} /></div>
                        <div>
                           <p className="text-sm text-gray-500 font-bold">العنوان</p>
                           <p className="text-nile-900 font-bold">مبنى 105، شارع التسعين الجنوبي، التجمع الخامس، القاهرة الجديدة.</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="bg-gold-100 p-3 rounded-xl text-gold-600"><Clock size={20} /></div>
                        <div>
                           <p className="text-sm text-gray-500 font-bold">مواعيد العمل</p>
                           <p className="text-nile-900 font-bold">يومياً من 10 صباحاً حتى 10 مساءً</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100">
                     <h4 className="font-bold text-nile-900 mb-4">تابعنا على</h4>
                     <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-nile-900 text-white flex items-center justify-center hover:bg-gold-500 hover:text-nile-900 transition"><Facebook size={20} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-nile-900 text-white flex items-center justify-center hover:bg-gold-500 hover:text-nile-900 transition"><Instagram size={20} /></a>
                        <a href="#" className="w-10 h-10 rounded-full bg-nile-900 text-white flex items-center justify-center hover:bg-gold-500 hover:text-nile-900 transition"><Linkedin size={20} /></a>
                     </div>
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
               <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-gray-100 h-full">
                  <h3 className="text-2xl font-bold text-nile-900 mb-2">أرسل لنا رسالة</h3>
                  <p className="text-gray-500 mb-8">سجل اهتمامك الآن وسيقوم أحد مستشارينا العقاريين بالتواصل معك في أقرب وقت.</p>
                  
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">الاسم بالكامل</label>
                           <input type="text" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-400 outline-none transition" placeholder="الاسم" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                           <input type="tel" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-400 outline-none transition" placeholder="01xxxxxxxxx" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">نوع الاستفسار</label>
                        <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-400 outline-none transition cursor-pointer">
                           <option>طلب شراء وحدة</option>
                           <option>عرض وحدة للبيع</option>
                           <option>استثمار عقاري</option>
                           <option>شكوى أو اقتراح</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">رسالتك</label>
                        <textarea rows={5} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-400 outline-none transition" placeholder="اكتب تفاصيل استفسارك هنا..."></textarea>
                     </div>
                     <button className="w-full bg-nile-900 text-white font-bold py-4 rounded-xl hover:bg-gold-500 hover:text-nile-900 transition shadow-lg flex items-center justify-center gap-2">
                        <Send size={20} /> إرسال الرسالة
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
