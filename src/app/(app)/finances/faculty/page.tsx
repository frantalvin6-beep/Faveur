'use client';

import * as React from 'react';
import { facultyFinances as initialFacultyFinances, FacultyFinance, calculerSalaireComplet, teacherWorkload, accountingTransactions, faculty } from '@/lib/data';
import { FacultyFinancesTable } from '@/components/finances/faculty-finances-table';
import { useToast } from '@/hooks/use-toast';
import { detectAnomalies, DetectAnomaliesOutput } from '@/ai/flows/detect-finance-anomalies';
import { Button } from '@/components/ui/button';
import { Bot, Loader2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FacultyFinancesPage() {
  const [facultyFinances, setFacultyFinances] = React.useState(initialFacultyFinances);
  const { toast } = useToast();
  const [isLoadingAnomalies, setIsLoadingAnomalies] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<DetectAnomaliesOutput | null>(null);

  // Recalculate all finances based on current workload whenever the component mounts
  // This simulates data being fresh from a database.
  React.useEffect(() => {
    const updatedFinances = initialFacultyFinances.map(finance => {
      const calculated = calculerSalaireComplet(
        finance.teacherId,
        finance.montantPaye,
        finance.tauxL1,
        finance.tauxL2,
        finance.tauxL3,
        finance.tauxMaster
      );
      return { ...finance, ...calculated };
    });
    setFacultyFinances(updatedFinances);
  }, []);

  const handleUpdateFinance = (updatedFinance: FacultyFinance) => {
    const originalFinance = facultyFinances.find(f => f.teacherId === updatedFinance.teacherId);
    const paymentAmount = updatedFinance.montantPaye - (originalFinance?.montantPaye || 0);

    setFacultyFinances(prev => prev.map(f => f.teacherId === updatedFinance.teacherId ? updatedFinance : f));
    
    if (paymentAmount > 0) {
        accountingTransactions.unshift({
            id: `TRN-FAC-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: updatedFinance.fullName,
            category: 'Salaires',
            amount: paymentAmount,
            paymentMethod: 'Virement bancaire', // Default method
            description: `Paiement salaire enseignant`,
            responsible: 'DRH'
        });
        toast({
            title: "Transaction enregistrée",
            description: `Une dépense de ${paymentAmount.toLocaleString()} FCFA pour ${updatedFinance.fullName} a été ajoutée à la comptabilité.`,
        });
    }
  };
  
  const handleAddFinance = (newFinance: FacultyFinance) => {
     // Prevent duplicates
    if (facultyFinances.some(f => f.teacherId === newFinance.teacherId)) {
        alert('Une fiche de paie pour cet enseignant existe déjà.');
        return;
    }
    setFacultyFinances(prev => [...prev, newFinance]);
    
    if (newFinance.montantPaye > 0) {
        accountingTransactions.unshift({
            id: `TRN-FAC-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Dépense',
            sourceBeneficiary: newFinance.fullName,
            category: 'Salaires',
            amount: newFinance.montantPaye,
            paymentMethod: 'Virement bancaire',
            description: `Avance sur salaire enseignant`,
            responsible: 'DRH'
        });
        toast({
            title: "Transaction enregistrée",
            description: `Une dépense de ${newFinance.montantPaye.toLocaleString()} FCFA pour ${newFinance.fullName} a été ajoutée à la comptabilité.`,
        });
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
            onAddFinance={handleAddFinance}
            onUpdateFinance={handleUpdateFinance}
        />
    </div>
  );
}
