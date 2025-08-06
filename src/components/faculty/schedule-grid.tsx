
'use client';

import * as React from 'react';
import { ScheduleEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

const daysOfWeek: Exclude<ScheduleEntry['dayOfWeek'], 'Dimanche'>[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Helper function to convert time string "HH:MM" to a number (e.g., 8.5 for "08:30")
const timeToNumber = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

export function ScheduleGrid({ schedule }: { schedule: ScheduleEntry[] }) {
  const grid: (ScheduleEntry | null)[][] = Array(timeSlots.length).fill(null).map(() => Array(daysOfWeek.length).fill(null));
  const rowSpans: (number)[][] = Array(timeSlots.length).fill(0).map(() => Array(daysOfWeek.length).fill(0));

  schedule.forEach(entry => {
    const dayIndex = daysOfWeek.indexOf(entry.dayOfWeek as any);
    if (dayIndex === -1) return;

    const startTime = timeToNumber(entry.startTime);
    const endTime = timeToNumber(entry.endTime);
    const duration = endTime - startTime;
    if (duration <= 0) return;

    let startIndex = -1;
    for(let i = 0; i < timeSlots.length; i++) {
        const slotTime = timeToNumber(timeSlots[i]);
        if (startTime >= slotTime && startTime < slotTime + 1) {
            startIndex = i;
            break;
        }
    }
    
    if (startIndex !== -1) {
      grid[startIndex][dayIndex] = entry;
      rowSpans[startIndex][dayIndex] = Math.ceil(duration);

      for (let i = 1; i < Math.ceil(duration); i++) {
          if (startIndex + i < timeSlots.length) {
              rowSpans[startIndex + i][dayIndex] = -1; // Mark as covered by a rowspan
          }
      }
    }
  });
  
  return (
    <div className="rounded-md border relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Heure</th>
            {daysOfWeek.map(day => (
              <th key={day} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {timeSlots.map((slot, rowIndex) => (
            <tr key={slot} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle font-medium text-muted-foreground">{slot} - {timeSlots[rowIndex+1] || `${parseInt(slot.split(':')[0]) + 1}:00`}</td>
              {daysOfWeek.map((day, colIndex) => {
                  if (rowSpans[rowIndex][colIndex] === -1) {
                      return null; // This cell is covered by a rowspan from above
                  }
                  const entry = grid[rowIndex][colIndex];
                  const span = rowSpans[rowIndex][colIndex];
                  return (
                      <td key={day} className={cn("p-2 align-top border-l h-24", entry ? 'bg-primary/5' : '')} rowSpan={span > 0 ? span : 1}>
                          {entry && (
                              <div className="flex flex-col p-2 bg-primary/10 rounded-lg h-full">
                                  <span className="font-bold text-primary">{entry.courseName}</span>
                                  <span className="text-sm text-muted-foreground">{entry.teacherName}</span>
                                  <Badge variant="secondary" className="mt-auto self-start">{entry.location}</Badge>
                              </div>
                          )}
                      </td>
                  );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
