import { departments } from '@/lib/data';
import { DepartmentsTable } from '@/components/academics/departments-table';

export default function DepartmentsPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-4">Facultés, Départements et Options</h1>
        <DepartmentsTable data={departments} />
    </div>
  )
}