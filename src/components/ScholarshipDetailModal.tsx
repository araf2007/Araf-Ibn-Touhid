import React, { useState, useEffect } from 'react';
import { Scholarship, UserProfile } from '../types';
import { 
  X, 
  Award, 
  MapPin, 
  Milestone, 
  CheckCircle2, 
  ExternalLink, 
  Lightbulb, 
  BadgeCheck,
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
  Share2,
  Copy,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  BookOpen,
  Bell,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { getCachedToken, loginWithGoogle } from '../firebase.js';
import { SCHOLARSHIP_PREP_RESOURCES } from '../scholarshipsPrepData.js';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onCheckEligibilityInModal: (s: Scholarship) => void;
  userProfile: UserProfile;
  user: User | null;
}

const SCHOLARSHIP_FAQS: Record<string, { question: string; answer: string }[]> = {
  chevening: [
    {
      question: "Can I apply for Chevening without an unconditional university offer?",
      answer: "Yes. You can apply for Chevening before securing any university offers. If you are shortlisted, you will be given until mid-July of the following year to upload at least one unconditional offer from your three selected UK courses."
    },
    {
      question: "Is there a return-home requirement for Bangladeshi Chevening Scholars?",
      answer: "Yes, you must return to Bangladesh for a minimum of two years immediately after your scholarship ends. This is a non-negotiable directive mandated for all Chevening scholars worldwide."
    },
    {
      question: "What types of work experience qualify for the 2-year (2,800-hour) Chevening requirement?",
      answer: "Full-time employment, part-time jobs, paid/unpaid internships, and voluntary work all qualify. The platform calculates hours cumulatively, meaning tasks taken during undergraduate programs in Dhaka or Chittagong count."
    }
  ],
  mext: [
    {
      question: "Do I need to speak Japanese to win the MEXT Graduate Scholarship?",
      answer: "No. While basic Japanese is useful, most graduate research scholars study in English-medium programs. MEXT also provides a fully funded 6-month intensive Japanese language course in Japan prior to your master's or PhD program."
    },
    {
      question: "What is the difference between Embassy Recommendation and University Recommendation?",
      answer: "Embassy Recommendation is organized by the Japanese Embassy in Dhaka (written exams + interview during May-June). University Recommendation is when a Japanese domestic professor directly recommends your profile for MEXT sponsorship."
    },
    {
      question: "Are medical certificates or health checkups required at Embassy screen?",
      answer: "Yes, once you pass the initial documentary review, the Japanese Embassy in Dhaka requires a standard medical examination form signed by an authority like Dhaka Medical College Hospital or similar vended institutions."
    }
  ]
};

