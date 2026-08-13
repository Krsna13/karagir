import React, { useState, useEffect } from 'react';
import { MOCK_RADAR_REQUESTS } from '../data/mockData';
import type { IncomingRequestRadar } from '../types';
import { Radar, Upload, Check, Send, Plus, FolderKanban, MessageSquare, Wallet, Settings, Hammer, Sparkles, X, ArrowLeft } from 'lucide-react';
import { KaragirProfileCard } from './KaragirProfileCard';
import { useKaragirStore } from '../context/KaragirStoreContext';
import { useEscrow } from '../context/EscrowContext';
import { WorkshopProfileEditor } from './WorkshopProfileEditor';
import { CatalogEditor } from './CatalogEditor';
import { MilestoneTracker } from './MilestoneTracker';
import { WithdrawModal } from './WithdrawModal';

interface ArtisanPortalProps {
  onBackToBuyer?: () => void;
}

export const ArtisanPortal: React.FC<ArtisanPortalProps> = ({ onBackToBuyer }) => {
  const { storeData, saveStoreProfile, addWorkItem } = useKaragirStore();
  const { wallet } = useEscrow();
  
  const [activeSidebarTab, setActiveSidebarTab] = useState<'radar' | 'projects' | 'messages' | 'earnings' | 'profile' | 'catalog'>('radar');
  const [activeSubTab, setActiveSubTab] = useState<'Dashboard' | 'Directory' | 'Showcase'>('Dashboard');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [hubTab, setHubTab] = useState<'radar' | 'enquiries'>('radar');
  const [quoteModalRequest, setQuoteModalRequest] = useState<IncomingRequestRadar | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(45000);
  const [timelineWeeks, setTimelineWeeks] = useState<number>(3);
  const [quoteNotes, setQuoteNotes] = useState<string>('Includes Grade-A Sagwan Teak wood seasoning certificate and 5-year anti-termite guarantee.');
  const [isQuoteSent, setIsQuoteSent] = useState<boolean>(false);
  const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false);
  const [isSyncCompleted, setIsSyncCompleted] = useState<boolean>(false);

  // Lock background scroll when quote modal opens
  useEffect(() => {
    if (quoteModalRequest) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [quoteModalRequest]);

  const handleSendQuote = () => {
    setIsQuoteSent(true);
    setTimeout(() => {
      setIsQuoteSent(false);
      setQuoteModalRequest(null);
    }, 1800);
  };

  const handleSyncMilestone = () => {
    setIsSyncCompleted(true);
    setTimeout(() => {
      setIsSyncCompleted(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      
      {/* 1. Dark Navigation Sidebar */}
      <aside className="w-full lg:w-64 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-8 shrink-0 shadow-2xl">
        {onBackToBuyer && (
          <button
            type="button"
            onClick={onBackToBuyer}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-300 hover:text-white border border-[#2A1E17] text-xs font-bold transition-all shadow group mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Switch to Buyer Mode</span>
          </button>
        )}
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-extrabold text-white">karagir</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] glow-dot"></span>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
            Artisan Portal • Crafting Excellence
          </p>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1.5">
          <button 
            onClick={() => setActiveSidebarTab('radar')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'radar' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <Radar className="w-4 h-4" />
            <span>Opportunity Radar</span>
          </button>
          <button 
            onClick={() => setActiveSidebarTab('projects')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'projects' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <FolderKanban className="w-4 h-4" />
            <span>Active Projects (4)</span>
          </button>
          <button 
            onClick={() => setActiveSidebarTab('catalog')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'catalog' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <Hammer className="w-4 h-4" />
            <span>Catalog & Categories</span>
          </button>
          <button 
            onClick={() => setActiveSidebarTab('messages')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'messages' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <MessageSquare className="w-4 h-4" />
            <span>Messages & Quotes</span>
          </button>
          <button 
            onClick={() => setActiveSidebarTab('earnings')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'earnings' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <Wallet className="w-4 h-4" />
            <span>Earnings & Escrow</span>
          </button>
          <button 
            onClick={() => setActiveSidebarTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeSidebarTab === 'profile' ? 'bg-[#EA580C] text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-[#261B15]'}`}>
            <Settings className="w-4 h-4" />
            <span>Workshop Profile</span>
          </button>
        </nav>

        {/* CTA Button */}
        <div className="pt-4 border-t border-[#2A1E17]">
          <button className="w-full py-3 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-[#EA580C] text-xs font-bold border border-[#EA580C]/40 transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Listing</span>
          </button>
        </div>
      </aside>

        {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        
        {/* Opportunity Hub & Live Sync Grid (Dashboard) */}
        {activeSidebarTab === 'radar' && activeSubTab === 'Dashboard' && (
          <>
            {/* 2. Top Sub-Header Tabs */}
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-3 flex items-center justify-between shadow-xl mb-8">
              <div className="flex items-center space-x-2">
                {(['Dashboard', 'Directory', 'Showcase'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      activeSubTab === tab
                        ? 'bg-[#EA580C] text-white shadow-md glow-orange'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 pr-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Workshop Live in Satpur MIDC</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 3. Opportunity Hub Section (Left Column) */}
              <div className="lg:col-span-7 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-6 shadow-2xl">
            
            {/* Sub-Tabs: Direct Enquiries | Area Request Radar */}
            <div className="flex items-center justify-between border-b border-[#2A1E17] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Radar className="w-5 h-5 text-[#EA580C] animate-spin" style={{ animationDuration: '8s' }} />
                  <span>Area Request Radar</span>
                </h2>
                <p className="text-xs text-slate-400">Live custom requirements posted by buyers in 5km radius</p>
              </div>

              <div className="flex items-center p-1 rounded-xl bg-[#120B08] border border-[#2A1E17]">
                <button
                  onClick={() => setHubTab('radar')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    hubTab === 'radar' ? 'bg-[#EA580C] text-white' : 'text-slate-400'
                  }`}
                >
                  Area Radar (4)
                </button>
                <button
                  onClick={() => setHubTab('enquiries')}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    hubTab === 'enquiries' ? 'bg-[#EA580C] text-white' : 'text-slate-400'
                  }`}
                >
                  Direct (2)
                </button>
              </div>
            </div>

            {/* Incoming Order Request Cards */}
            <div className="space-y-4">
              {MOCK_RADAR_REQUESTS.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#120B08] border border-[#2A1E17] hover:border-[#EA580C]/50 rounded-2xl p-5 space-y-3 shadow-md transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {req.postedAgo} • {req.locality} ({req.distanceKm} km)
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">{req.title}</h3>
                      <p className="text-xs text-slate-400">Buyer: {req.buyerName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Est. Budget</span>
                      <span className="text-base font-extrabold text-[#EAB308] font-mono">
                        ₹{req.budget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-[#2A1E17]/60">
                    <span>Specs: <strong className="text-white">{req.material} ({req.dimensions})</strong></span>
                    <span className="text-slate-400">Timeline: {req.timelineWeeks} wks</span>
                  </div>

                  <button
                    onClick={() => {
                      setQuoteModalRequest(req);
                      setQuoteAmount(req.budget);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5"
                  >
                    <Hammer className="w-3.5 h-3.5" />
                    <span>Submit Workshop Quote</span>
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* 4. Right Column: Live Milestone Sync & Financial Payout */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Milestone Sync Card */}
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-2xl">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#EA580C] flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Live Milestone Sync</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Active Project: Teak Patio Set (Order #99210)</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Structure Assembly</span>
                  <span className="text-emerald-400">80% Complete</span>
                </div>
                <div className="w-full h-2.5 bg-[#120B08] rounded-full overflow-hidden border border-[#2A1E17]">
                  <div className="h-full bg-gradient-to-r from-[#EA580C] to-emerald-500 w-[80%] rounded-full"></div>
                </div>
              </div>

              {/* Drag & Drop Photo Upload Zone */}
              <div
                onClick={() => setIsPhotoUploaded(true)}
                className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-colors ${
                  isPhotoUploaded
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : 'border-[#3E2E24] hover:border-[#EA580C] bg-[#120B08]'
                }`}
              >
                {isPhotoUploaded ? (
                  <div className="space-y-1 text-emerald-400">
                    <Check className="w-8 h-8 mx-auto" />
                    <p className="text-xs font-bold">Workshop Photo Uploaded!</p>
                    <p className="text-[10px] text-slate-400 font-mono">teak_assembly_aug05.jpg (3.2 MB)</p>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-400">
                    <Upload className="w-8 h-8 mx-auto text-[#EA580C]" />
                    <p className="text-xs font-bold text-white">Add Photo from Workshop</p>
                    <p className="text-[10px]">Drag & drop or click to attach image proof</p>
                  </div>
                )}
              </div>

              {/* Primary Sync CTA */}
              <button
                onClick={handleSyncMilestone}
                className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  isSyncCompleted
                    ? 'bg-emerald-600'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40 glow-green'
                }`}
              >
                {isSyncCompleted ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Synced to Buyer Timeline!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Sync Milestone to Buyer</span>
                  </>
                )}
              </button>
            </div>

            {/* Financial Payout Card */}
            <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Financial Payout Sync</h3>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Escrow Verified
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#120B08] border border-[#2A1E17]">
                <span className="text-xs text-slate-400">Available for Immediate Payout</span>
                <p className="text-3xl font-extrabold text-[#EAB308] font-mono mt-1 transition-all">
                  ₹{wallet.availableBalance.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Pending Escrow Release: ₹{wallet.pendingEscrow.toLocaleString('en-IN')} (Project #KARAGIR-99210)</p>
              </div>

              <button 
                onClick={() => setIsWithdrawModalOpen(true)}
                disabled={wallet.availableBalance <= 0}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 ${
                  wallet.availableBalance > 0
                    ? 'bg-[#120B08] hover:bg-[#261B15] text-[#EAB308] border border-[#EAB308]/40'
                    : 'bg-[#120B08] text-slate-500 border border-[#2A1E17] opacity-50 cursor-not-allowed'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Withdraw Funds to Bank</span>
              </button>
            </div>

              </div>
            </div>
          </>
        )}

        {/* Public Storefront Showcase */}
        {activeSidebarTab === 'radar' && activeSubTab === 'Showcase' && (
          <div className="mt-8">
            <KaragirProfileCard />
          </div>
        )}

        {/* Directory Tab (Placeholder) */}
        {activeSidebarTab === 'radar' && activeSubTab === 'Directory' && (
          <div className="flex flex-col items-center justify-center p-12 bg-[#1F1510] border border-[#2A1E17] rounded-3xl shadow-2xl space-y-4">
            <FolderKanban className="w-12 h-12 text-[#EA580C] opacity-50" />
            <h2 className="text-xl font-bold text-white">Artisan Directory</h2>
            <p className="text-sm text-slate-400">Discover other verified craftsmen in the Nashik region.</p>
          </div>
        )}

        {/* Active Projects Tab */}
        {activeSidebarTab === 'projects' && (
          <MilestoneTracker isArtisanView={true} />
        )}

        {/* Workshop Profile Tab */}
        {activeSidebarTab === 'profile' && (
          <WorkshopProfileEditor storeData={storeData} saveStoreProfile={saveStoreProfile} />
        )}

        {/* Catalog & Categories Tab */}
        {activeSidebarTab === 'catalog' && (
          <CatalogEditor storeData={storeData} addWorkItem={addWorkItem} />
        )}

      </main>

      {/* Submit Quote Modal */}
      {quoteModalRequest && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#1F1510] border border-[#3E2E24] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
            
            <div className="flex items-start justify-between border-b border-[#2A1E17] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#EA580C]">Submit Workshop Quote</span>
                <h3 className="text-base font-bold text-white">{quoteModalRequest.title}</h3>
                <p className="text-xs text-slate-400">Buyer: {quoteModalRequest.buyerName} • {quoteModalRequest.locality}</p>
              </div>

              <button
                onClick={() => setQuoteModalRequest(null)}
                className="w-8 h-8 rounded-full bg-[#120B08] hover:bg-[#261B15] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Quote Price (₹):</label>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white font-mono text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Completion Timeline (Weeks):</label>
                <input
                  type="number"
                  value={timelineWeeks}
                  onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white font-mono text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Craftsmanship Notes & Guarantee:</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#120B08] border border-[#2A1E17] text-white text-xs focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSendQuote}
                className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg flex items-center justify-center space-x-2 ${
                  isQuoteSent ? 'bg-emerald-600' : 'bg-[#EA580C] hover:bg-[#F97316] glow-orange'
                }`}
              >
                {isQuoteSent ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Quote Sent to Buyer!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Official Quote</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <WithdrawModal onClose={() => setIsWithdrawModalOpen(false)} />
      )}
    </div>
  );
};
