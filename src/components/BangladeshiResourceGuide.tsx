import React from 'react';
import { ExternalLink, Globe, MapPin } from 'lucide-react';

export const BangladeshiResourceGuide: React.FC = () => {
  const links = [
    {
      title: 'SHED Ministry of Education BD',
      desc: 'Hosts official nomination notices, application folders, and national selection results (Commonwealth, Hungarian Bursary, ICT fellowships).',
      url: 'https://shed.gov.bd/',
      category: 'Official Portals'
    },
    {
      title: 'MoFA Dhaka Attestation',
      desc: 'Step-by-step guideline and virtual booking portal for attesting certificates at MoFA Segunbagicha, Dhaka. Usually requires Education Board verification first.',
      url: 'https://mofa.gov.bd/site/page/8ba66258-20cf-481d-bf2e-4b68ff0dc6b1/Consular-Service',
      category: 'Document Verification'
    },
    {
      title: 'BD Online Police Clearance',
      desc: 'Direct portal to apply for a digital Police Clearance Certificate. Required for visa processing in almost all major European and American destinations.',
      url: 'https://pcc.police.gov.bd/',
      category: 'Consular Files'
    },
    {
      title: 'British Council & IDP Bangladesh',
      desc: 'Links to register for the IELTS (Academic) exam or English Proficiency test at official hubs in Dhaka, Chittagong, Sylhet, and Khulna.',
      url: 'https://www.britishcouncil.org.bd/en/exam/ielts',
      category: 'Language Tests'
    }
  ];

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-sm p-6 text-white"
      id="bangladeshi-resources-guide"
    >
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-emerald-400" />
        <h3 className="font-display font-medium text-base text-white uppercase tracking-wider">
          Government & verification Directory
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-5 leading-relaxed font-sans">
        Authentic circular boards, credential translations, and physical attestation centers operating inside Bangladesh.
      </p>

      <div className="space-y-4">
        {links.map((link, idx) => (
          <div key={idx} className="p-3.5 rounded-sm bg-slate-950 border border-slate-800 space-y-2 hover:border-emerald-500/50 transition-colors group">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 font-bold">
                {link.category}
              </span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 group-hover:text-white transition-colors"
                aria-label={`Open ${link.title}`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <h4 className="font-display font-bold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors">
              {link.title}
            </h4>

            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              {link.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3 rounded-sm bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-200/95 leading-relaxed font-sans space-y-1">
        <h5 className="font-bold uppercase tracking-wider text-[9px] text-emerald-400 flex items-center gap-1.5 leading-none">
          <MapPin className="w-3.5 h-3.5" />
          Physical Segunbagicha Tip:
        </h5>
        <p>No phone or bags are allowed inside MoFA and the Ministry offices in Dhaka. Arrive early before 9:00 AM with all primary Education Board stamp verifications pre-completed.</p>
      </div>
    </div>
  );
};
