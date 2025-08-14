
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserSquare, BookOpen, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/charts";
import { getStudents, getFaculty, getDepartments, getAccountingTransactions, calculerComptabilite, getCourses, Department } from "@/lib/data";
import type { Faculty, Student, AccountingTransaction } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// Generate academic years based on data
function getAcademicYears(students: Student[], transactions: AccountingTransaction[]): string[] {
    const years = new Set<number>();
    students.forEach(s => years.add(new Date(s.enrollmentDate).getFullYear()));
    transactions.forEach(t => years.add(new Date(t.date).getFullYear()));
    
    if (years.size === 0) {
        const currentYear = new Date().getFullYear();
        return [`${currentYear}-${currentYear + 1}`];
    }

    const sortedYears = Array.from(years).sort((a, b) => b - a);
    return sortedYears.map(year => `${year}-${year + 1}`);
}

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [academicYears, setAcademicYears] = React.useState<string[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>('');
  
  // Store all data fetched once
  const [allData, setAllData] = React.useState<{
      students: Student[];
      faculty: Faculty[];
      departments: Department[];
      transactions: AccountingTransaction[];
      courses: Course[];
  } | null>(null);

  const [stats, setStats] = React.useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalCourses: 0,
    revenus: 0,
    depenses: 0,
    solde: 0,
    studentChartData: [],
    facultyChartDataFormatted: []
  });

  // Initial data fetch
  React.useEffect(() => {
    async function fetchData() {
      try {
        const [students, faculty, departments, transactions, courses] = await Promise.all([
            getStudents(),
            getFaculty(),
            getDepartments(),
            getAccountingTransactions(),
            getCourses()
        ]);
        
        setAllData({ students, faculty, departments, transactions, courses });

        const years = getAcademicYears(students, transactions);
        setAcademicYears(years);
        if (years.length > 0) {
            setSelectedYear(years[0]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Recalculate stats when selectedYear or allData changes
  React.useEffect(() => {
    if (!selectedYear || !allData) return;

    const [startYear] = selectedYear.split('-').map(Number);
    const startDate = new Date(startYear, 8, 1); // Academic year starts Sept 1st
    const endDate = new Date(startYear + 1, 7, 31); // Ends July 31st

    const { students, faculty, departments, transactions, courses } = allData;

    const studentsForYear = students.filter(s => {
        const enrollmentYear = new Date(s.enrollmentDate).getFullYear();
        return enrollmentYear === startYear;
    });

    const transactionsForYear = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
    });

    const totalStudents = studentsForYear.length;
    const totalFaculty = faculty.length; // Faculty count is usually stable across the year
    const totalCourses = courses.length; // Same for courses
    const { revenus, depenses, solde } = calculerComptabilite(transactionsForYear);

    const studentChartData = departments
      .filter(d => d.parentId)
      .map(dept => ({
        name: dept.name,
        total: studentsForYear.filter(s => s.department === dept.name).length
      }));

    const facultyChartData = faculty
      .reduce((acc, member) => {
        const position = member.position;
        acc[position] = (acc[position] || 0) + 1;
        return acc;
      }, {} as Record<Faculty['position'], number>);
    
    const facultyChartDataFormatted = Object.entries(facultyChartData).map(([name, total]) => ({
      name,
      total
    }));

    setStats({
      totalStudents,
      totalFaculty,
      totalCourses,
      revenus,
      depenses,
      solde,
      studentChartData,
      facultyChartDataFormatted
    });

  }, [selectedYear, allData]);


  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex justify-end">
            <div className="flex items-center gap-2">
                <Label htmlFor="academic-year">Année Académique</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger id="academic-year" className="w-[180px]">
                        <SelectValue placeholder="Sélectionner l'année" />
                    </SelectTrigger>
                    <SelectContent>
                        {academicYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <UserSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus ({selectedYear})</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenus)}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses ({selectedYear})</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.depenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde ({selectedYear})</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.solde)}</div>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts studentData={stats.studentChartData} facultyData={stats.facultyChartDataFormatted} />
    </div>
  );
}
