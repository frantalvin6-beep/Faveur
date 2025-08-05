import { ReportGenerator } from "@/components/reports/report-generator";

export default function ReportsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold">AI-Powered Reports</h1>
                <p className="text-muted-foreground">
                    Generate comprehensive reports on student and faculty data using AI.
                </p>
            </div>
            <ReportGenerator />
        </div>
    );
}
