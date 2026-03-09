'use client';

import { useUser } from '@/firebase';

export function DashboardSidebarFooter() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading || !user) return null;

  return (
    <div className="flex items-center gap-3 px-2 mb-4">
      <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-sm font-semibold truncate">{user.displayName || 'Creator'}</p>
        <p className="text-xs text-slate-400 truncate">{user.email}</p>
      </div>
    </div>
  );
}