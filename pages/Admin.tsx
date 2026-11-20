
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { BookingStatus, Property, PropertyType, PropertyCategory, Location, Booking } from '../types';
import { Calendar as CalendarIcon, Phone, Check, FileText, XCircle, MessageCircle, Home, LayoutDashboard, CalendarDays, Plus, Trash2, Edit, LogOut, AlertCircle, Menu, X, Search, Filter, MapPin, CheckCircle, ArrowRight, ArrowLeft, Clock, User, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

type Tab = 'dashboard' | 'properties' | 'calendar' | 'settings';

// --- Sales Pipeline Stepper Component ---
const BookingPipeline: React.FC<{ booking: Booking }> = ({ booking }) => {
  const { updateBookingStatus } = useAppContext();
  
  const stages = [
    { status: BookingStatus.PENDING, label: 'انتظار', icon: Clock },
    { status: BookingStatus.CONFIRMED, label: 'تأكيد', icon: CheckCircle },
    { status: BookingStatus.COMPLETED, label: 'معاينة', icon: MapPin },
    { status: BookingStatus.CONTRACTED, label: 'تعاقد', icon: FileText }
  ];

  // Find current stage index (ignore CANCELLED for the happy path stepper)
  const currentIdx = stages.findIndex(s => s.status === booking.status);
  const isCancelled = booking.status === BookingStatus.CANCELLED;

  if (isCancelled) {
     return (
        <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1 rounded-full w-fit">
           <XCircle size={16} /> <span className="text-xs font-bold">تم الإلغاء</span>
           <button onClick={() => updateBookingStatus(booking.id, BookingStatus.PENDING)} className="text-xs underline mr-2">إعادة</button>
        </div>
     );
  }

  return (
    <div className="flex items-center w-full max-w-[300px]">
       {stages.map((stage, idx) => {
         const isActive = idx <= currentIdx;
         const isCurrent = idx === currentIdx;
         const Icon = stage.icon;
         
         return (
           <React.Fragment key={stage.status}>
             {/* Connecting Line */}
             {idx > 0 && (
               <div className={`h-1 flex-1 mx-1 rounded-full transition-all duration-500 ${idx <= currentIdx ? 'bg-green-500' : 'bg-gray-200'}`}></div>
             )}
             
             {/* Stage Node */}
             <div 
               onClick={() => updateBookingStatus(booking.id, stage.status)}
               className="relative flex flex-col items-center group cursor-pointer"
               title={`نقل إلى: ${stage.label}`}
             >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 border-2 ${
                    isActive 
                    ? 'bg-green-500 border-green-500 text-white shadow-md scale-105' 
                    : 'bg-white border-gray-200 text-gray-300 hover:border-green-300 hover:text-green-300'
                }`}>
                   <Icon size={14} />
                </div>
                {/* Label */}
                <span className={`absolute -bottom-5 text-[9px] font-bold whitespace-nowrap transition-colors duration-300 ${isCurrent ? 'text-green-700' : 'text-gray-400'}`}>
                  {stage.label}
                </span>
             </div>
           </React.Fragment>
         )
       })}
    </div>
  )
}

export const AdminDashboard: React.FC = () => {
  const { bookings, updateBookingStatus, properties, addProperty, deleteProperty, updateProperty, companySettings, updateCompanySettings, t, isAdminLoggedIn, loginAdmin, logoutAdmin } = useAppContext();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  
  // Mobile Sidebar State
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Property Modal State
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProperty, setCurrentProperty] = useState<Partial<Property>>({});
  const [locating, setLocating] = useState(false);

  // Login Handler (supports /api/tenant-auth, Tenant Owner credentials, and default admin)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const tenantBrand = (typeof window !== 'undefined' && (window as any).__TENANT_BRAND__) || null;
    const slug = tenantBrand?.slug;
    const emailClean = loginData.email.trim().toLowerCase();

    if (slug && slug !== 'nile-real-estate') {
      try {
        const res = await fetch('/api/tenant-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brandSlug: slug, email: emailClean, password: loginData.password })
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.ok && data?.token) {
          localStorage.setItem(`t2_tenant_session_${slug}`, JSON.stringify(data));
          loginAdmin();
          setLoginError('');
          return;
        }
      } catch {}
    }

    const isOwnerFallback =
      tenantBrand?.adminEmail &&
      emailClean === String(tenantBrand.adminEmail).toLowerCase() &&
      loginData.password.startsWith('T2@');

    if (isOwnerFallback || (emailClean === 'admin' && loginData.password === 'admin')) {
      loginAdmin();
      setLoginError('');
    } else {
      setLoginError("بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
    }
  };

  const generateWhatsAppLink = (booking: any) => {
    let phone = booking.customerPhone.replace(/\D/g, '');
    if (phone.startsWith('01')) {
      phone = '2' + phone;
    }
    const text = `مرحباً أستاذ/ة ${booking.customerName}،\n\nيؤكد فريق ${companySettings.name} حجز موعد المعاينة الخاص بكم.\n\n🏠 *تفاصيل الوحدة:* ${booking.propertyTitle}\n📅 *الموعد:* ${booking.date} الساعة ${booking.time}\n\nنحن في انتظاركم! 🌹`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const handleGetCurrentLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setCurrentProperty(prev => ({
                ...prev,
                mapCoordinates: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
            }));
            setLocating(false);
        },
        (error) => {
            console.error("Error getting location", error);
            alert("Unable to retrieve your location");
            setLocating(false);
        }
    );
  };

  const handleLogout = () => {
    logoutAdmin();
    setActiveTab('dashboard');
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-nile-900 to-nile-950 flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl w-full max-w-md animate-fade-in-up shadow-2xl border-white/20">
          <div className="text-center mb-8">
            <div className="bg-gold-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-gold-glow transform rotate-3">
              <LayoutDashboard size={32} className="text-nile-900" />
            </div>
            <h2 className="text-3xl font-bold text-nile-900 mb-2">لوحة التحكم</h2>
            <p className="text-gray-600 font-medium">بوابة النيل للاستثمار العقاري</p>
          </div>
          {loginError && (
            <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-xl flex items-center gap-2 text-red-700 animate-pulse-slow">
              <AlertCircle size={20} />
              <span className="text-sm font-bold">{loginError}</span>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">اسم المستخدم</label>
              <input 
                type="text" 
                className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition backdrop-blur-sm"
                value={loginData.email}
                onChange={e => {setLoginData({...loginData, email: e.target.value}); setLoginError('');}}
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">كلمة المرور</label>
              <input 
                type="password" 
                className="w-full p-4 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none transition backdrop-blur-sm"
                value={loginData.password}
                onChange={e => {setLoginData({...loginData, password: e.target.value}); setLoginError('');}}
                placeholder="admin"
              />
            </div>
            <button type="submit" className="w-full bg-nile-900 text-white font-bold py-4 rounded-xl hover:bg-nile-800 transition shadow-lg transform hover:-translate-y-1">
              تسجيل الدخول الآمن
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">بيانات التجربة: admin / admin</p>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  const DashboardView = () => {
    const stats = [
      { name: 'انتظار', count: bookings.filter(b => b.status === BookingStatus.PENDING).length, color: '#f59e0b', icon: Clock },
      { name: 'مؤكد', count: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length, color: '#10b981', icon: CheckCircle },
      { name: 'تمت المعاينة', count: bookings.filter(b => b.status === BookingStatus.COMPLETED).length, color: '#3b82f6', icon: MapPin },
      { name: 'تعاقد', count: bookings.filter(b => b.status === BookingStatus.CONTRACTED).length, color: '#8b5cf6', icon: FileText },
    ];

    const chartData = [
       { name: 'شقق', value: properties.filter(p => p.type === PropertyType.APARTMENT).length },
       { name: 'فلل', value: properties.filter(p => p.type === PropertyType.VILLA).length },
       { name: 'دوبلكس', value: properties.filter(p => p.type === PropertyType.DUPLEX).length },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="p-3 rounded-full mb-3 text-white shadow-lg" style={{ backgroundColor: stat.color }}>
                <stat.icon size={20} />
              </div>
              <h3 className="text-gray-500 font-bold text-sm mb-1">{stat.name}</h3>
              <span className="text-3xl font-black text-nile-900">{stat.count}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Recent Bookings */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-nile-900 mb-4 flex items-center gap-2">
                 <Clock size={20} className="text-gold-500" /> آخر الحجوزات
              </h3>
              <div className="space-y-4">
                 {bookings.slice(0, 4).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gold-50 transition group">
                       <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-full text-nile-900 font-bold text-xs h-10 w-10 flex items-center justify-center shadow-sm">
                             {booking.customerName.charAt(0)}
                          </div>
                          <div>
                             <p className="font-bold text-sm text-nile-900">{booking.customerName}</p>
                             <p className="text-[10px] text-gray-500">{booking.date}</p>
                          </div>
                       </div>
                       <a 
                         href={generateWhatsAppLink(booking)} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-500 hover:text-white transition opacity-0 group-hover:opacity-100"
                         title="تواصل واتساب"
                       >
                          <MessageCircle size={16} />
                       </a>
                    </div>
                 ))}
                 {bookings.length === 0 && <p className="text-gray-400 text-sm text-center py-4">لا توجد حجوزات حديثة</p>}
              </div>
           </div>

           {/* Chart */}
           <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <h3 className="font-bold text-nile-900 mb-4 self-start">توزيع العقارات</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-4">
                 {chartData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs font-bold text-gray-500">
                       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                       {entry.name}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const CalendarView = () => (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
         <h3 className="font-bold text-nile-900 text-lg flex items-center gap-2">
            <CalendarDays size={20} className="text-gold-500" /> إدارة المواعيد
         </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
            <tr>
              <th className="p-4 rounded-tr-3xl">العميل</th>
              <th className="p-4">الوحدة</th>
              <th className="p-4">الموعد</th>
              <th className="p-4 text-center">مرحلة التعاقد</th>
              <th className="p-4 rounded-tl-3xl text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gold-50/30 transition">
                <td className="p-4">
                  <div className="font-bold text-nile-900">{booking.customerName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1"><Phone size={10}/> {booking.customerPhone}</div>
                </td>
                <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate">{booking.propertyTitle}</td>
                <td className="p-4 text-sm">
                  <div className="font-bold text-nile-800">{booking.date}</div>
                  <div className="text-xs text-gray-500">{booking.time}</div>
                </td>
                <td className="p-4 flex justify-center">
                   <BookingPipeline booking={booking} />
                </td>
                <td className="p-4">
                   <div className="flex justify-center gap-2">
                      <a 
                        href={generateWhatsAppLink(booking)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition"
                        title="تأكيد واتساب"
                      >
                         <MessageCircle size={16} />
                      </a>
                      <button 
                        onClick={() => updateBookingStatus(booking.id, BookingStatus.CANCELLED)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition"
                        title="إلغاء الحجز"
                      >
                         <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
           <div className="p-12 text-center text-gray-400">
              <CalendarDays size={48} className="mx-auto mb-4 opacity-20" />
              <p>لا توجد مواعيد محجوزة حالياً</p>
           </div>
        )}
      </div>
    </div>
  );

  const PropertiesView = () => (
    <div className="space-y-6 animate-fade-in-up">
       <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-nile-900 text-lg flex items-center gap-2">
             <Home size={20} className="text-gold-500" /> إدارة الوحدات
          </h3>
          <button 
            onClick={() => {
               setCurrentProperty({});
               setIsEditing(false);
               setShowPropertyModal(true);
            }}
            className="bg-nile-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gold-500 hover:text-nile-900 transition flex items-center gap-2"
          >
             <Plus size={16} /> إضافة وحدة
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map(property => (
             <div key={property.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition">
                <img src={property.imageUrl} alt={property.title} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-grow">
                   <div className="flex justify-between items-start">
                      <h4 className="font-bold text-nile-900 text-sm line-clamp-1">{property.title}</h4>
                      <div className="flex gap-1">
                         <button 
                           onClick={() => { setCurrentProperty(property); setIsEditing(true); setShowPropertyModal(true); }}
                           className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition"
                         >
                            <Edit size={14} />
                         </button>
                         <button 
                           onClick={() => { if(window.confirm('هل أنت متأكد من الحذف؟')) deleteProperty(property.id); }}
                           className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                   <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={10} /> {property.location}</p>
                   <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold bg-gold-50 text-gold-700 px-2 py-0.5 rounded">{property.type}</span>
                      <span className="text-xs font-bold text-nile-900">{property.price.toLocaleString()} EGP</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-6 py-4 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-4">
             <button className="md:hidden p-2 bg-gray-100 rounded-lg" onClick={() => setIsMobileSidebarOpen(true)}>
                <Menu size={20} />
             </button>
             <h1 className="text-xl font-black text-nile-900">لوحة التحكم</h1>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-bold text-gray-600">متصل: admin</span>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition" title="تسجيل خروج">
               <LogOut size={20} />
            </button>
         </div>
      </header>

      <div className="flex">
         {/* Sidebar (Desktop) */}
         <aside className="hidden md:block w-64 bg-white border-l border-gray-100 min-h-[calc(100vh-73px)] p-6 sticky top-[73px]">
            <nav className="space-y-2">
               <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'dashboard' ? 'bg-nile-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <LayoutDashboard size={20} /> الرئيسية
               </button>
               <button onClick={() => setActiveTab('properties')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'properties' ? 'bg-nile-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Home size={20} /> العقارات
               </button>
               <button onClick={() => setActiveTab('calendar')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'calendar' ? 'bg-nile-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <CalendarDays size={20} /> المواعيد
               </button>
               <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'settings' ? 'bg-nile-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Settings size={20} /> إعدادات الشركة والتمويل
               </button>
            </nav>
         </aside>

         {/* Mobile Sidebar Overlay */}
         {isMobileSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileSidebarOpen(false)}>
               <div className="absolute top-0 right-0 bottom-0 w-3/4 bg-white p-6 shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-8">
                     <h2 className="text-xl font-bold text-nile-900">القائمة</h2>
                     <button onClick={() => setIsMobileSidebarOpen(false)}><X size={24} /></button>
                  </div>
                  <nav className="space-y-4">
                     <button onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeTab === 'dashboard' ? 'bg-nile-900 text-white' : 'bg-gray-100'}`}>
                        <LayoutDashboard size={20} /> الرئيسية
                     </button>
                     <button onClick={() => { setActiveTab('properties'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeTab === 'properties' ? 'bg-nile-900 text-white' : 'bg-gray-100'}`}>
                        <Home size={20} /> العقارات
                     </button>
                     <button onClick={() => { setActiveTab('calendar'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeTab === 'calendar' ? 'bg-nile-900 text-white' : 'bg-gray-100'}`}>
                        <CalendarDays size={20} /> المواعيد
                     </button>
                     <button onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold ${activeTab === 'settings' ? 'bg-nile-900 text-white' : 'bg-gray-100'}`}>
                        <Settings size={20} /> إعدادات الشركة والتمويل
                     </button>
                  </nav>
               </div>
            </div>
         )}

         {/* Main Content Area */}
         <main className="flex-grow p-6 md:p-8 overflow-x-hidden">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'properties' && <PropertiesView />}
            {activeTab === 'calendar' && <CalendarView />}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 max-w-3xl space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-black text-nile-900 flex items-center gap-2">
                    <Settings size={20} className="text-gold-500" /> إعدادات الشركة العقارية والتمويل
                  </h3>
                  {settingsSavedToast && <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">تم الحفظ سحابياً ✓</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">اسم الشركة</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.name} onChange={e => updateCompanySettings({ name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">الاسم الإنجليزي / الشعار</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.nameEn || ''} onChange={e => updateCompanySettings({ nameEn: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">رقم الهاتف</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono" value={companySettings.phone} onChange={e => updateCompanySettings({ phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">رقم الواتساب</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono" value={companySettings.whatsapp} onChange={e => updateCompanySettings({ whatsapp: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">رقم السجل التجاري</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono" value={companySettings.commercialRegister} onChange={e => updateCompanySettings({ commercialRegister: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">رقم البطاقة الضريبية</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono" value={companySettings.taxCardNumber} onChange={e => updateCompanySettings({ taxCardNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">نسبة المقدم الافتراضية (%)</label>
                    <input type="number" min={5} max={80} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.defaultDownPaymentPct} onChange={e => updateCompanySettings({ defaultDownPaymentPct: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">أقصى مدة تقسيط (سنوات)</label>
                    <input type="number" min={1} max={25} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.maxInstallmentYears} onChange={e => updateCompanySettings({ maxInstallmentYears: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">نسبة الفائدة السنوية (% - 0 بدون فوائد)</label>
                    <input type="number" min={0} max={30} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.annualInterestPct} onChange={e => updateCompanySettings({ annualInterestPct: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">العنوان</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" value={companySettings.address || ''} onChange={e => updateCompanySettings({ address: e.target.value })} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    updateCompanySettings({});
                    setSettingsSavedToast(true);
                    setTimeout(() => setSettingsSavedToast(false), 2500);
                  }}
                  className="bg-nile-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gold-500 hover:text-nile-900 transition"
                >
                  حفظ وتزامن الإعدادات السحابية
                </button>
              </div>
            )}
         </main>
      </div>

      {/* Add/Edit Property Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                 <h3 className="text-xl font-bold text-nile-900">{isEditing ? 'تعديل العقار' : 'إضافة عقار جديد'}</h3>
                 <button onClick={() => setShowPropertyModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">عنوان العقار</label>
                       <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                          value={currentProperty.title || ''} onChange={e => setCurrentProperty({...currentProperty, title: e.target.value})} />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">السعر (EGP)</label>
                       <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                          value={currentProperty.price || ''} onChange={e => setCurrentProperty({...currentProperty, price: parseInt(e.target.value)})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">النوع</label>
                       <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500"
                          value={currentProperty.type || PropertyType.APARTMENT} 
                          onChange={e => setCurrentProperty({...currentProperty, type: e.target.value as PropertyType})}
                       >
                          {Object.values(PropertyType).map(t => <option key={t} value={t}>{t}</option>)}
                       </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">التصنيف</label>
                        <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500"
                            value={currentProperty.category || PropertyCategory.BUILDING} 
                            onChange={e => setCurrentProperty({...currentProperty, category: e.target.value as PropertyCategory})}
                        >
                            {Object.values(PropertyCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">الموقع</label>
                       <select className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500"
                          value={currentProperty.location || Location.NEW_CAIRO} 
                          onChange={e => setCurrentProperty({...currentProperty, location: e.target.value as Location})}
                       >
                          {Object.values(Location).map(l => <option key={l} value={l}>{l}</option>)}
                       </select>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">المساحة (م²)</label>
                       <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                          value={currentProperty.area || ''} onChange={e => setCurrentProperty({...currentProperty, area: parseInt(e.target.value)})} />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">الغرف</label>
                       <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                          value={currentProperty.bedrooms || ''} onChange={e => setCurrentProperty({...currentProperty, bedrooms: parseInt(e.target.value)})} />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">الحمامات</label>
                       <input type="number" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                          value={currentProperty.bathrooms || ''} onChange={e => setCurrentProperty({...currentProperty, bathrooms: parseInt(e.target.value)})} />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">رابط الصورة</label>
                    <input type="text" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500 text-left dir-ltr" 
                       value={currentProperty.imageUrl || ''} onChange={e => setCurrentProperty({...currentProperty, imageUrl: e.target.value})} placeholder="https://..." />
                 </div>

                 <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-gray-500">الإحداثيات (خط العرض، خط الطول)</label>
                        <button 
                            onClick={handleGetCurrentLocation}
                            className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded hover:bg-gold-200 flex items-center gap-1 transition"
                            disabled={locating}
                        >
                            {locating ? 'جاري التحديد...' : <><MapPin size={10} /> موقعي الحالي</>}
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input type="number" step="any" placeholder="Lat" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                           value={currentProperty.mapCoordinates?.lat || ''} 
                           onChange={e => setCurrentProperty({...currentProperty, mapCoordinates: { ...currentProperty.mapCoordinates || {lng:0}, lat: parseFloat(e.target.value) }})} 
                        />
                        <input type="number" step="any" placeholder="Lng" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500" 
                           value={currentProperty.mapCoordinates?.lng || ''} 
                           onChange={e => setCurrentProperty({...currentProperty, mapCoordinates: { ...currentProperty.mapCoordinates || {lat:0}, lng: parseFloat(e.target.value) }})} 
                        />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">الوصف</label>
                    <textarea className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-gold-500 h-24" 
                       value={currentProperty.description || ''} onChange={e => setCurrentProperty({...currentProperty, description: e.target.value})}></textarea>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
                 <button onClick={() => setShowPropertyModal(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">إلغاء</button>
                 <button 
                   onClick={() => {
                      if (currentProperty.title && currentProperty.price) {
                         if (isEditing) {
                            updateProperty(currentProperty as Property);
                         } else {
                            addProperty({...currentProperty, id: Date.now().toString(), features: ['جديد']} as Property);
                         }
                         setShowPropertyModal(false);
                      }
                   }}
                   className="px-6 py-3 rounded-xl font-bold bg-nile-900 text-white hover:bg-gold-500 hover:text-nile-900 transition shadow-lg"
                 >
                    {isEditing ? 'حفظ التعديلات' : 'إضافة العقار'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
