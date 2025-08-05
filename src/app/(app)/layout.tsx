'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UserSquare,
  Package2,
  Landmark,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/students', icon: Users, label: 'Students' },
  { href: '/faculty', icon: UserSquare, label: 'Faculty' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/finances', icon: Landmark, label: 'Finances' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">Campus Central</span>
          </Link>
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 md:justify-end">
          <SidebarTrigger className="md:hidden"/>
          <UserMenu />
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-background">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className='h-8 w-8'>
            <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" data-ai-hint="person user" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href="/login" passHref>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
