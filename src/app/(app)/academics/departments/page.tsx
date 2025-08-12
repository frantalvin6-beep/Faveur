
'use client';

import * as React from 'react';
import { getDepartments, addDepartment, deleteDepartment, Department } from '@/lib/data';
import { DepartmentsTable } from '@/components/academics/departments-table';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function DepartmentsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Facultés, Départements et Options</h1>
            <DepartmentsTable />
        </div>
    )
}
