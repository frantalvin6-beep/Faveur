
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CourseAssignment, getCourseAssignments, addCourseAssignment, deleteCourseAssignment, getCourses, getFaculty, Course, Faculty, TeacherWorkload, addTeacherWorkload, deleteTeacherWorkloadByCourseAndTeacher, getTeacherWorkloads } from '@/lib/data';
import { CourseAssignmentsTable } from '@/components/faculty/course-assignments-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function CourseAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = React.useState<CourseAssignment[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [faculty, setFaculty] = React.useState<Faculty[]>([]);
  const [workloads, setWorkloads] = React.useState<TeacherWorkload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [assignmentsData, coursesData, facultyData, workloadsData] = await Promise.all([
        getCourseAssignments(),
        getCourses(),
        getFaculty(),
        getTeacherWorkloads(),
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
      setFaculty(facultyData);
      setWorkloads(workloadsData);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les données.' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleAddAssignment = async (assignmentData: Omit<CourseAssignment, 'id'>) => {
    try {
        const newAssignment = await addCourseAssignment(assignmentData);

        const course = courses.find(c => c.code === newAssignment.courseCode);
        if (course) {
            const workloadData: Omit<TeacherWorkload, 'id'> = {
                teacherId: newAssignment.teacherId,
                teacherName: newAssignment.teacherName,
                courseName: newAssignment.courseName,
                level: newAssignment.level,
                semester: newAssignment.semester,
                plannedHours: course.credits * 10, // Default calculation
                completedHours: 0,
            };
            await addTeacherWorkload(workloadData);
            toast({ title: 'Attribution et charge horaire créées', description: `La charge horaire pour ${newAssignment.courseName} a été initialisée.` });
        } else {
          toast({ title: 'Attribution ajoutée' });
        }

        await fetchData(); // Refetch all data
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'attribution.' });
        throw error;
    }
  };
  
  const handleDeleteAssignment = async (id: string) => {
      const assignmentToDelete = assignments.find(a => a.id === id);
      if (!assignmentToDelete) return;
      
      if (confirm('Êtes-vous sûr de vouloir supprimer cette attribution ? Cela supprimera aussi la charge horaire associée.')) {
          try {
              await deleteCourseAssignment(id);
              await deleteTeacherWorkloadByCourseAndTeacher(assignmentToDelete.courseCode, assignmentToDelete.teacherId);
              
              toast({ title: 'Attribution et charge horaire supprimées' });
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
            workloads={workloads}
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
        />
    </div>
  )
}
