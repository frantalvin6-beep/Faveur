
'use client';

import * as React from 'react';
import { FacultyFinance, calculerSalaireComplet, AccountingTransaction, faculty as allFaculty, getFacultyFinances, updateFacultyFinance, addFacultyFinance, addAccountingTransaction, getFaculty } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';
import { useToast } from '@/hooks/use-toast';
import { detectAnomalies, DetectAnomaliesOutput } from '@/ai/flows/detect-finance-anomalies';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Faculty } from '@/lib/types';


export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState<FacultyFinance[]>([]);
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();
  const [isLoadingAnomalies, setIsLoadingAnomalies] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<DetectAnomaliesOutput | null>(null);

  const refetchData = React.useCallback(async () => {
     try {
        setLoading(true);
        const [financesData, facultyData] = await Promise.all([
            getFacultyFinances(),
            getFaculty()
        ]);
        
        const updatedFinancesPromises = financesData.map(async finance => {
            const calculated = await calculerSalaireComplet(
                finance.teacherId,
                finance.montantPaye,
                finance.tauxL1,
                finance.tauxL2,
                finance.tauxL3,
                finance.tauxMaster
            );
            return { ...finance, ...calculated };
        });

        const updatedFinances = await Promise.all(updatedFinancesPromises);

        setFacultyFinances(updatedFinances);
        setFaculty(facultyData);
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données financières.' });
    } finally {
        setLoading(false);
    }
  }, [toast]);


  React.useEffect(() => {
    refetchData();
  }, [refetchData]);

  const handleUpdateFinance = async (updatedFinance: FacultyFinance) => {
    const originalFinance = facultyFinances.find(f => f.teacherId === updatedFinance.teacherId);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);

    try {
        await updateFacultyFinance(updatedFinance.teacherId, updatedFinance);
        setFacultyFinances(prev => prev.map(f => f.teacherId === updatedFinance.teacherId ? updatedFinance : f));
        
        if (paymentAmount > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: updatedFinance.fullName,
                category: 'Salaires',
                amount: paymentAmount,
                paymentMethod: 'Virement bancaire', // Default method
                description: `Paiement salaire enseignant`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de mettre à jour la paie.' });
    }
  };
  
  const handleAddFinance = async (newFinance: FacultyFinance) => {
    if (facultyFinances.some(f => f.teacherId === newFinance.teacherId)) {
        alert('Une fiche de paie pour cet enseignant existe déjà.');
        return;
    }
    
    try {
        await addFacultyFinance(newFinance);
        setFacultyFinances(prev => [...prev, newFinance]);
        
        if (newFinance.montantPaye > 0) {
            const newTransaction: Omit<AccountingTransaction, 'id'> = {
                date: new Date().toISOString().split('T')[0],
                type: 'Dépense',
                sourceBeneficiary: newFinance.fullName,
                category: 'Salaires',
                amount: newFinance.montantPaye,
                paymentMethod: 'Virement bancaire',
                description: `Avance sur salaire enseignant`,
                responsible: 'DRH'
            };
            await addAccountingTransaction(newTransaction);
            toast({
                title: "Transaction enregistrée",
                description: `Une dépense de ${newFinance.montantPaye.toLocaleString()} FCFA pour ${newFinance.fullName} a été ajoutée à la comptabilité.`,
            });
        }
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'initialiser la paie.' });
    }
  };

  const handleAnalyzeAnomalies = async () => {
    setIsLoadingAnomalies(true);
    setAnalysisResult(null);
    try {
        const result = await detectAnomalies({
            financeData: JSON.stringify(facultyFinances),
            personnelData: JSON.stringify(faculty),
        });
        setAnalysisResult(result);
        toast({
            title: "Analyse terminée",
            description: `L'IA a trouvé ${result.anomalies.length} anomalie(s) potentielle(s).`
        });
    } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Erreur d'analyse",
            description: "Impossible de lancer l'analyse des anomalies."
        });
    } finally {
        setIsLoadingAnomalies(false);
    }
  };

  if (loading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-96" />
                  <Skeleton className="h-4 w-96 mt-2" />
              </div>
              <Skeleton className="h-80 w-full" />
          </div>
      );
  }


  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold">Finances des Enseignants</h1>
            <p className="text-muted-foreground">
            Suivi de la rémunération des enseignants basée sur les heures de cours et les taux horaires.
            </p>
        </div>
        
        <div className="flex items-center gap-4">
             <Button onClick={handleAnalyzeAnomalies} disabled={isLoadingAnomalies}>
                {isLoadingAnomalies ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                Analyser les anomalies avec l'IA
            </Button>
        </div>
        
        {analysisResult && (
            <div className="space-y-4">
                {analysisResult.anomalies.length > 0 ? (
                     analysisResult.anomalies.map((anomaly, index) => (
                        <Alert key={index} variant={anomaly.severity === 'Haute' ? 'destructive' : 'default'}>
                            <AlertTitle>
                                Anomalie de sévérité {anomaly.severity}
                            </AlertTitle>
                            <AlertDescription>
                                <p className='font-semibold'>{anomaly.description}</p>
                                <p className='mt-1 text-xs'>Recommandation: {anomaly.recommendation}</p>
                            </AlertDescription>
                        </Alert>
                    ))
                ) : (
                    <Alert variant="default" className='border-green-500'>
                        <AlertTitle className='text-green-600'>Aucune anomalie détectée</AlertTitle>
                        <AlertDescription>
                            L'analyse par l'IA n'a révélé aucune incohérence ou anomalie dans les données de paie.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        )}

        <FacultyFinancesTable 
            data={facultyFinances} 
            allFaculty={faculty}
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
