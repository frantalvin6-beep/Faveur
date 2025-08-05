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
  Search,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Message } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommunicationClientProps {
  messages: Message[];
}

type MailboxType = 'inbox' | 'sent' | 'archived';

export function CommunicationClient({ messages: initialMessages }: CommunicationClientProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [selected, setSelected] = React.useState<string | null>(messages.find(m => m.status !== "Envoyé")?.id ?? null);
  const [mailbox, setMailbox] = React.useState<MailboxType>('inbox');
  const [searchTerm, setSearchTerm] = React.useState('');

  const message = messages.find((item) => item.id === selected) ?? null;

  const handleSendMessage = (newMessage: Omit<Message, 'id' | 'sentAt'>) => {
    const messageToSend: Message = {
      id: `MSG${Date.now()}`,
      ...newMessage,
      sentAt: new Date().toISOString(),
    };
    setMessages(prev => [messageToSend, ...prev]);
    alert("Message envoyé !");
  };

  const filteredMessages = messages
    .filter(m => {
        if(mailbox === 'inbox') return m.status !== 'Envoyé' && m.status !== 'Archivé';
        if(mailbox === 'sent') return m.status === 'Envoyé';
        if(mailbox === 'archived') return m.status === 'Archivé';
        return true;
    })
    .filter(m => m.subject.toLowerCase().includes(searchTerm.toLowerCase()) || m.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.body.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());


  const toggleMessageStatus = (id: string, status: Message['status']) => {
      setMessages(prev => prev.map(m => m.id === id ? {...m, status} : m));
      if(selected === id) {
          setSelected(null);
      }
  }

  return (
    <TooltipProvider>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-[calc(100vh-12rem)] max-h-full items-stretch rounded-lg border"
      >
        <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
            <div className="flex h-full flex-col p-2">
                <div className="p-2">
                  <ComposeMessageDialog onSendMessage={handleSendMessage}>
                      <Button className="w-full">
                          <PenSquare className="mr-2"/>
                          Nouveau Message
                      </Button>
                  </ComposeMessageDialog>
                </div>
                <nav className="flex flex-col gap-1 px-2 py-4">
                    <MailboxLink type="inbox" label="Boîte de réception" icon={Inbox} activeMailbox={mailbox} setMailbox={setMailbox} count={messages.filter(m => m.status === 'Non lu').length} />
                    <MailboxLink type="sent" label="Envoyés" icon={Send} activeMailbox={mailbox} setMailbox={setMailbox} />
                    <MailboxLink type="archived" label="Archivés" icon={Archive} activeMailbox={mailbox} setMailbox={setMailbox} />
                </nav>
            </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold capitalize">{mailbox === 'inbox' ? 'Boîte de réception' : mailbox}</h1>
              </div>
              <Separator />
               <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-8" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
              </div>
              <MessageList messages={filteredMessages} selected={selected} setSelected={setSelected} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <MessageDisplay message={message} onArchive={() => message && toggleMessageStatus(message.id, 'Archivé')} onDelete={() => message && toggleMessageStatus(message.id, 'Supprimé')} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

function MailboxLink({type, label, icon: Icon, activeMailbox, setMailbox, count}: {type: MailboxType, label: string, icon: React.ElementType, activeMailbox: MailboxType, setMailbox: (type: MailboxType) => void, count?: number}) {
    return (
        <Button variant={activeMailbox === type ? 'secondary' : 'ghost'} className="justify-start" onClick={() => setMailbox(type)}>
            <Icon className="mr-2 h-4 w-4"/>
            {label}
            {count && count > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>
            )}
        </Button>
    )
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
    <ScrollArea className="h-full">
        {messages.length > 0 ? (
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
                         <Avatar className="h-6 w-6">
                            <AvatarFallback>{item.sender.name.substring(0,2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className={cn("font-semibold", item.status === 'Non lu' && "font-bold")}>{item.sender.name}</div>
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
                    <div className={cn("text-sm", item.status === 'Non lu' && "font-bold")}>{item.subject}</div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.body.substring(0, 300)}...
                    </div>
                </button>
                ))}
            </div>
        ) : (
            <div className="p-8 text-center text-muted-foreground">
                <Inbox className="h-10 w-10 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">Boîte de réception vide</h3>
                <p>Aucun message à afficher ici.</p>
            </div>
        )}
    </ScrollArea>
  );
}

function MessageDisplay({ message, onArchive, onDelete }: { message: Message | null; onArchive: () => void; onDelete: () => void }) {
  if (!message) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <ArchiveX className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Aucun message sélectionné</h2>
        <p className="text-muted-foreground">Sélectionnez un message dans la liste pour le lire.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onArchive}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archiver</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archiver</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Supprimer</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
         <div className="ml-auto flex items-center gap-1">
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
              <div className="line-clamp-1 text-xs text-muted-foreground">
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

function ComposeMessageDialog({ onSendMessage, children }: { onSendMessage: (message: Omit<Message, 'id' | 'sentAt'>) => void; children: React.ReactNode }) {
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
            status: 'Envoyé', // Messages sent by the user are 'Envoyé'
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
                {children}
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