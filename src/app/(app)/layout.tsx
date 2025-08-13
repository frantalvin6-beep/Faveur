
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UserSquare,
  Package2,
  GraduationCap,
  PencilRuler,
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
  CheckSquare,
  BookCopy,
  Wallet,
  UserCircle,
  Trophy,
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
import { Button } from '@/components/ui/button';
import { SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AuthProvider, useAuth, UserRole } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', roles: ['Promoteur', 'DAC', 'DAF', 'Secrétaire', 'Surveillant'] },
  { 
    id: 'academics',
    icon: GraduationCap, 
    label: 'Gestion académique',
    roles: ['Promoteur', 'DAC', 'Secrétaire'],
    subItems: [
        { href: '/academics/departments', label: 'Facultés et départements', icon: Building, roles: ['Promoteur', 'DAC'] },
        { href: '/academics/courses', label: 'Cours et matières', icon: BookOpen, roles: ['Promoteur', 'DAC'] },
        { href: '/academics/syllabus', label: 'Syllabus des cours', icon: BookCopy, roles: ['Promoteur', 'DAC'] },
        { href: '/academics/calendar', label: 'Calendrier académique', icon: Calendar, roles: ['Promoteur', 'DAC', 'Secrétaire'] },
    ]
  },
   { 
    id: 'students',
    icon: Users, 
    label: 'Étudiants',
    roles: ['Promoteur', 'DAC', 'Secrétaire', 'Surveillant'],
    subItems: [
        { href: '/students/list', label: 'Liste des étudiants', icon: Users, roles: ['Promoteur', 'DAC', 'Secrétaire'] },
        { href: '/students/attendance', label: 'Suivi des étudiants', icon: ClipboardCheck, roles: ['Promoteur', 'DAC', 'Secrétaire', 'Surveillant'] },
        { href: '/students/repartition', label: 'Répartition', icon: BarChart3, roles: ['Promoteur', 'DAC'] },
    ]
   },
  { 
    id: 'faculty',
    icon: UserSquare, 
    label: 'Personnel enseignant',
    roles: ['Promoteur', 'DAC', 'Surveillant'],
    subItems: [
        { href: '/faculty/profiles', label: 'Profils enseignants', icon: Users, roles: ['Promoteur', 'DAC'] },
        { href: '/faculty/assignments', label: 'Attribution des cours', icon: Briefcase, roles: ['Promoteur', 'DAC'] },
        { href: '/faculty/schedule', label: 'Emploi du temps', icon: Clock, roles: ['Promoteur', 'DAC'] },
        { href: '/faculty/workload', label: 'Charge horaire', icon: Hourglass, roles: ['Promoteur', 'DAC'] },
        { href: '/faculty/attendance', label: 'Feuille de présence', icon: CheckSquare, roles: ['Promoteur', 'DAC', 'Surveillant'] },
    ]
  },
  { 
    id: 'exams',
    icon: PencilRuler, 
    label: 'Examens et notes',
    roles: ['Promoteur', 'DAC'],
    subItems: [
        { href: '/exams/grades', label: 'Saisie des notes', icon: ClipboardCheck, roles: ['Promoteur', 'DAC'] },
        { href: '/exams/planning', label: 'Planification', icon: CalendarPlus, roles: ['Promoteur', 'DAC'] },
        { href: '/exams/results', label: 'Résultats Globaux', icon: Trophy, roles: ['Promoteur', 'DAC'] },
    ]
  },
  { 
    id: 'finances',
    icon: DollarSign, 
    label: 'Finances',
    roles: ['Promoteur', 'DAF'],
    subItems: [
        { href: '/finances/students', label: 'Finances Étudiants', icon: Users, roles: ['Promoteur', 'DAF'] },
        { href: '/finances/faculty', label: 'Finances Enseignants', icon: UserSquare, roles: ['Promoteur', 'DAF'] },
        { href: '/finances/administration', label: 'Finances Administration', icon: Briefcase, roles: ['Promoteur', 'DAF'] },
        { href: '/finances/expenses', label: 'Dépenses Administratives', icon: Wallet, roles: ['Promoteur', 'DAF'] },
    ]
  },
  { href: '/accounting', icon: BookCopy, label: 'Comptabilité', roles: ['Promoteur', 'DAF'] },
  { href: '/settings', icon: Settings, label: 'Paramètres', roles: ['Promoteur'] },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isMobile } = useSidebar();
    const { userRole, setUserRole } = useAuth();

    const hasAccess = (itemRoles: UserRole[]) => itemRoles.includes(userRole);

    const isSubItemActive = (subItems: any[]) => {
        return subItems.some(item => pathname.startsWith(item.href) && hasAccess(item.roles));
    }
    
    const filteredNavItems = navItems.filter(item => hasAccess(item.roles));

  return (
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Package2 className="h-6 w-6" />
              <span className="text-lg font-semibold">S.G.ENIA 2.0</span>
            </Link>
            {isMobile && <SheetTitle className="sr-only">Menu Mobile</SheetTitle>}
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => {
                 const filteredSubItems = item.subItems?.filter(subItem => hasAccess(subItem.roles));
                 
                 if (item.subItems && filteredSubItems && filteredSubItems.length === 0) {
                     return null;
                 }

                 return item.subItems ? (
                  <Collapsible key={item.id} className="w-full" defaultOpen={isSubItemActive(filteredSubItems || [])}>
                    <CollapsibleTrigger asChild>
                       <SidebarMenuItem>
                          <SidebarMenuButton
                              className="w-full justify-start"
                              tooltip={item.label}
                              isActive={isSubItemActive(filteredSubItems || [])}
                          >
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                          </SidebarMenuButton>
                       </SidebarMenuItem>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                          {filteredSubItems && filteredSubItems.map((subItem) => (
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
                )}
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className='relative'>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex items-center gap-4">
              <RoleSelector />
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
  );
}

function RoleSelector() {
    const { userRole, setUserRole } = useAuth();

    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="role-selector" className="text-sm font-medium">Rôle:</Label>
            <Select value={userRole} onValueChange={(value: UserRole) => setUserRole(value)}>
                <SelectTrigger id="role-selector" className="w-[180px]">
                    <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Promoteur">Promoteur</SelectItem>
                    <SelectItem value="DAC">Directeur Académique</SelectItem>
                    <SelectItem value="DAF">Directeur Financier</SelectItem>
                    <SelectItem value="Secrétaire">Secrétaire</SelectItem>
                    <SelectItem value="Surveillant">Surveillant</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}

function UserMenu() {
    const router = useRouter();

    const handleLogout = () => {
        // Here you would typically clear the session, tokens, etc.
        // For this demo, we just redirect to the home page.
        router.push('/');
    };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-8 w-8" />
            <span className="sr-only">Ouvrir le menu utilisateur</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/settings">
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
        </Link>
        <Link href="mailto:support@campuscentral.com">
          <DropdownMenuItem>Support</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </AuthProvider>
  );
}
