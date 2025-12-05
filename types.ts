import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string; // Used as ID for view switching
  icon: LucideIcon;
  variant: "default" | "ghost";
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface Metric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export interface RecentSale {
  name: string;
  email: string;
  amount: string;
  avatar: string;
}
