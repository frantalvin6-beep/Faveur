
'use client';

import * as React from 'react';
import { teacherAttendance as initialAttendance, teacherWorkload as initialWorkload, scheduleData } from '@/lib/data';
import { AttendanceTable } from '@/components/faculty/attendance-table';
import { TeacherAttendance, TeacherWorkload } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile'; // This is a bit of a hack to force re-rendering on navigation

export default function AttendancePage() {
  const [attendance, setAttendance] = React.useState(initialAttendance);
  const [workload, setWorkload] = React.useState(initialWorkload);
  const isMobile = useIsMobile(); // unused, but its change on route change can trigger a re-render

  React.useEffect(() => {
    // This simulates fetching the latest data when the page is viewed
    setWorkload([...initialWorkload]);
  }, [isMobile]); // Re-run when route changes


  const handleAddEntry = (newEntry: TeacherAttendance) => {
    // Add to attendance list
    setAttendance(prev => [...prev, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // If present, update workload
    if (newEntry.status === 'Présent') {
      const scheduleEntry = scheduleData.find(
        s => s.teacherId === newEntry.teacherId && s.courseCode === newEntry.courseCode
      );
      
      if (scheduleEntry) {
        const startTime = new Date(`1970-01-01T${scheduleEntry.startTime}:00`);
        const endTime = new Date(`1970-01-01T${scheduleEntry.endTime}:00`);
        const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

        setWorkload(prevWorkload => {
          const workloadIndex = prevWorkload.findIndex(
            w => w.teacherId === newEntry.teacherId && w.courseName === scheduleEntry.courseName
          );

          if (workloadIndex > -1) {
            const updatedWorkload = [...prevWorkload];
            const currentWorkload = updatedWorkload[workloadIndex];
            updatedWorkload[workloadIndex] = {
              ...currentWorkload,
              completedHours: currentWorkload.completedHours + durationInHours,
            };
            // Note: In a real app, you would persist this change to the database.
            // For now, we update the original imported data to simulate persistence across pages.
            const originalWorkloadIndex = initialWorkload.findIndex(w => w.id === currentWorkload.id);
            if (originalWorkloadIndex > -1) {
                initialWorkload[originalWorkloadIndex] = updatedWorkload[workloadIndex];
            }
            return updatedWorkload;
          }
          return prevWorkload;
        });
      }
    }
  };
  
  const handleDeleteEntry = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
      const entryToDelete = attendance.find(a => a.id === id);
      if (!entryToDelete) return;

      // Reverse the workload update if the deleted entry was 'Present'
      if (entryToDelete.status === 'Présent') {
        const scheduleEntry = scheduleData.find(
          s => s.teacherId === entryToDelete.teacherId && s.courseCode === entryToDelete.courseCode
        );

        if (scheduleEntry) {
            const startTime = new Date(`1970-01-01T${scheduleEntry.startTime}:00`);
            const endTime = new Date(`1970-01-01T${scheduleEntry.endTime}:00`);
            const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

            setWorkload(prevWorkload => {
                const workloadIndex = prevWorkload.findIndex(
                    w => w.teacherId === entryToDelete.teacherId && w.courseName === scheduleEntry.courseName
                );
                if (workloadIndex > -1) {
                    const updatedWorkload = [...prevWorkload];
                    const currentWorkload = updatedWorkload[workloadIndex];
                    updatedWorkload[workloadIndex] = {
                        ...currentWorkload,
                        completedHours: Math.max(0, currentWorkload.completedHours - durationInHours),
                    };
                    const originalWorkloadIndex = initialWorkload.findIndex(w => w.id === currentWorkload.id);
                    if (originalWorkloadIndex > -1) {
                        initialWorkload[originalWorkloadIndex] = updatedWorkload[workloadIndex];
                    }
                    return updatedWorkload;
                }
                return prevWorkload;
            });
        }
      }
      
      setAttendance(attendance.filter(a => a.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Feuille de présence des enseignants</h1>
      <p className="text-muted-foreground mb-4">
        Suivi de la présence des enseignants aux cours planifiés. La charge horaire est mise à jour automatiquement.
      </p>
      <AttendanceTable data={attendance} onAddEntry={handleAddEntry} onDeleteEntry={handleDeleteEntry} />
    </div>
  );
}
