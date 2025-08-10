
'use client';

import * as React from 'react';
import { getFaculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';
import { Skeleton } from '@/components/ui/skeleton';

export default function FacultyProfilesPage() {
  const [faculty, setFaculty] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const facultyData = await getFaculty();
        setFaculty(facultyData);
      } catch (error) {
        console.error("Failed to fetch faculty data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-96" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Profils du Personnel Enseignant</h1>
        <FacultyTable 
            initialData={faculty} 
        />
    </div>
  )
}
