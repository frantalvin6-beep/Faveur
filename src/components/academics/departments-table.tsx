
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
import { Department } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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

function AddDepartmentForm({ onAddDepartment, parentId }: { onAddDepartment: (dept: Omit<Department, 'id'>) => void, parentId?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [head, setHead] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !head) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    
    const departmentData: Omit<Department, 'id'> = {
      name,
      head,
      facultyCount: 0,
      studentCount: 0,
      creationDate: new Date().toISOString().split('T')[0],
    };

    if (parentId) {
      departmentData.parentId = parentId;
    }

    onAddDepartment(departmentData);

    setIsOpen(false);
    setName('');
    setHead('');
  };

  const title = parentId ? "Ajouter une nouvelle option" : "Ajouter une faculté/département";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {parentId ? (
             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Créer une option
            </DropdownMenuItem>
        ) : (
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="head">Responsable</Label>
              <Input id="head" value={head} onChange={e => setHead(e.target.value)} required />
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


export function DepartmentsTable({ data, onAddDepartment, onDeleteDepartment }: { data: Department[], onAddDepartment: (dept: Omit<Department, 'id'>) => void, onDeleteDepartment: (id: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredDepartments = data.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.head && dept.head.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);
  
  return (
    <Card>
      <CardHeader>
         <div className="flex items-center justify-between">
            <div>
                <CardTitle>Structure Académique</CardTitle>
                <CardDescription>Gérer les facultés, départements et options de l'université.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
                />
                <AddDepartmentForm onAddDepartment={onAddDepartment} />
            </div>
        </div>
      </CardHeader>
      <CardContent>
          <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="hidden md:table-cell">Personnel Enseignant</TableHead>
                <TableHead className="hidden md:table-cell">Étudiants</TableHead>
                <TableHead className="hidden sm:table-cell">Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredDepartments.length > 0 ? filteredDepartments.map((dept) => (
                <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.head}</TableCell>
                    <TableCell className="hidden md:table-cell">{dept.facultyCount}</TableCell>
                    <TableCell className="hidden md:table-cell">{dept.studentCount}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(dept.creationDate).toLocaleDateString()}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(dept.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDeleteDepartment(dept.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                        </DropdownMenuItem>
                         <AddDepartmentForm onAddDepartment={onAddDepartment} parentId={dept.id} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
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
