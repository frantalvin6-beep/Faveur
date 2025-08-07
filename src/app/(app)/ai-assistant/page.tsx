'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Message } from 'genkit';

import { aiAssistant } from '@/ai/flows/ai-assistant';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const chatSchema = z.object({
  prompt: z.string().min(1, 'Le message ne peut pas être vide.'),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function AiAssistantPage() {
  const [conversation, setConversation] = React.useState<ChatMessage[]>([]);
  const [history, setHistory] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
  });

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [conversation]);

  const onSubmit = async (data: ChatFormValues) => {
    setIsLoading(true);
    setConversation((prev) => [...prev, { role: 'user', content: data.prompt }]);

    try {
      const { response } = await aiAssistant({ history, prompt: data.prompt });
      setConversation((prev) => [...prev, { role: 'model', content: response }]);
      
      // Update Genkit message history
      const newHistory: Message[] = [
        ...history,
        { role: 'user', content: [{ text: data.prompt }] },
        { role: 'model', content: [{ text: response }] },
      ];
      setHistory(newHistory);

    } catch (error) {
      console.error(error);
      setConversation((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        },
      ]);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div>
            <h1 className="text-3xl font-bold">Assistant IA</h1>
            <p className="text-muted-foreground">
                Posez vos questions sur l'utilisation de Campus Central.
            </p>
        </div>
      <Card className="flex-grow mt-4 flex flex-col">
        <CardContent className="p-4 flex-grow flex flex-col">
          <ScrollArea className="flex-grow mb-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {msg.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                   {msg.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User size={20} /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Textarea
              {...register('prompt')}
              placeholder="Posez une question à l'assistant..."
              className="flex-grow resize-none"
              rows={1}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
              }}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </form>
          {errors.prompt && (
            <p className="text-sm text-destructive mt-1">{errors.prompt.message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
