
import * as React from 'react';
import { getStudentFinances, getDepartments, StudentFinance, Department } from '@/lib/data';
import { StudentFinancesTableWrapper } from '@/components/finances/student-finances-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AddStudentFinanceForm } from '@/components/finances/add-student-finance-form';
import { StudentFinancesPageContent } from '@/components/finances/student-finances-page-content';


export default async function StudentFinancesPage() {
  const studentFinances = await getStudentFinances();
  const departments = await getDepartments();
  
  return <StudentFinancesPageContent initialFinances={studentFinances} initialDepartments={departments} />;
}
