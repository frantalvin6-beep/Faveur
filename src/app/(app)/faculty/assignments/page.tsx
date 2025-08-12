
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CourseAssignment, getCourseAssignments, addCourseAssignment, deleteCourseAssignment, getCourses, getFaculty, Course, Faculty } from '@/lib/data';
import { CourseAssignmentsTable } from '@/components/faculty/course-assignments-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function CourseAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = React.useState<CourseAssignment[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [data, coursesData, facultyData] = await Promise.all([
        getCourseAssignments(),
        getCourses(),
        getFaculty()
      ]);
      setAssignments(data);
      setCourses(coursesData);
      setFaculty(facultyData);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les attributions.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleAddAssignment = async (assignment: Omit<CourseAssignment, 'id'>) => {
    try {
        await addCourseAssignment(assignment);
        toast({ title: 'Attribution ajoutée' });
        await fetchData(); // Refetch
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'attribution.' });
    }
  };
  
  const handleDeleteAssignment = async (id: string) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette attribution ?')) {
          try {
              await deleteCourseAssignment(id);
              toast({ title: 'Attribution supprimée' });
              await fetchData(); // Refetch
          } catch (error) {
              console.error(error);
              toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'attribution.' });
          }
      }
  };
  
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
        <div className="flex items-center gap-4 mb-4">
             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Retour</span>
            </Button>
            <h1 className="text-3xl font-bold">Attribution des cours</h1>
        </div>
        <CourseAssignmentsTable 
            data={assignments} 
            courses={courses}
            faculty={faculty}
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
        />
    </div>
  )
}
