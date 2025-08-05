import { CommunicationClient } from '@/components/communication/communication-client';
import { messages } from '@/lib/data';

export default function CommunicationPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Communication interne</h1>
      <p className="text-muted-foreground">
        Gérez les annonces, les notifications et la messagerie interne.
      </p>
      <CommunicationClient messages={messages} />
    </div>
  );
}
