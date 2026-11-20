
export enum PropertyType {
  APARTMENT = 'شقة',
  VILLA = 'فيلا',
  DUPLEX = 'دوبلكس',
  PENTHOUSE = 'بنتهاوس'
}

export enum PropertyCategory {
  COMPOUND = 'كمبوند',
  BUILDING = 'عمارة سكنية'
}

export enum Location {
  SHEIKH_ZAYED = 'الشيخ زايد',
  NEW_CAIRO = 'القاهرة الجديدة',
  NEW_CAPITAL = 'العاصمة الإدارية',
  MAADI = 'المعادي'
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  location: Location;
  area: number; // in sqm
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  features: string[];
  imageUrl: string;
  videoUrl?: string; // Optional mock video link
  mapCoordinates: { lat: number; lng: number };
}

export enum BookingStatus {
  PENDING = 'قيد الانتظار',
  CONFIRMED = 'تم التأكيد',
  COMPLETED = 'تمت المعاينة',
  CONTRACTED = 'تم التعاقد',
  CANCELLED = 'ملغى'
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  createdAt: number;
}

export interface FilterState {
  type: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minArea: number;
}

// Updated Chat Message Interface
export interface ChatMessage {
  role: 'user' | 'model';
  text?: string;
  type?: 'text' | 'card' | 'form' | 'options';
  data?: any; // Holds Property[], options array, or form context
}

export type Language = 'ar' | 'en';

export interface Translations {
  home: string;
  properties: string;
  favorites: string;
  about: string;
  contact: string;
  search: string;
  smartConsultant: string;
  compare: string;
  dashboard: string;
  logout: string;
  viewDetails: string;
  bookViewing: string;
}

export interface CompanySettings {
  name: string;
  nameEn?: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  email: string;
  address?: string;
  commercialRegister: string;
  taxCardNumber: string;
  defaultDownPaymentPct: number;
  maxInstallmentYears: number;
  annualInterestPct: number;
  logoUrl?: string;
}

export interface AppContextType {
  bookings: Booking[];
  properties: Property[];
  companySettings: CompanySettings;
  favorites: string[]; // List of Property IDs
  compareList: string[]; // List of Property IDs for comparison
  filters: FilterState;
  isChatOpen: boolean;
  language: Language;
  t: Translations;
  isAdminLoggedIn: boolean; // Global Admin State
  loginAdmin: () => void;
  logoutAdmin: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  updateCompanySettings: (updates: Partial<CompanySettings>) => void;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setFilters: (filters: FilterState) => void;
  toggleChat: (isOpen: boolean) => void;
  toggleLanguage: () => void;
}
