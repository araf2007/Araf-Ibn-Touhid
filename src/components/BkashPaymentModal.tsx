import React, { useState } from 'react';
import { X, Smartphone, Lock, CheckCircle2, AlertCircle, Coins, Copy, Check, Info } from 'lucide-react';
import { savePaymentRecord } from '../firebase.js';

interface BkashPaymentModalProps {
  scholarshipName: string;
  scholarshipId: string;
  userId: string | null;
  onClose: () => void;
  onPaymentSuccess: (trxId: string) => void;
}

export const BkashPaymentModal: React.FC<BkashPaymentModalProps> = ({
  scholarshipName,
  scholarshipId,
  userId,
  onClose,
  onPaymentSuccess,
}) => {
  const [trxId, setTrxId] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const DEMO_NUMBER = '01922-378319';
  const DEMO_TRX_ID = 'BKASH99TRX';

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(DEMO_NUMBER.replace('-', ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyDemoTrx = () => {
    setTrxId(DEMO_TRX_ID);
    setErrorMsg(null);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const sanitizedTrx = trxId.trim().toUpperCase();
    
    if (!sanitizedTrx) {
      setErrorMsg('Transaction ID cannot be empty.');
      return;
    }

    // Standard bkash transaction ID is usually 10 characters, allowing 8-20 for total compatibility
    if (sanitizedTrx.length < 8 || sanitizedTrx.length > 20) {
      setErrorMsg('Invalid Transaction ID length. An active bKash Transaction ID is usually 10 alphanumeric characters.');
      return;
    }

    setIsVerifying(true);

    try {
      // Connect to server-side PipraPay verification proxy route
      const response = await fetch('/api/payment/verify-piprapay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trxId: sanitizedTrx,
          scholarshipId,
          userId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Verification refused. Please check the Transaction ID and try again.');
      }

      // Record payment in firestore if userId is available
      if (userId) {
        try {
          await savePaymentRecord(userId, scholarshipId, sanitizedTrx);
        } catch (dbErr: any) {
          console.error('Failed to sync to database, fallback to local state', dbErr);
          // Handled gracefully so the user isn't stuck on db failure
        }
      }

      // Also save to localStorage as a global local cache (highly robust caching fallback)
      const localPayments = JSON.parse(localStorage.getItem('unlocked_diagnostics') || '{}');
      localPayments[scholarshipId] = {
        trxId: sanitizedTrx,
        timestamp: Date.now(),
        gateway: 'PipraPay',
        isSandbox: !!result.isSandbox,
      };
      localStorage.setItem('unlocked_diagnostics', JSON.stringify(localPayments));

      setIsSuccess(true);
      setIsVerifying(false);

      // Transition out
      setTimeout(() => {
        onPaymentSuccess(sanitizedTrx);
      }, 1500);

    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err.message || 'Verification failed / connection timeout. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
      id="bkash-modal-backdrop"
    >
      <div 
        className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col animate-scale-up"
        id="bkash-modal-container"
      >
        {/* bKash Header Accent */}
        <div className="bg-[#E2136E] text-white p-5 relative" id="bkash-header-brand">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            {/* Elegant Custom bKash Birds & Text Mock */}
            <div className="w-10 h-10 bg-white text-[#E2136E] rounded-md font-extrabold flex items-center justify-center font-serif text-lg tracking-tight select-none shadow-sm shrink-0">
              bk
            </div>
            <div>
              <h3 className="font-sans font-bold text-md leading-tight tracking-wide">bKash Checkout</h3>
              <p className="text-white/80 text-[9px] uppercase tracking-wider font-mono">Automated Gateway • PipraPay</p>
            </div>
          </div>
        </div>

        {/* Amount bar */}
        <div className="bg-[#E2136E]/5 border-y border-pink-100 px-6 py-3 flex justify-between items-center text-xs text-slate-700">
          <div>
            <p className="text-slate-500 font-medium">Payment Target:</p>
            <p className="font-sans font-bold text-slate-800 line-clamp-1">{scholarshipName}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-slate-500 font-medium">Charge Amount:</p>
            <p className="font-mono font-black text-sm text-[#E2136E]">10.00 ৳ (BDT)</p>
          </div>
        </div>

        {/* Modal content */}
        <div className="p-6 flex-1 space-y-5 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-scale-up" id="bkash-success-screen">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-extrabold text-slate-800 text-base">Payment Verified via PipraPay!</h4>
                <p className="text-xs text-slate-500">Unlocking AI Match Diagnostics report now...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Steps Instructions */}
              <div className="space-y-3 font-sans" id="bkash-payment-instructions">
                <div className="flex items-center gap-2 text-slate-800">
                  <Smartphone className="w-4 h-4 text-[#E2136E]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Instruction Manual (PipraPay Automated)</span>
                </div>
                
                <ol className="text-xs space-y-2.5 text-slate-600 pl-1 list-decimal list-inside leading-relaxed bg-slate-50/50 p-3.5 rounded border border-slate-150">
                  <li>
                    Open your **bKash App** or dial Call **`*247#`**
                  </li>
                  <li>
                    Select **Send Money** option
                  </li>
                  <li>
                    Enter destination Personal Number: 
                    <div className="inline-flex items-center gap-1.5 ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono font-bold text-[11px] border border-slate-200">
                      <span>{DEMO_NUMBER}</span>
                      <button 
                        type="button" 
                        onClick={handleCopyNumber}
                        className="text-slate-400 hover:text-emerald-600 transition" 
                        title="Copy Number"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </li>
                  <li>
                    Enter Amount: <strong className="text-slate-900 font-mono">10 Taka</strong>
                  </li>
                  <li>
                    Authorize with Pin, copy the **Transaction ID (TrxID)**, and enter it below.
                  </li>
                </ol>
              </div>

              {/* Form Input Section */}
              <form onSubmit={handleVerify} className="space-y-4" id="bkash-input-form">
                <div className="space-y-1.5">
                  <label htmlFor="trxId" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans">
                    Enter Transaction ID (Alphanumeric)
                  </label>
                  <div className="relative">
                    <input 
                      id="trxId"
                      type="text"
                      value={trxId}
                      onChange={(e) => {
                        setTrxId(e.target.value);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      disabled={isVerifying}
                      placeholder="e.g. 8K89X7Y2Z1"
                      className="w-full px-3.5 py-2.5 border border-slate-250 bg-white font-mono font-bold text-slate-800 tracking-wider text-sm rounded-xs focus:ring-2 focus:ring-[#E2136E]/20 focus:border-[#E2136E] outline-none disabled:bg-slate-50 disabled:text-slate-400 uppercase"
                      maxLength={20}
                      required
                    />
                    <Coins className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xs border border-red-150 flex items-start gap-2 animate-shake" id="bkash-error-container">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3 bg-[#E2136E] hover:bg-[#c90a5d] text-white font-sans font-bold text-sm tracking-wide rounded-xs shadow-md shadow-pink-500/10 cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 select-none disabled:bg-pink-300 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verifying with PipraPay Server...</span>
                    </>
                  ) : (
                    <span>CONFIRM PAYMENT</span>
                  )}
                </button>
              </form>

              {/* Sandbox Helper Bar */}
              <div className="border-t border-slate-100 pt-4" id="bkash-sandbox-helpers">
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded text-[11px] font-sans border border-emerald-150 space-y-1.5">
                  <p className="font-extrabold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    PIPRAPAY AUTOMATIC INTEGRATION
                  </p>
                  <p className="text-slate-600 leading-tight">
                    This component connects to our server-side PipraPay verification route. 
                    Configure <strong className="font-mono">PIPRAPAY_API_KEY</strong> in the Secrets settings panel for live gateway billing logs.
                  </p>
                  <p className="text-slate-600">
                    Use the simulated sandbox key below for rapid testing:
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1 px-1 py-1.5 bg-emerald-100/55 rounded border border-emerald-200">
                    <span className="font-mono px-2 py-0.5 rounded font-bold text-emerald-950 text-xs">
                      {DEMO_TRX_ID}
                    </span>
                    <button 
                      type="button"
                      onClick={handleApplyDemoTrx}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer text-[10px] transition"
                    >
                      Auto-Fill Sandbox ID
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pink branding footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center text-[10px] font-mono text-slate-400 select-none">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#E2136E]" />
            Encrypted by PipraPay
          </span>
          <span>© PipraPay Applet 2026</span>
        </div>
      </div>
    </div>
  );
};
