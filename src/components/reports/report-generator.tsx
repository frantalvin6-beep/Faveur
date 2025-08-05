'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { generateReport } from '@/ai/flows/generate-ai-powered-reports';
import { students, faculty } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const reportSchema = z.object({
  reportType: z.enum(['Student', 'Faculty', 'Both']),
  includeGraphs: z.boolean().default(true),
  includeMetrics: z.boolean().default(true),
  includeEvaluation: z.boolean().default(true),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function ReportGenerator() {
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: 'Both',
      includeGraphs: true,
      includeMetrics: true,
      includeEvaluation: true,
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    setIsLoading(true);
    setReport('');
    try {
      const result = await generateReport({
        ...data,
        studentData: JSON.stringify(students),
        facultyData: JSON.stringify(faculty),
      });
      setReport(result.report);
      toast({
        title: "Report Generated",
        description: "Your AI-powered report has been successfully created.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate report. Please try again.",
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Select the parameters for your AI-generated report.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Controller
                name="reportType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Students</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                      <SelectItem value="Both">Students & Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="grid gap-4">
                <Label>Report Content</Label>
                <div className="flex items-center space-x-2">
                  <Controller name="includeGraphs" control={control} render={({ field }) => <Switch id="includeGraphs" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="includeGraphs">Include Graphs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller name="includeMetrics" control={control} render={({ field }) => <Switch id="includeMetrics" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="includeMetrics">Include Metrics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller name="includeEvaluation" control={control} render={({ field }) => <Switch id="includeEvaluation" checked={field.value} onCheckedChange={field.onChange} />} />
                  <Label htmlFor="includeEvaluation">Include Overall Evaluation</Label>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Report
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Generated Report</CardTitle>
          <CardDescription>The AI-powered report will appear below.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="mt-2 text-muted-foreground">Generating report...</p>
              </div>
            </div>
          )}
          {!isLoading && !report && (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Your report will be displayed here.</p>
            </div>
          )}
          {report && (
            <Textarea
              readOnly
              value={report}
              className="min-h-[400px] bg-muted/50 text-sm"
              aria-label="Generated Report"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
