
'use client';

import * as React from 'react';
import { StudentAttendanceTable } from '@/components/students/student-attendance-table';

export default function StudentAttendancePage() {
    return (
        <div>
            <h1 className="text-3xl font-bold">Suivi de la présence des étudiants</h1>
            <p className="text-muted-foreground mb-4">
                Tableau de bord mensuel de l'assiduité des étudiants.
            </p>
            <StudentAttendanceTable />
        </div>
    )
}
