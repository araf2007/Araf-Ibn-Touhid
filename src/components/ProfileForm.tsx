import React, { useState, useEffect } from 'react';
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
import { getCachedToken, loginWithGoogle } from '../firebase.js';

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

  // Sync profile when cloud database updates
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Google Picker Manual Input Link State
  const [manualLinkType, setManualLinkType] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualUrl, setManualUrl] = useState('');

  // Handle Manual Document Linking
  const saveManualLink = (type: string) => {
    if (!manualName.trim() || !manualUrl.trim()) return;
    const newDoc = {
      id: 'manual_' + Date.now(),
      name: manualName,
      url: manualUrl.startsWith('http') ? manualUrl : 'https://' + manualUrl,
      type: type
    };
    const existingDocs = profile.linkedDocuments || [];
    const updatedDocs = [
      ...existingDocs.filter(d => d.type !== type),
      newDoc
    ];
    updateProfileField('linkedDocuments', updatedDocs);
    setManualLinkType(null);
    setManualName('');
    setManualUrl('');
  };

  // Handle Google Drive Picker triggering
  const openGooglePicker = async (documentType: string) => {
    let token = getCachedToken();
    if (!token) {
      try {
        const wantsAuth = window.confirm("Google Authorization is required to securely select files from your Google Drive. Would you like to connect right now?");
        if (!wantsAuth) return;
        const result = await loginWithGoogle();
        token = getCachedToken();
      } catch (err) {
        console.error("Authentication failed:", err);
        return;
      }
    }

    if (!token) {
      alert("Unable to acquire Google OAuth access token. Please retry login.");
      return;
    }

    try {
      const gapi = (window as any).gapi;
      if (!gapi) {
        alert("Google API script has not fully loaded yet. Please wait a second and retry!");
        return;
      }

      gapi.load('picker', {
        callback: () => {
          try {
            const pickerBuilder = new (window as any).google.picker.PickerBuilder();
            const view = new (window as any).google.picker.DocsView((window as any).google.picker.ViewId.DOCS)
              .setMimeTypes("application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document");

            const picker = pickerBuilder
              .addView(view)
              .setOAuthToken(token)
              .setDeveloperKey("AIzaSyC7_iOa7gE4F41NLv8xOUElE-iAfPGseQI") // Same as Firebase Web API Key
              .setCallback((data: any) => {
                if (data.action === (window as any).google.picker.Action.PICKED) {
                  const file = data.docs[0];
                  const newDoc = {
                    id: file.id,
                    name: file.name,
                    url: file.url || `https://drive.google.com/file/d/${file.id}/view`,
                    type: documentType,
                  };

                  const existingDocs = profile.linkedDocuments || [];
                  const updatedDocs = [
                    ...existingDocs.filter(d => d.type !== documentType),
                    newDoc
                  ];
                  updateProfileField('linkedDocuments', updatedDocs);
                }
              })
              .build();

            picker.setVisible(true);
          } catch (pickerErr) {
            console.error("Error creating Google Picker:", pickerErr);
            alert("Unable to open dynamic Picker overlay. It might be due to development iFrame origin rules. Please use the 'Or manually' option to input your Google Drive file URL!");
          }
        }
      });
    } catch (err) {
      console.error("Picker error:", err);
      alert("Unable to open Google Picker. Recommended: Use the manual Google Drive link fallback!");
    }
  };

  // Remove / Disconnect documents from profile (Mutating Operation!)
  const handleRemoveDocument = (type: string) => {
    const confirmed = window.confirm(`Are you sure you want to decouple the "${type}" document from your active scholarship profile?`);
    if (!confirmed) return;

    const existingDocs = profile.linkedDocuments || [];
    const updatedDocs = existingDocs.filter(d => d.type !== type);
    updateProfileField('linkedDocuments', updatedDocs);
  };

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

        {/* Standard Academic Entrance Scores (IELTS, SAT, Experience) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-ielts">
              IELTS Score
            </label>
            <select
              id="profile-ielts"
              value={profile.ieltsScore}
              onChange={(e) => updateProfileField('ieltsScore', Number(e.target.value))}
              className="w-full text-xs font-mono py-2 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="0">No IELTS Yet</option>
              {[9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0].map((pt) => (
                <option key={pt} value={pt}>IELTS {pt.toFixed(1)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-sat">
                SAT Score
              </label>
              {profile.degreeLevel === 'Bachelor' && (
                <span className="text-[8px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 border border-emerald-100 rounded-none tracking-wider uppercase">Focus</span>
              )}
            </div>
            <div className="relative flex items-center">
              <input
                id="profile-sat"
                type="number"
                min="400"
                max="1600"
                step="10"
                placeholder="e.g. 1450"
                value={profile.satScore || ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Math.min(1600, Math.max(0, Number(e.target.value)));
                  updateProfileField('satScore', val);
                }}
                className="w-full text-xs font-mono py-2 pl-3 pr-10 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {profile.satScore ? (
                <button
                  type="button"
                  onClick={() => updateProfileField('satScore', 0)}
                  className="absolute right-2 px-1 text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase font-mono cursor-pointer border-none bg-transparent"
                  title="Clear SAT"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block uppercase tracking-wider" htmlFor="profile-exp">
              Post-Grad Experience
            </label>
            <select
              id="profile-exp"
              value={profile.workExperienceYears}
              onChange={(e) => updateProfileField('workExperienceYears', Number(e.target.value))}
              className="w-full text-xs font-mono py-2 px-2 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
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

        {/* Linked Documents (Google Drive Picker) */}
        <div className="pt-4 border-t border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              📁 Academic Files (Google Drive)
            </label>
            <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-100 rounded-sm uppercase font-bold">Drive Picker</span>
          </div>
          <p className="text-[10.5px] text-slate-450 leading-relaxed font-sans">
            Reference items from your Google Drive in customized inquiries using the Gmail composer.
          </p>

          <div className="space-y-2">
            {(['CV / Resume', 'Academic Transcript', 'Statement of Purpose'] as const).map((docType) => {
              const file = (profile.linkedDocuments || []).find(d => d.type === docType);
              return (
                <div key={docType} className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-750">{docType}</span>
                    {file ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#059669] font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm">
                          Connected
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(docType)}
                          className="text-[9px] font-bold text-red-600 hover:text-white hover:bg-red-600 px-2 py-0.5 rounded-sm border border-slate-250 hover:border-red-600 transition-colors cursor-pointer"
                        >
                          De-link
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openGooglePicker(docType)}
                          className="py-1 px-2.5 text-[10px] font-bold bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-100/50 text-slate-700 rounded-sm cursor-pointer transition-colors"
                        >
                          Pick File
                        </button>
                        <button
                          type="button"
                          onClick={() => setManualLinkType(manualLinkType === docType ? null : docType)}
                          className="text-[10px] text-slate-450 hover:text-slate-800 underline decor-dotted cursor-pointer"
                        >
                          Manual Link
                        </button>
                      </div>
                    )}
                  </div>

                  {file && (
                    <div className="flex items-center justify-between text-xs bg-white border border-slate-150 p-2.5 rounded-sm shadow-2xs font-sans">
                      <div className="flex items-center gap-1.5 overflow-hidden pr-2">
                        <span className="text-slate-500 text-sm shrink-0">📄</span>
                        <span className="font-bold text-slate-750 truncate" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#047857] hover:text-[#064e3b] font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100/60 px-2 py-1 rounded-sm flex items-center gap-0.5 shrink-0"
                      >
                        View Drive
                      </a>
                    </div>
                  )}

                  {manualLinkType === docType && (
                    <div className="border border-slate-200 border-dashed rounded-sm bg-white p-3 space-y-2.5 text-xs font-sans">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Filename / Label:</span>
                        <input
                          type="text"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-250 rounded-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                          placeholder="e.g. CV_Arafat_Standard.pdf"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide">Google Drive Link:</span>
                        <input
                          type="text"
                          value={manualUrl}
                          onChange={(e) => setManualUrl(e.target.value)}
                          className="w-full text-xs py-1.5 px-2 bg-slate-50 border border-slate-250 rounded-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                          placeholder="e.g. drive.google.com/file/d/..."
                        />
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setManualLinkType(null)}
                          className="py-1 px-2.5 text-[10px] text-slate-500 font-semibold border hover:bg-slate-50 rounded-sm cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveManualLink(docType)}
                          className="py-1 px-2.5 text-[10px] bg-slate-900 text-emerald-400 hover:text-emerald-300 font-bold border border-slate-900 rounded-sm cursor-pointer"
                        >
                          Link Document
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
