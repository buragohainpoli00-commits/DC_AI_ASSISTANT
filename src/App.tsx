import React, { useState } from "react";
import Header from "./components/Header";
import ChatInterface from "./components/ChatInterface";
import NoticeBoard from "./components/NoticeBoard";
import QuickLinks from "./components/QuickLinks";
import InfoSidebar from "./components/InfoSidebar";
import { Message } from "./types";
import { Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(false);

  // Unified API caller for the Gemini chat endpoint
  const handleSendMessage = async (text: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: text, 
          history: messages 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Dhemaji College AI.");
      }

      const data = await response.json();
      return data; // returns { text: string, sources?: [] }
    } catch (err) {
      console.error("API Fetch Error:", err);
      throw err;
    }
  };

  // Helper to handle trigger queries from external modules (Notice Board or Quick Links)
  const handleTriggerQuery = async (queryText: string) => {
    if (isGenerating) return;

    // Scroll chat interface to focus
    const chatEl = document.getElementById("dc-chat-interface");
    if (chatEl) {
      chatEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await handleSendMessage(queryText);
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "I'm sorry, I am experiencing temporary difficulties communicating with Dhemaji College records. Please verify the Gemini API key configuration and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectNotice = (title: string) => {
    handleTriggerQuery(`Summarize and explain the details, deadlines, and criteria for this recent college notice: "${title}".`);
  };

  const handleSelectQuickQuery = (query: string) => {
    handleTriggerQuery(query);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Official Header */}
      <Header />

      {/* Main Container Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Welcome Intro Section */}
        <div className="bg-gradient-to-r from-teal-950 to-emerald-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-emerald-800">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-emerald-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="h-3 w-3" /> Live Campus Knowledge
            </div>
            <h2 className="font-display font-bold text-2xl tracking-tight text-amber-300">
              Welcome to Dhemaji College AI Support Desk
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              We are pleased to assist you with real-time academic counseling. Ask our AI Assistant for instant official details about our higher secondary, 4-Year UG degree programs, hostels, fee structures, or government waivers.
            </p>
          </div>
          <div className="bg-emerald-900/60 px-5 py-4 rounded-2xl border border-emerald-850 self-start md:self-auto flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-amber-300">Need immediate help?</p>
              <p className="text-emerald-200 mt-0.5">Simply click any notice or query block below to begin.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Information Sidebars (4 Columns on Desktop when not expanded) */}
          {!isChatExpanded && (
            <div className="lg:col-span-4 flex flex-col gap-6 animate-fadeIn">
              {/* Quick Profile */}
              <div className="flex-1">
                <InfoSidebar />
              </div>
            </div>
          )}

          {/* MIDDLE: Chat Interface Centerpiece (Dynamic width depending on isChatExpanded state) */}
          <div className={`${isChatExpanded ? "lg:col-span-9" : "lg:col-span-5"} flex flex-col gap-6 transition-all duration-300`}>
            <ChatInterface 
              onSendMessage={handleSendMessage}
              messages={messages}
              setMessages={setMessages}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              isExpanded={isChatExpanded}
              onToggleExpand={() => setIsChatExpanded(!isChatExpanded)}
            />
          </div>

          {/* RIGHT: Notice Board circular bulletins (3 Columns on Desktop) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="h-full">
              <NoticeBoard onSelectNotice={handleSelectNotice} />
            </div>
          </div>

        </div>

        {/* BOTTOM: Quick Links (Suggested Grid Cards) */}
        <div className="border-t border-slate-200/60 pt-6">
          <QuickLinks onSelectQuery={handleSelectQuickQuery} />
        </div>

      </main>

      {/* Official Footer Banner */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4 text-xs space-y-2">
          <p className="font-medium text-slate-300">
            © 2026 Dhemaji College, Assam. All Rights Reserved.
          </p>
          <p className="text-[10px] text-slate-500 max-w-xl mx-auto leading-relaxed">
            Disclaimer: The AI College Assistant uses official knowledge bases and search grounding to ensure accuracy. Please consult the official college administrative office for final confirmation of admission and fees.
          </p>
        </div>
      </footer>
    </div>
  );
}
