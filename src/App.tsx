import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Scholarship, UserProfile } from './types.js';
import { scholarships } from './scholarshipsData.js';
import { ScholarshipCard } from './components/ScholarshipCard.js';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal.js';
import { ProfileForm } from './components/ProfileForm.js';
import { AIEligibilityReport } from './components/AIEligibilityReport.js';
import { ScholarshipAdvisorChat } from './components/ScholarshipAdvisorChat.js';
import { TimelineMilestones } from './components/TimelineMilestones.js';
import { BangladeshiResourceGuide } from './components/BangladeshiResourceGuide.js';
import { 
  GraduationCap, 
  Search, 
  Sparkles, 
  Cpu, 
  Award, 
  SlidersHorizontal, 
  CheckCircle,
  Clock,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  auth, 
  loginWithGoogle, 
  logout, 
  fetchUserProfile, 
  saveUserProfile, 
  fetchUserBookmarks, 
  addBookmark, 
  removeBookmark 
} from './firebase.js';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Data State
  const [allScholarships] = useState<Scholarship[]>(scholarships);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>(scholarships);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadlineSoonest'>('recommended');
  
  // Active User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    degreeLevel: 'Master',
    currentCGPA: 3.25,
    ieltsScore: 6.5,
    workExperienceYears: 2,
    fieldOfStudy: 'Computer Science',
    hasMoi: true,
  });

  // Firebase Auth and Storage states
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [bookmarkedScholarshipIds, setBookmarkedScholarshipIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Active Context & AI states
  const [focusedScholarship, setFocusedScholarship] = useState<Scholarship | null>(null);
  const [modalScholarship, setModalScholarship] = useState<Scholarship | null>(null);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'diagnostics' | 'advisor'>('listings');

  // Synchronize Auth & Profile Lifecycle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
      
      if (currentUser) {
        try {
          // Fetch synced profile
          const cloudProfile = await fetchUserProfile(currentUser.uid);
          if (cloudProfile) {
            setUserProfile(cloudProfile);
          } else {
            // Unsaved profile setup: upload current profile config
            await saveUserProfile(currentUser.uid, userProfile);
          }
          
          // Fetch synced bookmarks
          const bookmarks = await fetchUserBookmarks(currentUser.uid);
          setBookmarkedScholarshipIds(bookmarks);
        } catch (error) {
          console.error("Cloud hydration error:", error);
        }
      } else {
        setBookmarkedScholarshipIds([]);
      }
    });
    
    return () => unsubscribe();
  }, [userProfile]);

  // Sync edited Profile state
  const handleProfileChange = async (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    if (user) {
      setSaveStatus('saving');
      try {
        await saveUserProfile(user.uid, updatedProfile);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } catch (err) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }
  };

  // Toggle bookmark operations in Firebase
  const handleToggleBookmark = async (scholarshipId: string) => {
    if (!user) {
      alert("Please authenticate using Google Sign-In in the header area to bookmark this scholarship!");
      return;
    }
    
    const isAlreadyBookmarked = bookmarkedScholarshipIds.includes(scholarshipId);
    if (isAlreadyBookmarked) {
      setBookmarkedScholarshipIds(prev => prev.filter(id => id !== scholarshipId));
      try {
        await removeBookmark(user.uid, scholarshipId);
      } catch (err) {
        setBookmarkedScholarshipIds(prev => [...prev, scholarshipId]);
        console.error("Failed to remove bookmark:", err);
      }
    } else {
      setBookmarkedScholarshipIds(prev => [...prev, scholarshipId]);
      try {
        await addBookmark(user.uid, scholarshipId);
      } catch (err) {
        setBookmarkedScholarshipIds(prev => prev.filter(id => id !== scholarshipId));
        console.error("Failed to add bookmark:", err);
      }
    }
  };

  // Trigger Filtering and Sorting
  useEffect(() => {
    let result = [...allScholarships];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.popularMajors.some(m => m.toLowerCase().includes(query))
      );
    }

    if (selectedCountry !== 'All') {
      result = result.filter(s => s.country === selectedCountry);
    }

    if (selectedDegree !== 'All') {
      result = result.filter(s => s.degreeLevels.includes(selectedDegree as any));
    }

    // Apply Sorting: Deadline Soonest (relative urgency based on current date May 2026)
    if (sortBy === 'deadlineSoonest') {
      const DEADLINE_MAP: Record<string, { month: number; day: number }> = {
        chevening: { month: 11, day: 1 },
        'commonwealth-shared': { month: 12, day: 1 },
        'daad-epos': { month: 8, day: 1 },
        mext: { month: 5, day: 15 },
        erasmus: { month: 1, day: 15 },
        fulbright: { month: 6, day: 1 },
        'stipendium-hungaricum': { month: 1, day: 15 },
        'turkiye-burslari': { month: 2, day: 20 },
        gks: { month: 2, day: 1 },
        'australia-awards': { month: 4, day: 30 },
        'csc-china': { month: 2, day: 1 }
      };

      const getMonthsUntilDeadline = (id: string): number => {
        const dl = DEADLINE_MAP[id];
        if (!dl) return 999;
        
        const currentMonth = 5; // May
        const currentDay = 21;  // 21st
        
        let monthDiff = dl.month - currentMonth;
        let dayDiff = (dl.day - currentDay) / 30;
        
        let totalDiff = monthDiff + dayDiff;
        if (totalDiff < 0) {
          totalDiff += 12; // wraps around to next year's cycle
        }
        return totalDiff;
      };

      result.sort((a, b) => getMonthsUntilDeadline(a.id) - getMonthsUntilDeadline(b.id));
    }

    setFilteredScholarships(result);
  }, [searchQuery, selectedCountry, selectedDegree, sortBy, allScholarships]);

  // Run Real-Time AI Diagnostics
  const handleRunAiDiagnostics = async (scholarship: Scholarship) => {
    setFocusedScholarship(scholarship);
    setActiveTab('diagnostics');
    setIsLoadingReport(true);
    setReportMarkdown(null);

    // Scroll diagnostics panel into focus if on mobile
    const reportElem = document.getElementById('diagnostics-scroll-anchor');
    if (reportElem) {
      reportElem.scrollIntoView({ behavior: 'smooth' });
    }

    try {
      const res = await fetch('/api/gemini/profile-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: userProfile,
          scholarship: scholarship,
        }),
      });

      if (!res.ok) {
        throw new Error('Failure conducting profile diagnostics. Please retry.');
      }

      const data = await res.json();
      setReportMarkdown(data.analysis || 'No detailed analysis produced by the advisor.');
    } catch (err: any) {
      console.error(err);
      setReportMarkdown(`### ⚠️ Critical Diagnostics Failure
We faced an issue contacting the AI processing servers. 
- Error details: "${err.message}"

*Please verify that your Express development port is responsive or retry the audit.*`);
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Cross-Match Profile Against All (Heuristic Selection helper)
  const handleCrossMatchDiagnostics = () => {
    // Find the single best matching scholarship based on user parameters to activate diagnostic report
    const bestMatch = filteredScholarships.find(s => 
      userProfile.currentCGPA >= s.cgpaRequirement && 
      userProfile.ieltsScore >= s.ieltsRequirement
    ) || filteredScholarships[0];

    if (bestMatch) {
      handleRunAiDiagnostics(bestMatch);
    }
  };

  // Unique list of countries for filters
  const countries = ['All', ...Array.from(new Set(allScholarships.map(s => s.country)))];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-850 antialiased" id="root-app-layout">
      
      {/* Dynamic Floating Notification */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4 border-b border-slate-850" id="announcement-banner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 bg-emerald-400 h-2 rounded-xs animate-pulse" />
            <span className="font-bold text-slate-300 uppercase tracking-widest text-[9px]">Bangladeshi Cadet Intake Tracker (Updated for May 2026 cycles)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[10px]">
            <span>BD Local Time: {new Date().toLocaleDateString('en-GB')}</span>
            <span>📍 Active in Dhaka</span>
          </div>
        </div>
      </div>

      {/* Primary Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center border border-slate-850 rotate-45 rounded-sm shrink-0">
              <GraduationCap className="w-5 h-5 text-emerald-400 -rotate-45" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-slate-900 tracking-tight leading-none mb-0.5 uppercase">
                ScholarBD
              </h1>
              <p className="text-[9px] uppercase font-mono tracking-widest text-[#059669] font-bold">
                Bangladesh Scholarship Hub
              </p>
            </div>
          </div>

          {/* Sub Header / Auth Action */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('advisor')}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-sm border border-slate-800 cursor-pointer uppercase tracking-wider font-sans"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Consult AI Advisor</span>
            </button>

            {isAuthLoading ? (
              <div className="text-[11px] text-slate-400 font-mono animate-pulse uppercase select-none tracking-widest pl-2">Syncing Cloud...</div>
            ) : user ? (
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 pl-3 pr-2 py-1.5 rounded-sm">
                <div className="hidden sm:block text-right">
                  <p className="text-[11px] font-bold text-slate-850 truncate max-w-28 leading-tight">{user.displayName || 'Authorized User'}</p>
                  <p className="text-[9px] text-emerald-600 font-bold font-mono tracking-wider leading-none">Cloud Synced</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-300 shadow-2xs" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 bg-slate-800 text-white flex items-center justify-center rounded-full text-xs font-bold font-mono">
                    {user.email?.slice(0, 2).toUpperCase() || 'US'}
                  </div>
                )}
                <button 
                  onClick={() => logout()}
                  className="text-[9px] uppercase tracking-wider text-red-600 hover:text-white hover:bg-red-600 border border-slate-200 px-1.5 py-1 rounded-sm cursor-pointer transition-colors font-bold font-mono"
                  title="Sign out from database session"
                >
                  Exit
                </button>
              </div>
            ) : (
              <button 
                onClick={() => loginWithGoogle()}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 text-xs font-bold rounded-sm border border-slate-850 cursor-pointer uppercase tracking-wider font-sans transition-all shadow-sm"
              >
                <span>Google Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="application-body-view">
        
        {/* Top Feature Jumbotron */}
        <div className="bg-slate-900 border border-slate-850 rounded-sm p-6 md:p-10 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none">
            <GraduationCap className="w-96 h-96" />
          </div>
          
          <div className="relative max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-sm text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Fully Vetted Schemes for 2026/2027 In-takes
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight leading-snug uppercase text-[#daabab]">
              Fully Funded Overseas Scholarships for Bangladeshi Students
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-sans font-normal">
              Enter your CGPA and IELTS credentials to instantly diagnose your profile matches against major sovereign programs including **Chevening (UK), DAAD (Germany), MEXT (Japan), and Erasmus+ (EU)**.
            </p>
          </div>
        </div>

        {/* Dashboard Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Academic Profiler & Static Timelines (4 Cols) */}
          <div className="space-y-8 lg:col-span-4 self-start">
            
            <div className="space-y-2">
              <ProfileForm 
                initialProfile={userProfile}
                onProfileChange={handleProfileChange}
                onRunDiagnosticsOfAll={handleCrossMatchDiagnostics}
              />
              {user && (
                <div className="flex items-center justify-between text-[11px] px-3.5 py-2 bg-white border border-slate-200 rounded-sm font-sans shadow-2xs animate-fade-in">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    <span className="font-bold uppercase tracking-wider text-[9px]">Cloud Status</span>
                  </div>
                  {saveStatus === 'saving' && <span className="text-amber-600 font-mono font-bold animate-pulse text-[10px]">Uploading updates...</span>}
                  {saveStatus === 'saved' && <span className="text-emerald-600 font-mono font-extrabold text-[10px] uppercase tracking-wide">✓ Synced successfully</span>}
                  {saveStatus === 'error' && <span className="text-red-600 font-mono font-bold animate-pulse text-[10px]">⚠ Sync failed</span>}
                  {saveStatus === 'idle' && <span className="text-slate-400 font-mono text-[9px]">Verified in Firestore DB</span>}
                </div>
              )}
            </div>

            <TimelineMilestones />

            <BangladeshiResourceGuide />

          </div>

          {/* Right Column: Search panel, Results & Advisor console (8 Cols) */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* Control Navigation Tabs */}
            <div className="flex border border-slate-200 bg-white p-1 rounded-sm shadow-xs" id="primary-tabs">
              {(['listings', 'diagnostics', 'advisor'] as const).map((tab) => {
                const labelMap = {
                  listings: '🔍 Scholarship Catalog',
                  diagnostics: focusedScholarship 
                    ? `📊 Match: ${focusedScholarship.title.split(' ')[0]}` 
                    : '📊 AI Diagnostics Report',
                  advisor: '💬 AI ScholarsBot Advisor'
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 text-center py-2.5 px-4 text-[10px] font-bold rounded-sm transition-colors cursor-pointer uppercase tracking-wider ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-650 hover:text-slate-930 hover:bg-slate-50'
                    }`}
                  >
                    {labelMap[tab]}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: LISTINGS CATALOG */}
            {activeTab === 'listings' && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Search & Filter bar design */}
                <div className="bg-white border border-slate-200 rounded-sm p-5 space-y-4">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Search scholarships (e.g. MEXT, Germany, robotics, public policy)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs py-3.5 pl-10 pr-4 bg-slate-50 hover:bg-slate-100/30 focus:bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-sm transition-colors"
                      id="scholarship-search-text"
                    />
                  </div>

                  {/* Dropdown selectors */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Destination Host:</span>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-sm focus:outline-none cursor-pointer"
                      >
                        {countries.map(c => (
                          <option key={c} value={c}>{c === 'All' ? '🌐 All Countries' : c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Academic Degree:</span>
                      <select
                        value={selectedDegree}
                        onChange={(e) => setSelectedDegree(e.target.value)}
                        className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-sm focus:outline-none cursor-pointer"
                      >
                        <option value="All">🎓 All Degrees Available</option>
                        <option value="Bachelor">Bachelor Candidates</option>
                        <option value="Master">Master Candidates</option>
                        <option value="PhD">PhD Candidates</option>
                      </select>
                    </div>

                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Order / Prioritize:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-sm focus:outline-none cursor-pointer font-sans"
                        id="scholarship-sort-selector"
                      >
                        <option value="recommended">🌟 Recommended / Match</option>
                        <option value="deadlineSoonest">⏰ Deadline (Soonest First)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Grid Results */}
                {filteredScholarships.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="scholarships-grid-results">
                    {filteredScholarships.map((sch) => (
                      <ScholarshipCard 
                        key={sch.id}
                        scholarship={sch}
                        onSelect={(s) => setModalScholarship(s)}
                        onCheckEligibility={(s) => handleRunAiDiagnostics(sch)}
                        userProfile={userProfile}
                        isBookmarked={bookmarkedScholarshipIds.includes(sch.id)}
                        onToggleBookmark={handleToggleBookmark}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-sm p-12 text-center text-slate-500 space-y-2">
                    <p className="font-display font-medium text-slate-800">Your query returned zero matches.</p>
                    <p className="text-xs">Adjust filters or search parameters. Mined database houses all major packages.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: AI DIAGNOSTICS */}
            {activeTab === 'diagnostics' && (
              <div className="animate-fade-in-up" id="diagnostics-scroll-anchor">
                {focusedScholarship ? (
                  <AIEligibilityReport 
                    scholarship={focusedScholarship}
                    userProfile={userProfile}
                    reportMarkdown={reportMarkdown}
                    isLoading={isLoadingReport}
                    onRefresh={() => handleRunAiDiagnostics(focusedScholarship)}
                  />
                ) : (
                  <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-3">
                    <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
                    <div>
                      <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Diagnostics Sandbox Empty</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                        Go to the **Scholarship Catalog** tab, find a program of interest, and click **&quot;AI Match Diagnostics&quot;** to auto-generate a tailored, strategic report!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: INTERACTIVE CHAT */}
            {activeTab === 'advisor' && (
              <div className="animate-fade-in-up">
                <ScholarshipAdvisorChat 
                  selectedScholarship={focusedScholarship}
                  userProfile={userProfile}
                />
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Detail Viewer Modal */}
      {modalScholarship && (
        <ScholarshipDetailModal 
          scholarship={modalScholarship}
          onClose={() => setModalScholarship(null)}
          onCheckEligibilityInModal={(s) => {
            setModalScholarship(null);
            handleRunAiDiagnostics(s);
          }}
        />
      )}

      {/* Clean Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 mt-16 text-center" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 text-xs text-slate-400 space-y-2.5 font-sans">
          <p className="font-mono font-bold text-slate-500 uppercase tracking-widest text-[9px]">ScholarBD — Vetted opportunities for Bangladeshi Scholars abroad.</p>
          <div className="flex justify-center gap-6 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
            <a href="https://shed.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#0a5c40] transition-colors inline-flex items-center gap-1 font-mono">
              Ministry Circular Portal <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://mofa.gov.bd" target="_blank" rel="noopener noreferrer" className="hover:text-[#0a5c40] transition-colors inline-flex items-center gap-1 font-mono">
              MoFA Dhaka Services <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-relaxed">Disclaimer: Application cycles, stipend quotas, and policies depend strictly on government bilateral guidelines. Verify latest targets directly from primary board circulars.</p>
        </div>
      </footer>

      <Analytics />
    </div>
  );
}
