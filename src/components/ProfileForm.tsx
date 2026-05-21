import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  GraduationCap,
  Calculator,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';

interface ProfileFormProps {
  initialProfile: UserProfile;
  onProfileChange: (p: UserProfile) => void;
  onRunDiagnosticsOfAll: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialProfile,
  onProfileChange,
  onRunDiagnosticsOfAll,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [cgpaWarning, setCgpaWarning] = useState<string | null>(null);

  // High School / SSC / HSC conversion widget state
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [conversionMode, setConversionMode] = useState<'gpa5' | 'marks'>('gpa5');
  const [gpa5Input, setGpa5Input] = useState<string>("5.00");
  const [marksInput, setMarksInput] = useState<string>("80");

  // GPA Calculator / Accumulator states
  const [activeUtilTab, setActiveUtilTab] = useState<'converter' | 'calculator'>('converter');
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string; credits: number; gradePoint: number }>>([
    { id: '1', name: 'CSE-101', credits: 3, gradePoint: 4.0 },
    { id: '2', name: 'MAT-102', credits: 3, gradePoint: 3.75 },
    { id: '3', name: 'ENG-103', credits: 2, gradePoint: 4.0 },
  ]);

  const addSubject = () => {
    const nextId = String(Date.now());
    setSubjects([...subjects, { id: nextId, name: `SUB-${subjects.length + 1}`, credits: 3, gradePoint: 4.0 }]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const updateSubject = (id: string, key: 'name' | 'credits' | 'gradePoint', value: any) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [key]: value } : s));
  };

  const totalCredits = subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
  const totalPoints = subjects.reduce((sum, s) => sum + ((Number(s.credits) || 0) * (Number(s.gradePoint) || 0)), 0);
  const accumulatedGpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0.0;

  const updateProfileField = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    const nextProfile = { ...profile, [key]: value };
    setProfile(nextProfile);
    onProfileChange(nextProfile);

    // CGPA Validation warning for 5.0 scale entry
    if (key === 'currentCGPA') {
      const numericVal = Number(value);
      if (numericVal > 4.0) {
        setCgpaWarning("⚠️ Note: Bangladeshi University CGPAs are out of 4.0. If you are inputting high school (SSC/HSC) GPA out of 5.0, please convert or input your undergraduate CGPA.");
      } else {
        setCgpaWarning(null);
      }
    }
  };

  // Convert GPA 5.0 directly (linear mapping 5.0 -> 4.0)
  const numericGpa5 = parseFloat(gpa5Input) || 0;
  const convertedFromGpa5 = Math.min(4.0, Math.max(2.0, Number((numericGpa5 * 0.8).toFixed(2))));

  // Convert raw percentage (Bangladeshi board marking standards)
  const numericMarks = parseFloat(marksInput) || 0;
  let rawConvertedMarks = 2.0;
  if (numericMarks >= 80) {
    rawConvertedMarks = 4.0;
  } else if (numericMarks >= 70) {
    rawConvertedMarks = 3.5 + ((numericMarks - 70) * 0.5) / 10;
  } else if (numericMarks >= 60) {
    rawConvertedMarks = 3.0 + ((numericMarks - 60) * 0.5) / 10;
  } else if (numericMarks >= 50) {
    rawConvertedMarks = 2.5 + ((numericMarks - 50) * 0.5) / 10;
  } else if (numericMarks >= 40) {
    rawConvertedMarks = 2.0 + ((numericMarks - 40) * 0.5) / 10;
  }
  const convertedFromMarks = Math.min(4.0, Math.max(2.0, Number(rawConvertedMarks.toFixed(2))));

  const finalConvertedGpa = conversionMode === 'gpa5' ? convertedFromGpa5 : convertedFromMarks;

  const handleApplyConversion = () => {
    updateProfileField('currentCGPA', finalConvertedGpa);
  };

  return (
    <div 
      className="bg-white border border-slate-200 rounded-sm p-6"
      id="eligibility-profile-section"
    >
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-emerald-600" />
        <h3 className="font-display font-bold text-base text-slate-800 tracking-tight">
          Your Academic Profile
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed font-sans">
        Your parameters are used to instantly evaluate matching scores and generate strategic AI reports.
      </p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Degree Targeted */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-degree-level">
            Target Degree Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Bachelor', 'Master', 'PhD'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => updateProfileField('degreeLevel', level)}
                className={`py-2 px-3 text-xs font-bold rounded-sm text-center border cursor-pointer transition-colors ${
                  profile.degreeLevel === level
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* CGPA Slider / Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-cgpa">
              Bachelor CGPA (Scale 4.0)
            </label>
            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-sm text-slate-800 border border-slate-200">
              {profile.currentCGPA.toFixed(2)}
            </span>
          </div>
          <input
            id="profile-cgpa"
            type="range"
            min="2.0"
            max="5.0"
            step="0.05"
            value={profile.currentCGPA}
            onChange={(e) => updateProfileField('currentCGPA', Number(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-sm appearance-none cursor-pointer accent-emerald-600"
          />
          {cgpaWarning && (
            <p className="text-[10px] text-amber-800 bg-amber-50 rounded-sm p-2.5 border border-amber-200/50 leading-relaxed font-sans mt-2">
              {cgpaWarning}
            </p>
          )}

          {/* GPA & Marks Conversion Utility */}
          <div className="border border-dashed border-slate-200 rounded-sm p-3 bg-slate-50/50 space-y-2 mt-2">
            <button
              type="button"
              onClick={() => setIsConverterOpen(!isConverterOpen)}
              className="w-full flex items-center justify-between text-[11px] font-bold text-slate-700 hover:text-emerald-850 uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                Academic Scale Tools & Calculators
              </span>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 normal-case font-normal font-sans">
                {isConverterOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
            </button>

            {isConverterOpen && (
              <div className="pt-2.5 border-t border-slate-200 space-y-3 font-sans animate-fade-in-down">
                {/* Switcher tabs */}
                <div className="grid grid-cols-2 gap-1 bg-slate-200/50 p-0.5 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setActiveUtilTab('converter')}
                    className={`py-1 text-[10px] font-bold rounded-xs transition-colors cursor-pointer ${
                      activeUtilTab === 'converter'
                        ? 'bg-white text-slate-800 shadow-xs border-0'
                        : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
                    }`}
                  >
                    Scale Converter
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveUtilTab('calculator')}
                    className={`py-1 text-[10px] font-bold rounded-xs transition-colors cursor-pointer ${
                      activeUtilTab === 'calculator'
                        ? 'bg-white text-slate-800 shadow-xs border-0'
                        : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
                    }`}
                  >
                    GPA Calculator
                  </button>
                </div>

                {activeUtilTab === 'converter' ? (
                  <div className="space-y-3">
                    {/* Selector Tabs */}
                    <div className="grid grid-cols-2 gap-1 bg-slate-200/25 p-0.5 rounded-sm">
                      <button
                        type="button"
                        onClick={() => setConversionMode('gpa5')}
                        className={`py-1 text-[10px] font-bold rounded-xs transition-colors cursor-pointer ${
                          conversionMode === 'gpa5'
                            ? 'bg-white text-slate-800 shadow-xs border-y border-slate-200'
                            : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
                        }`}
                      >
                        GPA 5.0 Scale
                      </button>
                      <button
                        type="button"
                        onClick={() => setConversionMode('marks')}
                        className={`py-1 text-[10px] font-bold rounded-xs transition-colors cursor-pointer ${
                          conversionMode === 'marks'
                            ? 'bg-white text-slate-800 shadow-xs border-y border-slate-200'
                            : 'text-slate-500 hover:text-slate-800 bg-transparent border-0'
                        }`}
                      >
                        Board Marks %
                      </button>
                    </div>

                    {/* Mode Fields */}
                    {conversionMode === 'gpa5' ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                          <span>SSC/HSC GPA (out of 5.0)</span>
                          <span className="font-mono text-slate-700">{numericGpa5.toFixed(2)}</span>
                        </div>
                        <input
                          type="number"
                          min="2.0"
                          max="5.0"
                          step="0.01"
                          value={gpa5Input}
                          onChange={(e) => setGpa5Input(e.target.value)}
                          className="w-full text-xs font-mono py-1.5 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. 5.00"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                          <span>Average HSC/SSC Marks %</span>
                          <span className="font-mono text-slate-700">{numericMarks}%</span>
                        </div>
                        <input
                          type="number"
                          min="33"
                          max="100"
                          step="1"
                          value={marksInput}
                          onChange={(e) => setMarksInput(e.target.value)}
                          className="w-full text-xs font-mono py-1.5 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="e.g. 85"
                        />
                      </div>
                    )}

                    {/* Result Block */}
                    <div className="bg-white border border-slate-200 rounded-sm p-2 flex items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Approx. 4.0 Scale:</span>
                        <span className="font-sans font-extrabold text-[#059669] text-sm">
                          {finalConvertedGpa.toFixed(2)} / 4.0
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyConversion}
                        className="py-1 px-2 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-250 hover:bg-emerald-100 font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider flex items-center gap-1 shrink-0"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Apply
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-normal font-sans italic">
                      *Uses standard conversion guidelines (A+ / 80% = GPA 4.0) common for USA/WES & European evaluations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1 animate-fade-in">
                    <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500 uppercase">
                      <span>Add your university course list:</span>
                      <span className="font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-100 text-[9px]">
                        CGPA Goal: 4.0
                      </span>
                    </div>

                    {/* Scrollable container for subjects */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                      {subjects.map((sub) => (
                        <div key={sub.id} className="flex gap-1 items-center">
                          {/* Subject Code/Name Input */}
                          <input
                            type="text"
                            value={sub.name}
                            onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                            className="flex-1 text-[11px] py-1 px-1.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                            placeholder="Code (e.g. CSE101)"
                          />
                          
                          {/* Credits Selector */}
                          <select
                            value={sub.credits}
                            onChange={(e) => updateSubject(sub.id, 'credits', Number(e.target.value))}
                            className="w-14 text-[11px] py-1 px-0.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-center cursor-pointer"
                            title="Credit Hours"
                          >
                            {[1.0, 1.5, 2.0, 3.0, 4.0, 5.0].map((c) => (
                              <option key={c} value={c}>{c.toFixed(1)}</option>
                            ))}
                          </select>

                          {/* Grade Point Selector */}
                          <select
                            value={sub.gradePoint}
                            onChange={(e) => updateSubject(sub.id, 'gradePoint', Number(e.target.value))}
                            className="w-20 text-[11px] py-1 px-0.5 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono cursor-pointer"
                            title="Subject GPA Score"
                          >
                            <option value="4.0">A+ / A (4.0)</option>
                            <option value="3.75">A- (3.75)</option>
                            <option value="3.5">B+ (3.5)</option>
                            <option value="3.25">B (3.25)</option>
                            <option value="3.0">B- (3.0)</option>
                            <option value="2.75">C+ (2.75)</option>
                            <option value="2.5">C (2.50)</option>
                            <option value="2.25">C- (2.25)</option>
                            <option value="2.0">D (2.00)</option>
                            <option value="0.0">F (0.00)</option>
                          </select>

                          {/* Delete Action */}
                          <button
                            type="button"
                            onClick={() => removeSubject(sub.id)}
                            className="p-1 text-slate-300 hover:text-red-500 rounded-sm hover:bg-slate-100 cursor-pointer transition-all"
                            title="Delete subject"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Utilities controls */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={addSubject}
                        className="py-1 px-2 text-[9px] bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-sm cursor-pointer transition-colors uppercase tracking-wider flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-slate-500" />
                        Add Subject
                      </button>
                      <span className="text-[10px] font-mono text-slate-400">
                        Total Credits: <strong className="text-slate-600 font-bold">{totalCredits.toFixed(1)}</strong>
                      </span>
                    </div>

                    {/* Calculations Presentation & Actions */}
                    <div className="bg-white border border-slate-200 rounded-sm p-2 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Calculated GPA:</span>
                        <span className="font-sans font-extrabold text-[#059669] text-sm">
                          {accumulatedGpa.toFixed(3)} / 4.00
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => updateProfileField('currentCGPA', Number(accumulatedGpa.toFixed(2)))}
                        disabled={totalCredits === 0}
                        className={`py-1 px-2 text-[10px] font-bold rounded-sm uppercase tracking-wider flex items-center gap-1 ${
                          totalCredits > 0
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-250 hover:bg-emerald-100 cursor-pointer transition-colors'
                            : 'bg-slate-50 text-slate-350 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Apply CGPA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* IELTS Score */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-ielts">
              IELTS Score
            </label>
            <select
              id="profile-ielts"
              value={profile.ieltsScore}
              onChange={(e) => updateProfileField('ieltsScore', Number(e.target.value))}
              className="w-full text-xs font-mono py-2 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="0">No IELTS Yet</option>
              {[9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0].map((pt) => (
                <option key={pt} value={pt}>IELTS {pt.toFixed(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-exp">
              Post-Grad Experience
            </label>
            <select
              id="profile-exp"
              value={profile.workExperienceYears}
              onChange={(e) => updateProfileField('workExperienceYears', Number(e.target.value))}
              className="w-full text-xs font-mono py-2 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="0">No Experience</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((yr) => (
                <option key={yr} value={yr}>{yr} {yr === 1 ? 'Year' : 'Years'}</option>
              ))}
              <option value="10">8+ Years</option>
            </select>
          </div>
        </div>

        {/* Field of Study */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-field">
            Major / Interest Area
          </label>
          <input
            id="profile-field"
            type="text"
            placeholder="e.g. Computer Science / Business"
            value={profile.fieldOfStudy}
            onChange={(e) => updateProfileField('fieldOfStudy', e.target.value)}
            className="w-full text-xs py-2 px-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            maxLength={100}
          />
        </div>

        {/* MOI Toggle */}
        <div className="flex items-start gap-2.5 py-1.5">
          <input
            type="checkbox"
            id="profile-moi"
            checked={profile.hasMoi}
            onChange={(e) => updateProfileField('hasMoi', e.target.checked)}
            className="rounded-xs border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5 cursor-pointer accent-emerald-600"
          />
          <div className="leading-tight">
            <label htmlFor="profile-moi" className="text-xs font-bold text-slate-700 cursor-pointer block">
              English MOI Certificate Available
            </label>
            <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
              Certified that my bachelors program in Bangladesh was taught in English.
            </span>
          </div>
        </div>

        {/* Diagnostic Trigger */}
        <button
          type="button"
          onClick={onRunDiagnosticsOfAll}
          className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 uppercase tracking-widest"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Cross-Match All Scholarships
        </button>
      </form>
    </div>
  );
};
