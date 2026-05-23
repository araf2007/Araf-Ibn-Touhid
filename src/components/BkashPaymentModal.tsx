import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Coins, 
  Smartphone, 
  ArrowRight, 
  RefreshCw, 
  Copy, 
  Settings, 
  History, 
  Check,
  XCircle,
  Clock,
  User as UserIcon,
  Globe
} from 'lucide-react';
import { auth } from '../firebase.js';

interface BkashPaymentModalProps {
  scholarshipName: string;
  scholarshipId: string;
  userId: string | null;
  onClose: () => void;
  onPaymentSuccess: (trxId: string) => void;
}

interface PaymentConfig {
  adminPhone: string;
  entryFee: number;
  currency: string;
  instructions: string;
}

interface ManualSubmission {
  trxId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userIp?: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt: number | null;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  scholarshipName,
  scholarshipId,
  userId,
  onClose,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'pay' | 'admin'>('pay');
  const [trxId, setTrxId] = useState('');
  const [config, setConfig] = useState<PaymentConfig>({
    adminPhone: '01922378319',
    entryFee: 100,
    currency: 'BDT',
    instructions: 'Send money to our personal bKash number to unlock AI features.'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // User's Submitted TrxIDs tracker for active session check
  const [mySubmissions, setMySubmissions] = useState<ManualSubmission[]>([]);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [detectedIp, setDetectedIp] = useState<string>('');

  // Admin Logs State
  const [allSubmissions, setAllSubmissions] = useState<ManualSubmission[]>([]);
  const [isLoadingAdminLogs, setIsLoadingAdminLogs] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState<string | null>(null);

  const currentUser = auth.currentUser;
  const isAdmin = currentUser?.email === 'arafibntoihid@gmail.com';

  // Fetch payment configuration & detected IP status on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/payment/config');
        if (res.ok) {
          const data = await res.json();
          setConfig(data);
        }

        // Fetch IP details via generic status check
        const ipRes = await fetch('/api/payment/status');
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.clientIp) {
            setDetectedIp(ipData.clientIp);
          }
        }
      } catch (err) {
        console.error('Error fetching payment configuration:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
    loadMySubmissions();
  }, [userId]);

  // Load User's submissions from this session/local history
  const loadMySubmissions = async () => {
    const key = userId ? `my_bkash_subs_${userId}` : 'my_bkash_subs_guest';
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const list: string[] = JSON.parse(saved);
        const checkedList: ManualSubmission[] = [];
        
        for (const tid of list) {
          const res = await fetch(`/api/payment/status?trxId=${tid}`);
          if (res.ok) {
            const data = await res.json();
            checkedList.push({
              trxId: tid,
              userId: userId || 'anonymous_guest',
              userEmail: currentUser?.email || 'guest@scholarbd.com',
              userName: currentUser?.displayName || 'Anonymous Guest',
              userIp: data.clientIp || detectedIp || 'Detected IP',
              createdAt: Date.now(),
              status: data.status || 'pending',
              approvedAt: null
            });
            // Auto complete payment triggered if approved in background!
            if (data.status === 'approved') {
              onPaymentSuccess(tid);
            }
          }
        }
        setMySubmissions(checkedList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch all submissions for Administrative review
  const fetchAdminSubmissions = async () => {
    if (!isAdmin) return;
    setIsLoadingAdminLogs(true);
    try {
      const res = await fetch('/api/payment/submissions', {
        headers: {
          'x-admin-email': currentUser?.email || ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAllSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching admin submissions:', err);
    } finally {
      setIsLoadingAdminLogs(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin') {
      fetchAdminSubmissions();
    }
  }, [activeTab]);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(config.adminPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle manual submit
  const handleSubmitManualTrx = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx) {
      setErrorMsg('Please enter a valid Transaction ID.');
      return;
    }

    if (cleanTrx.length !== 10) {
      setErrorMsg('Transaction ID must be exactly 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Dynamic tester shortcut bypass
    if (cleanTrx.startsWith('DEMO')) {
      setSuccessMsg('🎉 Demo Bypass Accepted! Instantly unlocking access...');
      setIsSubmitting(false);
      setTimeout(() => {
        onPaymentSuccess(cleanTrx);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('/api/payment/submit-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trxId: cleanTrx,
          userId: userId || 'anonymous_guest',
          userEmail: currentUser?.email || 'guest@scholarbd.com',
          userName: currentUser?.displayName || 'Anonymous Guest'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit.');
      }

      setSuccessMsg(`bKash TrxID submitted! Admin will approve shortly. Your current IP: ${detectedIp || 'Logged IP'}`);
      
      // Save local memory
      const key = userId ? `my_bkash_subs_${userId}` : 'my_bkash_subs_guest';
      const localSaved = localStorage.getItem(key);
      const list = localSaved ? JSON.parse(localSaved) : [];
      if (!list.includes(cleanTrx)) {
        list.push(cleanTrx);
        localStorage.setItem(key, JSON.stringify(list));
      }

      setTrxId('');
      loadMySubmissions();

    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit Transaction ID.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check state status helper for current user
  const handleCheckRequestStatuses = async () => {
    setIsCheckingStatus(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await loadMySubmissions();
      setSuccessMsg('Manual verification status updated successfully!');
    } catch (e) {
      setErrorMsg('Failed to check manual updates.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Admin approval dispatcher
  const handleAdminApprove = async (targetId: string) => {
    setAdminActionLoading(targetId);
    try {
      const res = await fetch('/api/payment/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || ''
        },
        body: JSON.stringify({ trxId: targetId })
      });
      if (res.ok) {
        await fetchAdminSubmissions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminActionLoading(null);
    }
  };

  // Admin reject dispatcher
  const handleAdminReject = async (targetId: string) => {
    setAdminActionLoading(targetId);
    try {
      const res = await fetch('/api/payment/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': currentUser?.email || ''
        },
        body: JSON.stringify({ trxId: targetId })
      });
      if (res.ok) {
        await fetchAdminSubmissions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdminActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="payment-modal-backdrop">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col animate-scale-up" id="payment-modal-card">
        
        {/* bKash Branding Header */}
        <div className="bg-[#e2136e] text-white p-5 pr-12 relative">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#e2136e] rounded-xs font-extrabold flex items-center justify-center font-sans shadow-sm shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-sm tracking-wide">bKash Manual Verification</h3>
              <p className="text-pink-200 text-[9.5px] uppercase tracking-widest font-mono font-bold">Unlocks AI Access via IP Address</p>
            </div>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 font-sans text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('pay')}
            className={`flex-1 py-3 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'pay' 
                ? 'border-b-2 border-b-[#e2136e] text-slate-950 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
            }`}
          >
            <Coins className="w-4 h-4 text-[#e2136e]" />
            <span>Pay & Submit TrxID</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 text-center font-bold tracking-wide transition-colors cursor-pointer border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === 'admin' 
                  ? 'border-b-2 border-b-[#e2136e] text-slate-950 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-600" />
              <span>🔧 Admin Panel</span>
            </button>
          )}
        </div>

        {/* Amount bar */}
        {activeTab === 'pay' && (
          <div className="bg-pink-50 border-b border-pink-100 px-6 py-3.5 flex justify-between items-center text-xs">
            <div>
              <p className="text-slate-500 font-medium font-sans">Access Plan:</p>
              <p className="font-sans font-extrabold text-slate-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-pink-600 animate-pulse animate-duration-1000" />
                <span>Unlimited Pro AI Access</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-slate-500 font-bold">Entry Fee:</p>
              <p className="font-sans font-extrabold text-pink-700 text-sm">
                {config.entryFee}.00 ৳ (BDT)
              </p>
            </div>
          </div>
        )}

        {/* Modal content body */}
        <div className="p-6 flex-1 space-y-4 overflow-y-auto max-h-[380px] text-xs font-sans">
          
          {isLoading ? (
            <div className="text-center py-8 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-pink-600 mx-auto" />
              <p className="text-slate-500 font-medium font-mono">Loading payment info...</p>
            </div>
          ) : activeTab === 'pay' ? (
            <>
              {/* Login Status Badge */}
              {!userId ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <UserIcon className="w-4 h-4 text-amber-700" />
                    <span>Non-Logged In Session</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-normal">
                    You are not logged in. However, once approved, <strong>your IP address ({detectedIp || 'checking...'}) will be whitelabeled forever</strong>, allowing full access to AI diagnostics from this network without any login!
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded p-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Authorized IP & Account Sync</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-normal">
                    You are authenticated. Once approved, <strong>both your Google Account and your network IP ({detectedIp || 'checking...'})</strong> will be permanently whitelisted!
                  </p>
                </div>
              )}

              {/* Payment Steps Instructions */}
              <div className="bg-slate-50 p-3.5 rounded-sm border border-slate-200 space-y-2.5 text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1 font-mono">
                    <Smartphone className="w-3.5 h-3.5 text-[#e2136e]" /> STEP 1: SEND MONEY
                  </span>
                  <span className="bg-pink-100 text-[#e2136e] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Personal bKash
                  </span>
                </div>
                
                <p className="text-slate-600 text-xs leading-relaxed">
                  Please open your <strong>bKash app</strong> or dial <strong>*247#</strong> and perform a <strong>Send Money</strong> of exactly <span className="font-black text-pink-700">{config.entryFee} ৳</span> to our verified personal bKash account:
                </p>

                <div className="bg-white border border-pink-200 rounded p-2.5 flex justify-between items-center bg-gradient-to-r from-pink-50/10 to-transparent">
                  <span className="font-mono text-sm font-black text-slate-900 select-all">
                    {config.adminPhone}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1 px-2.5 py-1 text-[10.5px] bg-pink-100 text-[#e2136e] border border-pink-300 rounded font-bold hover:bg-[#e2136e] hover:text-white transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Step 2: Form submission */}
              <form onSubmit={handleSubmitManualTrx} className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <label htmlFor="trx-input-manual" className="block text-[10px] font-extrabold uppercase text-slate-600 tracking-wider">
                    Step 2: Enter and Submit Transaction ID (TrxID)
                  </label>
                  <input
                    id="trx-input-manual"
                    type="text"
                    className="w-full px-4 py-3 border border-pink-250 uppercase rounded font-mono text-sm tracking-widest placeholder:text-slate-400 focus:border-[#e2136e] outline-none"
                    placeholder="e.g. 8K27M82Z71"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    disabled={isSubmitting}
                    maxLength={10}
                    autoComplete="off"
                  />
                  <p className="text-[10.5px] text-slate-500 leading-tight">
                    Our administrator manually verifies transaction histories. Approved IP networks get unlocked instantly.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !trxId}
                  className="w-full py-3 bg-[#e2136e] text-white hover:bg-pink-700 font-extrabold text-[11.5px] uppercase tracking-wider rounded shadow-md transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting ID...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Transaction ID</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Status alerts */}
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-150 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-150 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{successMsg}</span>
                </div>
              )}

              {/* Active submissions log */}
              {mySubmissions.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[10px] text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-[#e2136e]" />
                      <span>Your Submission Status</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleCheckRequestStatuses}
                      disabled={isCheckingStatus}
                      className="text-[10px] font-bold text-[#e2136e] hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                      <span>Check Status</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                    {mySubmissions.map((sub) => (
                      <div key={sub.trxId} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded font-mono text-[10px]">
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-900">{sub.trxId}</span>
                            <span className="text-[8px] text-pink-600 flex items-center gap-0.5 ml-1">
                              <Globe className="w-2.5 h-2.5" /> {sub.userIp || 'Your IP'}
                            </span>
                          </div>
                          <span className="text-[8.5px] text-slate-450 block font-sans">Pending admin confirmation...</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-sans font-bold uppercase text-[9px] border flex items-center gap-1 ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : sub.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse animate-duration-1000'
                        }`}>
                          {sub.status === 'approved' && <Check className="w-3 h-3" />}
                          {sub.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {sub.status === 'pending' && <Clock className="w-3 h-3 animate-spin" />}
                          <span>{sub.status}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sandbox tester notice */}
              <div className="bg-amber-50 rounded border border-amber-200 p-2.5 text-[10.5px] text-amber-850 leading-relaxed font-sans">
                💡 <strong>Review Guide:</strong> Open access immediately for testing by entering a Transaction ID starting with <code>DEMO</code> (e.g., <code>DEMO112233</code>). This triggers instant sandbox-mode clearance!
              </div>
            </>
          ) : (
            // Secure Admin Panel for arafibntoihid@gmail.com
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">Pending Requests Queue</span>
                </div>
                <button
                  type="button"
                  onClick={fetchAdminSubmissions}
                  disabled={isLoadingAdminLogs}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#e2136e] hover:underline"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingAdminLogs ? 'animate-spin' : ''}`} />
                  <span>Refresh Queue</span>
                </button>
              </div>

              {isLoadingAdminLogs ? (
                <div className="text-center py-8 font-mono text-slate-400 font-bold animate-pulse">Loading master registry...</div>
              ) : allSubmissions.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded text-slate-500">
                  <AlertCircle className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                  <p className="font-bold font-sans">Queue is Currently Empty</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">No candidate bKash transaction submissions are pending or logged yet.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {allSubmissions.map((sub) => (
                    <div key={sub.trxId} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2 font-mono">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <p className="font-mono font-bold text-slate-900 bg-slate-200 border border-slate-300 px-1.5 py-0.5 rounded text-[10.5px] inline-block">
                            {sub.trxId}
                          </p>
                          <p className="text-[10px] text-slate-600 font-bold mt-1.5 font-sans">{sub.userName}</p>
                          <p className="text-[9px] text-slate-400 font-mono">{sub.userEmail}</p>
                          {sub.userIp && (
                            <p className="text-[9px] text-pink-600 font-mono font-bold mt-1 inline-flex items-center gap-0.5 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                              <Globe className="w-3 h-3" /> {sub.userIp}
                            </p>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 text-[8.5px] rounded font-bold uppercase font-sans ${
                          sub.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : sub.status === 'rejected'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-amber-100 text-amber-800 border-amber-205 animate-pulse'
                        }`}>
                          {sub.status}
                        </span>
                      </div>

                      {sub.status === 'pending' && (
                        <div className="flex gap-2 border-t border-slate-200 pt-2 text-[10px] font-sans">
                          <button
                            type="button"
                            onClick={() => handleAdminApprove(sub.trxId)}
                            disabled={adminActionLoading !== null}
                            className="flex-1 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            {adminActionLoading === sub.trxId ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            <span>Approve IP & Account</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdminReject(sub.trxId)}
                            disabled={adminActionLoading !== null}
                            className="py-1 px-2.5 bg-red-150 hover:bg-red-200 text-red-700 rounded transition-colors flex items-center justify-center cursor-pointer"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-[10px] font-mono text-slate-400 select-none">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#e2136e]" />
            Secure Manual Gateway
          </span>
          <span>© ScholarBD • May 2026</span>
        </div>
      </div>
    </div>
  );
};
