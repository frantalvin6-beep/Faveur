import { ReportGenerator } from "@/components/reports/report-generator";

export default function ReportsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold">Rapports IA</h1>
                <p className="text-muted-foreground">
                    Générez des rapports complets sur les données des étudiants et du personnel à l'aide de l'IA.
                </p>
            </div>
            <ReportGenerator />
        </div>
    );
}
