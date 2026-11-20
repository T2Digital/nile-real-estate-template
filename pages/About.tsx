
import React from 'react';
import { Target, Award, Users, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-nile-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10 text-center animate-fade-in-up">
           <h1 className="text-5xl font-extrabold mb-4">من نحن</h1>
           <p className="text-xl text-gray-300 max-w-2xl mx-auto">رواد الاستثمار العقاري الفاخر في مصر، نصنع مستقبلاً من الرفاهية والاستقرار.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
         <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl font-bold text-nile-900 mb-6 relative">
                     <span className="absolute -top-6 -right-6 text-9xl text-gray-50 font-black z-0">01</span>
                     <span className="relative z-10">قصتنا ورؤيتنا</span>
                  </h2>
                  <p className="text-gray-600 leading-8 text-lg mb-6 text-justify">
                     تأسست "النيل للاستثمار العقاري" برؤية واضحة: تغيير مفهوم السكن في مصر. نحن لا نبيع مجرد جدران، بل نقدم أسلوب حياة متكامل يليق بصفوة المجتمع. نركز في اختياراتنا على المواقع الاستراتيجية في القاهرة الجديدة والشيخ زايد والعاصمة الإدارية، لضمان أعلى عائد استثماري وراحة بال لعملائنا.
                  </p>
                  <p className="text-gray-600 leading-8 text-lg text-justify">
                     فريقنا المكون من خبراء السوق العقاري يضمن لك تجربة شراء سلسة، شفافة، وخالية من التعقيدات، مدعومة بأحدث تقنيات الذكاء الاصطناعي لترشيح الأنسب لك.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 rounded-2xl p-6 text-center hover:bg-gold-50 transition duration-300 group">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-nile-900 group-hover:text-gold-600 shadow-sm"><Target size={24} /></div>
                     <h3 className="font-bold text-nile-900 mb-1">الدقة</h3>
                     <p className="text-xs text-gray-500">اختيارات مدروسة</p>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-6 text-center hover:bg-gold-50 transition duration-300 group mt-8">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-nile-900 group-hover:text-gold-600 shadow-sm"><Award size={24} /></div>
                     <h3 className="font-bold text-nile-900 mb-1">التميز</h3>
                     <p className="text-xs text-gray-500">جودة لا تضاهى</p>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-6 text-center hover:bg-gold-50 transition duration-300 group -mt-8">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-nile-900 group-hover:text-gold-600 shadow-sm"><ShieldCheck size={24} /></div>
                     <h3 className="font-bold text-nile-900 mb-1">الأمان</h3>
                     <p className="text-xs text-gray-500">استثمار مضمون</p>
                  </div>
                  <div className="bg-gray-100 rounded-2xl p-6 text-center hover:bg-gold-50 transition duration-300 group">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-nile-900 group-hover:text-gold-600 shadow-sm"><Users size={24} /></div>
                     <h3 className="font-bold text-nile-900 mb-1">خدمة العملاء</h3>
                     <p className="text-xs text-gray-500">معك في كل خطوة</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
