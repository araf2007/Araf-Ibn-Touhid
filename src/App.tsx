import React, { useState, useEffect } from 'react';
import { Scholarship, UserProfile } from './types.js';
import { scholarships } from './scholarshipsData.js';
import { SCHOLARSHIP_MONETARY_VALUES } from './scholarshipFundingData.js';
import { ScholarshipCard } from './components/ScholarshipCard.js';
import { ScholarshipDetailModal } from './components/ScholarshipDetailModal.js';
import { ProfileForm } from './components/ProfileForm.js';
import { AIEligibilityReport } from './components/AIEligibilityReport.js';
import { ScholarshipAdvisorChat } from './components/ScholarshipAdvisorChat.js';
import { BangladeshiResourceGuide } from './components/BangladeshiResourceGuide.js';
import { BkashPaymentModal } from './components/BkashPaymentModal.js';
import { PlanComparisonSection } from './components/PlanComparisonSection.js';
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
  BookOpen,
  Mail,
  MessageSquare,
  Lock,
  User as UserIcon,
  ShieldAlert,
  X
} from 'lucide-react';
import { 
  auth, 
  loginWithGoogle, 
  loginWithEmail,
  registerWithEmail,
  logout, 
  fetchUserProfile, 
  saveUserProfile, 
  fetchUserBookmarks, 
  addBookmark, 
  removeBookmark,
  fetchUserPayments,
  checkPaymentStatus,
  savePaymentRecord
} from './firebase.js';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  // Data State
  const [allScholarships] = useState<Scholarship[]>(() => 
    scholarships.map(s => ({
      ...s,
      monetaryValue: SCHOLARSHIP_MONETARY_VALUES[s.id] || 0
    }))
  );
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>(() => 
    scholarships.map(s => ({
      ...s,
      monetaryValue: SCHOLARSHIP_MONETARY_VALUES[s.id] || 0
    }))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedDegree, setSelectedDegree] = useState('All');
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [selectedFundingAmount, setSelectedFundingAmount] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'deadlineSoonest' | 'fundingHighToLow' | 'fundingLowToHigh'>('recommended');
  
  // Active User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    degreeLevel: 'Master',
    currentCGPA: 3.25,
    ieltsScore: 6.5,
    workExperienceYears: 2,
    fieldOfStudy: 'Computer Science',
    hasMoi: true,
    satScore: 0,
  });

  // Firebase Auth and Storage states
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [bookmarkedScholarshipIds, setBookmarkedScholarshipIds] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Email Auth Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Unlocked Diagnostics Payments
  const [unlockedScholarshipIds, setUnlockedScholarshipIds] = useState<string[]>([]);
  const [isGlobalUnlocked, setIsGlobalUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('unlocked_ai_global') === 'true';
  });
  const [pendingPaymentScholarship, setPendingPaymentScholarship] = useState<Scholarship | null>(null);

  // Email / Google Auth Handlers
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);
    if (!authEmail.trim() || !authPassword) {
      setAuthError("Please fill out all required fields.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await loginWithEmail(authEmail, authPassword);
        setAuthSuccessMsg("Logged in successfully!");
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 1000);
      } else {
        if (!authDisplayName.trim()) {
          setAuthError("Full Name is required for registration.");
          setAuthSubmitting(false);
          return;
        }
        await registerWithEmail(authEmail, authPassword, authDisplayName);
        setAuthSuccessMsg("Account registered successfully and logged in!");
        setTimeout(() => {
          setIsAuthModalOpen(false);
        }, 1500);
      }
    } catch (err: any) {
      console.error("Auth submit error:", err);
      let msg = err.message || String(err);
      if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password")) {
        msg = "Invalid email or password. Please verify your credentials.";
      } else if (msg.includes("auth/email-already-in-use")) {
        msg = "This email is already registered. Try signing in instead.";
      } else if (msg.includes("auth/weak-password")) {
        msg = "Password is too weak. It should be at least 6 characters.";
      } else if (msg.includes("auth/invalid-email")) {
        msg = "Please enter a valid email address.";
      } else if (msg.includes("auth/user-not-found")) {
        msg = "No account found with this email. Please register first.";
      } else if (msg.includes("auth/operation-not-allowed")) {
        msg = "Email/Password sign-in is not enabled in Firebase Console yet. Please refer to directions on how to enable it!";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setAuthSuccessMsg(null);
    setAuthSubmitting(true);
    try {
      await loginWithGoogle();
      setAuthSuccessMsg("Authorized successfully!");
      setTimeout(() => {
        setIsAuthModalOpen(false);
      }, 1000);
    } catch (err: any) {
      console.error("Google auth error:", err);
      let msg = err.message || String(err);
      if (msg.includes("auth/popup-blocked")) {
        msg = "The sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (msg.includes("access_denied") || msg.includes("restricted") || msg.includes("verification")) {
        msg = "Google access is restricted in this environment. Please register/sign in with your Email & Password below instantly!";
      }
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Active Context & AI states
  const [focusedScholarship, setFocusedScholarship] = useState<Scholarship | null>(null);
  const [modalScholarship, setModalScholarship] = useState<Scholarship | null>(null);
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'listings' | 'diagnostics' | 'advisor'>('listings');

  // Listen for manual bKash/Nagad automated callback parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    const trxId = params.get('trxId');
    const scholarshipId = params.get('scholarshipId');

    if (status === 'success' && trxId) {
      console.log(`[bKash Manual Feedback] Payment successful. Trx ID: ${trxId}`);
      setIsGlobalUnlocked(true);
      localStorage.setItem('unlocked_ai_global', 'true');
      
      const targetId = scholarshipId || 'global_ai_unlock';
      setUnlockedScholarshipIds(prev => Array.from(new Set([...prev, 'global_ai_unlock', targetId])));
      
      // If user is authenticated, sync to cloud database
      if (user) {
        savePaymentRecord(user.uid, targetId, trxId)
          .then(() => console.log('[Cloud Sync] Synced payment callback to firestore.'))
          .catch((dbErr) => console.error('[Cloud Sync Error] Failed to upload callback payment record:', dbErr));
      }

      // Record locally for backward compatibility
      const localPayments = JSON.parse(localStorage.getItem('unlocked_diagnostics') || '{}');
      localPayments[targetId] = {
        timestamp: Date.now(),
        gateway: 'BkashAutomatedWebhook',
        trxId: trxId,
      };
      localStorage.setItem('unlocked_diagnostics', JSON.stringify(localPayments));

      // Clear query params elegantly without causing page refresh
      const freshUrl = window.location.pathname;
      window.history.replaceState({}, document.title, freshUrl);

      // Secure payment alert toast
      alert(`🎉 Payment Verified!\n\nTransaction ID ${trxId} was cleared successfully. ScholarsBot Unlimited Pro capabilities have been globally unlocked on your profile.`);
    } else if (status === 'cancel') {
      alert('ℹ️ bKash checkout was canceled.');
      // Clear query params elegantly
      const freshUrl = window.location.pathname;
      window.history.replaceState({}, document.title, freshUrl);
    }
  }, [user]);

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

          // Fetch unlocked/paid diagnostics
          const payments = await fetchUserPayments(currentUser.uid);
          const localPayments = JSON.parse(localStorage.getItem('unlocked_diagnostics') || '{}');
          const localKeys = Object.keys(localPayments);
          const combined = Array.from(new Set([...payments, ...localKeys]));
          setUnlockedScholarshipIds(combined);

          if (payments.includes('global_ai_unlock') || localStorage.getItem('unlocked_ai_global') === 'true') {
            setIsGlobalUnlocked(true);
            localStorage.setItem('unlocked_ai_global', 'true');
          }
        } catch (error) {
          console.error("Cloud hydration error:", error);
        }
      } else {
        setBookmarkedScholarshipIds([]);
        const localPayments = JSON.parse(localStorage.getItem('unlocked_diagnostics') || '{}');
        setUnlockedScholarshipIds(Object.keys(localPayments));
        setIsGlobalUnlocked(localStorage.getItem('unlocked_ai_global') === 'true');
      }
    });
    
    return () => unsubscribe();
  }, [userProfile]);

  // ----------------------------------------------------
  // Dynamic IP-Based Manual Approval Checker
  // ----------------------------------------------------
  useEffect(() => {
    const checkIpBypass = async () => {
      try {
        const queryParam = user ? `?userId=${user.uid}` : '';
        const res = await fetch(`/api/payment/status${queryParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.hasApprovedAccess) {
            console.log(`[IP Checker] Approved manual payment found! Granting lifetime Pro access.`);
            setIsGlobalUnlocked(true);
            localStorage.setItem('unlocked_ai_global', 'true');
          }
        }
      } catch (err) {
        console.warn('[IP Checker] Scanning backend status... (Server may be starting or temporarily unreachable)');
      }
    };

    checkIpBypass();
    // Run interval status sync check every 10 seconds to respond immediately when Admin click 'Approve'
    const interval = setInterval(checkIpBypass, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // ----------------------------------------------------
  // Dynamic Local Reminder Notification Background Checker Hook
  // ----------------------------------------------------
  useEffect(() => {
    const checkScheduledLocalReminders = () => {
      try {
        const rawReminders = localStorage.getItem('scholarbd_reminders');
        if (!rawReminders) return;

        const reminders = JSON.parse(rawReminders);
        if (!Array.isArray(reminders) || reminders.length === 0) return;

        const now = new Date();
        let changed = false;

        const updatedReminders = reminders.map((rem: any) => {
          // If already fired or not browser channel, skip
          if (rem.channel !== 'browser' || rem.fired) return rem;

          // Convert target date/time strings to local Date object
          const scheduledTime = new Date(`${rem.date}T${rem.time}`);
          
          if (now >= scheduledTime) {
            // Trigger browser notification alert
            if (Notification.permission === 'granted') {
              try {
                new Notification("ScholarBD Deadline Alert! 🎓", {
                  body: `${rem.title}\nTime Scheduled: ${rem.date} @ ${rem.time}`,
                  tag: rem.id,
                  requireInteraction: true
                });
              } catch (notifyErr) {
                // Fallback for custom browsers/restricted iframe environments
                alert(`🔔 ScholarBD Deadline Reminder!\n\n${rem.title}\nScheduled Time: ${rem.date} @ ${rem.time}`);
              }
            } else {
              // Fallback if browser permission is blocked/not granted yet
              alert(`🔔 ScholarBD Deadline Reminder!\n\n${rem.title}\nScheduled Time: ${rem.date} @ ${rem.time}`);
            }
            changed = true;
            return { ...rem, fired: true };
          }
          return rem;
        });

        if (changed) {
          localStorage.setItem('scholarbd_reminders', JSON.stringify(updatedReminders));
        }
      } catch (err) {
        console.error('[Reminder Checker Error]:', err);
      }
    };

    // Run custom reminder checkout interval loop every 15 seconds
    const intervalId = setInterval(checkScheduledLocalReminders, 15000);
    // Execute a quick scan on boot up as well
    checkScheduledLocalReminders();

    return () => clearInterval(intervalId);
  }, []);

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

    if (selectedMajor) {
      result = result.filter(s => s.popularMajors.includes(selectedMajor));
    }

    if (selectedFundingAmount !== 'All') {
      if (selectedFundingAmount === 'Elite') {
        result = result.filter(s => (s.monetaryValue || 0) >= 80000);
      } else if (selectedFundingAmount === 'High') {
        result = result.filter(s => (s.monetaryValue || 0) >= 50000);
      } else if (selectedFundingAmount === 'Mid') {
        result = result.filter(s => (s.monetaryValue || 0) >= 25000);
      } else if (selectedFundingAmount === 'Regular') {
        result = result.filter(s => (s.monetaryValue || 0) < 25000);
      }
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
        'csc-china': { month: 2, day: 1 },
        'saudi-government': { month: 12, day: 15 },
        'russian-government': { month: 12, day: 31 },
        'iccr-scholarship': { month: 4, day: 15 },
        singa: { month: 6, day: 1 },
        'swedish-institute': { month: 2, day: 15 },
        'gates-cambridge': { month: 10, day: 15 },
        'swiss-government': { month: 11, day: 15 },
        'pearson-toronto': { month: 11, day: 30 },
        'brunei-government': { month: 2, day: 15 },
        'romanian-government': { month: 3, day: 15 },
        'taiwan-icdf': { month: 3, day: 15 },
        'italy-regional-calabria': { month: 5, day: 15 },
        'ait-thai-government': { month: 2, day: 28 }
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
    } else if (sortBy === 'fundingHighToLow') {
      result.sort((a, b) => (b.monetaryValue || 0) - (a.monetaryValue || 0));
    } else if (sortBy === 'fundingLowToHigh') {
      result.sort((a, b) => (a.monetaryValue || 0) - (b.monetaryValue || 0));
    }

    setFilteredScholarships(result);
    setCurrentPage(1);
  }, [searchQuery, selectedCountry, selectedDegree, selectedMajor, selectedFundingAmount, sortBy, allScholarships]);

  // Paginated Slicing calculation
  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const paginatedScholarships = filteredScholarships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Run Real-Time AI Diagnostics
  const handleRunAiDiagnostics = async (scholarship: Scholarship) => {
    // Guard: Verify bKash payment clearance before running AI Diagnostics
    const localPayments = JSON.parse(localStorage.getItem('unlocked_diagnostics') || '{}');
    const isUnlockedLocally = !!localPayments[scholarship.id];
    const isUnlockedCloud = unlockedScholarshipIds.includes(scholarship.id);

    if (!isGlobalUnlocked && !isUnlockedLocally && !isUnlockedCloud) {
      setPendingPaymentScholarship(scholarship);
      return;
    }

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

  const triggerGlobalAiUnlock = () => {
    const dummyScholarship: Scholarship = {
      id: 'global_ai_unlock',
      title: 'ScholarsBot AI Advisor Pro',
      country: 'Global',
      flag: '🌐',
      fundingType: 'Fully Funded',
      degreeLevels: ['Bachelor', 'Master', 'PhD'],
      ieltsRequirement: 0,
      cgpaRequirement: 0,
      deadline: 'Dec 2026',
      description: 'Unlocks all AI diagnostic tools and interactive academic consultant permanently.',
      benefits: ['Unlimited chats', 'SOP constructors', 'Paper verification route maps'],
      eligibilityDetails: ['Verify transaction with automated bKash/Nagad SMS match.'],
      applicationFee: '100 BDT',
      applicationSteps: [],
      tipsForBangladeshis: [],
      officialLink: 'https://bdscholars.unaux.com/payment-link/523284229087900125600758553',
      popularMajors: [],
      timelineStrategy: []
    };
    setPendingPaymentScholarship(dummyScholarship);
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
            <div className="flex items-center gap-2.5">
              <div>
                <h1 className="font-display font-black text-lg text-slate-900 tracking-tight leading-none mb-0.5 uppercase">
                  ScholarBD
                </h1>
                <p className="text-[9px] uppercase font-mono tracking-widest text-[#059669] font-bold">
                  Bangladesh Scholarship Hub
                </p>
              </div>
              {isGlobalUnlocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-sm text-[9px] font-black uppercase tracking-wider animate-pulse shrink-0 font-sans select-none">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>AI PRO</span>
                </span>
              )}
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
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setAuthEmail('');
                  setAuthPassword('');
                  setAuthDisplayName('');
                  setAuthError(null);
                  setAuthSuccessMsg(null);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-emerald-400 hover:bg-slate-800 hover:text-emerald-300 text-xs font-bold rounded-sm border border-slate-850 cursor-pointer uppercase tracking-wider font-sans transition-all shadow-sm"
              >
                <span>Login / Register</span>
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
            <h2 className="font-display font-extrabold text-2xl md:text-3.5xl tracking-tight leading-none uppercase text-[#daabab]">
              Overseas Scholarships for Bangladeshi Students
            </h2>
            <div className="flex flex-wrap gap-2.5 items-center pt-1.5 pb-1">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 rounded-sm text-[10.5px] font-mono font-black uppercase tracking-wider">
                🎯 {allScholarships.filter(s => s.fundingType === 'Fully Funded').length} Fully Funded Programs Listed
              </span>
              <span className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 rounded-sm text-[10px] font-mono font-bold uppercase tracking-wider">
                🇧🇩 Specially Tailored BD Entry Paths
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl font-sans font-normal">
              Enter your CGPA and IELTS credentials to instantly diagnose your profile matches against exactly <strong>{allScholarships.filter(s => s.fundingType === 'Fully Funded').length} high-yield, fully funded sovereign programs</strong> including Chevening (UK), DAAD (Germany), MEXT (Japan), and Erasmus+ (EU).
            </p>
          </div>
        </div>

        {/* Plan Comparison Page/Section */}
        <PlanComparisonSection 
          isUnlocked={isGlobalUnlocked} 
          onUnlockPro={triggerGlobalAiUnlock} 
        />

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
              <div className="space-y-6 animate-fade-in-up" id="scholarships-catalogue-anchor">
                
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
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

                    <div className="space-y-1">
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

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Funding Amount:</span>
                      <select
                        value={selectedFundingAmount}
                        onChange={(e) => setSelectedFundingAmount(e.target.value)}
                        className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-sm focus:outline-none cursor-pointer"
                        id="scholarship-funding-filter"
                      >
                        <option value="All">💰 All Funding Amounts</option>
                        <option value="Elite">💎 Super Elite (≥ $80,000)</option>
                        <option value="High">🥇 High Value (≥ $50,000)</option>
                        <option value="Mid">🥈 Medium Value (≥ $25,000)</option>
                        <option value="Regular">🥉 Standard Value (&lt; $25,000)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Order / Prioritize:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full text-xs py-2 px-2.5 bg-white border border-slate-200 rounded-sm focus:outline-none cursor-pointer font-sans"
                        id="scholarship-sort-selector"
                      >
                        <option value="recommended">🌟 Recommended / Match</option>
                        <option value="deadlineSoonest">⏰ Deadline (Soonest First)</option>
                        <option value="fundingHighToLow">📈 Value: High to Low</option>
                        <option value="fundingLowToHigh">📉 Value: Low to High</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Row */}
                  {(selectedMajor || selectedCountry !== 'All' || selectedDegree !== 'All' || selectedFundingAmount !== 'All' || searchQuery !== '') && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 text-xs text-slate-500 font-sans" id="active-filters-container">
                      <span className="font-mono text-[9px] uppercase font-bold text-slate-400 mr-1">Active Filters:</span>
                      {searchQuery !== '' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-sm border border-slate-200 text-[11px]" id="filter-chip-search">
                          <span>Search: <strong className="text-slate-900">"{searchQuery}"</strong></span>
                          <button onClick={() => setSearchQuery('')} className="hover:text-red-500 font-bold ml-1 cursor-pointer focus:outline-none text-slate-400" aria-label="Clear search">×</button>
                        </span>
                      )}
                      {selectedCountry !== 'All' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-sm border border-slate-200 text-[11px]" id="filter-chip-country">
                          <span>🌐 <strong className="text-slate-900">{selectedCountry}</strong></span>
                          <button onClick={() => setSelectedCountry('All')} className="hover:text-red-500 font-bold ml-1 cursor-pointer focus:outline-none text-slate-400" aria-label="Clear country">×</button>
                        </span>
                      )}
                      {selectedDegree !== 'All' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-sm border border-slate-200 text-[11px]" id="filter-chip-degree">
                          <span>🎓 <strong className="text-slate-900">{selectedDegree}</strong></span>
                          <button onClick={() => setSelectedDegree('All')} className="hover:text-red-500 font-bold ml-1 cursor-pointer focus:outline-none text-slate-400" aria-label="Clear degree">×</button>
                        </span>
                      )}
                      {selectedFundingAmount !== 'All' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-700 rounded-sm border border-slate-200 text-[11px]" id="filter-chip-funding">
                          <span>💰 <strong>{
                            selectedFundingAmount === 'Elite' ? 'Super Elite (≥ $80k)' :
                            selectedFundingAmount === 'High' ? 'High Value (≥ $50k)' :
                            selectedFundingAmount === 'Mid' ? 'Medium Value (≥ $25k)' :
                            'Standard Value (< $25k)'
                          }</strong></span>
                          <button onClick={() => setSelectedFundingAmount('All')} className="hover:text-red-500 font-bold ml-1 cursor-pointer focus:outline-none text-slate-400" aria-label="Clear funding">×</button>
                        </span>
                      )}
                      {selectedMajor && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-sm border border-emerald-200 font-semibold text-[11px]" id="filter-chip-major">
                          <span>📚 Major: <strong className="text-emerald-950">{selectedMajor}</strong></span>
                          <button onClick={() => setSelectedMajor(null)} className="hover:text-emerald-600 font-bold ml-1 cursor-pointer focus:outline-none text-emerald-500" aria-label="Clear major">×</button>
                        </span>
                      )}
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCountry('All');
                          setSelectedDegree('All');
                          setSelectedFundingAmount('All');
                          setSelectedMajor(null);
                        }}
                        className="text-[10px] font-bold text-slate-450 hover:text-red-600 uppercase hover:underline ml-auto cursor-pointer focus:outline-none py-1 px-2 hover:bg-red-50 rounded-xs transition-colors"
                        id="clear-all-filters-btn"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid Results */}
                {filteredScholarships.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="scholarships-grid-results">
                      {paginatedScholarships.map((sch) => (
                        <ScholarshipCard 
                          key={sch.id}
                          scholarship={sch}
                          onSelect={(s) => setModalScholarship(s)}
                          onCheckEligibility={(s) => handleRunAiDiagnostics(sch)}
                          userProfile={userProfile}
                          isBookmarked={bookmarkedScholarshipIds.includes(sch.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectMajor={(major) => setSelectedMajor(prev => prev === major ? null : major)}
                          activeMajor={selectedMajor}
                          isUnlocked={isGlobalUnlocked || unlockedScholarshipIds.includes(sch.id)}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 px-4 py-3.5 rounded-sm font-sans" id="scholarships-pagination-controls">
                        <div className="text-xs text-slate-500">
                          Showing <strong className="text-slate-800">{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredScholarships.length)}</strong> of <strong className="text-slate-800">{filteredScholarships.length}</strong> scholarships
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              if (currentPage > 1) {
                                setCurrentPage(prev => prev - 1);
                                document.getElementById('scholarships-catalogue-anchor')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-xs font-medium border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 cursor-pointer disabled:cursor-not-allowed text-slate-700 transition-all flex items-center gap-1"
                            id="btn-prev-page"
                          >
                            <span>&larr;</span> Previous
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                              const shouldShow = pg === 1 || pg === totalPages || Math.abs(pg - currentPage) <= 1;
                              if (!shouldShow) {
                                if (pg === 2 || pg === totalPages - 1) {
                                  return <span key={pg} className="px-1.5 text-xs text-slate-400 font-mono">...</span>;
                                }
                                return null;
                              }
                              return (
                                <button
                                  key={pg}
                                  onClick={() => {
                                    setCurrentPage(pg);
                                    document.getElementById('scholarships-catalogue-anchor')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className={`w-8 h-8 flex items-center justify-center text-xs font-mono font-bold rounded-sm border cursor-pointer transition-all ${
                                    currentPage === pg
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                  }`}
                                >
                                  {pg}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => {
                              if (currentPage < totalPages) {
                                setCurrentPage(prev => prev + 1);
                                document.getElementById('scholarships-catalogue-anchor')?.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-xs font-medium border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-sm disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 cursor-pointer disabled:cursor-not-allowed text-slate-700 transition-all flex items-center gap-1"
                            id="btn-next-page"
                          >
                            Next <span>&rarr;</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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
                  isUnlocked={isGlobalUnlocked}
                  onUnlockRequest={() => {
                    const dummyScholarship: Scholarship = {
                      id: 'global_ai_unlock',
                      title: 'ScholarsBot AI Advisor Pro',
                      country: 'Global',
                      flag: '🌐',
                      fundingType: 'Fully Funded',
                      degreeLevels: ['Bachelor', 'Master', 'PhD'],
                      ieltsRequirement: 0,
                      cgpaRequirement: 0,
                      deadline: 'Dec 2026',
                      description: 'Unlocks all AI diagnostic tools and interactive academic consultant permanently.',
                      benefits: ['Unlimited chats', 'SOP constructors', 'Paper verification route maps'],
                      eligibilityDetails: ['Verify transaction with automated bKash/Nagad SMS match.'],
                      applicationFee: '100 BDT',
                      applicationSteps: [],
                      tipsForBangladeshis: [],
                      officialLink: 'https://bdscholars.unaux.com/payment-link/523284229087900125600758553',
                      popularMajors: [],
                      timelineStrategy: []
                    };
                    setPendingPaymentScholarship(dummyScholarship);
                  }}
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
          userProfile={userProfile}
          user={user}
        />
      )}

      {/* bKash Payment Modal */}
      {pendingPaymentScholarship && (
        <BkashPaymentModal 
          scholarshipName={pendingPaymentScholarship.title}
          scholarshipId={pendingPaymentScholarship.id}
          userId={user ? user.uid : null}
          onClose={() => setPendingPaymentScholarship(null)}
          onPaymentSuccess={(trxId) => {
            setIsGlobalUnlocked(true);
            localStorage.setItem('unlocked_ai_global', 'true');
            setUnlockedScholarshipIds(prev => [...prev, 'global_ai_unlock', pendingPaymentScholarship.id]);
            const unlockedScholarship = pendingPaymentScholarship;
            setPendingPaymentScholarship(null);
            // Immediately compile the diagnostics now that the bill is cleared!
            handleRunAiDiagnostics(unlockedScholarship);
          }}
        />
      )}

      {/* Dynamic Authentication Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="auth-modal-screen">
          <div className="bg-white rounded-sm border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative" id="auth-modal-container">
            
            {/* Header branding */}
            <div className="bg-slate-900 text-white p-5 relative">
              <button 
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-5 bg-emerald-500 shrink-0" />
                <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-[#daabab]">Authorized Access Portal</h3>
              </div>
              <p className="text-[10px] text-slate-350 font-sans uppercase tracking-wider">Track admissions, save diagnostic profiles & sync metadata</p>
            </div>

            {/* Trouble / Info Notice */}
            <div className="bg-amber-50 border-b border-amber-200/80 p-3.5 flex gap-2.5 items-start text-amber-950 font-sans">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed col-span-1">
                <span className="font-bold">OAuth Verification Pending?</span> If Google authorization fails or triggers a block in this sandbox, use the <span className="font-semibold underline text-amber-900">Email & Password options</span> below to sign up and establish your workspace account instantly!
              </div>
            </div>

            <div className="p-6 space-y-4 font-sans">
              
              {/* Login / Register Modes switcher tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                    setAuthSuccessMsg(null);
                  }}
                  className={`flex-1 pb-2 font-display text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    authMode === 'login' 
                      ? 'border-emerald-600 text-emerald-950 font-black' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError(null);
                    setAuthSuccessMsg(null);
                  }}
                  className={`flex-1 pb-2 font-display text-xs font-bold uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                    authMode === 'register' 
                      ? 'border-emerald-600 text-emerald-950 font-black' 
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Status messages */}
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-sm text-xs text-rose-600 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium leading-normal">{authError}</span>
                </div>
              )}

              {authSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-sm text-xs text-emerald-800 font-bold flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              {/* Native form */}
              <form onSubmit={handleEmailAuthSubmit} className="space-y-3.5">
                {authMode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-550 block uppercase tracking-wider" htmlFor="auth-name">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                      <input
                        id="auth-name"
                        type="text"
                        required
                        placeholder="e.g. Touhid Ali"
                        value={authDisplayName}
                        onChange={(e) => setAuthDisplayName(e.target.value)}
                        className="w-full text-xs font-medium py-2 pl-9 pr-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 rounded-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-550 block uppercase tracking-wider" htmlFor="auth-email">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full text-xs font-medium py-2 pl-9 pr-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 rounded-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-550 block uppercase tracking-wider" htmlFor="auth-password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                    <input
                      id="auth-password"
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full text-xs font-medium py-2 pl-9 pr-3 bg-slate-50 hover:bg-white border border-slate-200 focus:border-slate-350 rounded-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-extrabold text-xs uppercase tracking-wider rounded-sm shadow-sm transition-all cursor-pointer border-none font-sans disabled:opacity-50"
                >
                  {authSubmitting ? "Processing..." : authMode === 'login' ? "Sign In via Password" : "Create Account & Login"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Or</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* Google alternative button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={authSubmitting}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-sm text-[11px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50 font-sans"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" strokeLinecap="round" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Sign in with Google</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Clean Footer with Support & Contact Info */}
      <footer className="bg-slate-100 border-t border-slate-200 py-12 mt-16 text-center" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 font-sans space-y-6">
          
          {/* Contact Us Feature Widget */}
          <div className="bg-white border border-slate-200 rounded-sm p-5 max-w-xl mx-auto text-left shadow-2xs space-y-4" id="contact-us-footer-widget">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 bg-emerald-600 rounded-none shrink-0" />
              <h5 className="font-display font-bold text-xs uppercase tracking-wider text-slate-800">Support & Placement Guidance (Contact Us)</h5>
            </div>
            
            <p className="text-xs text-slate-505 leading-relaxed">
              Have questions regarding verification procedures, program timelines, or need direct human assistance? Get in touch with our team in Dhaka:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Email Button */}
              <a 
                href="mailto:arafibntoihid@gmail.com" 
                className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-200 rounded-sm hover:border-emerald-300 hover:bg-emerald-50/20 transition-all font-mono text-[11px] text-slate-700 hover:text-emerald-950 group text-decoration-none"
              >
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                <div className="truncate">
                  <span className="block text-[8px] font-mono uppercase text-slate-400 tracking-wider font-bold">Write Email</span>
                  <span className="font-semibold text-slate-850">arafibntoihid@gmail.com</span>
                </div>
              </a>

              {/* WhatsApp Button */}
              <a 
                href="https://wa.me/8801922378319" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2.5 p-3 bg-slate-50/50 border border-slate-200 rounded-sm hover:border-emerald-300 hover:bg-emerald-50/20 transition-all font-mono text-[11px] text-slate-700 hover:text-emerald-950 group text-decoration-none"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:scale-105 transition-transform shrink-0" />
                <div>
                  <span className="block text-[8px] font-mono uppercase text-slate-400 tracking-wider font-bold">WhatsApp Direct</span>
                  <span className="font-semibold text-slate-850">01922378319</span>
                </div>
              </a>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2.5">
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
        </div>
      </footer>

    </div>
  );
}
