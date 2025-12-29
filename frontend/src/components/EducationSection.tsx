import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Send, Sparkles, Loader2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatAPI, ChatMessage } from "@/lib/api";
import { toast } from "sonner";

const EducationSection = () => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Internal API Key - now using environment variable
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const responseText = await chatAPI.sendMessage(newMessage.text, apiKey);

      const aiResponse: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "I apologize, but I'm having trouble connecting to the spirits of knowledge right now.";
      toast.error("Guide connection issue.");
      setMessages(prev => [...prev, {
        role: 'model',
        text: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "Tell me about Udupi Krishna Matha",
    "What is the significance of Yakshagana?",
    "Explain the history of Mangaloreadevi Temple",
    "When is the next Paryaya festival?"
  ];

  return (
    <section className="min-h-[calc(100vh-80px)] w-full bg-[#fdfcf8] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Background Texture & Mandalas - Reusing styles from other pages */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#DAA520] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#3D2616] blur-[150px]" />
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col h-[85vh] shadow-2xl rounded-2xl overflow-hidden border border-[#DAA520]/30 bg-white/80 backdrop-blur-md">
        {/* Header */}
        <div className="bg-[#3D2616] text-[#F9F5EA] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#DAA520]/20 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-[#DAA520]" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">TempleVerse Guide</h2>
              <p className="text-xs text-[#F9F5EA]/70">Powered by Gemini AI • Ask about Culture & Heritage</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 p-6 bg-[url('/textures/paper.png')] bg-repeat" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-10">
              <div className="bg-[#DAA520]/10 p-6 rounded-full">
                <Bot className="h-12 w-12 text-[#3D2616]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl text-[#3D2616] font-bold mb-2">
                  Namaste! How can I enlighten you today?
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I am trained on the sacred history of Tulunadu temples. Ask me about deities, rituals, architecture, or legends.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(s)}
                    className="p-4 rounded-xl border border-[#DAA520]/30 bg-white hover:bg-[#F9F5EA] hover:border-[#DAA520] transition-all text-left text-sm text-[#3D2616] shadow-sm hover:shadow-md"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-[#3D2616]' : 'bg-[#DAA520]'
                      }`}>
                      {m.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${m.role === 'user'
                      ? 'bg-[#3D2616] text-white rounded-tr-none'
                      : 'bg-white border border-[#DAA520]/20 text-[#3D2616] rounded-tl-none'
                      }`}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start w-full">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-8 w-8 rounded-full bg-[#DAA520] flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-white border border-[#DAA520]/20 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#DAA520]" />
                      <span className="text-xs text-muted-foreground">Consulting the scriptures...</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Invisible element to scroll to */}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-[#DAA520]/20">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex gap-3 max-w-3xl mx-auto relative"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about a temple..."
              className="pr-12 py-6 bg-[#F9F5EA] border-[#DAA520]/30 focus-visible:ring-[#DAA520] text-base"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="absolute right-1 top-1 bottom-1 bg-[#3D2616] hover:bg-[#2A1A0F] text-white rounded-lg px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Victory Coders • Hackathon 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