const DEFAULT_FAQS = [
  {
    question: "Do I need to get my documents attested by the Ministry of Foreign Affairs (MoFA) before applying?",
    answer: "Most scholarships accept scanned copies of your official academic transcripts and certificates during the online application phase. However, once you receive an admission offer or win the award, physical attestation from MoFA Dhaka, the Ministry of Education, and your respective Board (BISE) is mandatory before visa submission."
  },
  {
    question: "What is a Medium of Instruction (MOI) certificate and is it useful?",
    answer: "An MOI certificate is an official letter issued by your university's Registrar Office confirming that your undergraduate degree was conducted entirely in English. For countries like Germany, Japan, or Hungary, an MOI often allows you to secure conditional offers or waive IELTS requirements, though taking the IELTS remains highly recommended."
  },
  {
    question: "How can I secure high-quality academic recommendation letters in Bangladesh?",
    answer: "Request references early from professors who know your work personally, preferably those with active research profiles or international publication records. Provide them with a bulleted summary of your achievements, projects, and your prospective SOP draft to help them craft a personalized letter."
  }
];

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  onCheckEligibilityInModal,
  userProfile,
  user,
}) => {
  if (!scholarship) return null;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [expandedFaqAnswers, setExpandedFaqAnswers] = useState<Record<number, boolean>>({});
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Deadline Reminder states
  const [isReminderDrawerOpen, setIsReminderDrawerOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderChannel, setReminderChannel] = useState<'browser' | 'calendar'>('calendar');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccessMsg, setScheduleSuccessMsg] = useState<string | null>(null);

  // Guess reminder date based on deadline string
  const getDefaultReminderDate = (deadlineStr: string): string => {
    const currentYear = new Date().getFullYear();
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const lower = (deadlineStr || '').toLowerCase();
    let foundMonthIdx = -1;
    for (let i = 0; i < 11; i++) {
      if (lower.includes(months[i])) {
        foundMonthIdx = i;
        break;
      }
    }
    
    if (foundMonthIdx === -1) {
      const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      for (let i = 0; i < 12; i++) {
        if (lower.includes(shortMonths[i])) {
          foundMonthIdx = i;
          break;
        }
      }
    }

    // Try to extract any number for the day
    const matches = lower.match(/\b\d{1,2}\b/);
    let dayNum = 15;
    if (matches && matches[0]) {
      dayNum = parseInt(matches[0], 10);
      if (dayNum > 28) dayNum = 28; // safe day of month
    }

    const targetMonth = foundMonthIdx !== -1 ? foundMonthIdx : (new Date().getMonth() + 1) % 12;
    let targetYear = currentYear;
    
    const dateObj = new Date(targetYear, targetMonth, dayNum);
    if (dateObj.getTime() < Date.now()) {
      targetYear += 1;
    }
    
    const m = String(targetMonth + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    return `${targetYear}-${m}-${d}`;
  };

  useEffect(() => {
    if (scholarship) {
      setReminderTitle(`Deadline: Apply for ${scholarship.title}`);
      setReminderDate(getDefaultReminderDate(scholarship.deadline));
      setScheduleSuccessMsg(null);
    }
  }, [scholarship, isReminderDrawerOpen]);

  // Connect, Schedule and Notify via Google Calendar or local browser notification
  const handleSetReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) {
      alert("Please provide a title and date.");
      return;
    }

    setIsScheduling(true);
    setScheduleSuccessMsg(null);

    try {
      if (reminderChannel === 'calendar') {
        // --- GOOGLE CALENDAR CHANNEL ---
        let token = getCachedToken();
        if (!token) {
          const authPrompt = window.confirm(
            "Google Calendar API integration requires authorizing with your Google account. Connect now?"
          );
          if (!authPrompt) {
            setIsScheduling(false);
            return;
          }
          await loginWithGoogle();
          token = getCachedToken();
        }

        if (!token) {
          throw new Error("Unable to obtain Google OAuth access token. Please authorize again.");
        }

        // Mutation safeguard requirement: explicit user confirmation beforehand
        const confirmMsg = `Create a matching calendar deadline item named "${reminderTitle}" on ${reminderDate} at ${reminderTime} inside your Google Calendar?`;
        if (!window.confirm(confirmMsg)) {
          setIsScheduling(false);
          return;
        }

        // Construct Date instances for start and end
        const startD = new Date(`${reminderDate}T${reminderTime}`);
        const endD = new Date(startD.getTime() + 60 * 60 * 1000); // 1 hour duration

        const body = {
          summary: reminderTitle,
          description: `Application Deadline Reminder for ${scholarship.title}.\nHost Country: ${scholarship.country}\nWebsite: ${scholarship.officialLink}\n\nGenerated automatically by ScholarBD.`,
          start: {
            dateTime: startD.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: endD.toISOString(),
            timeZone: 'UTC',
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 1440 }, // 1 day ahead
              { method: 'popup', minutes: 120 },  // 2 hours ahead
            ],
          },
        };

        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Calendar API Error: ${errText || 'Fail status'}`);
        }

        setScheduleSuccessMsg(
          `Success! Calendar event registered. We added "${reminderTitle}" to your primary calendar and set automated email notifications.`
        );

      } else {
        // --- BROWSER DESKTOP NOTIFICATION CHANNEL ---
        if (!('Notification' in window)) {
          throw new Error('This browser does not support desktop notifications.');
        }

        let permission = Notification.permission;
        if (permission === 'default') {
          permission = await Notification.requestPermission();
        }

        if (permission !== 'granted') {
          throw new Error(
            'Notification permission was denied. Please allow notifications in your browser options to use local notifications.'
          );
        }

        // Mutation safeguard requirement for desktop notification simulation trigger
        const confirmMsg = `Enable system notifications and schedule a local application reminder for "${reminderTitle}"?`;
        if (!window.confirm(confirmMsg)) {
          setIsScheduling(false);
          return;
        }

        // Store scheduled reminder in localStorage for persistent client tracking
        const stored = localStorage.getItem('scholarbd_reminders');
        const reminders = stored ? JSON.parse(stored) : [];
        const newReminder = {
          id: `${Date.now()}_${scholarship.id}`,
          scholarshipId: scholarship.id,
          scholarshipTitle: scholarship.title,
          reminderTitle,
          reminderDate,
          reminderTime,
        };
        reminders.push(newReminder);
        localStorage.setItem('scholarbd_reminders', JSON.stringify(reminders));

        // Fire initial immediate desktop alert indicating success
        try {
          new Notification('Reminder Set Successfully!', {
            body: `You will be notified for "${scholarship.title}" on ${reminderDate}!`,
            tag: `scholarbd-reg-${scholarship.id}`,
          });
        } catch (e) {
          console.warn("Direct notification failed fallback alert: ", e);
        }

        setScheduleSuccessMsg(
          `Success! Local reminder configured for ${reminderDate} at ${reminderTime}. ScholarBD will trigger desktop alerts as you browse.`
        );
      }
    } catch (err: any) {
      console.error('Reminder scheduling exception:', err);
      alert(`Event Integration Failed: ${err.message || err}`);
    } finally {
      setIsScheduling(false);
    }
  };

  useEffect(() => {
    setExpandedFaqAnswers({});
  }, [scholarship?.id, openFaqIndex]);

  const handleShareToggle = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
  };

  const handleCopyLink = () => {
    if (scholarship) {
      navigator.clipboard.writeText(scholarship.officialLink)
        .then(() => {
          setShareFeedback("Copied to Clipboard!");
          setTimeout(() => setShareFeedback(null), 2000);
        })
        .catch((err) => {
          console.error("Copy failed", err);
          setShareFeedback("Copy Failed");
          setTimeout(() => setShareFeedback(null), 2000);
        });
    }
  };

  const handleNativeShare = () => {
    if (scholarship && navigator.share) {
      navigator.share({
        title: scholarship.title,
        text: `Check out the fully funded ${scholarship.title} opportunity on ScholarBD!`,
        url: scholarship.officialLink,
      })
      .then(() => setIsShareMenuOpen(false))
      .catch((err) => console.log("Native share failed", err));
    }
  };

  // Gmail sharing portal states
  const [isGmailComposerOpen, setIsGmailComposerOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Auto-compose professional scholarly cover inquiry draft when catalog modal is opened or folder connected
  useEffect(() => {
    if (scholarship) {
      setRecipientEmail(user?.email || '');
      setEmailSubject(`[ScholarBD] Academic Inquiry - ${scholarship.title}`);
      
      const attachedDocsText = userProfile.linkedDocuments && userProfile.linkedDocuments.length > 0
        ? `\nI have securely linked my academic credentials from Google Drive for your convenient reference:\n` + 
          userProfile.linkedDocuments.map(d => `- ${d.type}: ${d.url}`).join('\n')
        : '\nI am prepared to share my full academic achievements profile if requested.';

      const defaultBody = `Dear Fellow Scholar,

