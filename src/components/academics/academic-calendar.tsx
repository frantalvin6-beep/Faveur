'use client';

import * as React from 'react';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDate,
  getDay,
  isSameMonth,
  startOfMonth,
  startOfYear,
  addMonths,
  isSameDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const currentYear = new Date();
  const months = Array.from({ length: 12 }, (_, i) => startOfMonth(addMonths(startOfYear(currentYear), i)));
  const weekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier Annuel {format(currentYear, 'yyyy')}</CardTitle>
        <CardDescription>Vue d'ensemble de l'année académique. Passez sur un événement pour voir les détails.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {months.map(month => {
          const daysInMonth = eachDayOfInterval({
            start: startOfMonth(month),
            end: endOfMonth(month),
          });
          const firstDayOfMonth = getDay(startOfMonth(month));

          return (
            <div key={format(month, 'yyyy-MM')} className="rounded-lg border">
              <h3 className="font-bold text-center py-2 border-b">{format(month, 'MMMM yyyy', { locale: fr })}</h3>
              <div className="grid grid-cols-7 text-center text-xs text-muted-foreground border-b">
                {weekdays.map(day => <div key={day} className="py-1 border-r last:border-r-0">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b"></div>)}
                {daysInMonth.map((day, index) => {
                    const event = getEventForDate(day);
                    const colIndex = (firstDayOfMonth + index) % 7;
                    return (
                        <div key={day.toString()} className={cn(
                            "relative flex items-center justify-center h-10 border-b",
                             colIndex !== 6 && "border-r" // Add right border to all but last column
                        )}>
                            <span className={cn(
                                "flex items-center justify-center h-6 w-6 rounded-full",
                                event && `${eventStyles[event.type]} cursor-pointer font-bold`,
                                isSameDay(day, new Date()) && "bg-primary text-primary-foreground",
                            )}
                            title={event ? event.event : undefined}
                            >
                                {format(day, 'd')}
                            </span>
                        </div>
                    )
                })}
                 {/* Fill remaining cells to complete grid */}
                {Array.from({ length: (7 - (firstDayOfMonth + daysInMonth.length) % 7) % 7 }).map((_, i) => (
                    <div key={`fill-${i}`} className={cn("border-b", (firstDayOfMonth + daysInMonth.length + i) % 7 !== 6 && "border-r")}></div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
