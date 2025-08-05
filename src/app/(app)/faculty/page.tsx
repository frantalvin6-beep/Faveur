import { faculty } from '@/lib/data';
import { FacultyTable } from '@/components/faculty/faculty-table';

export default function FacultyPage() {
  return <FacultyTable data={faculty} />;
}
