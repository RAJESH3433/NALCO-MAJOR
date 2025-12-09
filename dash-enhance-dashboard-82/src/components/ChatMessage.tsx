
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`p-4 max-w-[80%] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <p className="text-sm">{message}</p>
      </Card>
    </div>
  );
};

export default ChatMessage;
