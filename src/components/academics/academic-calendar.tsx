
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
import { ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from 'lucide-react';
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
  event: "bg-primary/20 text-primary-foreground border-primary/30 hover:bg-primary/30",
  exam: "bg-destructive/20 text-destructive-foreground border-destructive/30 hover:bg-destructive/30",
  holiday: "bg-accent/30 text-accent-foreground border-accent/40 hover:bg-accent/40",
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
  
  const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

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
          await fetchEvents(); // Refetch
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
        await fetchEvents(); // Refetch
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer l\'événement.' });
      }
    }
  };

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-80" />
                    <Skeleton className="h-10 w-64" />
                </div>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
              <div>
                  <CardTitle>Calendrier académique</CardTitle>
                  <CardDescription>Cliquez sur une date pour ajouter un événement, ou sur un événement pour le supprimer.</CardDescription>
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
                const eventsOnDay = getEventsForDate(day);
                const isCurrentMonthDay = format(day, 'M') === format(currentMonth, 'M');
                return (
                  <div key={day.toString()} className={cn(
                      "p-1 border-b border-r relative group transition-colors duration-150 min-h-[8rem]",
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
                              <div key={event.id} onClick={() => handleDeleteEvent(event.id)} className={cn("py-1 px-1.5 rounded-md text-sm border cursor-pointer break-words", eventStyles[event.type])}>
                                {event.event}
                              </div>
                          ))}
                      </div>
                      {isCurrentMonthDay && (
                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDayClick(day)}>
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
