
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
import { Faculty } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getDepartments } from '@/lib/data';


function AddFacultyForm({ onAddFaculty }: { onAddFaculty: (faculty: Omit<Faculty, 'id'>) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [departments, setDepartments] = React.useState<any[]>([]);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [position, setPosition] = React.useState<Faculty['position']>('Chargé de cours');
  const [specialization, setSpecialization] = React.useState('');
  const [teachingLevels, setTeachingLevels] = React.useState<Faculty['teachingLevels'][]>([]);

  React.useEffect(() => {
    async function loadDeps() {
      const deps = await getDepartments();
      setDepartments(deps.filter(d => d.id.includes('OPT')));
    }
    loadDeps();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !department || !position) {
      alert("Veuillez remplir les champs obligatoires.");
      return;
    }
    onAddFaculty({
      name, email, phone, department, position, specialization, teachingLevels,
      hireDate: new Date().toISOString().split('T')[0]
    });
    setIsOpen(false);
    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un membre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouveau membre du personnel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2"><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Téléphone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="space-y-2">
                <Label>Département</Label>
                <Select onValueChange={setDepartment} value={department}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..."/></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label>Poste</Label>
                <Select onValueChange={(v: Faculty['position']) => setPosition(v)} value={position}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Chargé de cours">Chargé de cours</SelectItem>
                        <SelectItem value="Professeur assistant">Professeur assistant</SelectItem>
                        <SelectItem value="Professeur agrégé">Professeur agrégé</SelectItem>
                        <SelectItem value="Professeur">Professeur</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2"><Label>Spécialisation</Label><Input value={specialization} onChange={e => setSpecialization(e.target.value)} /></div>

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


export function FacultyTable({ data, onAddFaculty, onDeleteFaculty }: { data: Faculty[], onAddFaculty: (faculty: Omit<Faculty, 'id'>) => void, onDeleteFaculty: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredFaculty = data.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => alert(`La fonctionnalité de modification du membre du personnel ${id} sera bientôt implémentée.`);
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Profils enseignants</CardTitle>
                <CardDescription>Gérer les dossiers des membres du personnel.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher du personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <AddFacultyForm onAddFaculty={onAddFaculty} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="relative w-full overflow-auto rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="whitespace-nowrap">Nom</TableHead>
                <TableHead className="whitespace-nowrap">Contact</TableHead>
                <TableHead className="whitespace-nowrap">Département</TableHead>
                <TableHead className="whitespace-nowrap">Poste</TableHead>
                <TableHead className="whitespace-nowrap">Spécialisation</TableHead>
                <TableHead className="whitespace-nowrap">Niveau d'enseignement</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredFaculty.length > 0 ? filteredFaculty.map((member) => (
                <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span className="text-sm">{member.email}</span>
                            <span className="text-xs text-muted-foreground">{member.phone}</span>
                        </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{member.department}</Badge></TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.specialization}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1">
                            {member.teachingLevels.map(level => (
                                <Badge key={level} variant="secondary">{level}</Badge>
                            ))}
                        </div>
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
                        <DropdownMenuItem onClick={() => handleEdit(member.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDeleteFaculty(member.id)}
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
                        <TableCell colSpan={7} className="h-24 text-center">
                            Aucun résultat trouvé.
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
