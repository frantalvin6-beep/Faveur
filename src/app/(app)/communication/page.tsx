import { CommunicationClient } from '@/components/communication/communication-client';
import { messages } from '@/lib/data';

export default function CommunicationPage() {
  return (
    <div className="space-y-4 h-full">
       <div className="flex-col md:flex">
         <div className="flex-1 space-y-4">
            <CommunicationClient messages={messages} />
         </div>
       </div>
    </div>
  );
}
