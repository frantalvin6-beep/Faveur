
'use client';

import * as React from 'react';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { Message } from 'genkit';

import { aiAssistant } from '@/ai/flows/ai-assistant';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AiAssistantPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = new Message({ role: 'user', content: [{ text: input }] });
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const result = await aiAssistant({
        history: messages,
        prompt: input,
      });
      const aiMessage = new Message({
        role: 'model',
        content: [{ text: result.response }],
      });
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      const errorMessage = new Message({
        role: 'model',
        content: [{ text: 'Désolé, une erreur est survenue. Veuillez réessayer.' }],
      });
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-8rem)] flex justify-center items-center">
    <Card className="w-full max-w-3xl h-full flex flex-col">
      <CardHeader>
        <CardTitle>Assistant IA</CardTitle>
        <CardDescription>
          Posez des questions sur la gestion de l'application ou demandez des résumés.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8 border">
                    <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="rounded-lg bg-muted p-3 text-sm">
                    <p>Bonjour ! Je suis votre assistant IA pour Campus Central. Comment puis-je vous aider aujourd'hui ?</p>
                </div>
            </div>
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'model' && (
                   <Avatar className="h-8 w-8 border">
                     <AvatarFallback><Bot /></AvatarFallback>
                   </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p>{message.content[0].text}</p>
                </div>
                 {message.role === 'user' && (
                   <Avatar className="h-8 w-8 border">
                     <AvatarFallback><User /></AvatarFallback>
                   </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-4">
                    <Avatar className="h-8 w-8 border">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg bg-muted p-3 text-sm flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ici..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
    </div>
  );
}
