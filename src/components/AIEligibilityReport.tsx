import React from 'react';
import { Scholarship, UserProfile } from '../types';
import { Award, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

interface AIEligibilityReportProps {
  scholarship: Scholarship;
  userProfile: UserProfile;
  reportMarkdown: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export const AIEligibilityReport: React.FC<AIEligibilityReportProps> = ({
  scholarship,
  userProfile,
  reportMarkdown,
  isLoading,
  onRefresh,
}) => {
  // Helper to extract segments from Gemini's markdown if they follow the requested keys
  const parseSection = (markdown: string, sectionKey: string): string => {
    try {
      const regex = new RegExp(`### ${sectionKey}([\\s\\S]*?)(?=### |$)`, 'i');
      const match = markdown.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    } catch (e) {
      console.error(e);
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-sm p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-none border-4 border-slate-100 border-t-emerald-600 animate-spin" />
          <Award className="w-6 h-6 text-emerald-600 absolute animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-display font-medium text-slate-800">Compiling Diagnostic Report</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our AI engine is evaluating your IELTS, CGPA, and work histories against ${scholarship.title}'s official criteria, compiling high school conversions, and drafting tailored SOP structures.
          </p>
        </div>
      </div>
    );
  }

  if (!reportMarkdown) {
    return (
      <div className="bg-slate-50 border border-slate-200 border-dashed rounded-sm p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[350px]">
        <Award className="w-10 h-10 text-slate-400" />
        <div className="max-w-sm">
          <h4 className="font-display font-medium text-slate-700 text-sm">No Active Report Diagnostic</h4>
          <p className="text-xs text-slate-500 mt-1">
            Configure your academic profile on the left and tap "AI Match Diagnostics" on any scholarship of your choice to get started.
          </p>
        </div>
      </div>
    );
  }

  // Parse sections
  const verdictRaw = parseSection(reportMarkdown, 'match-verdict');
  const detailsRaw = parseSection(reportMarkdown, 'academic-and-ielts-fit');
  const strengthsRaw = parseSection(reportMarkdown, 'strength-analysis');
  const gapsRaw = parseSection(reportMarkdown, 'gap-analysis');
  const checklistRaw = parseSection(reportMarkdown, 'action-plan-checklist');

  // Fallback parsing: if sections aren't cleanly sliced, render full markdown
  const isSegmented = verdictRaw || strengthsRaw || gapsRaw || checklistRaw;

  return (
    <div 
      className="bg-white border border-slate-200 rounded-sm p-6 space-y-6"
      id={`ai-eligibility-report-${scholarship.id}`}
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-sm font-bold tracking-wider">
            AI Diagnosis Active
          </span>
          <h3 className="font-display font-bold text-base text-slate-800 leading-snug">
            Eligibility Roadmap: {scholarship.title}
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Tailored analysis context for Bangladeshi students.
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-sm cursor-pointer transition-colors border border-slate-250/50 uppercase tracking-wider"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Re-Analyze
        </button>
      </div>

      {isSegmented ? (
        <div className="space-y-6">
          
          {/* Section 1: Verdict */}
          <div className="p-5 rounded-sm bg-slate-900 text-white relative overflow-hidden border border-slate-850">
            <h4 className="font-display font-medium text-emerald-400 text-xs uppercase tracking-widest mb-2">
              Advisor Core Verdict
            </h4>
            <div className="text-xs font-sans leading-relaxed text-slate-200 whitespace-pre-line prose prose-invert">
              {verdictRaw}
            </div>
          </div>

          {/* Section 2: Detailed Academics Match */}
          {detailsRaw && (
            <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <h5 className="font-display font-bold text-slate-800 mb-2 uppercase tracking-wide">Academic & English Criteria Fit</h5>
              <div className="whitespace-pre-line leading-relaxed">
                {detailsRaw}
              </div>
            </div>
          )}

          {/* Section 3 & 4: Strengths & Gaps (Bento Pair) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-sm bg-emerald-50/50 border border-emerald-100 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-950">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h5 className="font-display font-bold text-xs uppercase tracking-wide">Match Strengths</h5>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                {strengthsRaw || 'No specific strengths categorized. You meet the minimum guidelines.'}
              </div>
            </div>

            {/* Gaps */}
            <div className="p-4 rounded-sm bg-orange-50/50 border border-orange-100/80 space-y-2.5">
              <div className="flex items-center gap-2 text-orange-950">
                <div className="w-2 h-2 rounded-full bg-orange-600 shrink-0" />
                <h5 className="font-display font-bold text-xs uppercase tracking-wide">Strategic Gaps to Safeguard</h5>
              </div>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                {gapsRaw || 'Your GPA and IELTS meet the thresholds perfectly. Ensure recommendation letter quality.'}
              </div>
            </div>
          </div>

          {/* Section 5: Numbered Action-Plan Checklist */}
          {checklistRaw && (
            <div className="p-5 rounded-sm border border-slate-200 bg-white space-y-3">
              <h4 className="font-display font-bold text-slate-800 text-xs flex items-center gap-2 uppercase tracking-wider">
                <ArrowRight className="w-4.5 h-4.5 text-emerald-600" />
                5-Step Strategic Timeline (Action-Plan)
              </h4>
              <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-sans p-3 bg-slate-50 rounded-sm border border-slate-200">
                {checklistRaw}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Fallback Markdown renderer */
        <div className="prose max-w-none text-xs leading-relaxed p-4 bg-slate-50 rounded-sm border border-slate-200">
          <div className="markdown-body whitespace-pre-line">
            {reportMarkdown}
          </div>
        </div>
      )}

      {/* Advice Footnote */}
      <p className="text-[10px] text-slate-400 font-mono text-center">
        Reports compiled dynamically via Gemini-3.5-Flash utilizing annual admission guidelines.
      </p>
    </div>
  );
};
