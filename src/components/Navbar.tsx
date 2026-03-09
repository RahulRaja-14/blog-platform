'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Rss, LogIn, UserPlus, Bell } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/utils/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      setIsUserLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsUserLoading(false);
    };
    getUser();
  }, [supabase]);

  // Defensive helper for user initials
  const getUserInitial = () => {
    if (!user) return '?';
    const identifier = user.user_metadata.name || user.email || 'User';
    return identifier.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              P
            </div>
            <span>PlatformStream</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/feed"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === '/feed' ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Rss className="h-4 w-4" />
              Feed
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          {isUserLoading ? (
            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <>
              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold border-2 border-background shadow-sm">
                {getUserInitial()}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-2 hidden sm:flex">
                  <UserPlus className="h-4 w-4" />
                  Join
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
