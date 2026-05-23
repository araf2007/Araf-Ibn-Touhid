import React from 'react';
import { Check, X, Sparkles, Coins, ShieldCheck, CheckCircle2, Cpu, FileText, Landmark } from 'lucide-react';

interface PlanComparisonSectionProps {
  isUnlocked: boolean;
  onUnlockPro: () => void;
}

export const PlanComparisonSection: React.FC<PlanComparisonSectionProps> = ({
  isUnlocked,
  onUnlockPro,
}) => {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-sm p-6 md:p-8 mb-8" 
      id="plans-comparison-section"
    >
      <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-250/50 rounded-sm text-[9px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Access Level Comparison
        </span>
        <h3 className="font-display font-black text-xl md:text-2xl text-slate-900 uppercase tracking-tight">
          Choose Your Scholarship Strategy Plan
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-sans">
          Leverage our fully-vetted database under the standard tier, or activate ScholarsBot BD AI Pro for automated high-impact SOP drafting and precise profile diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto font-sans">
        
        {/* FREE PLAN */}
        <div className="border border-slate-200 bg-slate-50/50 p-6 rounded-sm flex flex-col justify-between transition-all hover:border-slate-350 relative shadow-2xs">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Standard Tier</h4>
                <p className="font-display font-extrabold text-lg text-slate-800 uppercase mt-1">Sovereign Explorer</p>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-2xl text-slate-800">৳0</span>
                <span className="text-[10px] text-slate-400 font-mono block">Permanently Free</span>
              </div>
            </div>

            <p className="text-xs text-slate-505 leading-relaxed">
              Explore sovereign and university guidelines, browse courses, and build your bookmarks with full query capabilities in Bangladesh's best repository.
            </p>

            <ul className="space-y-3 pt-2 text-xs">
              <li className="flex items-start gap-2.5 text-slate-700">
                <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Browse and filter all fully-funded opportunities</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-700">
                <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Filter by Country, Degree Level, and IELTS scores</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-700">
                <Check className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Unlimited personal scholarship bookmarks</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="line-through decoration-slate-200">Conversational ScholarsBot BD consultant chat</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="line-through decoration-slate-200">Custom 4-paragraph Statement of Purpose (SOP) structures</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-400">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="line-through decoration-slate-200">Real-Time Match gap and strength profile diagnostics</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200">
            <button
              disabled
              className="w-full text-center py-2.5 px-4 bg-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider rounded-sm select-none cursor-not-allowed border border-slate-250"
            >
              Active Workspace Tier
            </button>
          </div>
        </div>

        {/* PAID PLAN */}
        <div className={`border-2 p-6 rounded-sm flex flex-col justify-between transition-all relative overflow-hidden shadow-md group ${
          isUnlocked 
            ? 'border-emerald-600 bg-emerald-50/10' 
            : 'border-slate-800 bg-white hover:scale-[1.01] hover:shadow-lg'
        }`}>
          {/* Top highlight ribbon */}
          <div className={`absolute top-0 right-0 py-1.5 px-6 rotate-45 translate-x-6 translate-y-2 text-[8px] font-black uppercase text-center tracking-widest ${
            isUnlocked ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-[#daabab]'
          }`}>
            {isUnlocked ? 'Active Pro' : 'Best Offer'}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <div>
                <h4 className="text-xs font-mono font-black text-emerald-600 uppercase tracking-widest">Premium Tier</h4>
                <p className="font-display font-extrabold text-lg text-slate-950 uppercase mt-1">ScholarsBot AI Pro</p>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-2.5xl text-emerald-800">৳100</span>
                <span className="text-[10px] text-slate-400 font-mono block">One-time / Lifetime</span>
              </div>
            </div>

            <p className="text-xs text-slate-655 leading-relaxed">
              Unlock our flagship suite of AI tools. Receive tailored SOP breakdowns, diagnostic gap audits, academic email drafts, and local attestation routing strategies.
            </p>

            <ul className="space-y-3 pt-2 text-xs">
              <li className="flex items-start gap-2.5 text-slate-800 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-spin animate-duration-3000 shrink-0" />
                  ScholarsBot BD Unrestricted Interactive Chat
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Custom 4-Paragraph SOP Structure drafting guide
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Diagnostic suitability score & gap assessments
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                  Secretariat, MoE & MoFA physical attestation maps
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct professor cold email layouts</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Downloadable textual consultation outputs (TXT export)</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200">
            {isUnlocked ? (
              <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 border border-emerald-250 text-emerald-800 font-sans font-black text-xs uppercase tracking-wider rounded-sm select-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Unlimited Access Unlocked</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onUnlockPro}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all duration-150 flex items-center justify-center gap-1 border border-emerald-700 hover:scale-[1.01] cursor-pointer"
                id="pricing-unlock-cta-btn"
              >
                <Coins className="w-4 h-4 text-emerald-100 animate-bounce" />
                <span>Activate Lifetime Pro (৳100 BDT)</span>
              </button>
            )}
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2 flex items-center justify-center gap-1 select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Automated validation over verified local bKash
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
