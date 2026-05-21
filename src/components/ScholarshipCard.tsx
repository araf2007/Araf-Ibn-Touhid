import React from 'react';
import { Scholarship, UserProfile } from '../types';
import { GraduationCap, Calendar, Clock, Globe, Award, CheckCircle, Bookmark } from 'lucide-react';

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSelect: (s: Scholarship) => void;
  onCheckEligibility: (s: Scholarship) => void;
  userProfile?: UserProfile;
  isBookmarked?: boolean;
  onToggleBookmark?: (scholarshipId: string) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  onSelect,
  onCheckEligibility,
  userProfile,
  isBookmarked = false,
  onToggleBookmark,
}) => {
  // Simple clientside eligibility heuristic check (for display badge)
  const isCgpaOk = !userProfile || userProfile.currentCGPA >= scholarship.cgpaRequirement;
  const isIeltsOk = !userProfile || userProfile.ieltsScore >= scholarship.ieltsRequirement;
  const isDegreeOk = !userProfile || scholarship.degreeLevels.includes(userProfile.degreeLevel);
  const isEligibleHeuristic = isCgpaOk && isIeltsOk && isDegreeOk;

  return (
    <div 
      className="group relative flex flex-col justify-between bg-white border border-slate-200 rounded-sm p-6 transition-all duration-200 hover:shadow-xs hover:border-emerald-600"
      id={`scholarship-card-${scholarship.id}`}
    >
      {/* Top Banner Accent - Geometric 3px bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-100 group-hover:bg-emerald-600 transition-colors duration-200" />

      <div>
        {/* Flag, Country & Funding Type */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-xs font-semibold bg-slate-50 text-slate-800 border border-slate-200">
            <span>{scholarship.flag}</span>
            <span>{scholarship.country}</span>
          </span>
          <div className="flex items-center gap-1.5">
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(scholarship.id);
                }}
                className={`p-1.5 rounded-sm transition-all border shrink-0 cursor-pointer ${
                  isBookmarked 
                    ? 'border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100' 
                    : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
                title={isBookmarked ? "Remove Bookmark" : "Save Scholarship"}
              >
                <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            )}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-bold ${
              scholarship.fundingType === 'Fully Funded' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-250' 
                : 'bg-emerald-100/10 text-emerald-800 border border-emerald-600/20'
            }`}>
              <Award className="w-3 h-3 text-emerald-600" />
              {scholarship.fundingType}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-base text-slate-800 leading-snug mb-2 group-hover:text-emerald-700 transition-colors duration-150">
          {scholarship.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {scholarship.description}
        </p>

        {/* Info Grid with Geometric dividers */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 border-t border-b border-slate-200/70 py-3 mb-4 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {scholarship.degreeLevels.join(', ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-slate-800 font-medium">
              {scholarship.deadline}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono uppercase">IELTS:</span>
            <span className="font-semibold text-slate-800">
              {scholarship.ieltsRequirement === 0 ? 'Not Req / MOI' : `Min ${scholarship.ieltsRequirement}`}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-mono uppercase">Min CGPA:</span>
            <span className="font-semibold text-slate-800">
              {scholarship.cgpaRequirement === 0 ? 'No Minimum' : `${scholarship.cgpaRequirement} / 4.0`}
            </span>
          </div>
        </div>
      </div>

      {/* Heuristic Match Meter (If user profile is added) */}
      {userProfile && (
        <div className={`flex items-center justify-between text-xs px-3 py-2 rounded-sm mb-4 font-sans ${
          isEligibleHeuristic 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
            : 'bg-slate-50 text-slate-600 border border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle className={`w-4 h-4 ${isEligibleHeuristic ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Profile Match Estimate</span>
          </div>
          <span className="font-mono font-bold text-[11px]">
            {isEligibleHeuristic ? '100% Eligible' : 'View Core Gaps'}
          </span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => onCheckEligibility(scholarship)}
          className="flex-1 text-center py-2 px-3 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/90 rounded-sm transition-colors cursor-pointer border border-emerald-600/20"
          id={`check-eligibility-btn-${scholarship.id}`}
        >
          AI Match Diagnostics
        </button>
        <button
          onClick={() => onSelect(scholarship)}
          className="py-2 px-3 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-sm transition-colors cursor-pointer"
          id={`view-details-btn-${scholarship.id}`}
        >
          Check Details & Tips
        </button>
      </div>
    </div>
  );
};
