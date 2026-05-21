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
  Send
} from 'lucide-react';
import { User } from 'firebase/auth';
import { getCachedToken, loginWithGoogle } from '../firebase.js';

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
- Experience Sector: ${userProfile.workExperienceYears > 0 ? `${userProfile.workExperienceYears} Years` : 'Fresh Graduate'}
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
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

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
                            {faq.answer}
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
          ) : (
            <>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                <span>Fully vetted information for Bangladeshi citizens.</span>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsGmailComposerOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2 px-3.5 bg-white border border-slate-300 hover:border-slate-450 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider font-sans"
                  title="Share details & academic credentials via Gmail"
                >
                  <Mail className="w-4 h-4 text-[#059669]" />
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
