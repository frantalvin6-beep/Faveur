
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
import { addDepartment, deleteDepartment, getDepartments } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

function AddDepartmentForm({ onDepartmentAdded, parentDepartment }: { onDepartmentAdded: () => void, parentDepartment?: Department }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [head, setHead] = React.useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !head) {
      toast({variant: 'destructive', title: 'Erreur', description: 'Veuillez remplir tous les champs.'});
      return;
    }
    
    const departmentData: Omit<Department, 'id'> = {
      name,
      head,
      facultyCount: 0,
      studentCount: 0,
      creationDate: new Date().toISOString().split('T')[0],
      parentId: parentDepartment?.id
    };

    try {
        const newDept = await addDepartment(departmentData);
        toast({ title: parentDepartment ? 'Option ajoutée' : 'Faculté ajoutée', description: `Le département ${newDept.name} a été créé.` });
        onDepartmentAdded(); // Trigger refetch
        setIsOpen(false);
        setName('');
        setHead('');
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter le département.' });
    }
  };

  const title = parentDepartment ? `Ajouter une option à ${parentDepartment.name}` : "Ajouter une faculté/département";

  const TriggerButton = parentDepartment ? (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Créer une option
    </DropdownMenuItem>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" />
      Ajouter
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {TriggerButton}
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


export function DepartmentsTable() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les départements.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleEdit = (id: string) => alert(`La fonctionnalité de modification pour ${id} sera bientôt implémentée.`);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce département ?')) {
        try {
            await deleteDepartment(id);
            toast({title: 'Département supprimé'});
            fetchData();
        } catch(error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le département.' });
        }
    }
  }

  const faculties = departments.filter(d => !d.parentId);
  
  const getFilteredOptionsForFaculty = (facultyId: string) => {
      const options = departments.filter(d => d.parentId === facultyId);
      if (!searchTerm) return options;
      return options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        opt.head.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }

  const displayedFaculties = faculties.filter(faculty => {
      if (!searchTerm) return true;
      const facultyMatch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) || faculty.head.toLowerCase().includes(searchTerm.toLowerCase());
      const optionsMatch = getFilteredOptionsForFaculty(faculty.id).length > 0;
      return facultyMatch || optionsMatch;
  });

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-8">
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
                    <AddDepartmentForm onDepartmentAdded={fetchData} />
                </div>
            </div>
          </CardHeader>
      </Card>
      
      {displayedFaculties.length > 0 ? displayedFaculties.map(faculty => {
          const options = getFilteredOptionsForFaculty(faculty.id);
          return (
            <Card key={faculty.id}>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{faculty.name}</CardTitle>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions pour {faculty.name}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(faculty.id)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier la faculté
                            </DropdownMenuItem>
                            <AddDepartmentForm onDepartmentAdded={fetchData} parentDepartment={faculty} />
                            <DropdownMenuItem
                                onClick={() => handleDelete(faculty.id)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer la faculté
                            </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardDescription>Responsable: {faculty.head}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Option / Département</TableHead>
                                <TableHead>Responsable</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {options.length > 0 ? options.map(option => (
                                    <TableRow key={option.id}>
                                        <TableCell className="font-medium">{option.name}</TableCell>
                                        <TableCell>{option.head}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Ouvrir le menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions pour {option.name}</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleEdit(option.id)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(option.id)}
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
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            Aucune option trouvée pour cette faculté.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
          )
      }) : (
        <Card>
            <CardContent>
                <p className="text-center text-muted-foreground py-8">
                    {searchTerm ? "Aucun résultat trouvé." : "Aucune faculté à afficher. Commencez par en ajouter une."}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
