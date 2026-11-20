
import React, { useState } from 'react';
import { Property, BookingStatus } from '../types';
import { useAppContext } from '../App';
import { Calendar, Clock, User, Phone, CheckCircle, Send } from 'lucide-react';

interface Props {
  property: Property;
  onClose: () => void;
}

export const BookingForm: React.FC<Props> = ({ property, onClose }) => {
  const { addBooking } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Save to Internal System (Admin Dashboard)
    addBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      customerName: formData.name,
      customerPhone: formData.phone,
      date: formData.date,
      time: formData.time,
      status: BookingStatus.PENDING,
      createdAt: Date.now()
    });

    // 2. Send via WhatsApp
    // Using the requested number: +201030956097
    const adminPhone = "201030956097"; 
    
    const message = `*طلب حجز معاينة جديد* 🏠
    
📌 *الوحدة:* ${property.title}
👤 *الاسم:* ${formData.name}
📱 *الهاتف:* ${formData.phone}
📅 *التاريخ:* ${formData.date}
⏰ *الوقت:* ${formData.time}

يرجى تأكيد الموعد.`;

    // Encode the message for URL
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>
        <h3 className="text-2xl font-bold text-nile-900 mb-2">تم إرسال الطلب!</h3>
        <p className="text-gray-600 mb-6">تم تحويل بيانات الحجز إلى واتساب لتأكيد الموعد مع الإدارة.</p>
        <div className="flex flex-col gap-3">
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-lg transition">إغلاق</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-nile-900 mb-6 border-b pb-2">حجز موعد معاينة</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
          <div className="relative">
            <User className="absolute right-3 top-3 text-gray-400" size={18} />
            <input 
              required
              type="text" 
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
              placeholder="الاسم"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <div className="relative">
            <Phone className="absolute right-3 top-3 text-gray-400" size={18} />
            <input 
              required
              type="tel" 
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
              placeholder="01xxxxxxxxx"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
            <div className="relative">
              <Calendar className="absolute right-3 top-3 text-gray-400" size={18} />
              <input 
                required
                type="date" 
                className="w-full pr-10 pl-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوقت</label>
            <div className="relative">
              <Clock className="absolute right-3 top-3 text-gray-400" size={18} />
              <input 
                required
                type="time" 
                className="w-full pr-10 pl-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-400 outline-none"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-nile-900 text-gold-400 font-bold py-3 rounded-lg hover:bg-nile-800 transition shadow-md mt-4 flex items-center justify-center gap-2"
        >
          <Send size={18} /> تأكيد وإرسال عبر واتساب
        </button>
      </form>
    </div>
  );
};
