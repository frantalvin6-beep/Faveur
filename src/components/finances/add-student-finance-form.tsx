
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { StudentFinance, Department } from '@/lib/types';
import { calculerFinance } from '@/lib/data';

export function AddStudentFinanceForm({ onAddStudent, departments }: { onAddStudent: (student: StudentFinance) => void, departments: Department[] }) {
    const [isOpen, setIsOpen] = React.useState(false);

    // Form state
    const [matricule, setMatricule] = React.useState('');
    const [fullName, setFullName] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [option, setOption] = React.useState('');
    const [inscription, setInscription] = React.useState(50000);
    const [semester, setSemester] = React.useState<'Pair' | 'Impair'>('Impair');
    const [fournitures, setFournitures] = React.useState(20000);
    const [support, setSupport] = React.useState(10000);
    const [bourseType, setBourseType] = React.useState<StudentFinance['bourseType']>('Non boursier');
    const [reduction, setReduction] = React.useState(0);
    const [scolariteBase, setScolariteBase] = React.useState(400000);
    const [latrine, setLatrine] = React.useState(3000);
    const [session, setSession] = React.useState(15000);
    const [rattrapage, setRattrapage] = React.useState(0);
    const [avance, setAvance] = React.useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!matricule || !fullName || !level || !option) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const calculated = calculerFinance(inscription, fournitures, support, bourseType, reduction, scolariteBase, latrine, session, rattrapage, avance);
        
        const newStudent: StudentFinance = {
            matricule, fullName, level, option, inscription, semester, fournitures, support, bourseType, reduction,
            scolariteBase, latrine, session, rattrapage, avance, ...calculated
        };

        onAddStudent(newStudent);
        setIsOpen(false);
        // Reset form
        setMatricule('');
        setFullName('');
        setLevel('');
        setOption('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un étudiant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel étudiant aux finances</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex-grow overflow-hidden flex flex-col">
                   <ScrollArea className="flex-grow pr-6 -mr-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                            {/* Champs principaux */}
                            <div className="space-y-2"><Label htmlFor="matricule">Matricule</Label><Input id="matricule" value={matricule} onChange={(e) => setMatricule(e.target.value)} required /></div>
                            <div className="space-y-2"><Label htmlFor="fullName">Nom & Prénom</Label><Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                            <div className="space-y-2"><Label htmlFor="level">Niveau d'études</Label><Input id="level" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Ex: Licence 1" required /></div>
                            <div className="space-y-2"><Label htmlFor="option">Option</Label><Select onValueChange={setOption} value={option}><SelectTrigger id="option"><SelectValue placeholder="Sélectionner..." /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label htmlFor="semester">Semestre</Label><Select onValueChange={(v: 'Pair' | 'Impair') => setSemester(v)} value={semester}><SelectTrigger id="semester"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Impair">Impair</SelectItem><SelectItem value="Pair">Pair</SelectItem></SelectContent></Select></div>
                            
                            {/* Champs financiers */}
                            <div className="space-y-2"><Label htmlFor="inscription">Frais d'inscription</Label><Input id="inscription" type="number" value={inscription} onChange={(e) => setInscription(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="fournitures">Frais de fournitures</Label><Input id="fournitures" type="number" value={fournitures} onChange={(e) => setFournitures(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="support">Frais de support</Label><Input id="support" type="number" value={support} onChange={(e) => setSupport(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="latrine">Frais de latrine</Label><Input id="latrine" type="number" value={latrine} onChange={(e) => setLatrine(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="session">Frais de session</Label><Input id="session" type="number" value={session} onChange={(e) => setSession(Number(e.target.value))} /></div>
                            <div className="space-y-2"><Label htmlFor="rattrapage">Frais de rattrapage</Label><Input id="rattrapage" type="number" value={rattrapage} onChange={(e) => setRattrapage(Number(e.target.value))} /></div>
                            
                            {/* Scolarité et Bourse */}
                            <div className="space-y-2"><Label htmlFor="bourseType">Type de Bourse</Label><Select onValueChange={(v: StudentFinance['bourseType']) => setBourseType(v)} value={bourseType}><SelectTrigger id="bourseType"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Non boursier">Non boursier</SelectItem><SelectItem value="Boursier">Boursier</SelectItem><SelectItem value="Partiellement boursier">Partiellement boursier</SelectItem></SelectContent></Select></div>
                            {bourseType === 'Partiellement boursier' && <div className="space-y-2"><Label htmlFor="reduction">% Réduction</Label><Input id="reduction" type="number" value={reduction} onChange={(e) => setReduction(Number(e.target.value))} /></div>}
                            <div className="space-y-2"><Label htmlFor="scolariteBase">Scolarité de base</Label><Input id="scolariteBase" type="number" value={scolariteBase} onChange={(e) => setScolariteBase(Number(e.target.value))} /></div>
                            
                            {/* Avance */}
                            <div className="space-y-2"><Label htmlFor="avance">Avance</Label><Input id="avance" type="number" value={avance} onChange={(e) => setAvance(Number(e.target.value))} /></div>
                        </div>
                    </ScrollArea>
                    <DialogFooter className="pt-4 flex-shrink-0">
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit">Enregistrer l'étudiant</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
