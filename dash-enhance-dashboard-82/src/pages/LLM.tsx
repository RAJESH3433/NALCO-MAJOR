import { useState, FormEvent } from "react";
import Layout from "@/components/Layout";
import { Bot, Paperclip, Mic, CornerDownLeft, Search, FileText, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/config/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  text: string;
  isUser: boolean;
}

const LLM = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I help you today?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput("");
    setIsLoading(true);

    // TODO: Add API call here
    // For now, we'll just add a mock response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        text: "This is a placeholder response. The API integration will be added later.",
        isUser: false
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout title={t('aiAssistant')}>
      <div className="p-6 space-y-8">
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Natural Language Query Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2 mb-2">
                <Search className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-xl">{t('nlqInterface')}</CardTitle>
              </div>
              <CardDescription>
                {t('uploadDataset')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Analyze your data without the need for complex queries. Simply ask questions like,
                "What is the average casting temperature over the last month?" or "Which parameters correlate with high UTS?"
                <br /><br />
                The system will interpret your questions and provide insightful answers, summarizing your data automatically.
              </p>
            </CardContent>
          </Card>

          {/* PDF Summary Generator Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-xl">{t('pdfSummary')}</CardTitle>
              </div>
              <CardDescription>
                {t('uploadPdf')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Upload technical reports, production logs, or any PDF document, and the system will extract key points
                and provide a concise summary of the content.
                <br /><br />
                This feature is perfect for reviewing long documents quickly and understanding the most important details.
              </p>
            </CardContent>
          </Card>

          {/* Data Visualization Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-2 mb-2">
                <ChartLine className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-xl">{t('dataViz')}</CardTitle>
              </div>
              <CardDescription>
                {t('askForGraphs')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Want to see trends, patterns, or relationships in your data? Simply type in a request, like 
                "Plot the relationship between casting speed and UTS," and our system will generate the appropriate 
                charts and graphs for you.
                <br /><br />
                Visualize your data easily and gain insights in a way that's intuitive and actionable.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Existing Chat Interface */}
        <ExpandableChat
          size="lg"
          position="bottom-right"
          icon={<Bot className="h-6 w-6" />}
        >
          <ExpandableChatHeader className="flex-col text-center justify-center">
            <h1 className="text-xl font-semibold">{t('chatWithAI')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('howCanIHelp')}
            </p>
          </ExpandableChatHeader>

          <ExpandableChatBody>
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isUser={message.isUser}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  message="..."
                  isUser={false}
                />
              )}
            </div>
          </ExpandableChatBody>

          <ExpandableChatFooter>
            <form
              onSubmit={handleSubmit}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('typeMessage')}
                className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0 justify-between">
                <div className="flex">
                  <Button variant="ghost" size="icon" type="button">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" type="button">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={!input.trim()}>
                  {t('sendMessage')}
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </ExpandableChatFooter>
        </ExpandableChat>
      </div>
    </Layout>
  );
};

export default LLM;
