import { students } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';

export default function StudentsPage() {
  return <StudentTable data={students} />;
}
