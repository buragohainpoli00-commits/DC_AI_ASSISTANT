import React, { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Trash2, 
  Sparkles, 
  User, 
  HelpCircle, 
  ExternalLink, 
  Info, 
  GraduationCap, 
  FileText, 
  Coins,
  Maximize2,
  Minimize2,
  BookmarkCheck,
  CheckCircle2,
  X
} from "lucide-react";
import { Message } from "../types";

interface ChatInterfaceProps {
  onSendMessage: (text: string) => Promise<{ text: string; sources?: { title: string; url: string }[] }>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
}

const SUGGESTED_CHIPS = [
  { text: "Hostel criteria", icon: HelpCircle },
  { text: "Admission steps", icon: GraduationCap },
  { text: "Required documents", icon: FileText },
  { text: "Government Fee waiver", icon: Coins },
];

const INITIAL_GREETING = `Hello! 👋 Welcome to DHEMAJI COLLEGE.

I'm your AI College Assistant.

I can help you with:

🎓 Admissions
📚 Courses
💰 Fees
🏠 Hostel
📅 Academic Calendar
📝 Examination
📢 Notices
📞 Contact Information

How may I assist you today?`;

// Highly polished, robust parser for rendering clean headers, bold terms, lists, and links clearly
function FormatMessageText({ text }: { text: string }) {
  if (!text) return null;
  
  // Standardize bullet points and section titles
  const paragraphs = text.split("\n");
  
  return (
    <div className="space-y-2 text-slate-700">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return <div key={pIdx} className="h-2" />;

        // Detect Markdown headers e.g. "### Title" or "## Title"
        if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#")) {
          const cleanHeader = trimmed.replace(/^#+\s*/, "");
          return (
            <h4 key={pIdx} className="font-display font-bold text-slate-900 text-sm mt-3 mb-1 text-emerald-800 border-b border-slate-100 pb-0.5">
              {cleanHeader}
            </h4>
          );
        }

        // Check if it's a bullet list item
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*");
        
        // Check if it's a numbered list item
        const isNumbered = /^\d+\.\s/.test(trimmed);

        let cleanText = trimmed;
        if (isBullet) {
          cleanText = trimmed.replace(/^[•\-*]\s*/, "");
        } else if (isNumbered) {
          cleanText = trimmed.replace(/^\d+\.\s*/, "");
        }

        // Helper to parse formatting (bold, markdown images, and markdown links)
        const parseFormatting = (input: string) => {
          const regex = /(\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g;
          const tokens = input.split(regex);
          
          return tokens.map((token, tIdx) => {
            if (!token) return null;
            
            // Check for bold
            if (token.startsWith("**") && token.endsWith("**")) {
              return (
                <strong key={tIdx} className="font-semibold text-slate-950 bg-amber-100/60 px-1 rounded inline-block">
                  {token.slice(2, -2)}
                </strong>
              );
            }
            
            // Check for image: ![alt](url)
            if (token.startsWith("![") && token.includes("](")) {
              const altMatch = token.match(/\!\[(.*?)\]/);
              const urlMatch = token.match(/\((.*?)\)/);
              const alt = altMatch ? altMatch[1] : "";
              const url = urlMatch ? urlMatch[1] : "";
              return (
                <span key={tIdx} className="block my-3 max-w-[260px] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white p-1 ml-1 hover:scale-[1.02] transition-transform duration-200">
                  <img src={url} alt={alt} className="h-44 w-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                  {alt && <span className="block text-[10px] text-center text-slate-500 font-semibold mt-1.5 select-none">{alt}</span>}
                </span>
              );
            }

            // Check for link: [text](url)
            if (token.startsWith("[") && token.includes("](")) {
              const textMatch = token.match(/\[(.*?)\]/);
              const urlMatch = token.match(/\((.*?)\)/);
              const linkText = textMatch ? textMatch[1] : "";
              const url = urlMatch ? urlMatch[1] : "";
              return (
                <a key={tIdx} href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-900 font-bold underline inline-flex items-center gap-0.5">
                  {linkText}
                  <ExternalLink className="h-3 w-3 inline shrink-0" />
                </a>
              );
            }
            
            return token;
          });
        };

        const renderedText = parseFormatting(cleanText);

        if (isBullet) {
          return (
            <div key={pIdx} className="flex items-start gap-2 pl-3 py-0.5">
              <span className="text-emerald-600 font-extrabold text-sm select-none shrink-0">•</span>
              <p className="text-sm text-slate-700 leading-relaxed flex-1">{renderedText}</p>
            </div>
          );
        }

        if (isNumbered) {
          const match = trimmed.match(/^(\d+)\.\s/);
          const num = match ? match[1] : "1";
          return (
            <div key={pIdx} className="flex items-start gap-2.5 pl-3 py-0.5">
              <span className="text-emerald-700 font-mono font-bold text-xs bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                {num}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed flex-1 pt-0.5">{renderedText}</p>
            </div>
          );
        }

        return (
          <p key={pIdx} className="text-sm text-slate-700 leading-relaxed">
            {renderedText}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatInterface({ 
  onSendMessage, 
  messages, 
  setMessages, 
  isGenerating, 
  setIsGenerating,
  isExpanded = false,
  onToggleExpand,
  onClose
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "assistant",
          text: INITIAL_GREETING,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [messages, setMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || input).trim();
    if (!textToSend || isGenerating) return;

    if (!customText) setInput("");
    setSources([]);

    // Add user message
    const userMsgId = Date.now().toString();
    const userMsg: Message = {
      id: userMsgId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await onSendMessage(textToSend);
      
      // Add assistant response
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      
      if (response.sources && response.sources.length > 0) {
        setSources(response.sources);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "I'm sorry, I am experiencing temporary difficulties communicating with Dhemaji College records. Please check your network and try again soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Do you want to reset your conversation with the College AI?")) {
      setMessages([
        {
          id: "welcome-reset",
          sender: "assistant",
          text: INITIAL_GREETING,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setSources([]);
    }
  };

  return (
    <div 
      id="dc-chat-interface" 
      className={`bg-white rounded-2xl shadow-md border border-slate-200/80 flex flex-col transition-all duration-300 overflow-hidden ${
        isExpanded ? "h-[700px] lg:h-[780px]" : "h-[560px] lg:h-[630px]"
      }`}
    >
      {/* Chat header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 px-5 py-4 border-b border-emerald-800 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="bg-amber-400 h-10 w-10 rounded-xl flex items-center justify-center text-emerald-950 font-bold text-base shadow-inner">
              DC
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-emerald-900 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-slate-100 text-sm sm:text-base leading-tight">
              Dhemaji College AI Desk
            </h2>
            <div className="flex items-center space-x-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-emerald-200 font-medium tracking-wide uppercase">
                Active Support Agent
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {onToggleExpand && (
            <button 
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse View" : "Expand View"}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 transition-colors"
            >
              {isExpanded ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
            </button>
          )}

          <button 
            onClick={handleClear}
            title="Reset Chat History"
            className="p-1.5 rounded-lg text-emerald-200 hover:text-rose-200 hover:bg-rose-900/40 transition-colors"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>

          {onClose && (
            <button 
              onClick={onClose}
              title="Close Chat"
              className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition-colors border border-emerald-850 bg-emerald-950/20"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Message logs */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-gradient-to-b from-slate-50/50 to-white">
        {messages.map((msg) => {
          const isAssistant = msg.sender === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"} animate-fadeIn`}
            >
              {isAssistant && (
                <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-300 h-9 w-9 rounded-xl shadow-md flex items-center justify-center text-xs font-bold shrink-0 mt-1 border border-emerald-700/40">
                  AI
                </div>
              )}
              
              <div className="flex flex-col max-w-[85%]">
                <div 
                  className={`px-4.5 py-3.5 rounded-2xl shadow-sm border text-slate-850 ${
                    isAssistant 
                      ? "bg-white border-slate-200/70 rounded-tl-none text-slate-800" 
                      : "bg-emerald-900 border-emerald-850 text-white rounded-tr-none"
                  }`}
                >
                  {isAssistant ? (
                    <FormatMessageText text={msg.text} />
                  ) : (
                    <p className="text-sm leading-relaxed text-emerald-50 select-text selection:bg-amber-400 selection:text-emerald-950">
                      {msg.text}
                    </p>
                  )}
                </div>
                
                <div className={`flex items-center gap-1.5 text-[9px] font-mono text-slate-400 mt-1.5 px-1.5 ${!isAssistant && "justify-end"}`}>
                  {isAssistant && <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />}
                  <span>{isAssistant ? `Verified Office Assistant • ${msg.timestamp}` : `Student Inquiry • ${msg.timestamp}`}</span>
                </div>
              </div>

              {!isAssistant && (
                <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  <User className="h-4.5 w-4.5" />
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-amber-300 h-9 w-9 rounded-xl shadow-md flex items-center justify-center text-xs font-bold shrink-0 mt-1 border border-emerald-700/40">
              AI
            </div>
            <div className="bg-white border border-slate-200/60 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <span className="h-2 w-2 bg-emerald-800 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 bg-emerald-800 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 bg-emerald-800 rounded-full animate-bounce" />
              <span className="text-[11px] text-slate-400 font-medium pl-1">AI Assistant is processing...</span>
            </div>
          </div>
        )}

        {/* Dynamic verified sources panel */}
        {sources.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-xl p-4 border border-emerald-100/80 mt-4 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Reference Sources from dhemajicollege.in:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((src, sIdx) => (
                <a
                  key={sIdx}
                  href={src.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-100/80 hover:border-emerald-200 px-3 py-1.5 rounded-lg transition-all shadow-xs max-w-full truncate"
                >
                  <span className="truncate">{src.title}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-emerald-600" />
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips panel */}
      {messages.length > 0 && !isGenerating && (
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 self-center uppercase tracking-wider mr-1">Quick Ask:</span>
          {SUGGESTED_CHIPS.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSubmit(undefined, `Tell me about ${chip.text.toLowerCase()} at Dhemaji College.`)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-850 border border-slate-200 hover:border-emerald-200 rounded-full px-3.5 py-1.5 transition-all cursor-pointer shadow-xs hover:-translate-y-0.5"
              >
                <Icon className="h-3 w-3 text-emerald-700 shrink-0" />
                <span>{chip.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-200/80 bg-white flex gap-2.5 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isGenerating}
          placeholder="Ask a question clearly (e.g. eligibility criteria for BA science streams...)"
          className="flex-1 text-sm bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3.5 focus:outline-none focus:border-emerald-700 focus:bg-white disabled:opacity-60 transition-all text-slate-800 placeholder-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="bg-emerald-800 hover:bg-emerald-950 disabled:bg-slate-100 text-white disabled:text-slate-400 px-5 py-3.5 rounded-xl shadow-md disabled:shadow-none transition-all flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed text-sm font-bold gap-1.5"
        >
          <span>Send</span>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
