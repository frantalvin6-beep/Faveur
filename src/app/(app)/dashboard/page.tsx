
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, Users, UserSquare, BookOpen, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard/charts";
import { getStudents, getFaculty, getDepartments, getAccountingTransactions, calculerComptabilite } from "@/lib/data";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default async function DashboardPage() {
  const students = await getStudents();
  const faculty = await getFaculty();
  const departments = await getDepartments();
  const transactions = await getAccountingTransactions();

  const totalStudents = students.length;
  const totalFaculty = faculty.length;
  // Nous filtrons les options pour ne compter que les départements parents
  const totalDepartments = departments.filter(d => !d.parentId).length;
  const { revenus, depenses, solde } = calculerComptabilite(transactions);


  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Personnel</CardTitle>
            <UserSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaculty}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(revenus)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Actuel</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(solde)}</div>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts />
    </div>
  );
}
