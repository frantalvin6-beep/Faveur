
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
  Plus,
  Paperclip,
  Mic,
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
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

interface CommunicationClientProps {
  messages: Message[];
}


export function CommunicationClient({ messages: initialMessages }: CommunicationClientProps) {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);
  const [selected, setSelected] = React.useState<string | null>(messages.find(m => m.status !== "Envoyé")?.id ?? null);
  const [searchTerm, setSearchTerm] = React.useState('');

  const conversation = messages.find((item) => item.id === selected);

  const handleSendMessage = (newMessage: Omit<Message, 'id' | 'sentAt'>) => {
    const messageToSend: Message = {
      id: `MSG${Date.now()}`,
      ...newMessage,
      sentAt: new Date().toISOString(),
    };
    setMessages(prev => [messageToSend, ...prev]);
    // In a real app, this would also update the selected conversation
    // For this demo, we'll just add it to the general pool
  };
  
  // Group messages by participants to form conversations
  const conversations = React.useMemo(() => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(message => {
        // Simple grouping by sender/recipient name for demo purposes
        const otherParty = message.sender.name === 'Admin' 
            ? message.recipients[0].name 
            : message.sender.name;
        if (!groups[otherParty]) {
            groups[otherParty] = [];
        }
        groups[otherParty].push(message);
    });
    
    return Object.entries(groups).map(([name, messages]) => {
        const latestMessage = messages.sort((a,b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];
        return {
            id: latestMessage.id, // Use latest message id as conversation id
            name: name,
            latestMessage: latestMessage.body,
            latestDate: latestMessage.sentAt,
            avatar: `https://placehold.co/40x40.png?text=${name.substring(0,2).toUpperCase()}`
        };
    }).sort((a,b) => new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime());

  }, [messages]);
  
  const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="grid h-[calc(100vh-14rem)] grid-cols-1 md:grid-cols-[300px_1fr]">
      <div className="flex flex-col border-r">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h1 className="text-xl font-bold">Messages</h1>
           <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
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
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 text-left text-sm transition-all hover:bg-accent",
                  selected === conv.id && "bg-accent"
                )}
                onClick={() => setSelected(conv.id)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.avatar} alt={conv.name} />
                  <AvatarFallback>{conv.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-semibold">{conv.name}</div>
                  <div className="text-xs text-muted-foreground">{conv.latestMessage}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conv.latestDate), { addSuffix: true, locale: fr })}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <MessageDisplay conversation={conversation} onSendMessage={handleSendMessage} />
    </div>
  );
}


function MessageDisplay({ conversation, onSendMessage }: { conversation: Message | undefined, onSendMessage: (message: Omit<Message, 'id' | 'sentAt'>) => void }) {
  const [newMessage, setNewMessage] = React.useState('');
  
  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Aucune conversation sélectionnée</h2>
        <p className="text-muted-foreground">Sélectionnez une conversation pour afficher les messages.</p>
      </div>
    );
  }
  
  const otherParty = conversation.sender.name === 'Admin' ? conversation.recipients[0] : conversation.sender;
  
  const handleSend = () => {
    if(!newMessage.trim()) return;
    onSendMessage({
        sender: { name: 'Admin', role: 'Admin' },
        recipients: [otherParty],
        subject: conversation.subject, // Continue same subject line
        body: newMessage,
        status: 'Envoyé'
    });
    setNewMessage('');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://placehold.co/40x40.png?text=${otherParty.name.substring(0,2).toUpperCase()}`} alt={otherParty.name} />
            <AvatarFallback>{otherParty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{otherParty.name}</div>
            <div className="text-xs text-muted-foreground">{otherParty.role}</div>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
            {/* This is a mock-up. In a real app, you would map over all messages in the conversation */}
            <div className="flex items-end gap-2">
                <Avatar className="h-8 w-8">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${otherParty.name.substring(0,2).toUpperCase()}`} alt={otherParty.name} />
                <AvatarFallback>{otherParty.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-lg bg-muted p-3 text-sm">
                 <p>{conversation.body}</p>
                 <p className="text-xs text-muted-foreground mt-1 text-right">{format(new Date(conversation.sentAt), 'HH:mm')}</p>
                </div>
            </div>
             <div className="flex items-end gap-2 justify-end">
                <div className="max-w-[70%] rounded-lg bg-primary text-primary-foreground p-3 text-sm">
                 <p>D'accord, merci pour l'information !</p>
                 <p className="text-xs text-primary-foreground/80 mt-1 text-right">{format(new Date(), 'HH:mm')}</p>
                </div>
                 <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/40x40.png?text=AD" alt="Admin"/>
                    <AvatarFallback>AD</AvatarFallback>
                 </Avatar>
            </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="relative">
          <Textarea
            placeholder="Écrivez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon">
              <Mic className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
