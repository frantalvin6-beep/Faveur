
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminStaff, UserRole } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ALL_ROLES: UserRole[] = ['Promoteur', 'DAC', 'DAF', 'Secrétaire', 'Surveillant', 'Professeur', 'Étudiant'];

function StaffForm({
  staff,
  onSave,
  children,
}: {
  staff?: AdminStaff;
  onSave: (staff: Omit<AdminStaff, 'id'>) => Promise<AdminStaff | void>;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('Secrétaire');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [status, setStatus] = React.useState<AdminStaff['status']>('Actif');
  const { toast } = useToast();

  React.useEffect(() => {
    if (staff) {
      setName(staff.name);
      setRole(staff.role);
      setEmail(staff.email);
      setPhone(staff.phone);
      setStatus(staff.status);
    } else {
      setName('');
      setRole('Secrétaire');
      setEmail('');
      setPhone('');
      setStatus('Actif');
    }
  }, [staff, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email) {
      toast({ variant: "destructive", title: "Erreur", description: "Veuillez remplir les champs obligatoires (Nom, Rôle, Email)." });
      return;
    }
    
    try {
      const staffData = {
        name,
        role,
        email,
        phone,
        status,
        hireDate: staff?.hireDate || new Date().toISOString().split('T')[0],
      };
      await onSave(staffData);
      setIsOpen(false);
    } catch(error) {
      // Error toast is handled in parent component
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{staff ? 'Modifier le membre' : 'Nouveau membre du personnel'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Nom Complet</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="space-y-2">
                <Label>Rôle / Poste</Label>
                <Select onValueChange={(v: UserRole) => setRole(v)} value={role}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Téléphone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="space-y-2">
                <Label>Statut</Label>
                <Select onValueChange={(v: AdminStaff['status']) => setStatus(v)} value={status}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export function AdminStaffTable({ data, onAddStaff, onUpdateStaff, onDeleteStaff }: { data: AdminStaff[], onAddStaff: (staff: Omit<AdminStaff, 'id'>) => Promise<AdminStaff>, onUpdateStaff: (id: string, data: Partial<AdminStaff>) => void, onDeleteStaff: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredStaff = data.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusChange = (id: string, currentStatus: AdminStaff['status']) => {
    const newStatus = currentStatus === 'Actif' ? 'Suspendu' : 'Actif';
    onUpdateStaff(id, { status: newStatus });
  }

  const handleSave = (staffData: Omit<AdminStaff, 'id'>) => {
    return onAddStaff(staffData);
  }
  
  const handleUpdate = (id: string) => async (staffData: Omit<AdminStaff, 'id'>) => {
    return onUpdateStaff(id, staffData);
  }
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Liste du personnel</CardTitle>
                <CardDescription>Gérer les comptes et les informations du personnel.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <StaffForm onSave={handleSave}>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un membre
                  </Button>
                </StaffForm>
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nom Complet</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date d'embauche</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredStaff.length > 0 ? filteredStaff.map((member) => (
                <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell><Badge variant="secondary">{member.role}</Badge></TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm">{member.email}</span>
                            <span className="text-xs text-muted-foreground">{member.phone}</span>
                        </div>
                    </TableCell>
                    <TableCell>{new Date(member.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge 
                            variant={member.status === 'Actif' ? 'default' : 'destructive'}
                            className={cn(member.status === 'Actif' && "bg-green-600")}
                        >
                            {member.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <StaffForm staff={member} onSave={handleUpdate(member.id)}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                          </StaffForm>
                          <DropdownMenuItem onClick={() => handleStatusChange(member.id, member.status)}>
                              {member.status === 'Actif' ? 'Suspendre' : 'Activer'} le compte
                          </DropdownMenuItem>
                          <DropdownMenuItem
                              onClick={() => onDeleteStaff(member.id)}
                              className="text-destructive focus:text-destructive"
                          >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            Aucun membre trouvé.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
