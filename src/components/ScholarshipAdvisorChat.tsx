import React, { useState, useRef, useEffect } from 'react';
import { Scholarship, UserProfile, ChatMessage } from '../types';
import { Send, Sparkles, User, Cpu, AlertCircle, Lock, Coins, ShieldCheck, Download, Trash2, Sliders } from 'lucide-react';

interface ScholarshipAdvisorChatProps {
  selectedScholarship: Scholarship | null;
  userProfile: UserProfile;
  isUnlocked: boolean;
  onUnlockRequest: () => void;
}

export const ScholarshipAdvisorChat: React.FC<ScholarshipAdvisorChatProps> = ({
  selectedScholarship,
  userProfile,
  isUnlocked,
  onUnlockRequest,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `আসসালামু আলাইকুম (Peace be upon you)! I am **ScholarsBot BD**, your expert AI overseas advisor. 

I can guide you through any aspect of studying abroad on fully funded schemes directly from Bangladesh. 

**Smart Recipes & Tools we can deploy immediately below:**
- Structure a matching SOP structure based on your academic credentials.
- Outline physical degree & transcripts attestation routes in Secretariat, MoE, Dhaka Education Board or MoFA.
- Select recommendation kit patterns to hand to Bangladeshi university faculty.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [fontSize, setFontSize] = useState<'text-xs' | 'text-sm' | 'text-base'>('text-xs');
  const [activePresetCategory, setActivePresetCategory] = useState<'drafting' | 'dhaka' | 'enquiries'>('drafting');
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

  const handleExportChat = () => {
    const formattedText = messages
      .map((m) => `[${m.timestamp}] ${m.sender === 'user' ? 'Applicant (You)' : 'ScholarsBot BD AI Advisor'}:\n${m.text}\n`)
      .join('\n============================\n\n');

    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScholarBot_BD_Consultation_Logs_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation logs and reload initial advice sequence?')) {
      setMessages([
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: `ScholarsBot consultation trace cleared. Ready for your custom academic queries.\n\nType down SOP formats, Dhaka attestation routes, or scholarship suitability items below!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  };

  const presetChips = [
    {
      category: 'drafting',
      label: '📝 Custom SOP Outline',
      prompt: `Based on my background in "${userProfile.fieldOfStudy || 'my major'}" (CGPA: ${userProfile.currentCGPA}, IELTS: ${userProfile.ieltsScore}), please outline a world-class 4-paragraph Statement of Purpose structure for the ${selectedScholarship ? selectedScholarship.title : 'best matching scholarship'} highlighting my strengths and addressing gaps.`,
    },
    {
      category: 'drafting',
      label: '📋 Reference Letter Kit',
      prompt: `How should I approach university lecturers in Bangladesh for strong recommendations? Draft a professional reference checklist template to handover to Bangladeshi university faculty.`,
    },
    {
      category: 'drafting',
      label: '✉️ English MOI Waiver Draft',
      prompt: 'Draft an English Medium of Instruction (MOI) verification request letter template to submit to a Bangladeshi university registrar office to replace standard IELTS.',
    },
    {
      category: 'dhaka',
      label: '🏛️ Dhaka Board & MoFA Attestation',
      prompt: "Explain the exact physical and online flow of getting university transcripts, board certificates, and birth certificates certified by the Board of Intermediate and Secondary Education (Dhaka/Mymensingh/other), Ministry of Education, and MoFA (Secretariat/Segunbagicha in Dhaka) for Bangladeshi candidates.",
    },
    {
      category: 'dhaka',
      label: '⚖️ Notary Public Stamps',
      prompt: "What is the procedure for getting photocopies notarized in Dhaka (Judge Court, Nilkhet or Farmgate)? Which files strictly need notary stamps before foreign portals?",
    },
    {
      category: 'enquiries',
      label: '📧 Professor Cold Email Layout',
      prompt: `I have a CGPA of ${userProfile.currentCGPA} in "${userProfile.fieldOfStudy || 'my major'}". Draft a superb, polite cold academic email to contact lab professors in North America or Asia seeking fully-funded assistantships.`,
    },
    {
      category: 'enquiries',
      label: '📅 BD Timeline Gap Buffer',
      prompt: "Considering Bangladeshi academic calendar delays or administrative waiting periods, outline a resilient timeline starting from early degree publication to student visa clearance in Dhaka.",
    },
  ];

  const filteredPresetChips = presetChips.filter(c => c.category === activePresetCategory);

  return (
    <div 
      className="flex flex-col bg-white border border-slate-200 rounded-sm h-[570px] overflow-hidden"
      id="scholarship-advisor-chat-module"
    >
      {/* Active Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-emerald-600 border border-emerald-500 text-white animate-pulse">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="font-display font-medium text-xs leading-none text-white flex items-center gap-1.5 uppercase tracking-wider">
              <span>ScholarsBot BD AI Advisor</span>
              <span className="inline-block w-1.5 h-1.5 rounded-none bg-emerald-400" />
            </h4>
            <span className="text-[10px] text-slate-400 font-mono mt-1 block">
              {selectedScholarship ? `Context Target: ${selectedScholarship.title}` : 'Universal Overseas Intake Advisor'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-mono uppercase tracking-wider">
              Preview Mode
            </span>
          )}
        </div>
      </div>

      {/* Messages Sandbox or Lock Screen */}
      {!isUnlocked ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-55 bg-slate-50 text-center space-y-6 select-none overflow-y-auto" id="chat-lock-container">
          <div className="relative">
            <div className="w-16 h-16 bg-amber-500/10 border-2 border-amber-500/20 text-amber-600 rounded-full flex items-center justify-center animate-pulse shadow-xs">
              <Lock className="w-7 h-7" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2 max-w-sm">
            <h3 className="font-display font-black text-slate-900 text-base uppercase tracking-wide">ScholarsBot AI Advisor is locked</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paying <strong>৳100 BDT</strong> unlocks permanently unrestricted, conversational counseling with our expert overseas advisor.
            </p>
          </div>

          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-md p-4 text-left divide-y divide-slate-100 flex flex-col text-xs text-slate-600 shadow-xs">
            <div className="py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#059669] rounded-none shrink-0" />
              <span>Draft tailored 4-paragraph Statement of Purpose (SOP) structures.</span>
            </div>
            <div className="py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#059669] rounded-none shrink-0" />
              <span>Attestation route maps (Dhaka Education Boards, MoE, MoFA).</span>
            </div>
            <div className="py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#059669] rounded-none shrink-0" />
              <span>Custom strategies for cold emails and teacher recommendation letters.</span>
            </div>
            <div className="py-2.5 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#059669] rounded-none shrink-0" />
              <span>Unlimited, persistent context chat regarding foreign placements.</span>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button
              type="button"
              onClick={onUnlockRequest}
              className="w-full py-3 bg-[#059669] hover:bg-[#047857] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all duration-155 flex items-center justify-center gap-2 cursor-pointer border border-[#047857] hover:scale-[1.01]"
              id="unlock-chat-button"
            >
              <Coins className="w-4 h-4 text-emerald-100 animate-bounce" />
              <span>Unlock AI Advisor (৳100 BDT)</span>
            </button>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Verified local gateway setup via bKash
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Active Live Parameter / Diagnostic Widget */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600 font-sans shrink-0">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Consultant Data Sync:</span>
              <strong className="text-slate-800 uppercase">{userProfile.degreeLevel}</strong>
              <span className="text-slate-350">|</span>
              <strong>CGPA: {userProfile.currentCGPA}</strong>
              <span className="text-slate-350">|</span>
              <strong>IELTS: {userProfile.ieltsScore}</strong>
              {userProfile.satScore ? (
                <>
                  <span className="text-slate-350">|</span>
                  <strong>SAT: {userProfile.satScore}</strong>
                </>
              ) : null}
              {userProfile.hasMoi && (
                <>
                  <span className="text-slate-350">|</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded-sm uppercase font-bold text-[8.5px] border border-emerald-200">MOI Ready</span>
                </>
              )}
            </div>
            
            {/* Control Bar Actions */}
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setFontSize(f => f === 'text-xs' ? 'text-sm' : f === 'text-sm' ? 'text-base' : 'text-xs')}
                className="px-2 py-0.5 bg-white text-slate-600 border border-slate-205 flex items-center gap-1 rounded-xs hover:bg-slate-50 cursor-pointer text-[9px] font-bold"
                title="Change display text sizing"
              >
                <span>Font Size ({fontSize.replace('text-', '')})</span>
              </button>
              <button 
                onClick={handleExportChat}
                className="px-2 py-0.5 bg-white/90 text-slate-700 hover:text-white hover:bg-slate-900 border border-slate-205 flex items-center gap-1 rounded-xs cursor-pointer text-[9px] font-bold"
                title="Export Advice Consultation logs to local TXT"
              >
                <Download className="w-3 h-3 text-slate-500 hover:text-white" />
                <span>Export logs</span>
              </button>
              <button 
                onClick={handleClearHistory}
                className="px-2 py-0.5 bg-white text-red-600 border border-slate-205 hover:bg-red-50 flex items-center gap-1 rounded-xs cursor-pointer text-[9px] font-bold"
                title="Clear and reload initial template layout"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
                <span>Reset</span>
              </button>
            </div>
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
                <div className={`h-8 w-8 rounded-sm shrink-0 flex items-center justify-center text-[10px] font-bold border ${
                  m.sender === 'user' 
                    ? 'bg-slate-200 border-slate-300 text-slate-850' 
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : 'BOT'}
                </div>

                {/* Bubble */}
                <div className="space-y-1">
                  <div className={`rounded-sm px-4 py-3 leading-relaxed border ${fontSize} ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white border-slate-800 font-medium font-sans'
                      : 'bg-white border-slate-200 text-slate-800 font-sans shadow-2xs'
                  }`}>
                    <div className="markdown-body whitespace-pre-wrap">
                      {m.text}
                    </div>
                  </div>
                  <span className={`block text-[9px] text-slate-450 font-mono ${
                    m.sender === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="h-8 w-8 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] shrink-0 font-bold">
                  BOT
                </div>
                <div className="bg-white border border-slate-200 p-4 rounded-sm flex items-center gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-slate-450 font-mono">Formulating advice draft...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Preset Chips Panel (Tabs Category filter + Buttons) */}
          {messages.length < 10 && (
            <div className="p-3 border-t border-slate-200 bg-white shrink-0">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  Interactive Quick Diagnostics:
                </span>
                
                {/* Preset Categories switcher */}
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setActivePresetCategory('drafting')}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-xs transition-colors cursor-pointer select-none ${
                      activePresetCategory === 'drafting' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    SOP & References
                  </button>
                  <button 
                    onClick={() => setActivePresetCategory('dhaka')}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-xs transition-colors cursor-pointer select-none ${
                      activePresetCategory === 'dhaka' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    BD Attestation Maps
                  </button>
                  <button 
                    onClick={() => setActivePresetCategory('enquiries')}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-xs transition-colors cursor-pointer select-none ${
                      activePresetCategory === 'enquiries' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Professor Outreach
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-h-[85px]">
                {filteredPresetChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.prompt)}
                    className="text-[9.5px] py-1 px-2 rounded-sm bg-slate-50 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer font-bold shrink-0 truncate max-w-[210px]"
                    title={chip.prompt}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Demo Warning Banner */}
          {isDemoMode && (
            <div className="bg-amber-50 border-t border-b border-amber-200/50 p-2 text-[10px] text-amber-805 flex items-center gap-2 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Configuring a real <strong>GEMINI_API_KEY</strong> will unlock custom evaluations.</span>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2 shrink-0">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask about SOP, physical MOFA papers, reference letter tips..."
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
        </>
      )}
    </div>
  );
};
