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
  GraduationCap,
  PencilRuler,
  MessageSquare,
  BookOpen,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  Building,
  BarChart3,
  ClipboardCheck,
  CalendarPlus,
  Hourglass,
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
  SidebarTrigger,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { 
    id: 'academics',
    icon: GraduationCap, 
    label: 'Gestion académique',
    subItems: [
        { href: '/academics/departments', label: 'Facultés et départements', icon: Building },
        { href: '/academics/courses', label: 'Cours et matières', icon: BookOpen },
        { href: '/academics/calendar', label: 'Calendrier académique', icon: Calendar },
    ]
  },
   { 
    id: 'students',
    icon: Users, 
    label: 'Étudiants',
    subItems: [
        { href: '/students/list', label: 'Liste des étudiants', icon: Users },
        { href: '/students/repartition', label: 'Répartition', icon: BarChart3 },
    ]
   },
  { 
    id: 'faculty',
    icon: UserSquare, 
    label: 'Personnel enseignant',
    subItems: [
        { href: '/faculty/profiles', label: 'Profils enseignants', icon: Users },
        { href: '/faculty/assignments', label: 'Attribution des cours', icon: Briefcase },
        { href: '/faculty/schedule', label: 'Emploi du temps', icon: Clock },
        { href: '/faculty/workload', label: 'Charge horaire', icon: Hourglass },
    ]
  },
  { 
    id: 'exams',
    icon: PencilRuler, 
    label: 'Examens et notes',
    subItems: [
        { href: '/exams/grades', label: 'Saisie des notes', icon: ClipboardCheck },
        { href: '/exams/planning', label: 'Planification', icon: CalendarPlus },
    ]
  },
  { href: '/communication', icon: MessageSquare, label: 'Communication' },
  { href: '/reports', icon: FileText, label: 'Rapports' },
  { href: '/finances', icon: DollarSign, label: 'Finances' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const isSubItemActive = (subItems: any[]) => {
    return subItems.some(item => pathname.startsWith(item.href));
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">Campus Central</span>
          </Link>
          {isMobile && <SheetTitle className="sr-only">Menu Mobile</SheetTitle>}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              item.subItems ? (
                <Collapsible key={item.id} className="w-full" defaultOpen={isSubItemActive(item.subItems)}>
                  <CollapsibleTrigger asChild>
                     <SidebarMenuItem>
                        <SidebarMenuButton
                            className="w-full justify-start"
                            tooltip={item.label}
                            isActive={isSubItemActive(item.subItems)}
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.subItems.map((subItem) => (
                             <SidebarMenuItem key={subItem.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                  <Link href={subItem.href}>
                                      <subItem.icon className="h-4 w-4" />
                                      <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                             </SidebarMenuItem>
                        ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href!} passHref>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href!)}
                      tooltip={item.label}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )
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
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
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
        <DropdownMenuLabel>Compte Administrateur</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href="/login" passHref>
          <DropdownMenuItem>Déconnexion</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
