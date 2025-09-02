import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fil';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    pos: 'POS',
    users: 'Users',
    reports: 'Reports',
    settings: 'Settings',
    
    // Dashboard
    welcome: 'Welcome to G.O.D.I',
    welcomeDesc: 'Your complete inventory management solution for school supplies',
    addProduct: 'Add Product',
    quickSale: 'Quick Sale',
    recentActivity: 'Recent Activity',
    topProducts: 'Top Products',
    
    // Inventory
    inventoryManagement: 'Inventory Management',
    manageInventory: 'Manage your school supply inventory',
    filters: 'Filters',
    searchProducts: 'Search products...',
    category: 'Category',
    allCategories: 'All Categories',
    stockLevel: 'Stock Level',
    allStockLevels: 'All Stock Levels',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    critical: 'Critical',
    clearFilters: 'Clear Filters',
    
    // POS
    pointOfSale: 'Point of Sale',
    quickCheckout: 'Quick checkout for in-store purchases',
    quickAddProducts: 'Quick Add Products',
    cart: 'Cart',
    subtotal: 'Subtotal',
    tax: 'Tax (8%)',
    total: 'Total',
    processPayment: 'Process Payment',
    printReceipt: 'Print Receipt',
    
    // Products
    notebooks: 'Notebooks',
    writing: 'Writing',
    artSupplies: 'Art Supplies',
    paper: 'Paper',
    accessories: 'Accessories',
    
    // Common
    edit: 'Edit',
    delete: 'Delete',
    restock: 'Restock',
    price: 'Price',
    supplier: 'Supplier',
    uploadImage: 'Upload Image',
    noProductsFound: 'No products found',
    tryAdjusting: 'Try adjusting your search or filter criteria',
    units: 'units',
    each: 'each',
  },
  fil: {
    // Navigation
    dashboard: 'Dashboard',
    inventory: 'Imbentaryo',
    pos: 'POS',
    users: 'Mga User',
    reports: 'Mga Ulat',
    settings: 'Mga Setting',
    
    // Dashboard
    welcome: 'Maligayang Pagdating sa G.O.D.I',
    welcomeDesc: 'Ang inyong kumpletong sistema ng pamamahala ng imbentaryo para sa mga school supplies',
    addProduct: 'Magdagdag ng Produkto',
    quickSale: 'Mabilis na Benta',
    recentActivity: 'Mga Kamakailang Gawain',
    topProducts: 'Mga Nangungunang Produkto',
    
    // Inventory
    inventoryManagement: 'Pamamahala ng Imbentaryo',
    manageInventory: 'Pamahalaan ang inyong imbentaryo ng school supplies',
    filters: 'Mga Filter',
    searchProducts: 'Maghanap ng mga produkto...',
    category: 'Kategorya',
    allCategories: 'Lahat ng Kategorya',
    stockLevel: 'Antas ng Stock',
    allStockLevels: 'Lahat ng Antas ng Stock',
    inStock: 'May Stock',
    lowStock: 'Mababang Stock',
    critical: 'Kritikal',
    clearFilters: 'Burahin ang mga Filter',
    
    // POS
    pointOfSale: 'Point of Sale',
    quickCheckout: 'Mabilis na checkout para sa mga benta sa tindahan',
    quickAddProducts: 'Mabilis na Pagdagdag ng mga Produkto',
    cart: 'Cart',
    subtotal: 'Subtotal',
    tax: 'Buwis (8%)',
    total: 'Kabuuan',
    processPayment: 'Iproseso ang Bayad',
    printReceipt: 'I-print ang Resibo',
    
    // Products
    notebooks: 'Mga Notebook',
    writing: 'Panulat',
    artSupplies: 'Art Supplies',
    paper: 'Papel',
    accessories: 'Mga Accessories',
    
    // Common
    edit: 'I-edit',
    delete: 'Tanggalin',
    restock: 'Mag-restock',
    price: 'Presyo',
    supplier: 'Supplier',
    uploadImage: 'Mag-upload ng Larawan',
    noProductsFound: 'Walang produktong nahanap',
    tryAdjusting: 'Subukan na ayusin ang inyong paghahanap o filter',
    units: 'piraso',
    each: 'bawat isa',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fil' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}