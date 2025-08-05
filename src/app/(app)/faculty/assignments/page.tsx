'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { courseAssignments } from '@/lib/data';
import { CourseAssignmentsTable } from '@/components/faculty/course-assignments-table';

export default function CourseAssignmentsPage() {
  const router = useRouter();

  return (
    <div>
        <div className="flex items-center gap-4 mb-4">
             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Button>
            <h1 className="text-3xl font-bold">Attribution des cours</h1>
        </div>
        <CourseAssignmentsTable data={courseAssignments} />
    </div>
  )
}
