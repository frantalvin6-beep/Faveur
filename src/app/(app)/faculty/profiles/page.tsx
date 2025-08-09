
import * as React from 'react';
import { getFaculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';

export default async function FacultyProfilesPage() {
  const faculty = await getFaculty();

  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Profils du Personnel Enseignant</h1>
        <FacultyTable 
            initialData={faculty} 
        />
    </div>
  )
}
