import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ShoppingBag, 
  BarChart3,
  LogOut,
  Package,
  FileText
} from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onChangeView }) => {
  const navItems: NavItem[] = [
    { title: '文章管理', href: 'articles', icon: FileText, variant: 'ghost' },
    { title: '产品管理', href: 'products', icon: Package, variant: 'ghost' },
    { title: '订单管理', href: 'orders', icon: ShoppingBag, variant: 'ghost' },
  ];

  const handleNavClick = (view: string) => {
    onChangeView(view);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span>Admin<span className="text-primary">Panel</span></span>
          </div>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-4">
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`
                  group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                  ${currentView === item.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                `}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </button>
            ))}
          </nav>
          
          <div className="px-3">
             <button
                className="group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
          </div>
        </div>
      </aside>
    </>
  );
};