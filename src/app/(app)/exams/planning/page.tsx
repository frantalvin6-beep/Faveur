
'use client';

import * as React from 'react';
import { examSchedule } from '@/lib/data';
import { ExamsPlanningTable } from '@/components/exams/exams-planning-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExamsPlanningPage() {
  const [schedule, setSchedule] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // In a real app, you would fetch this data.
    // For now, we use the static import but simulate a load.
    setSchedule(examSchedule);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-96 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Planification des examens</h1>
      <p className="text-muted-foreground mb-4">
        Organisez le calendrier des examens pour tous les départements.
      </p>
      <ExamsPlanningTable data={schedule} />
    </div>
  );
}
