import React from 'react';
import { TimelineMilestone } from '../types';
import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';

export const TimelineMilestones: React.FC = () => {
  const milestones: TimelineMilestone[] = [
    {
      id: 'm1',
      month: 'Jan — Mar',
      title: 'Foundation & English Standard Prep',
      tasks: [
        'Research eligible programs (Commonwealth courses or Erasmus catalogs).',
        'Begin daily IELTS preparation or schedule a mock test in British Council Bangladesh / IDP.',
        'Apply for standard Machine Readable Passport (MRP) or E-Passport if not owned.',
        'Request official academic transcripts from university (BUET, DU, NSU, SUST etc.).'
      ],
      status: 'upcoming'
    },
    {
      id: 'm2',
      month: 'Apr — Jun',
      title: 'MEXT & Initial Essay Writing',
      tasks: [
        'MEXT Embassy Track opens at the Japanese Embassy Dhaka. Prepare math & physics drills.',
        'Draft first draft of Statement of Purpose (SOP) or Study Research Plan.',
        'Approach bachelors thesis supervisors for physical recommendation letters.'
      ],
      status: 'upcoming'
    },
    {
      id: 'm3',
      month: 'Jul — Sep',
      title: 'Chevening & Core Intake Preparation',
      tasks: [
        'Chevening Scholarship portal opens in August. Draft leadership essays.',
        'DAAD EPOS portals open. Collect wet-signed Europass CV and professional work certificates.',
        'Translate academic SSC/HSC certificates if they are written in Bengali.'
      ],
      status: 'upcoming'
    },
    {
      id: 'm4',
      month: 'Oct — Dec',
      title: 'Submissions & Ministry Portals',
      tasks: [
        'Commonwealth Shared & General application portals close. Apply to joint UK universities.',
        'Check Bangladesh Ministry of Education portal (shed.gov.bd) daily for Stipendium Hungaricum circulars.',
        'Finalize all submissions. Sit for Skype/Zoom interviews if pre-selected.'
      ],
      status: 'upcoming'
    }
  ];

  return (
    <div 
      className="bg-white border border-slate-200 rounded-sm p-6"
      id="milestones-timeline-section"
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-emerald-600" />
        <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">
          Applicant Timeline (2026 Strategy)
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed font-sans">
        Preparation timeline recommended by previous scholars to stay ahead of competitive quotas.
      </p>

      <div className="space-y-6">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="relative flex gap-4 border-l-2 border-slate-200 pl-5 ml-2 pb-2">
            {/* Timeline node */}
            <div className="absolute -left-[6px] top-1 h-3 w-3 bg-white border-2 border-slate-900 rounded-none flex items-center justify-center">
              <div className="h-1 w-1 bg-emerald-600" />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  {milestone.month}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                  Priority Phase
                </span>
              </div>

              <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">
                {milestone.title}
              </h4>

              <ul className="space-y-1.5 pt-1">
                {milestone.tasks.map((task, idx) => (
                  <li key={idx} className="flex gap-2 items-start text-xs text-slate-500 font-sans leading-relaxed">
                    <span className="inline-block w-4 h-4 rounded-xs bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[9px] text-center shrink-0 mt-0.5 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
