
'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, UserSquare, BookOpen, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/charts";
import { getStudents, getFaculty, getDepartments, getAccountingTransactions, calculerComptabilite, getCourses, Department } from "@/lib/data";
import type { Faculty } from "@/lib/types";
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
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

        const totalStudents = students.length;
        const totalFaculty = faculty.length;
        const totalCourses = courses.length;
        const { revenus, depenses, solde } = calculerComptabilite(transactions);

        const studentChartData = departments
          .filter(d => d.parentId)
          .map(dept => ({
            name: dept.name,
            total: students.filter(s => s.department === dept.name).length
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
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.revenus)}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Totales</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.depenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Actuel</CardTitle>
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
