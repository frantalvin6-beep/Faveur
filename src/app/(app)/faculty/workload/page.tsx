'use client';

import * as React from 'react';
import { teacherWorkload } from '@/lib/data';
import { TeacherWorkloadTable } from '@/components/faculty/teacher-workload-table';
import { useIsMobile } from '@/hooks/use-mobile'; // This is a bit of a hack to force re-rendering on navigation

export default function TeacherWorkloadPage() {
  // Re-fetch data on component mount to get updates from other pages
  const [workloadData, setWorkloadData] = React.useState(teacherWorkload);
  const isMobile = useIsMobile(); // unused, but its change on route change can trigger a re-render

  React.useEffect(() => {
    // This simulates fetching the latest data when the page is viewed
    setWorkloadData([...teacherWorkload]);
  }, [isMobile]); // Re-run when route changes

  return (
    <div>
      <h1 className="text-3xl font-bold">Charge horaire des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi des heures de cours prévues et effectuées par chaque enseignant.
      </p>
      <TeacherWorkloadTable data={workloadData} />
    </div>
  );
}
