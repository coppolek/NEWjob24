import { useState } from 'react';
import { Search, Bell, SlidersHorizontal, UserCircle, LogOut, LogIn, AlertCircle, X, MapPin } from 'lucide-react';
import CareerjetWidget from './components/CareerjetWidget';
import PostJobTab from './components/PostJobTab';
import PreferencesTab from './components/PreferencesTab';
import type { Tab } from './types';
import { useAuth } from './lib/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('IT Paese e lingua');
  const { user, signIn, signOut, loading, error, clearError } = useAuth();

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'search', label: 'Cerca Lavoro', icon: <Search className="w-4 h-4" /> },
    { id: 'preferences', label: 'Avvisi', icon: <Bell className="w-4 h-4" /> },
  ];

  const handleLanguageSelect = (lang: string) => {
    setCurrentLang(lang);
    setIsLangModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and primary nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('search')}>
                <h1 className="text-2xl font-bold tracking-tighter" style={{ color: '#003399' }}>CareerPortal</h1>
              </div>
              
              <nav className="hidden md:flex space-x-1 h-full items-center">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`px-4 h-16 border-b-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                        isActive 
                          ? 'border-[#003399] text-slate-900' 
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right side utilities */}
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setIsLangModalOpen(true)}
                className="hidden md:flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                {currentLang}
              </div>
              <div className="hidden md:block w-px h-6 bg-slate-200 mx-2"></div>
              
              <div 
                onClick={() => setActiveTab('post-job')}
                className={`hidden sm:block text-sm font-medium cursor-pointer px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'post-job' 
                    ? 'text-[#003399] bg-blue-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Pubblica un annuncio
              </div>

              {loading ? (
                <div className="w-24 h-8 bg-slate-100 rounded animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-transparent sm:border-slate-200">
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-slate-200" />
                    ) : (
                      <UserCircle className="w-8 h-8 text-slate-300" />
                    )}
                  </div>
                  <button onClick={signOut} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Esci">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-transparent sm:border-slate-200">
                  <button onClick={signIn} className="text-[#003399] hover:bg-blue-50 text-sm font-semibold transition-colors px-4 py-2 rounded-lg">
                    Accedi
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-100 bg-white overflow-x-auto">
          <nav className="flex px-4 py-2 space-x-4">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                    isActive 
                      ? 'text-blue-700 bg-blue-50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => setActiveTab('post-job')}
              className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'post-job' 
                  ? 'text-blue-700 bg-blue-50' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Pubblica un annuncio
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-0 relative">

        {/* Auth Error Banner */}
        {error && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-red-800">
                {error}
              </div>
              <button onClick={clearError} className="p-1 hover:bg-red-100 rounded-lg transition-colors shrink-0">
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          
          <div className={activeTab === 'search' ? 'block' : 'hidden'}>
            <CareerjetWidget />
            
            {/* CTA Section for unauthenticated users */}
            {!loading && !user && (
              <div className="mt-20 mb-16 flex flex-col items-center text-center">
                <h2 className="text-[2.5rem] md:text-5xl font-bold tracking-tighter mb-6" style={{ color: '#003399' }}>
                  CareerPortal
                </h2>
                
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                  Il tuo prossimo lavoro inizia qui
                </h3>
                
                <p className="text-base md:text-lg text-slate-600 mb-8 max-w-xl">
                  Crea un account o accedi per visualizzare suggerimenti di annunci personalizzati.
                </p>
                
                <button 
                  onClick={signIn}
                  className="bg-[#003399] hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg text-base flex items-center justify-center transition-colors shadow-sm"
                >
                  Inizia
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                
                <div className="mt-20 flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors">
                  <span className="font-medium text-sm">Tendenze su CareerPortal</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          <div className={activeTab === 'post-job' ? 'block' : 'hidden'}>
            <PostJobTab />
          </div>

          <div className={activeTab === 'preferences' ? 'block' : 'hidden'}>
            <PreferencesTab />
          </div>

        </div>
      </main>

      {/* Language Modal */}
      {isLangModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-lg text-slate-900">Scegli il Paese e la lingua</h3>
              <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-y-auto">
              {[
                'IT Paese e lingua',
                'EN United Kingdom',
                'EN United States',
                'FR France',
                'DE Deutschland',
                'ES España'
              ].map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    currentLang === lang ? 'bg-blue-50 text-[#003399] font-medium' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
