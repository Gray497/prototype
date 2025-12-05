import React from 'react';
import { Menu, Bell, Search, Sun, Moon, User } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Avatar } from './ui/Avatar';

interface HeaderProps {
  onMenuClick: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isDark, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="w-full flex-1">
        <form className="relative w-full md:w-2/3 lg:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索..."
            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
          />
        </form>
      </div>

      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 border-l pl-2 ml-2">
            <Avatar fallback="JD" src="https://picsum.photos/200/200" />
            <div className="hidden md:flex flex-col text-sm">
                <span className="font-semibold">John Doe</span>
                <span className="text-xs text-muted-foreground">管理员</span>
            </div>
        </div>
      </div>
    </header>
  );
};