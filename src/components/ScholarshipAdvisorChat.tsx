import React, { useState, useRef, useEffect } from 'react';
import { Scholarship, UserProfile, ChatMessage } from '../types';
import { Send, Sparkles, User, ShieldAlert, Cpu, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

interface ScholarshipAdvisorChatProps {
  selectedScholarship: Scholarship | null;
  userProfile: UserProfile;
}

export const ScholarshipAdvisorChat: React.FC<ScholarshipAdvisorChatProps> = ({
  selectedScholarship,
  userProfile,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `আসসালামু আলাইকুম (Peace be upon you)! I am **ScholarsBot BD**, your scholarship navigator. 

I can guide you through any aspect of studying abroad on fully funded schemes from Bangladesh. 

**Here are some smart recipes we can cook up right now:**
- Draft an SOP structure specifically tailored to ${selectedScholarship ? selectedScholarship.title : 'international standards'}.
- Step-by-step guide for attesting educational papers in Dhaka (Secretariat, MoE, MoFA).
- How to seek recommendation letters from Bangladeshi university teachers.

How can I assist your scholarship aspirations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const apiCall = async (chatMessages: ChatMessage[]) => {
    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          selectedScholarship,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Server network failure. Please retry.');
      }

      const data = await response.json();
      if (data.isDemoMode) {
        setIsDemoMode(true);
      } else {
        setIsDemoMode(false);
      }

      return data.text || data.text === '' ? data.text : (data.text || 'Error obtaining response');
    } catch (err: any) {
      console.error(err);
      return `⚠️ Oops, I encountered a communication error. Message from server: "${err.message}". Try resubmitting.`;
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim() || isSending) return;

    if (!customText) setInputVal('');

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsSending(true);

    const assistantResponseText = await apiCall(updatedMessages);

    const assistantMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'assistant',
      text: assistantResponseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsSending(false);
  };

  const presetChips = [
    {
      label: '📝 SOP Outline',
      prompt: `Hello ScholarsBot BD! Based on my background in "${userProfile.fieldOfStudy || 'my major'}" (CGPA: ${userProfile.currentCGPA}, IELTS: ${userProfile.ieltsScore}), please outline a world-class 4-paragraph Statement of Purpose structure for the ${selectedScholarship ? selectedScholarship.title : 'best matching scholarship'}.`,
    },
    {
      label: '✉️ Cold Email Drafting',
      prompt: `Draft a highly professional scholarly cold email that a Bangladeshi student can send to professors (seeking PhD/Master fellowships), emphasizing research capacities and mentioning IELTS ${userProfile.ieltsScore || '6.5'}.`,
    },
    {
      label: '🏛️ MOFA Dhaka Paper Attestation',
      prompt: "Explain the exact, current physical and online procedure of getting board/university degree certificates certified by the Education Board, Ministry of Education, and MoFA (Secretariat/Segunbagicha in Dhaka) for Bangladeshi students traveling abroad.",
    },
    {
      label: '📋 Recommendations Guide',
      prompt: "How should I approach university teachers in Bangladesh for strong academic recommendation letters? What details or reference kits should I provide them?",
    },
  ];

  return (
    <div 
      className="flex flex-col bg-white border border-slate-200 rounded-sm h-[550px] overflow-hidden"
      id="scholarship-advisor-chat-module"
    >
      {/* Active Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-emerald-600 border border-emerald-500 text-white">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-display font-medium text-sm leading-none text-white flex items-center gap-1.5 uppercase tracking-wider">
              <span>ScholarsBot BD</span>
              <span className="inline-block w-1.5 h-1.5 rounded-none bg-emerald-400 animate-pulse" />
            </h4>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
              {selectedScholarship ? `Context Mode: ${selectedScholarship.title}` : 'Universal Search Mode'}
            </span>
          </div>
        </div>

        {isDemoMode && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
            Preview Mode
          </span>
        )}
      </div>

      {/* Messages Sandbox */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar block */}
            <div className={`h-8 w-8 rounded-sm shrink-0 flex items-center justify-center text-xs border ${
              m.sender === 'user' 
                ? 'bg-slate-200 border-slate-300 text-slate-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {m.sender === 'user' ? <User className="w-4.5 h-4.5" /> : 'S'}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div className={`rounded-sm px-4 py-3 text-xs leading-relaxed border ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white border-slate-800 font-medium'
                  : 'bg-white border-slate-200 text-slate-800 font-sans'
              }`}>
                <div className="markdown-body whitespace-pre-wrap">
                  {m.text}
                </div>
              </div>
              <span className={`block text-[9px] text-slate-400 font-mono ${
                m.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="h-8 w-8 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-xs shrink-0 font-bold">
              S
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-sm flex items-center gap-2">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] text-slate-450 font-mono">Drafting reply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Chips */}
      {messages.length < 5 && (
        <div className="p-3 border-t border-slate-200 bg-white">
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
            Suggested Strategic Templates:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presetChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                className="text-[10px] py-1.5 px-2.5 rounded-sm bg-slate-50 text-slate-705 hover:bg-emerald-50 hover:text-emerald-850 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer font-bold"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Demo Warning Banner */}
      {isDemoMode && (
        <div className="bg-amber-50 border-t border-b border-amber-200/50 p-2 text-[10px] text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>Configuring a real <strong>GEMINI_API_KEY</strong> will unlock custom evaluations.</span>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          placeholder="Ask our AI about SOP drafts, physical MOFA papers, recommendation templates..."
          className="flex-1 text-xs py-2.5 px-3.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
          disabled={isSending}
          id="chat-user-textbox"
        />
        <button
          onClick={() => handleSendMessage()}
          className="p-2.5 rounded-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          disabled={isSending}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
