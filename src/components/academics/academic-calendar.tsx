
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
  isSameMonth,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
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
import { AcademicEvent, EventType, getAcademicEvents, addAcademicEvent, deleteAcademicEvent } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const eventStyles = {
  event: "bg-primary/80 text-primary-foreground border-primary/90 hover:bg-primary",
  exam: "bg-destructive/80 text-destructive-foreground border-destructive/90 hover:bg-destructive",
  holiday: "bg-accent/80 text-accent-foreground border-accent/90 hover:bg-accent",
};

export function AcademicCalendar() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [academicEvents, setAcademicEvents] = React.useState<AcademicEvent[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [newEvent, setNewEvent] = React.useState('');
  const [eventType, setEventType] = React.useState<EventType>('event');
  const { toast } = useToast();

  const fetchEvents = React.useCallback(async () => {
      try {
          const events = await getAcademicEvents();
          setAcademicEvents(events);
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les événements.' });
      } finally {
        setLoading(false);
      }
  }, [toast]);

  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);


  const firstDayCurrentMonth = startOfMonth(currentMonth);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { locale: fr }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { locale: fr }),
  });
  
  const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const getEventsForDate = (date: Date) => {
    return academicEvents.filter(e => isSameDay(new Date(e.date), date));
  }
  
  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  }

  const handleSaveEvent = async () => {
    if (selectedDate && newEvent) {
      try {
          const newEventObject: Omit<AcademicEvent, 'id'> = {
            date: format(selectedDate, 'yyyy-MM-dd'),
            event: newEvent,
            type: eventType,
          };
          await addAcademicEvent(newEventObject);
          toast({ title: 'Événement ajouté' });
          await fetchEvents();
          setIsDialogOpen(false);
          setNewEvent('');
          setEventType('event');
          setSelectedDate(null);
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible d\'ajouter l\'événement.' });
      }
    }
  };
  
  const handleDeleteEvent = async (eventId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await deleteAcademicEvent(eventId);
        toast({ title: 'Événement supprimé' });
        await fetchEvents();
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'événement.' });
      }
    }
  };
  
  if (loading) {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
    )
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-xl font-semibold capitalize">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
                <p className="text-sm text-muted-foreground">Cliquez sur une date pour ajouter un événement.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>

        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full table-fixed">
                <thead>
                    <tr>
                        {weekdays.map(day => (
                            <th key={day} className="p-2 text-center font-semibold text-muted-foreground text-sm border-b">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: Math.ceil(daysInMonth.length / 7) }).map((_, weekIndex) => (
                        <tr key={weekIndex} className="divide-x divide-border">
                            {daysInMonth.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => {
                                const eventsOnDay = getEventsForDate(day);
                                const isCurrentMonthDay = isSameMonth(day, currentMonth);
                                return (
                                    <td key={day.toString()} className={cn(
                                        "p-1 align-top relative group transition-colors duration-150 border-t",
                                        isCurrentMonthDay ? "hover:bg-accent/5" : "bg-muted/30 text-muted-foreground"
                                    )}>
                                        <span className={cn(
                                            "font-medium cursor-pointer",
                                            isSameDay(day, new Date()) && "text-primary font-bold"
                                        )} onClick={() => isCurrentMonthDay && handleDayClick(day)}>
                                            {format(day, 'd')}
                                        </span>
                                        <div className="space-y-1 mt-1">
                                            {eventsOnDay.map(event => (
                                                <div key={event.id} onClick={() => handleDeleteEvent(event.id)} className={cn("py-0.5 px-1.5 rounded-md text-xs border cursor-pointer break-words", eventStyles[event.type])}>
                                                  {event.event}
                                                </div>
                                            ))}
                                        </div>
                                        {isCurrentMonthDay && (
                                           <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDayClick(day)}>
                                              <Plus className="h-4 w-4" />
                                           </Button>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

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
    </div>
  );
}
