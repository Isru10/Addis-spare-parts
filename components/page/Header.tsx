// components/page/Header.tsx
'use client';
import { Search, Menu, User } from 'lucide-react';

export function Header() {
  return (
    <header className="container mx-auto flex justify-between items-center gap-4 py-4">
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search for parts..."
          className="bg-brand-blue/50 w-full pl-12 pr-4 py-3 rounded-lg text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Menu size={28} className="text-white cursor-pointer hover:text-brand-orange transition-colors" />
        <User size={28} className="text-white cursor-pointer hover:text-brand-orange transition-colors" />
      </div>
    </header>
  );
}