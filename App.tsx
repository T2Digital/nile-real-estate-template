
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
import { Booking, BookingStatus, Property, AppContextType, FilterState, Language, Translations, CompanySettings } from './types';
import { PROPERTIES as INITIAL_PROPERTIES, INITIAL_FILTERS } from './constants';
import { resolveRealEstateSlug, loadRealEstateCloudState, syncRealEstateCloudState } from './tenantBootstrap';

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'النيل للاستثمار العقاري',
  nameEn: 'Nile Real Estate Investment',
  slogan: 'نعيد تعريف مفهوم السكن الفاخر والاستثمار العقاري الآمن في مصر',
  phone: '19999',
  whatsapp: '201000000000',
  email: 'info@nile-realestate.eg',
  address: 'القاهرة الجديدة، التجمع الخامس، شارع التسعين',
  commercialRegister: '',
  taxCardNumber: '',
  defaultDownPaymentPct: 20,
  maxInstallmentYears: 8,
  annualInterestPct: 0,
  logoUrl: '',
};

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

  const activeSlug = resolveRealEstateSlug();
  const storagePrefix = `t2_re_${activeSlug}`;

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_settings`);
      if (saved) return { ...DEFAULT_COMPANY_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    const b = (typeof window !== 'undefined' && (window as any).__TENANT_BRAND__) || null;
    return {
      ...DEFAULT_COMPANY_SETTINGS,
      ...(b?.name ? { name: b.name } : {}),
      ...(b?.slogan ? { slogan: b.slogan } : {}),
      ...(b?.phone ? { phone: b.phone } : {}),
      ...(b?.whatsapp ? { whatsapp: b.whatsapp } : {}),
      ...(b?.commercialRegister ? { commercialRegister: b.commercialRegister } : {}),
      ...(b?.taxCardNumber ? { taxCardNumber: b.taxCardNumber } : {}),
      ...(b?.logoUrl ? { logoUrl: b.logoUrl } : {}),
    };
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_bookings`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: '101',
        propertyId: '1',
        propertyTitle: 'فيلا فاخرة في كمبوند النخيل',
        customerName: 'أحمد محمد',
        customerPhone: '01012345678',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        status: BookingStatus.PENDING,
        createdAt: Date.now()
      }
    ];
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(`${storagePrefix}_properties`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PROPERTIES;
  });

  // Hydrate cloud state from Firestore REST on mount
  useEffect(() => {
    (async () => {
      const [cloudProps, cloudBookings, cloudSettings] = await Promise.all([
        loadRealEstateCloudState<Property[]>(activeSlug, 'properties'),
        loadRealEstateCloudState<Booking[]>(activeSlug, 'bookings'),
        loadRealEstateCloudState<CompanySettings>(activeSlug, 'settings'),
      ]);
      if (Array.isArray(cloudProps) && cloudProps.length > 0) {
        setProperties(cloudProps);
        localStorage.setItem(`${storagePrefix}_properties`, JSON.stringify(cloudProps));
      }
      if (Array.isArray(cloudBookings) && cloudBookings.length > 0) {
        setBookings(cloudBookings);
        localStorage.setItem(`${storagePrefix}_bookings`, JSON.stringify(cloudBookings));
      }
      if (cloudSettings && cloudSettings.name) {
        const merged = { ...DEFAULT_COMPANY_SETTINGS, ...cloudSettings };
        setCompanySettings(merged);
        localStorage.setItem(`${storagePrefix}_settings`, JSON.stringify(merged));
      }
    })();
  }, [activeSlug, storagePrefix]);
  
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
    setBookings(prev => {
      const next = [booking, ...prev];
      localStorage.setItem(`${storagePrefix}_bookings`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'bookings', next);
      return next;
    });
    fetch('https://ez-zel.onrender.com/api/webhooks/tenant-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'nile_real_estate',
        eventType: 'viewing_booking_created',
        brandId: activeSlug,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        summary: `حجز معاينة عقارية: ${booking.propertyTitle} (${booking.date} ${booking.time})`,
      }),
    }).catch(() => {});
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === id ? { ...b, status } : b);
      localStorage.setItem(`${storagePrefix}_bookings`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'bookings', next);
      return next;
    });
  };

  const addProperty = (property: Property) => {
    setProperties(prev => {
      const next = [property, ...prev];
      localStorage.setItem(`${storagePrefix}_properties`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'properties', next);
      return next;
    });
  };

  const updateProperty = (updatedProperty: Property) => {
    setProperties(prev => {
      const next = prev.map(p => p.id === updatedProperty.id ? updatedProperty : p);
      localStorage.setItem(`${storagePrefix}_properties`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'properties', next);
      return next;
    });
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(`${storagePrefix}_properties`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'properties', next);
      return next;
    });
  };

  const updateCompanySettings = (updates: Partial<CompanySettings>) => {
    setCompanySettings(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem(`${storagePrefix}_settings`, JSON.stringify(next));
      syncRealEstateCloudState(activeSlug, 'settings', next);
      return next;
    });
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
      companySettings,
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
      updateCompanySettings,
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
