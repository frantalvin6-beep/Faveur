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
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type EventType = 'event' | 'exam' | 'holiday';

interface AcademicEvent {
    date: string;
    event: string;
    type: EventType;
}

const initialAcademicEvents: AcademicEvent[] = [
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
  event: "bg-primary/10 text-primary border-primary/20",
  exam: "bg-destructive/10 text-destructive border-destructive/20",
  holiday: "bg-accent/20 text-accent-foreground border-accent/30",
};

export function AcademicCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [academicEvents, setAcademicEvents] = React.useState<AcademicEvent[]>(initialAcademicEvents);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [newEvent, setNewEvent] = React.useState('');
  const [eventType, setEventType] = React.useState<EventType>('event');

  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { locale: fr }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { locale: fr }),
  });
  
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getEventForDate = (date: Date) => {
    return academicEvents.find(e => isSameDay(new Date(e.date), date));
  }
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  }

  const handleSaveEvent = () => {
    if (selectedDate && newEvent) {
      const newEventObject: AcademicEvent = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        event: newEvent,
        type: eventType,
      };
      setAcademicEvents([...academicEvents, newEventObject]);
      setIsDialogOpen(false);
      setNewEvent('');
      setEventType('event');
      setSelectedDate(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Calendrier académique</CardTitle>
                  <CardDescription>Cliquez sur une date pour ajouter un événement.</CardDescription>
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
                const isCurrentMonthDay = format(day, 'M') === format(currentMonth, 'M');
                return (
                  <div key={day.toString()} className={cn(
                      "h-32 p-2 border-b border-r flex flex-col relative group transition-colors duration-150",
                      isCurrentMonthDay ? "hover:bg-accent/5" : "bg-muted/30 text-muted-foreground"
                  )} onClick={() => isCurrentMonthDay && handleDayClick(day)}>
                      <span className={cn(
                          "font-medium",
                          isSameDay(day, new Date()) && "text-primary font-bold"
                      )}>
                          {format(day, 'd')}
                      </span>
                      {event && isCurrentMonthDay && (
                        <div className={cn("mt-1 p-1 rounded-md text-xs border truncate", eventStyles[event.type])}>
                          {event.event}
                        </div>
                      )}
                      {isCurrentMonthDay && (
                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Plus className="h-4 w-4" />
                         </Button>
                      )}
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Ajouter un événement pour le {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: fr })}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="event-name" className="text-right">Événement</Label>
                      <Input id="event-name" value={newEvent} onChange={(e) => setNewEvent(e.target.value)} className="col-span-3" placeholder="Ex: Début des inscriptions" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-type" className="text-right">Type</Label>
                    <Select onValueChange={(value: EventType) => setEventType(value)} defaultValue={eventType}>
                      <SelectTrigger id="event-type" className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">Événement</SelectItem>
                        <SelectItem value="exam">Examen</SelectItem>
                        <SelectItem value="holiday">Jour férié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Annuler</Button>
                  </DialogClose>
                  <Button onClick={handleSaveEvent}>Enregistrer</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </>
  );
}
