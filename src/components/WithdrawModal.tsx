import React, { useState } from 'react';
import { X, Building2, ShieldCheck, Check } from 'lucide-react';
import { useEscrow } from '../context/EscrowContext';

interface Props {
  onClose: () => void;
}

export const WithdrawModal: React.FC<Props> = ({ onClose }) => {
  const { wallet, withdrawWalletFunds } = useEscrow();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refId, setRefId] = useState('');

  const handleWithdraw = () => {
    setIsProcessing(true);
    // Simulate IMPS processing time
    setTimeout(() => {
      withdrawWalletFunds(wallet.availableBalance);
      setRefId(`IMPS${Math.floor(Math.random() * 9000000000) + 1000000000}`);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#120B08] border border-[#2A1E17] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        
        {!isSuccess && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center animate-bounce mb-2">
              <Check className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Transfer Successful!</h2>
            <p className="text-sm text-slate-400">Funds have been credited to your HDFC Bank account via IMPS.</p>
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-xl px-6 py-3 mt-4 w-full">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">IMPS Ref No.</p>
              <p className="text-sm font-mono text-emerald-400 font-bold">{refId}</p>
            </div>
            <button onClick={onClose} className="w-full py-3 mt-6 rounded-xl bg-[#261B15] hover:bg-[#3E2E24] text-white text-sm font-bold border border-[#3E2E24] transition-colors">
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-white">Withdraw Funds</h2>
              <p className="text-xs text-slate-400 mt-1">Instant IMPS Transfer to your saved bank account.</p>
            </div>

            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-2xl p-4 flex items-start space-x-4">
              <div className="bg-[#120B08] p-2 rounded-xl border border-[#2A1E17]">
                <Building2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{wallet.payoutBank.bankName}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{wallet.payoutBank.accountNumber}</p>
                <p className="text-[10px] text-slate-500 mt-1">IFSC: {wallet.payoutBank.ifsc}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Amount to Withdraw (₹)</label>
              <input 
                type="text" 
                readOnly
                value={wallet.availableBalance.toLocaleString('en-IN')}
                className="w-full bg-[#1F1510] border border-[#2A1E17] rounded-xl px-4 py-3 text-white font-mono text-lg font-bold opacity-70 cursor-not-allowed"
              />
              <p className="text-[10px] text-emerald-500 flex items-center mt-2">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Maximum available balance selected. No hidden fees.
              </p>
            </div>

            <button 
              onClick={handleWithdraw}
              disabled={isProcessing || wallet.availableBalance <= 0}
              className={`w-full py-3.5 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center space-x-2 ${
                isProcessing || wallet.availableBalance <= 0
                  ? 'bg-[#261B15] border border-[#3E2E24] cursor-not-allowed text-slate-400' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/50 glow-green'
              }`}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>Confirm Instant IMPS Transfer</span>
              )}
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};
