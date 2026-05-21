import React, { useState } from 'react';
import { Scholarship } from '../types';
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
  ChevronDown
} from 'lucide-react';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  onCheckEligibilityInModal: (s: Scholarship) => void;
}

const SCHOLARSHIP_FAQS: Record<string, { question: string; answer: string }[]> = {
  chevening: [
    {
      question: "Can I apply for Chevening without an unconditional university offer?",
      answer: "Yes. You do not need an unconditional offer at the time of application in November. You list three course preferences, and you must secure at least one unconditional admission offer by July of the following year."
    },
    {
      question: "How is the 2-year work experience (2,800 hours) verified?",
      answer: "You calculate and input your working hours on the portal. No physical certificates are required for primary submission. However, if shortlisted for the interview at the British High Commission in Dhaka, you must present official certificates."
    },
    {
      question: "Does Chevening require a mandatory IELTS test score?",
      answer: "Chevening itself removed its global English requirement in 2020. However, the UK universities you apply to will almost certainly require IELTS or TOEFL to issue you the unconditional offer letter."
    }
  ],
  'commonwealth-shared': [
    {
      question: "Can I apply to any UK university under Commonwealth Shared?",
      answer: "No. You can only apply to specific courses at participating UK universities that have partnered with the Commonwealth Scholarship Commission (CSC). The list of eligible courses is updated and published annually on the CSC website."
    },
    {
      question: "Can I apply to multiple universities for Commonwealth Shared?",
      answer: "Yes, you can apply to different universities. However, you must submit a separate online application for each chosen university program on both the university's portal and the CSC application system."
    },
    {
      question: "Does this scholarship allow me to bring family members?",
      answer: "Commonwealth Shared Scholarships are intended for single candidates. No spouse or child allowance is provided, and the stipend is strictly calculated to support one student's living expenses."
    }
  ],
  'daad-epos': [
    {
      question: "Is exactly 2 years of post-graduation work experience mandatory?",
      answer: "Yes, German universities are exceptionally strict about this. You must demonstrate at least 2 years of work experience completed *after* your graduation date. Student internships done during your bachelor's degree do not qualify."
    },
    {
      question: "What is a 'wet signature' and why is it required by DAAD?",
      answer: "A wet signature is a signature signed by hand with a physical pen. German intake offices frequently reject digital, typed, or copy-pasted signatures on your Europass CV and Statement of Purpose. You must sign physically, then scan the document."
    },
    {
      question: "Do I need to speak German to apply for DAAD EPOS?",
      answer: "No. All EPOS programs listed in this system are fully taught in English. However, learning basic German (A1/A2 level) in Dhaka before traveling will dramatically increase your visa approval speed at the German Embassy."
    }
  ],
  mext: [
    {
      question: "Is IELTS mandatory for MEXT scholarship in Bangladesh?",
      answer: "No, IELTS is not strictly mandatory for MEXT because the Japanese Embassy conducts its own written English and Japanese tests. However, having a good IELTS score (e.g., 6.5+) adds massive value during the primary screening."
    },
    {
      question: "What is the MEXT written examination like?",
      answer: "The exam is highly rigorous and content-dense, holding test modules for English, Mathematics, and Sciences (for undergraduate candidates) at the Embassy in Dhaka. Past exam papers are archived and freely accessible for practice on the Study in Japan website."
    },
    {
      question: "Can I apply if I don't know any Japanese language?",
      answer: "Yes, you can. All selected scholars undergo a mandatory, fully-funded 6-month intensive preparatory Japanese language course in Japan before starting their primary degree lectures."
    }
  ],
  erasmus: [
    {
      question: "I am in my final year of Bachelor's. Can I apply for Erasmus?",
      answer: "Yes. You can apply using your temporary or on-going transcripts, provided you graduate and receive your provisional undergraduate degree certificate prior to the start of the Erasmus course in September."
    },
    {
      question: "How does the mobility system work in different countries?",
      answer: "Erasmus Mundus courses are jointly run by a consortium. You will study in at least 2 or 3 different European countries (e.g., Semester 1 in France, Semester 2 in Germany, Semester 3 in Spain). Travel and relocation costs are fully covered."
    },
    {
      question: "Is the CGPA requirement flexible for Erasmus?",
      answer: "Yes! While high CGPA helps, Erasmus selection committees heavily prioritize undergraduate publications, research proposals, software projects, and clear motivation over pure GPAs. Your academic portfolio is key."
    }
  ],
  fulbright: [
    {
      question: "Is the GRE test strictly required for Fulbright applicants in Bangladesh?",
      answer: "Yes, for the Fulbright program administered in Dhaka, a valid GRE score is traditionally mandatory. You must prepare and sit for the exam well in advance of the June deadline."
    },
    {
      question: "What is the J-1 J-visa 2-year home residency obligation?",
      answer: "US Fulbright recipients travel on a J-1 Exchange Visitor visa. By law, you must return and reside in Bangladesh for a minimum of 2 years after completing your degree before you are eligible to work or reside permanently in the US."
    },
    {
      question: "Do I need to apply or secure admission to a US university first?",
      answer: "No. You apply solely to the Fulbright program. Once selected, dedicated US placement agencies (such as IIE) handle university matching and secure admissions on your behalf based on your academic profile."
    }
  ],
  'stipendium-hungaricum': [
    {
      question: "Why do I have to apply to the Bangladesh Ministry of Education portal?",
      answer: "Stipendium Hungaricum is a bilateral government agreement. You must apply to both the Hungarian portal and the Bangladesh Ministry of Education portal. Without the Ministry's official nomination, your application will be instantly disqualified."
    },
    {
      question: "Are English Medium of Instruction (MOI) certificates accepted?",
      answer: "Yes. Most Hungarian universities accept a formal English Medium of Instruction (MOI) letter issued by prominent Bangladeshi universities (BUET, DU, SUST, NSU, BRAC, etc.) instead of formal IELTS certificates."
    },
    {
      question: "Are accommodations and dormitory services completely free?",
      answer: "Yes, the scholarship provides free guaranteed dormitory placement or a monthly voucher/allowance of HUF 40,000 to assist with private renting costs in Hungary."
    }
  ],
  'turkiye-burslari': [
    {
      question: "Is the 1-year Turkish language preparatory year compulsory?",
      answer: "Yes. Even if your chosen university program is fully taught in English, Turkiye Burslari requires a mandatory 1-year Turkish language preparatory course (TÖMER) to help you adapt to local culture."
    },
    {
      question: "Are there any specific age limits to apply for Turkey scholarships?",
      answer: "Yes. You must be under 21 years of age for Bachelor programs, under 30 years old for Master programs, and under 35 years old for PhD/Doctoral programs."
    },
    {
      question: "Can I choose my own state university in Turkey?",
      answer: "During application, you can select up to 12 preferred universities and course programs. The Turkiye Burslari committee matches your profile and places you in one of your selected choices if approved."
    }
  ],
  gks: [
    {
      question: "What is the difference between Embassy Track and University Track for GKS?",
      answer: "Embassy Track allows you to apply to 3 Korean universities. If selected by the Korean Embassy in Dhaka, you pass to NIIED. University Track restricts you to applying directly to exactly 1 participating university, which handles your vetting. Embassy Track usually has a secondary selection round, but University Track is faster."
    },
    {
      question: "How strict is the GPA / CGPA 80% rule for GKS?",
      answer: "Extremely strict. NIIED requires that your cumulative GPA or score is 80% or above on your transcripts. If your university operates on a 4.0 scale and doesn't print percentages, you MUST secure an official grading conversion certificate from your Registrar's office explaining that your GPA matches 80% or higher."
    },
    {
      question: "Is IELTS accepted in GKS in place of TOPIK?",
      answer: "Yes. While TOPIK (Korean Language Test) is the ultimate bonus, high scores in IELTS (6.5+) or TOEFL are highly respected and will grant you substantial preference in the primary shortlisting rounds in Bangladesh."
    }
  ],
  'australia-awards': [
    {
      question: "What are the Priority Development Sectors for Bangladesh?",
      answer: "DFAT releases a list of eligible fields annually. For Bangladeshi applicants, primary priority development areas include Climate Change/Environment, Public Policy/Governance, Developmental Economics, Blue Economy, Public Health, and Gender Equity."
    },
    {
      question: "Do Australia Awards recipients have to return to Bangladesh?",
      answer: "Yes. It is a strict prerequisite of the scholarship visa. Under the Australia Awards agreement, you must leave Australia and reside in Bangladesh to contribute to its growth for at least two consecutive years after graduation."
    },
    {
      question: "Is the 2-year work experience requirement flexible?",
      answer: "No. DFAT is exceptionally meticulous. You must have at least 2 full years (24 months) of active professional work experience in a developmental or relevant administrative field by the application deadline."
    }
  ],
  'csc-china': [
    {
      question: "What are Type A and Type B Chinese Government Scholarships?",
      answer: "Type A (Bilateral Program) is managed directly by the Bangladesh Ministry of Education and the Chinese Embassy in Dhaka. Type B is the University Program, where you apply directly to your target Chinese university using their unique registration agency code."
    },
    {
      question: "How important is an 'Acceptance Letter' from a Chinese professor?",
      answer: "Extremely important, especially for Type B (University Track) and graduate applicants. Securing a written Acceptance Letter from a supervisor at a top Chinese university virtually guarantees your final CSC selection."
    },
    {
      question: "Do I have to study in Chinese language?",
      answer: "No. Thousands of top-tier CSC courses are taught fully in English. However, if you choose a Chinese-taught degree, the scholarship fully funds an initial 1-to-2 years of intensive Chinese language prep courses (HSK)."
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
}) => {
  if (!scholarship) return null;

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span>{scholarship.flag}</span>
              <span>{scholarship.country}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-950 text-emerald-350 border border-emerald-600/30">
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
          <p className="text-xs text-slate-355 leading-relaxed font-sans max-w-xl md:max-w-2xl">
            {scholarship.description}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[550px] overflow-y-auto space-y-6 font-sans">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-sm bg-slate-50 border border-slate-250/75">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Degree Target:</span>
              <span className="text-xs font-bold text-slate-800 font-display">
                {scholarship.degreeLevels.join(', ')} Degree
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">IELTS / English Level:</span>
              <span className="text-xs font-bold text-slate-800 font-display">
                {scholarship.ieltsRequirement === 0 ? 'Not Req / MOI accepted' : `Minimum Score ${scholarship.ieltsRequirement}`}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Target CGPA Level:</span>
              <span className="text-xs font-bold text-slate-800 font-display">
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
            <ul className="space-y-2.5 text-xs text-slate-750">
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
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-600 mt-2 shrink-0" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step by Step Applications */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
              <Milestone className="w-4 h-4 text-slate-505" />
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

          {/* Frequently Asked Questions Accordion */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-705 flex items-center gap-2 border-b border-slate-200 pb-2">
              <HelpCircle className="w-4 h-4 text-emerald-650" />
              Frequently Asked Questions (FAQ)
            </h3>
            <div className="space-y-2">
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
                      className="w-full text-left p-3 flex items-center justify-between gap-3 font-sans text-xs font-bold text-slate-800 hover:text-emerald-800 transition-colors cursor-pointer focus:outline-none"
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
                      <div className="p-3.5 pt-0 border-t border-slate-100 bg-white text-xs text-slate-650 leading-relaxed font-sans animate-fade-in-down">
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

        {/* Modal Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <span>Fully vetted information for Bangladeshi citizens.</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
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
        </div>
      </div>
    </div>
  );
};
