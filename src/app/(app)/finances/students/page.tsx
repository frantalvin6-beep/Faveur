
'use client';

import * as React from 'react';
import { getStudentFinances, getDepartments } from '@/lib/data';
import { StudentFinancesPageContent } from '@/components/finances/student-finances-page-content';
import { Skeleton } from '@/components/ui/skeleton';
import { StudentFinance, Department } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function StudentFinancesPage() {
  const [studentFinances, setStudentFinances] = React.useState<StudentFinance[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [finances, depts] = await Promise.all([
          getStudentFinances(),
          getDepartments()
        ]);
        setStudentFinances(finances);
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch student finances data:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les finances des étudiants.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-72" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  
  return <StudentFinancesPageContent initialFinances={studentFinances} initialDepartments={departments} />;
}
