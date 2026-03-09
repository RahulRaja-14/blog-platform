import { getSession } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { signOutAction } from '@/app/lib/actions';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardSidebarFooter } from '@/components/DashboardSidebarFooter';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const userId = await getSession();

  if (!userId) {
    redirect('/login');
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-slate-200">
        <SidebarHeader className="h-16 flex items-center justify-center border-b border-slate-200 p-0">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-bold text-primary px-4 group-data-[collapsible=icon]:hidden">
            <div className="flex min-h-8 min-w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              P
            </div>
            <span>PlatformStream</span>
          </Link>
          <Link href="/" className="hidden items-center justify-center font-headline text-lg font-bold text-primary group-data-[collapsible=icon]:flex h-full w-full">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              P
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2 gap-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Overview">
                    <Link href="/dashboard" className="flex items-center gap-3">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="My Blogs">
                    <Link href="/dashboard/blogs" className="flex items-center gap-3">
                      <FileText className="h-4 w-4" />
                      <span>My Blogs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Create Blog">
                    <Link href="/dashboard/blogs/new" className="flex items-center gap-3">
                      <PlusCircle className="h-4 w-4" />
                      <span>New Post</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              Explore
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Public Feed">
                    <Link href="/feed" className="flex items-center gap-3">
                      <Home className="h-4 w-4" />
                      <span>Public Feed</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t border-slate-200">
          <div className="group-data-[collapsible=icon]:hidden px-2 mb-2">
            <DashboardSidebarFooter />
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <form action={signOutAction}>
                <SidebarMenuButton asChild tooltip="Logout" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <button type="submit" className="flex items-center gap-3 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </form>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col bg-slate-50 min-h-screen">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}