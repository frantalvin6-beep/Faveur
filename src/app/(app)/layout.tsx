
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  UserCog,
  Megaphone,
  ExternalLink,
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
import { useAuth, UserRole } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getPermissions, Permissions, defaultPermissions } from '@/lib/permissions';
import { Skeleton } from '@/components/ui/skeleton';

const navStructure = [
  { path: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { 
    id: 'academics',
    label: 'Gestion académique',
    icon: GraduationCap,
    subItems: [
        { path: 'academics/departments', label: 'Facultés et départements', icon: Building },
        { path: 'academics/courses', label: 'Cours et matières', icon: BookOpen },
        { path: 'academics/syllabus', label: 'Syllabus des cours', icon: BookCopy },
        { path: 'academics/calendar', label: 'Calendrier académique', icon: Calendar },
    ]
  },
   { 
    id: 'students',
    label: 'Étudiants',
    icon: Users,
    subItems: [
        { path: 'students/list', label: 'Liste des étudiants', icon: Users },
        { path: 'students/attendance', label: 'Suivi des étudiants', icon: ClipboardCheck },
        { path: 'students/repartition', label: 'Répartition', icon: BarChart3 },
    ]
   },
  { 
    id: 'faculty',
    label: 'Personnel enseignant',
    icon: UserSquare,
    subItems: [
        { path: 'faculty/profiles', label: 'Profils enseignants', icon: Users },
        { path: 'faculty/assignments', label: 'Attribution des cours', icon: Briefcase },
        { path: 'faculty/schedule', label: 'Emploi du temps', icon: Clock },
        { path: 'faculty/workload', label: 'Charge horaire', icon: Hourglass },
        { path: 'faculty/attendance', label: 'Feuille de présence', icon: CheckSquare },
    ]
  },
  { 
    id: 'exams',
    label: 'Examens et notes',
    icon: PencilRuler,
    subItems: [
        { path: 'exams/grades', label: 'Saisie des notes', icon: ClipboardCheck },
        { path: 'exams/planning', label: 'Planification', icon: CalendarPlus },
        { path: 'exams/results', label: 'Résultats Globaux', icon: Trophy },
    ]
  },
  { 
    id: 'finances',
    label: 'Finances',
    icon: DollarSign,
    subItems: [
        { path: 'finances/students', label: 'Finances Étudiants', icon: Users },
        { path: 'finances/faculty', label: 'Finances Enseignants', icon: UserSquare },
        { path: 'finances/administration', label: 'Finances Administration', icon: Briefcase },
        { path: 'finances/expenses', label: 'Dépenses Administratives', icon: Wallet },
    ]
  },
  { 
    id: 'administration',
    label: 'Administration',
    icon: UserCog,
    subItems: [
        { path: 'administration/staff', label: 'Personnel Administratif', icon: UserCog },
    ]
  },
  { path: 'accounting', icon: BookCopy, label: 'Comptabilité' },
  { path: 'marketing-admin', icon: Megaphone, label: 'Marketing' },
  { path: 'settings', icon: Settings, label: 'Paramètres' },
];

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isMobile } = useSidebar();
    const { userRole } = useAuth();
    const [permissions, setPermissions] = React.useState<Permissions | null>(null);

    React.useEffect(() => {
        async function fetchPermissions() {
            const perms = await getPermissions();
            setPermissions(perms);
        }
        fetchPermissions();
    }, []);

    const hasAccess = (path: string) => {
        if (!permissions || !userRole) return false;
        return permissions[path]?.includes(userRole);
    }
    
    if (!permissions) {
        return (
            <div className="flex h-screen">
                <div className="w-64 bg-sidebar p-4 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="flex-1 p-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="mt-4 h-[calc(100vh-100px)] w-full" />
                </div>
            </div>
        )
    }

    const filteredNavItems = navStructure.map(item => {
        if (item.subItems) {
            const visibleSubItems = item.subItems.filter(sub => hasAccess(sub.path));
            return visibleSubItems.length > 0 ? { ...item, subItems: visibleSubItems } : null;
        }
        return hasAccess(item.path!) ? item : null;
    }).filter(Boolean);

    const isSubItemActive = (subItems: any[]) => subItems.some(item => pathname.startsWith(`/${item.path}`));

  return (
      <>
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
                 if (!item) return null;
                 return item.subItems ? (
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
                               <SidebarMenuItem key={subItem.path}>
                                  <SidebarMenuSubButton asChild isActive={pathname === `/${subItem.path}`}>
                                    <Link href={`/${subItem.path}`}>
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
                  <SidebarMenuItem key={item.path}>
                    <Link href={`/${item.path!}`} passHref>
                      <SidebarMenuButton
                        isActive={pathname.startsWith(`/${item.path!}`)}
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
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex items-center gap-4">
              <RoleSelector />
              {userRole === 'Promoteur' && (
                  <Link href="/marketing" target="_blank" passHref>
                      <Button variant="outline">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Voir le site public
                      </Button>
                  </Link>
              )}
              <UserMenu />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-background">
            {children}
          </main>
        </SidebarInset>
      </>
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
                    <SelectItem value="Professeur">Professeur</SelectItem>
                    <SelectItem value="Étudiant">Étudiant</SelectItem>
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
    <SidebarProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