I would like to share and query eligibility for the prestigious "${scholarship.title}" program.

--- Candidate Profile Overview ---
- Academic Degree: ${userProfile.degreeLevel} candidate
- Current CGPA: ${userProfile.currentCGPA.toFixed(2)} / 4.0
- IELTS Standard: ${userProfile.ieltsScore > 0 ? userProfile.ieltsScore.toFixed(1) : 'Pending / Not Taken'}
${userProfile.satScore ? `- SAT Entrance Score: ${userProfile.satScore}\n` : ''}- Experience Sector: ${userProfile.workExperienceYears > 0 ? `${userProfile.workExperienceYears} Years` : 'Fresh Graduate'}
- Specialization: ${userProfile.fieldOfStudy || 'General Sciences & Arts'}
${userProfile.hasMoi ? '- English Medium of Instruction (MOI) certificate is available' : ''}${attachedDocsText}

Please let me know if we can coordinate reviews or build matching admission targets on ScholarBD!

Sincerely,
${user?.displayName || 'Post-Grad Candidate'}`;

      setEmailBody(defaultBody);
      setSendSuccess(null);
    }
  }, [scholarship, isGmailComposerOpen, userProfile, user]);

  // Secure Gmail sending via standard Workspace SMTP JSON proxy
  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      alert("Please specify a recipient email address.");
      return;
    }

    let token = getCachedToken();
    if (!token) {
      try {
        const wantsAuth = window.confirm("Gmail authentication is required to send messages from your account. Connect with Google now?");
        if (!wantsAuth) return;
        await loginWithGoogle();
        token = getCachedToken();
      } catch (err) {
        console.error("Gmail authorization error:", err);
        alert("Authorization failed. Ensure popups are allowed.");
        return;
      }
    }

    if (!token) {
      alert("No active Google Workspace OAuth token available.");
      return;
    }

    // Require explicit user confirmation before executing mutating workspace actions
    const mailConfirm = window.confirm(`Send query to "${recipientEmail}" using the Gmail API on your behalf?`);
    if (!mailConfirm) return;

    setIsSending(true);
    setSendSuccess(null);

    try {
      const cleanSubject = emailSubject || `Academic scholarship details: ${scholarship.title}`;
      
      const encodeUtf8AndBase64Url = (str: string) => {
        const encoded = btoa(unescape(encodeURIComponent(str)));
        return encoded
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      };

      const rawEmailContent = [
        `To: ${recipientEmail}\r\n`,
        `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(cleanSubject)))}?=\r\n`,
        `Content-Type: text/html; charset=utf-8\r\n`,
        `MIME-Version: 1.0\r\n\r\n`,
        `<div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; padding: 12px; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 4px;">`,
        `<h3 style="color:#0f172a; border-bottom: 2px solid #10b981; padding-bottom: 8px; margin-top: 0;">ScholarBD Academic Notification</h3>`,
        emailBody.replace(/\n/g, '<br />'),
        `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />`,
        `<p style="font-size: 11px; color: #64748b; margin-bottom: 0;">Sent securely via ScholarBD using Google Workspace Authentication with Gmail Send permissions.</p>`,
        `</div>`
      ].join('');

      const base64Raw = encodeUtf8AndBase64Url(rawEmailContent);

      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: base64Raw
        })
      });

      if (!response.ok) {
        const errDetails = await response.text();
        throw new Error(errDetails || "Failed sending message through Google Services");
      }

      setSendSuccess(`Success! Message dispatched via Gmail to ${recipientEmail}. You can confirm this inside your Gmail 'Sent' folder!`);
    } catch (err: any) {
      console.error("Gmail dispatch error:", err);
      alert(`Unable to dispatch email. Common cause: workspace permissions or expired tokens. Error description: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-sm shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up md:my-8"
        id="scholarship-detail-modal"
      >
        {/* Banner/Header */}
        <div className="bg-slate-900 p-6 md:p-8 text-white relative border-b border-slate-800">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-30">
            <button
              onClick={handleShareToggle}
              className={`p-2 rounded-sm transition-colors cursor-pointer flex items-center justify-center ${
                isShareMenuOpen 
                  ? 'text-emerald-400 bg-slate-850 border border-slate-750' 
                  : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-transparent'
              }`}
              aria-label="Share scholarship program"
              title="Share scholarship program"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-sm transition-colors cursor-pointer flex items-center justify-center border border-transparent"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share Dropdown Overlay */}
          {isShareMenuOpen && (
            <div className="absolute top-14 right-4 z-40 w-52 bg-slate-850 border border-slate-700 rounded-sm shadow-2xl text-xs overflow-hidden text-white divide-y divide-slate-800 animate-fade-in-down font-sans">
              <div className="p-2.5 font-bold text-[9px] text-slate-400 uppercase tracking-widest bg-slate-900 select-none flex items-center justify-between">
                <span>Share Program</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse" />
              </div>
              
              {/* Copy action */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer border-none bg-transparent"
              >
                <Copy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-slate-100">
                  {shareFeedback || "Copy Official Link"}
                </span>
              </button>

              {/* Native System share */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer border-none bg-transparent"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="font-semibold text-slate-100">Use System Share</span>
                </button>
              )}

              {/* WhatsApp Share */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out the fully funded ${scholarship.title} opportunity for Bangladeshi students! Read official details here: ${scholarship.officialLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareMenuOpen(false)}
                className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer block no-underline text-decoration-none"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-slate-100">Share on WhatsApp</span>
              </a>

              {/* Facebook Share */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(scholarship.officialLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareMenuOpen(false)}
                className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer block no-underline text-decoration-none"
              >
                <Facebook className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-semibold text-slate-100">Share on Facebook</span>
              </a>

              {/* Twitter / X Share */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Amazing fully-funded overseas scholarship opportunity for Bangladeshi graduates: ${scholarship.title} ${scholarship.officialLink}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareMenuOpen(false)}
                className="w-3.5 h-3.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer block no-underline text-decoration-none p-2.5"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold text-slate-100">Share on Twitter / X</span>
              </a>

              {/* LinkedIn Share */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(scholarship.officialLink)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsShareMenuOpen(false)}
                className="w-full text-left p-2.5 hover:bg-slate-800 flex items-center gap-2.5 transition-colors text-slate-200 hover:text-white text-[11px] cursor-pointer block no-underline text-decoration-none"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold text-slate-100">Share on LinkedIn</span>
              </a>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-sans">
              <span>{scholarship.flag}</span>
              <span>{scholarship.country}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-950 text-emerald-350 border border-emerald-600/30 font-sans">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {scholarship.fundingType}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-mono bg-slate-850 text-slate-300">
              Fee: {scholarship.applicationFee}
            </span>
          </div>

          <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight leading-tight mb-2 uppercase">
            {scholarship.title}
          </h2>
          <p className="text-xs text-slate-350 leading-relaxed font-sans max-w-xl md:max-w-2xl">
            {scholarship.description}
          </p>
        </div>

        {/* Modal Body / Gmail sharing panel */}
        {isGmailComposerOpen ? (
          <div className="p-6 md:p-8 max-h-[500px] overflow-y-auto space-y-5 font-sans animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <h3 className="font-display font-bold text-sm text-slate-900 uppercase tracking-tight">
                  Gmail Academic Sharing Drawer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSendSuccess(null);
                  setIsGmailComposerOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-855 font-bold hover:bg-slate-100 px-2 py-1 rounded-sm cursor-pointer transition-colors"
              >
                ← Back to Details
              </button>
            </div>

            {sendSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-6 text-center space-y-4">
                <div className="text-4xl text-emerald-600">✉</div>
                <h4 className="font-display font-bold text-slate-900 uppercase text-sm">Email Dispatched Successfully!</h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  {sendSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSendSuccess(null);
                    setIsGmailComposerOpen(false);
                  }}
                  className="py-2 px-4 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-sm uppercase tracking-wide cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs font-sans text-slate-800">
                {/* To Recipient */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-600 uppercase tracking-wider block">
                      Recipient Email (To):
                    </label>
                    <button 
                      type="button"
                      onClick={() => setRecipientEmail(user?.email || '')} 
                      className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer border-none bg-transparent outline-none"
                    >
                      Address to myself
                    </button>
                  </div>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-250 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-550"
                    placeholder="e.g. professor@dhakauni.edu or a fellow cadet"
                  />
                </div>

                {/* Email Subject */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-600 uppercase tracking-wider block">
                    Email Subject:
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full text-xs py-2 px-3 bg-white border border-slate-250 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-550"
                    placeholder="Subject line"
                  />
                </div>

                {/* Email Body */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-600 uppercase tracking-wider block">
                      Message Content (Inquiry Draft):
                    </label>
                    <span className="text-[10px] text-slate-400">Pre-hydrates CV/Transcript links</span>
                  </div>
                  <textarea
                    rows={11}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-250 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-555 font-mono leading-relaxed bg-white text-slate-800"
                  />
                </div>

                {/* Security info */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm text-[10.5px] text-slate-500 leading-normal">
                  🔐 <strong>Real API Sending:</strong> Your email is transmitted via Google Workspace TLS using your authorized Google Account. No local databases will capture your messages.
                </div>
              </div>
            )}
          </div>
        ) : isReminderDrawerOpen ? (
          <div className="p-6 md:p-8 max-h-[500px] overflow-y-auto space-y-5 font-sans animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-emerald-600 animate-bounce" />
                <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                  Application Deadline Reminder Portal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setScheduleSuccessMsg(null);
                  setIsReminderDrawerOpen(false);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold hover:bg-slate-100 px-3 py-1 bg-transparent border-none rounded-sm cursor-pointer transition-colors"
              >
                ← Back to Details
              </button>
            </div>

            {scheduleSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-6 text-center space-y-4 animate-fade-in">
                <div className="text-4xl text-emerald-600">🔔</div>
                <h4 className="font-display font-extrabold text-slate-900 uppercase text-xs tracking-wider">Reminder Set Successfully!</h4>
                <p className="text-xs text-slate-650 leading-relaxed max-w-md mx-auto font-sans">
                  {scheduleSuccessMsg}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setScheduleSuccessMsg(null);
                    setIsReminderDrawerOpen(false);
                  }}
                  className="py-2.5 px-5 bg-slate-900 text-white hover:bg-slate-800 text-[11px] font-bold rounded-sm uppercase tracking-wider cursor-pointer border-none transition-all"
                >
                  Return to Scholarship Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetReminderSubmit} className="space-y-4 text-xs font-sans text-slate-800">
                {/* Channel selection tabs */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">
                    Reminder Target Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setReminderChannel('calendar')}
                      className={`py-3.5 px-4 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        reminderChannel === 'calendar'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-extrabold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-400 bg-transparent'
                      }`}
                    >
                      <span className="text-2xl">📅</span>
                      <span className="text-xs font-bold uppercase tracking-wide">Google Calendar</span>
                      <span className="text-[10px] text-slate-400 font-normal normal-case">Adds persistent cloud slot</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setReminderChannel('browser')}
                      className={`py-3.5 px-4 rounded-sm border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        reminderChannel === 'browser'
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-extrabold shadow-sm'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-400 bg-transparent'
                      }`}
                    >
                      <span className="text-2xl">💻</span>
                      <span className="text-xs font-bold uppercase tracking-wide">Browser Notification</span>
                      <span className="text-[10px] text-slate-400 font-normal normal-case">HTML5 Desktop audio & alert</span>
                    </button>
                  </div>
                </div>

                {/* Reminder Title */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]" htmlFor="reminder-title-field">
                    Reminder Title Text
                  </label>
                  <input
                    id="reminder-title-field"
                    type="text"
                    required
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                    className="w-full text-xs font-medium py-2 px-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-sm font-sans"
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]" htmlFor="reminder-date-field">
                      Schedule Date
                    </label>
                    <input
                      id="reminder-date-field"
                      type="date"
                      required
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full text-xs font-medium py-2 px-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]" htmlFor="reminder-time-field">
                      Schedule Time
                    </label>
                    <input
                      id="reminder-time-field"
                      type="time"
                      required
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full text-xs font-medium py-2 px-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-sm font-mono"
                    />
                  </div>
                </div>

                {/* Help guide box */}
                {reminderChannel === 'calendar' ? (
                  <div className="bg-amber-50/50 border border-amber-200 p-3.5 rounded-sm text-[10.5px] leading-relaxed text-amber-950 font-sans">
                    <span className="font-bold">🔐 Persistent Access:</span> We will prompt you to connect your Google Account securely (or reuse your existing token) to submit this reminder directly to your Google Calendar. This adds visual alarms and optional custom email buffers!
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-sm text-[10.5px] leading-relaxed text-slate-550 font-sans">
                    <span className="font-bold">💻 Browser Sandbox Limit:</span> HTML5 local notifications rely heavily on standard page session state. Ensure your browser allows alerts for this sandbox domain, and keep ScholarBD opened/running to trigger active alarms as dates approach.
                  </div>
                )}
              </form>
            )}
          </div>
        ) : (
          /* Modal Body */
          <div className="p-6 md:p-8 max-h-[500px] overflow-y-auto space-y-6 font-sans">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-sm bg-slate-50 border border-slate-250/75 font-sans">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Degree Target:</span>
                <span className="text-xs font-bold text-slate-800">
                  {scholarship.degreeLevels.join(', ')} Degree
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">IELTS / English Level:</span>
                <span className="text-xs font-bold text-slate-800">
                  {scholarship.ieltsRequirement === 0 ? 'Not Req / MOI accepted' : `Minimum Score ${scholarship.ieltsRequirement}`}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Target CGPA Level:</span>
                <span className="text-xs font-bold text-slate-800">
                  {scholarship.cgpaRequirement === 0 ? 'No fixed threshold' : `Min ${scholarship.cgpaRequirement} / 4.0 Scale`}
                </span>
              </div>
            </div>

            {/* Core Benefits */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Award className="w-4 h-4 text-emerald-650" />
                Financial Package & Benefits
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                {scholarship.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start bg-slate-50 p-3 rounded-sm border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Advice for Bangladeshi Students */}
            <div className="p-5 rounded-sm bg-orange-50/50 border border-orange-200/60 space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-orange-950 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-orange-605" />
                Actionable Guide for Bangladeshi Applicants
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-750 font-sans">
                {scholarship.tipsForBangladeshis.map((tip, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="inline-flex leading-none items-center justify-center font-mono font-bold text-[10px] bg-orange-100/80 text-orange-900 w-5 h-5 rounded-sm shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Eligibility Rules */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Detailed Eligibility Requirements
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {scholarship.eligibilityDetails.map((detail, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-none bg-emerald-650 mt-2 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step by Step Applications */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                <Milestone className="w-4 h-4 text-slate-500" />
                Application Walkthrough Sequence
              </h3>
              <ol className="space-y-3 text-xs text-slate-700">
                {scholarship.applicationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 start items-start border-l-2 border-slate-150 pl-4 relative py-1">
                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-none bg-white border-2 border-emerald-600 flex items-center justify-center">
                      <div className="w-1 h-1 bg-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase mb-0.5">Step {idx + 1}</span>
                      <span className="leading-relaxed text-slate-600">{step}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Custom Individual Timeline Strategy */}
            {scholarship.timelineStrategy && scholarship.timelineStrategy.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="text-base">📅</span>
                  Tailored Applicant Preparation Timeline
                </h3>
                <p className="text-[11px] text-slate-500 leading-normal mb-3 font-sans">
                  Recommended strategic roadmap compiled by previous Bangladeshi scholars to safely navigate key intake steps.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarship.timelineStrategy.map((phaseItem, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-slate-50 border border-slate-200 rounded-sm relative animate-fade-in-up"
                    >
                      {/* Phase Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 uppercase tracking-wider">
                          {phaseItem.months}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">
                          Step 0{index + 1}
                        </span>
                      </div>
                      
                      <h4 className="font-display font-bold text-xs text-slate-800 mb-2 leading-tight">
                        {phaseItem.phase}
                      </h4>

                      <ul className="space-y-1.5 font-sans text-xs text-slate-600">
                        {phaseItem.tasks.map((task, idx) => (
                          <li key={idx} className="flex gap-2 items-start leading-relaxed text-slate-550">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 mt-1.5 shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation and Exam Resources Sector */}
            <div className="space-y-3.5" id="preparation-resources-sector">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                <BookOpen className="w-4 h-4 text-emerald-650" />
                Preparation & Study Resources
              </h3>
              
              {(() => {
                const prepResources = SCHOLARSHIP_PREP_RESOURCES[scholarship.id] || [];
                if (prepResources.length === 0) {
                  return (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-center">
                      <p className="text-xs text-slate-400 font-mono">No resources are available right now for this scholarship.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {prepResources.map((res, index) => {
                      let badgeText = 'Resource';
                      let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                      
                      if (res.type === 'past_papers') {
                        badgeText = '📑 Past Papers';
                        badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200/50';
                      } else if (res.type === 'study_guides') {
                        badgeText = '📚 Study Guide';
                        badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200/50';
                      } else if (res.type === 'official_syllabus') {
                        badgeText = '📋 Syllabus Outline';
                        badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-250/50';
                      } else if (res.type === 'community_channels') {
                        badgeText = '💬 Community Hub';
                        badgeStyle = 'bg-purple-50 text-purple-800 border-purple-200/50';
                      }

                      return (
                        <div 
                          key={index}
                          className="p-3.5 bg-white border border-slate-200 rounded-sm flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-2xs transition-all duration-155 relative group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase border ${badgeStyle}`}>
                                {badgeText}
                              </span>
                            </div>
                            
                            <h4 className="font-display font-bold text-xs text-slate-800 leading-snug group-hover:text-emerald-950 transition-colors">
                              {res.title}
                            </h4>
                            
                            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                              {res.description}
                            </p>
                          </div>
                          
                          <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-mono font-bold text-emerald-700 hover:text-emerald-950 inline-flex items-center gap-1 text-decoration-none"
                            >
                              <span>Explore Resource</span>
                              <ExternalLink className="w-3 h-3 text-emerald-650 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
                <HelpCircle className="w-4 h-4 text-emerald-650" />
                Frequently Asked Questions (FAQ)
              </h3>
              <div className="space-y-2 font-sans">
                {(SCHOLARSHIP_FAQS[scholarship.id] || DEFAULT_FAQS).map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border border-slate-200 rounded-sm overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full text-left p-3 flex items-center justify-between gap-3 font-sans text-xs font-bold text-slate-800 hover:text-emerald-800 transition-colors cursor-pointer focus:outline-none border-none"
                        aria-expanded={isOpen}
                      >
                        <span className="leading-snug flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">Q</span>
                          {faq.question}
                        </span>
                        <ChevronDown 
                          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} 
                        />
                      </button>
                      {isOpen && (
                        <div className="p-3.5 pt-0 border-t border-slate-100 bg-white text-xs text-slate-655 leading-relaxed font-sans mt-0 animate-fade-in-down">
                          <div className="pl-3.5 border-l-2 border-emerald-500/40 text-slate-600 font-normal">
                            {(() => {
                              const isLong = faq.answer.length > 140;
                              const isExpanded = !!expandedFaqAnswers[idx];
                              
                              if (isLong && !isExpanded) {
                                return (
                                  <div>
                                    <span>{faq.answer.slice(0, 140)}...</span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedFaqAnswers(prev => ({ ...prev, [idx]: true }));
                                      }}
                                      className="text-emerald-600 hover:text-emerald-800 font-bold ml-1.5 hover:underline cursor-pointer inline-flex items-center gap-0.5 font-sans border-none bg-transparent p-0"
                                    >
                                      Read More
                                    </button>
                                  </div>
                                );
                              }
                              
                              return (
                                <div>
                                  <span>{faq.answer}</span>
                                  {isLong && isExpanded && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setExpandedFaqAnswers(prev => ({ ...prev, [idx]: false }));
                                      }}
                                      className="text-slate-400 hover:text-slate-605 font-bold ml-2 hover:underline cursor-pointer inline-flex items-center gap-0.5 font-sans border-none bg-transparent p-0"
                                    >
                                      Read Less
                                    </button>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popular Majors */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Top Recipient Fields in Bangladesh:</h4>
              <div className="flex flex-wrap gap-2">
                {scholarship.popularMajors.map((mj, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-700 text-xs rounded-sm border border-slate-200 font-medium">
                    {mj}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between font-sans">
          {isGmailComposerOpen ? (
            <>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <span className="inline-block w-2 bg-emerald-500 h-2 rounded-full animate-pulse" />
                <span>Workspace Access Active</span>
              </div>
              {!sendSuccess && (
                <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsGmailComposerOpen(false)}
                    className="py-2 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-sm cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    disabled={isSending}
                    className="inline-flex items-center gap-1.5 py-2 px-5 bg-slate-900 border border-slate-900 text-emerald-400 hover:text-emerald-300 rounded-sm text-xs font-bold disabled:opacity-50 transition-colors uppercase tracking-wider cursor-pointer font-sans"
                  >
                    {isSending ? (
                      <span className="animate-pulse">Delivering via Gmail...</span>
                    ) : (
                      <>
                        <span>Send Email</span>
                        <Send className="w-3 h-3 text-emerald-400" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : isReminderDrawerOpen ? (
            <>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <span className="inline-block w-2 bg-emerald-500 h-2 rounded-full animate-pulse" />
                <span>Ready to Schedule</span>
              </div>
              {!scheduleSuccessMsg && (
                <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsReminderDrawerOpen(false)}
                    className="py-2 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-sm cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSetReminderSubmit}
                    disabled={isScheduling}
                    className="inline-flex items-center gap-1.5 py-2 px-5 bg-slate-900 border border-slate-900 text-emerald-400 hover:text-emerald-300 rounded-sm text-xs font-bold disabled:opacity-50 transition-colors uppercase tracking-wider cursor-pointer font-sans"
                  >
                    {isScheduling ? (
                      <span className="animate-pulse">Setting Alert...</span>
                    ) : (
                      <>
                        <span>Set Reminder</span>
                        <Bell className="w-3.5 h-3.5 text-emerald-400" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <span>Fully vetted information for Bangladeshi citizens.</span>
              </div>
 
              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsReminderDrawerOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white border border-slate-300 hover:border-slate-450 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider font-sans"
                  title="Schedule application / deadline alerts with Google Calendar or Browser Desktop"
                >
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <span>Set Deadline Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsGmailComposerOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white border border-slate-300 hover:border-slate-450 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider font-sans"
                  title="Share details & academic credentials via Gmail"
                >
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Share via Gmail</span>
                </button>
                <button
                  type="button"
                  onClick={() => onCheckEligibilityInModal(scholarship)}
                  className="flex-1 sm:flex-none text-center py-2 px-4 bg-emerald-50 text-emerald-800 border border-emerald-250 hover:bg-emerald-100 text-xs font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider"
                >
                  Analyze Your Eligibility Score
                </button>
                <a
                  href={scholarship.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 border border-slate-900 text-white rounded-sm text-xs font-bold hover:bg-slate-800 transition-colors uppercase tracking-wider"
                >
                  <span>Apply on Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
