import React from 'react';
import { MOCK_MILESTONE } from '../data/mockData';
import { Check, Hammer, Brush, Truck, ShieldCheck, Lock, MessageSquare, Clock, Camera, Sparkles, ArrowLeft } from 'lucide-react';

import { useMaterial } from '../context/MaterialContext';

interface MilestoneTrackerProps {
  onBack?: () => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ onBack }) => {
  const order = MOCK_MILESTONE;
  const { selectedPrimaryMaterial, selectedAccentMaterials, selectedFinish } = useMaterial();

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'check':
        return <Check className="w-4 h-4 stroke-[3]" />;
      case 'hammer':
        return <Hammer className="w-4 h-4" />;
      case 'brush':
        return <Brush className="w-4 h-4" />;
      case 'truck':
        return <Truck className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Back Button Navigation Header */}
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Home</span>
          </button>
        </div>
      )}
      
      {/* 1. Order Header */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="text-xs font-mono text-[#EA580C] bg-[#EA580C]/10 px-3 py-1 rounded-full border border-[#EA580C]/30 font-bold">
              Order ID: #{order.orderId}
            </span>
            <span className="text-xs font-semibold text-[#EAB308] bg-[#EAB308]/10 px-3 py-1 rounded-full border border-[#EAB308]/30 flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              {order.escrowStatus}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{order.projectTitle}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Buyer: <span className="text-white font-semibold">{order.buyerName}</span> • Estimated Handover: <span className="text-emerald-400 font-semibold">{order.estimatedDeliveryDate}</span>
          </p>
        </div>

        <button className="px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#F97316] text-white text-xs font-bold transition-all shadow-lg glow-orange flex items-center space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span>Artisan Chat & Direct Feed</span>
        </button>
      </div>

      {/* 2. Locked Material Specifications Card */}
      <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#EA580C]">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Escrow-Locked Raw Material Specifications</h3>
          </div>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            Gate 1 Escrow Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#120B08] p-4 rounded-2xl border border-[#2A1E17]">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Primary Timber</span>
            <span className="text-xs font-extrabold text-[#EA580C]">{selectedPrimaryMaterial}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Secondary Inlays</span>
            <span className="text-xs font-bold text-white">
              {selectedAccentMaterials.length > 0 ? selectedAccentMaterials.join(', ') : 'Solid Brass Wire Inlay'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Organic Polish</span>
            <span className="text-xs font-bold text-slate-300">{selectedFinish}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Timeline Left + Sidebar Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 3. Vertical Visual Progress Timeline */}
        <div className="lg:col-span-8 bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Live Material Milestone Verification</h2>
            <p className="text-xs text-slate-400 mt-1">Stage 1 requires artisan photo proof of seasoned raw timber planks & brass sheets before escrow release.</p>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-10 border-l-2 border-[#2A1E17]">
            {order.steps.map((step) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in_progress';

              return (
                <div key={step.id} className="relative group">
                  
                  <div
                    className={`absolute -left-[35px] sm:-left-[43px] top-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50'
                        : isInProgress
                        ? 'bg-[#EA580C] text-white shadow-lg glow-orange animate-pulse'
                        : 'bg-[#120B08] text-slate-500 border border-[#2A1E17]'
                    }`}
                  >
                    {renderIcon(step.iconName)}
                  </div>

                  <div className="bg-[#120B08] border border-[#2A1E17] rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold text-slate-500">STEP 0{step.id}</span>
                        <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      </div>
                      
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                          MATERIAL GATE VERIFIED
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[10px] font-bold text-[#EA580C] bg-[#EA580C]/10 px-2.5 py-0.5 rounded-full border border-[#EA580C]/40">
                          IN PROGRESS
                        </span>
                      )}
                      {!isCompleted && !isInProgress && (
                        <span className="text-[10px] font-bold text-slate-500 bg-[#1F1510] px-2.5 py-0.5 rounded-full border border-[#2A1E17]">
                          PENDING
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>

                    {step.timestamp && (
                      <p className="text-[11px] text-slate-400 font-mono flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-[#EA580C]" />
                        {step.timestamp}
                      </p>
                    )}

                    {step.photoUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[#2A1E17] relative group/photo">
                        <img
                          src={step.photoUrl}
                          alt={step.title}
                          className="w-full h-48 sm:h-56 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-3 flex items-end justify-between">
                          <span className="text-[10px] text-slate-200 font-mono flex items-center">
                            <Camera className="w-3 h-3 mr-1 text-emerald-400" />
                            Raw Timber Planks Moisture & Grain Verification Uploaded
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Sidebar Detail Cards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Artisan Profile Card */}
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Assigned Master Artisan</h3>
            <div className="flex items-center space-x-4">
              <img
                src={order.artisan.avatarUrl}
                alt={order.artisan.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#EA580C]"
              />
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{order.artisan.shopName}</h4>
                <p className="text-xs text-slate-400">{order.artisan.name}</p>
                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Response ~2 hours</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 pt-2 border-t border-[#2A1E17] flex justify-between">
              <span className="text-slate-500">Completed Builds:</span>
              <span className="font-bold text-white">{order.artisan.completedOrdersCount} orders</span>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#120B08] hover:bg-[#261B15] text-slate-200 text-xs font-bold border border-[#2A1E17] transition-all flex items-center justify-center space-x-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Send Message</span>
            </button>
          </div>

          {/* Payment Escrow Protection Card */}
          <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">karagir Material Escrow</h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#120B08] border border-emerald-950/80">
              <span className="text-xs text-slate-400">Total Escrow Protection</span>
              <p className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
                ₹{order.totalAmount.toLocaleString('en-IN')}.00
              </p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Escrow funds are released incrementally only after Stage 1 timber verification and final delivery photo proof approval.
            </p>

            <div className="p-3 rounded-xl bg-[#261B15] border border-[#EAB308]/30 flex items-start space-x-2 text-[11px] text-slate-300">
              <Lock className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
              <span>100% money-back guarantee if timber grain or brass inlay does not match specifications.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
