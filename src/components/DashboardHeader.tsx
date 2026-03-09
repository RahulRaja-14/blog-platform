'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function DashboardHeader() {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b bg-white sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h2 className="text-lg font-bold">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blogs/new">
          <Button size="sm" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Create New</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}