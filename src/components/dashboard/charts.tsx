'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const studentData = [
  { name: 'IA & Robotique', total: 450 },
  { name: 'Génie Elec & Info', total: 600 },
  { name: 'Génie Info', total: 550 },
  { name: 'Génie Civil', total: 300 },
  { name: 'Digital Business', total: 250 },
];

const facultyData = [
  { name: 'Professeurs', total: 60 },
  { name: 'Prof. agrégés', total: 85 },
  { name: 'Prof. assistants', total: 110 },
  { name: 'Chargés de cours', total: 95 },
]

export function DashboardCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Étudiants par département</CardTitle>
            <CardDescription>Répartition des étudiants dans les principaux départements.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Personnel par poste</CardTitle>
            <CardDescription>Répartition des membres du personnel par leur rang académique.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={facultyData}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  labelStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Legend iconSize={10} verticalAlign="top" height={36} />
                <Bar dataKey="total" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
  )
}
