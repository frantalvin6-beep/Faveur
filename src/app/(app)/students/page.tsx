import { students } from '@/lib/data';
import { StudentTable } from '@/components/students/student-table';

export default function StudentsPage() {
    return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Gestion des Étudiants</h1>
        <StudentTable data={students} />
    </div>
  )
}