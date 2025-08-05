'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar as CalendarIcon, BookOpen, Coffee } from 'lucide-react';

const academicEvents = [
  { date: '2024-09-02', event: 'Rentrée universitaire', type: 'event' as const, icon: BookOpen },
  { date: '2024-10-28', event: 'Vacances de la Toussaint (début)', type: 'holiday' as const, icon: Coffee },
  { date: '2024-11-03', event: 'Vacances de la Toussaint (fin)', type: 'holiday' as const, icon: Coffee },
  { date: '2024-12-16', event: 'Début des examens du 1er semestre', type: 'exam' as const, icon: CalendarIcon },
  { date: '2024-12-23', event: 'Vacances de Noël (début)', type: 'holiday' as const, icon: Coffee },
  { date: '2025-01-05', event: 'Vacances de Noël (fin)', type: 'holiday' as const, icon: Coffee },
  { date: '2025-01-20', event: 'Début du 2ème semestre', type: 'event' as const, icon: BookOpen },
];

const eventStyles = {
    event: "bg-blue-100 text-blue-800",
    exam: "bg-red-100 text-red-800",
    holiday: "bg-green-100 text-green-800",
}

export function AcademicCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleAddEvent = () => {
    alert("La fonctionnalité d'ajout d'événement sera bientôt implémentée.");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Vue du Calendrier</CardTitle>
          <CardDescription>Naviguez dans le calendrier de l'année académique.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
                ...academicEvents.reduce((acc, ev) => {
                    acc[ev.type] = (acc[ev.type] || []).concat(new Date(ev.date));
                    return acc;
                }, {} as Record<string, Date[]>)
            }}
            modifiersStyles={{
                event: { border: '2px solid hsl(var(--primary))' },
                exam: { color: 'hsl(var(--destructive))', fontWeight: 'bold' },
                holiday: { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Événements Clés</CardTitle>
                <CardDescription>Dates importantes de l'année.</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddEvent}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-3">
                <event.icon className={`h-5 w-5 mt-1 flex-shrink-0 ${eventStyles[event.type].replace(/bg-\w+-\d+/,'').replace(/text/,'text-muted-foreground')}`} />
                <div>
                  <p className="font-semibold">{event.event}</p>
                  <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
