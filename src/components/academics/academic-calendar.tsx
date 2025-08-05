'use client';

import * as React from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  addMonths,
  subMonths,
  isSameDay,
  getDay,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const academicEvents = [
  { date: '2024-09-02', event: 'Rentrée universitaire', type: 'event' as const },
  { date: '2024-10-28', event: 'Vacances de la Toussaint', type: 'holiday' as const },
  { date: '2024-11-03', event: 'Fin des vacances de la Toussaint', type: 'holiday' as const },
  { date: '2024-12-16', event: 'Début des examens', type: 'exam' as const },
  { date: '2024-12-23', event: 'Vacances de Noël', type: 'holiday' as const },
  { date: '2025-01-05', event: 'Fin des vacances de Noël', type: 'holiday' as const },
  { date: '2025-01-20', event: 'Début du 2ème semestre', type: 'event' as const },
  { date: '2025-02-17', event: 'Vacances d\'hiver', type: 'holiday' as const },
  { date: '2025-04-14', event: 'Vacances de printemps', type: 'holiday' as const },
  { date: '2025-05-01', event: 'Jour férié', type: 'holiday' as const },
  { date: '2025-05-15', event: 'Fin des cours', type: 'event' as const },
  { date: '2025-05-26', event: 'Début des examens finaux', type: 'exam' as const },
];

const eventStyles = {
  event: "bg-blue-100 text-blue-800 border-blue-300",
  exam: "bg-red-100 text-red-800 border-red-300",
  holiday: "bg-green-100 text-green-800 border-green-300",
};

const getEventForDate = (date: Date) => {
    return academicEvents.find(e => isSameDay(new Date(e.date), date));
}

export function AcademicCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { locale: fr }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { locale: fr }),
  });
  
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Calendrier académique</CardTitle>
                <CardDescription>Vue mensuelle des événements importants.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold capitalize">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 border-t border-l">
            {weekdays.map(day => (
              <div key={day} className="text-center font-semibold py-2 border-b border-r bg-muted/50">{day}</div>
            ))}
            {daysInMonth.map((day) => {
              const event = getEventForDate(day);
              const isCurrentMonth = format(day, 'M') === format(currentMonth, 'M');
              return (
                <div key={day.toString()} className={cn(
                    "h-32 p-2 border-b border-r flex flex-col",
                    !isCurrentMonth && "bg-muted/30 text-muted-foreground"
                )}>
                    <span className={cn(
                        "font-medium",
                        isSameDay(day, new Date()) && "text-primary font-bold"
                    )}>
                        {format(day, 'd')}
                    </span>
                    {event && isCurrentMonth && (
                      <div className={cn("mt-1 p-1 rounded-md text-xs", eventStyles[event.type])}>
                        {event.event}
                      </div>
                    )}
                </div>
              )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
