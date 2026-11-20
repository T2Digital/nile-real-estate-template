
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { PropertyDetails } from './pages/PropertyDetails';
import { AdminDashboard } from './pages/Admin';
import { AboutPage } from './pages/About';
import { ContactPage } from './pages/Contact';
import { FavoritesPage } from './pages/Favorites';
import { ComparePage } from './pages/Compare';
import { ChatBot } from './components/ChatBot';
import { Booking, BookingStatus, Property, AppContextType, FilterState, Language, Translations } from './types';
import { PROPERTIES as INITIAL_PROPERTIES, INITIAL_FILTERS } from './constants';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within App");
  return context;
};

// Component to handle scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const translations: Record<Language, Translations> = {
  ar: {
    home: 'الرئيسية',
    properties: 'العقارات',
    favorites: 'المفضلة',
    about: 'من نحن',
    contact: 'اتصل بنا',
    search: 'بحث',
    smartConsultant: 'المستشار الذكي',
    compare: 'مقارنة',
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل خروج',
    viewDetails: 'التفاصيل',
    bookViewing: 'حجز معاينة'
  },
  en: {
    home: 'Home',
    properties: 'Properties',
    favorites: 'Favorites',
    about: 'About Us',
    contact: 'Contact',
    search: 'Search',
    smartConsultant: 'Smart Agent',
    compare: 'Compare',
    dashboard: 'Dashboard',
    logout: 'Logout',
    viewDetails: 'Details',
    bookViewing: 'Book Viewing'
  }
};

const App: React.FC = () => {
  // Detect Device Language
  const [language, setLanguage] = useState<Language>('ar');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('ar')) {
      setLanguage('ar');
    } else {
      setLanguage('en'); // Default to English for non-Arabic devices
    }
  }, []);

  // Update HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Initialize with mock bookings
  const [bookings, setBookings] = useState<Booking[]>([
    {
        id: '101',
        propertyId: '1',
        propertyTitle: 'فيلا فاخرة في كمبوند النخيل',
        customerName: 'أحمد محمد',
        customerPhone: '01012345678',
        date: '2024-05-20',
        time: '14:00',
        status: BookingStatus.PENDING,
        createdAt: Date.now()
    }
  ]);

  // Initialize properties state
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  
  // Global Filter State
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Global Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Favorites State
  const [favorites, setFavorites] = useState<string[]>([]);

  // Compare List State
  const [compareList, setCompareList] = useState<string[]>([]);

  const addBooking = (newBooking: Omit<Booking, 'id'>) => {
    const booking = { ...newBooking, id: Math.random().toString(36).substr(2, 9) };
    setBookings(prev => [...prev, booking]);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const addProperty = (property: Property) => {
    setProperties(prev => [property, ...prev]);
  };

  const updateProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 3) return prev; // Max 3 items
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareList([]);

  const toggleChat = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const loginAdmin = () => setIsAdminLoggedIn(true);
  const logoutAdmin = () => setIsAdminLoggedIn(false);

  return (
    <AppContext.Provider value={{ 
      bookings, 
      properties, 
      filters,
      favorites,
      compareList,
      isChatOpen,
      language,
      t: translations[language],
      isAdminLoggedIn,
      loginAdmin,
      logoutAdmin,
      addBooking, 
      updateBookingStatus,
      addProperty,
      updateProperty,
      deleteProperty,
      toggleFavorite,
      toggleCompare,
      clearCompare,
      setFilters,
      toggleChat,
      toggleLanguage
    }}>
      <HashRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <ChatBot />
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
