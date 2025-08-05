'use client';

import * as React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  File,
  Archive,
  Trash2,
  ArchiveX,
  Send,
  Inbox,
  PenSquare,
  Reply,
  ReplyAll,
  Forward,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommunicationClientProps {
  messages: Message[];
}

export function CommunicationClient({ messages: initialMessages }: CommunicationClientProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [selected, setSelected] = React.useState<string | null>(messages[0]?.id ?? null);

  const message = messages.find((item) => item.id === selected) ?? null;

  const handleSendMessage = (newMessage: Omit<Message, 'id' | 'sentAt' | 'status'>) => {
    const messageToSend: Message = {
      id: `MSG${Date.now()}`,
      ...newMessage,
      sentAt: new Date().toISOString(),
      status: 'Envoyé',
    };
    setMessages(prev => [messageToSend, ...prev]);
    // In a real app, you would also send this to a server.
    alert("Message envoyé !");
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-[calc(100vh-12rem)] max-h-full items-stretch rounded-lg border"
    >
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <Tabs defaultValue="inbox">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Boîte de réception</h1>
            <div className="ml-auto flex items-center gap-2">
                <ComposeMessageDialog onSendMessage={handleSendMessage} />
                <TabsList>
                  <TabsTrigger value="inbox">Boîte de réception</TabsTrigger>
                  <TabsTrigger value="sent">Envoyés</TabsTrigger>
                </TabsList>
            </div>
          </div>
          <Separator />
          <MessageList messages={messages} selected={selected} setSelected={setSelected} />
        </Tabs>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <MessageDisplay message={message} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MessageList({
  messages,
  selected,
  setSelected,
}: {
  messages: Message[];
  selected: string | null;
  setSelected: (id: string | null) => void;
}) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {messages.map((item) => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              selected === item.id && 'bg-accent'
            )}
            onClick={() => setSelected(item.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.sender.name}</div>
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    selected === item.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(new Date(item.sentAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.body.substring(0, 300)}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function MessageDisplay({ message }: { message: Message | null }) {
  if (!message) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-muted-foreground">
        Aucun message sélectionné
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archiver</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archiver</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
         <div className="ml-auto flex items-center gap-2">
            <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Reply className="h-4 w-4" /></Button></TooltipTrigger>
                <TooltipContent>Répondre</TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon"><ReplyAll className="h-4 w-4" /></Button></TooltipTrigger>
                <TooltipContent>Répondre à tous</TooltipContent>
            </Tooltip>
             <Tooltip>
                <TooltipTrigger asChild><Button variant="ghost" size="icon"><Forward className="h-4 w-4" /></Button></TooltipTrigger>
                <TooltipContent>Transférer</TooltipContent>
            </Tooltip>
        </div>
      </div>
      <Separator />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start p-4">
          <div className="flex items-start gap-4 text-sm">
            <Avatar>
              <AvatarImage alt={message.sender.name} />
              <AvatarFallback>
                {message.sender.name
                  .split(' ')
                  .map((chunk) => chunk[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="font-semibold">{message.sender.name}</div>
              <div className="line-clamp-1 text-xs">
                À {message.recipients.map((r) => r.name).join(', ')}
              </div>
            </div>
          </div>
           <div className="ml-auto text-xs text-muted-foreground">
              {format(new Date(message.sentAt), 'd MMMM yyyy, HH:mm', { locale: fr })}
            </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <h2 className="text-lg font-bold mb-4">{message.subject}</h2>
            {message.body}
        </ScrollArea>
        {message.attachment && (
            <>
                <Separator className="mt-auto" />
                <div className="p-4">
                    <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                        <File className="h-4 w-4" />
                        <span className="font-medium">{message.attachment.name}</span>
                        <Button variant="outline" size="sm" className="ml-auto">
                            Télécharger
                        </Button>
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}

function ComposeMessageDialog({ onSendMessage }: { onSendMessage: (message: Omit<Message, 'id' | 'sentAt' | 'status'>) => void }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [to, setTo] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [body, setBody] = React.useState('');
    const [attachment, setAttachment] = React.useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!to || !subject || !body) {
            alert("Veuillez remplir les champs destinataire, objet et message.");
            return;
        }

        onSendMessage({
            sender: { name: 'Admin', role: 'Admin' }, // Assuming the user is always Admin for now
            recipients: [{ name: to, role: 'Étudiant' }], // Simple parsing for now
            subject,
            body,
            attachment: attachment ? { name: attachment.name, url: '#' } : undefined,
        });

        setIsOpen(false);
        // Reset form
        setTo('');
        setSubject('');
        setBody('');
        setAttachment(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Nouveau message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Écrire un nouveau message</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="to" className="text-right">À</Label>
                            <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} className="col-span-3" placeholder="email@exemple.com ou nom du groupe" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subject" className="text-right">Objet</Label>
                            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="col-span-3" placeholder="Sujet de votre message" />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="body">Message</Label>
                            <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[200px]" placeholder="Écrivez votre message ici..." />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                           <Label htmlFor="attachment">Pièce jointe</Label>
                           <Input 
                                id="attachment" 
                                type="file" 
                                onChange={(e) => setAttachment(e.target.files?.[0] || null)} 
                                className="col-span-3" 
                            />
                            {attachment && <p className="text-sm text-muted-foreground">Fichier sélectionné : {attachment.name}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Annuler</Button></DialogClose>
                        <Button type="submit"><Send className="mr-2 h-4 w-4" />Envoyer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}