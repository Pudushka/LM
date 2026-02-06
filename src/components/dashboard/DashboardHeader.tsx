"use client";

import { Bell, Search } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6 border-b border-border mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-40"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
          U
        </div>
      </div>
    </header>
  );
}
