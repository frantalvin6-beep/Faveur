import { courseAssignments } from '@/lib/data';
import { CourseAssignmentsTable } from '@/components/faculty/course-assignments-table';

export default function CourseAssignmentsPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Attribution des cours</h1>
        <CourseAssignmentsTable data={courseAssignments} />
    </div>
  )
}
