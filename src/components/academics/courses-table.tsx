
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
import { Course } from '@/lib/types';
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
import { departments } from '@/lib/data';


function AddCourseForm({ onAddCourse }: { onAddCourse: (course: Course) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [name, setName] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [level, setLevel] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const [credits, setCredits] = React.useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name || !department || !level || !semester || credits <= 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newCourse: Course = {
      code,
      name,
      department,
      level,
      semester,
      credits,
    };
    onAddCourse(newCourse);
    setIsOpen(false);
    // Reset form
    setCode('');
    setName('');
    setDepartment('');
    setLevel('');
    setSemester('');
    setCredits(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une matière
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Matière</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code Matière</Label>
              <Input id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="Ex: MATH101" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la matière</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Algèbre Linéaire" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département/Option</Label>
               <Select onValueChange={setDepartment} value={department} required>
                <SelectTrigger id="department"><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                <SelectContent>
                  {departments.filter(d => d.id.includes('OPT')).map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="level">Niveau</Label>
              <Select onValueChange={setLevel} value={level} required>
                    <SelectTrigger><SelectValue placeholder="Sélectionner le niveau..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Licence 1">Licence 1</SelectItem>
                        <SelectItem value="Licence 2">Licence 2</SelectItem>
                        <SelectItem value="Licence 3">Licence 3</SelectItem>
                        <SelectItem value="Master 1">Master 1</SelectItem>
                        <SelectItem value="Master 2">Master 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semestre</Label>
              <Input id="semester" value={semester} onChange={e => setSemester(e.target.value)} placeholder="Ex: Semestre 1" required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="credits">Crédits (Coefficient)</Label>
              <Input id="credits" type="number" min="0" value={credits} onChange={e => setCredits(Number(e.target.value))} required />
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


export function CoursesTable({ data, onAddCourse, onDeleteCourse }: { data: Course[], onAddCourse: (course: Course) => void, onDeleteCourse: (code: string) => void }) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (code: string) => alert(`Modification de ${code} bientôt disponible.`);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Liste des matières</CardTitle>
            <CardDescription>Consultez et gérez toutes les matières de l'université.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <AddCourseForm onAddCourse={onAddCourse} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom de la matière</TableHead>
                <TableHead>Département/Option</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Crédits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? filteredData.map((item) => (
                <TableRow key={item.code}>
                  <TableCell className="font-mono">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Badge variant="outline">{item.department}</Badge></TableCell>
                  <TableCell>{item.level}</TableCell>
                  <TableCell>{item.semester}</TableCell>
                  <TableCell>{item.credits}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(item.code)}>
                          <Edit className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteCourse(item.code)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucune matière trouvée.
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

    