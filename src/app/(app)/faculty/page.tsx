import { faculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';

export default function FacultyPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Gestion du Personnel Enseignant</h1>
        <FacultyTable data={faculty} />
    </div>
  )
}