import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { SettingsView } from './components/views/SettingsView';
import { CustomersView } from './components/views/CustomersView';
import { ArticlesView } from './components/views/ArticlesView';
import { OrdersView } from './components/views/OrdersView';
import { ProductsView } from './components/views/ProductsView';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'settings':
        return <SettingsView />;
      case 'customers':
        return <CustomersView />;
      case 'articles':
        return <ArticlesView />;
      case 'orders':
        return <OrdersView />;
      case 'products':
        return <ProductsView />;
      default:
        return (
          <div className="flex h-[50vh] flex-col items-center justify-center space-y-4 text-center">
            <div className="text-4xl font-bold text-muted-foreground/30">开发中</div>
            <p className="text-muted-foreground">该页面 ({currentView}) 尚未实现。</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;