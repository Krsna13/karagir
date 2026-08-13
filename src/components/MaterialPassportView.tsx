import React, { useState } from 'react';
import type { MaterialPassport } from '../types/materialPassport';
import { 
  ShieldCheck, 
  FileText, 
  Image, 
  Package, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MaterialPassportViewProps {
  passport: MaterialPassport;
  showTimelineOnly?: boolean;
}

export const MaterialPassportView: React.FC<MaterialPassportViewProps> = ({ 
  passport, 
  showTimelineOnly = false 
}) => {
  const [showDocs, setShowDocs] = useState(false);
  const { batch, evidence, certifications } = passport;

  const hasInvoice = evidence.some(e => e.type === 'invoice' || e.type === 'receipt');
  const hasPhotos = evidence.some(e => e.type === 'raw_full' || e.type === 'grain_closeup' || e.type === 'angle_additional');
  const hasSample = batch.sampleStatus !== 'none';
  const hasCert = certifications.length > 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'client_approved':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'pending_client_review':
      case 'ready_for_review':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'sample_pending':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'rejected':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      default:
        return 'text-slate-400 bg-[#120B08] border-[#2A1E17]';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'client_approved':
        return 'CLIENT VERIFIED';
      case 'pending_client_review':
        return 'PENDING CLIENT REVIEW';
      case 'ready_for_review':
        return 'READY FOR REVIEW';
      case 'sample_pending':
        return 'SAMPLE SHIPPED & PENDING';
      case 'client_requested_more_evidence':
        return 'ADDITIONAL EVIDENCE REQUESTED';
      case 'rejected':
        return 'REJECTED';
      default:
        return 'CREATED';
    }
  };

  // Generate dynamic timeline from batch data
  const generateTimelineEvents = () => {
    const events = [];
    
    // 1. Sourcing
    events.push({
      date: new Date(batch.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      title: 'Material Sourced',
      description: `Sourced ${batch.materialType} (${batch.species}, ${batch.grade}) from ${batch.supplierName}`,
      isDone: true
    });

    // 2. Documentation
    if (hasInvoice || hasCert) {
      events.push({
        date: new Date(batch.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        title: 'Procurement Documentation Uploaded',
        description: `${hasInvoice ? 'Supplier invoice' : ''} ${hasCert ? '& FSC Certifications' : ''} attached to passport`,
        isDone: true
      });
    }

    // 3. Raw photo capture
    if (hasPhotos) {
      events.push({
        date: new Date(batch.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        title: 'Raw Material Planks Captured',
        description: 'Uploaded macro wood grain photos and wide angles of wood planks',
        isDone: true
      });
    }

    // 4. Sample
    if (batch.sampleStatus === 'shipped' || batch.sampleStatus === 'received' || batch.sampleStatus === 'verified') {
      events.push({
        date: batch.sampleShippedAt ? new Date(batch.sampleShippedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
        title: 'Physical Sample Block Shipped',
        description: `Off-cut block (Sample ID: ${batch.sampleId}) shipped via BlueDart (${batch.sampleTrackingNumber || 'N/A'})`,
        isDone: true
      });
    }

    if (batch.sampleStatus === 'received' || batch.sampleStatus === 'verified') {
      events.push({
        date: batch.sampleReceivedAt ? new Date(batch.sampleReceivedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '',
        title: 'Physical Sample Received',
        description: 'Client received the reference block for texture, color, and scent matching',
        isDone: true
      });
    }

    // 5. Verification
    if (batch.status === 'client_approved') {
      events.push({
        date: batch.sampleVerifiedAt ? new Date(batch.sampleVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        title: 'Client Approved Material',
        description: 'Material passport audit trail verified and signed by client',
        isDone: true
      });

      // Crafting milestones from workshop evidence
      const cuts = evidence.filter(e => e.type === 'process_cut');
      const joins = evidence.filter(e => e.type === 'process_join');
      const assems = evidence.filter(e => e.type === 'process_assem');
      const finishes = evidence.filter(e => e.type === 'process_finish');
      const finals = evidence.filter(e => e.type === 'final_furniture');

      if (cuts.length > 0) {
        events.push({
          date: new Date(cuts[0].uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          title: 'Sizing & Cutting Started',
          description: 'Timber cutting and sizing started in the workshop',
          isDone: true
        });
      }
      if (joins.length > 0) {
        events.push({
          date: new Date(joins[0].uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          title: 'Framing & Joinery Assembly',
          description: 'Mortise and tenon joinery channels cut and frames set',
          isDone: true
        });
      }
      if (assems.length > 0) {
        events.push({
          date: new Date(assems[0].uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          title: 'Product Structure Completed',
          description: 'Main structures assembled; initial sanding performed',
          isDone: true
        });
      }
      if (finishes.length > 0) {
        events.push({
          date: new Date(finishes[0].uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          title: 'Polishing & Finish Coat Applied',
          description: 'Final protective finishes, wax coats, or polish layers sealed',
          isDone: true
        });
      }
      if (finals.length > 0) {
        events.push({
          date: new Date(finals[0].uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          title: 'Finished Furniture Delivered',
          description: 'Delivered and scanned matching QR codes',
          isDone: true
        });
      }
    } else {
      events.push({
        date: '',
        title: 'Client Material Approval Pending',
        description: 'Waiting for client to match sample and click approve',
        isDone: false
      });
    }

    return events;
  };

  if (showTimelineOnly) {
    return (
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Provenance Timeline</h3>
        <div className="relative pl-6 space-y-6 border-l-2 border-[#2A1E17]">
          {generateTimelineEvents().map((ev, idx) => (
            <div key={idx} className="relative">
              <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${
                ev.isDone 
                  ? 'bg-[#EA580C] border-[#EA580C] text-white' 
                  : 'bg-[#120B08] border-[#2A1E17]'
              }`} />
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400">{ev.date}</span>
                <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                <p className="text-[11px] text-slate-400">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1F1510] border border-[#2A1E17] rounded-3xl p-6 shadow-2xl space-y-6 max-w-md mx-auto hover:border-[#EA580C]/30 transition-colors">
      
      {/* 1. Header Shield */}
      <div className="flex items-center justify-between border-b border-[#2A1E17] pb-4">
        <div className="flex items-center space-x-2 text-[#EA580C]">
          <ShieldCheck className="w-6 h-6 stroke-[2]" />
          <span className="text-sm font-extrabold uppercase tracking-widest font-mono">Material Passport</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-bold bg-[#120B08] px-2.5 py-1 rounded border border-[#2A1E17]">
          {batch.passportId}
        </span>
      </div>

      {/* 2. Specs Title */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Lumber</span>
        <h2 className="text-xl font-extrabold text-white">{batch.materialType}</h2>
        <div className="flex items-center space-x-2 text-xs text-[#EAB308] font-semibold">
          <span>{batch.species}</span>
          <span className="text-slate-500">•</span>
          <span>{batch.grade}</span>
        </div>
      </div>

      {/* 3. Document Checklists */}
      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center"><FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Supplier Invoice</span>
          {hasInvoice ? (
            <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center">✓ AVAILABLE</span>
          ) : (
            <span className="text-slate-500 font-mono text-[10px] flex items-center">MISSING</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center"><FileText className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Certification Docs</span>
          {hasCert ? (
            <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center">✓ {certifications[0].type}</span>
          ) : (
            <span className="text-slate-500 font-mono text-[10px] flex items-center">OPTIONAL</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center"><Image className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Grain Photographs</span>
          {evidence.some(e => e.type === 'grain_closeup') ? (
            <span className="text-emerald-400 font-bold font-mono text-[10px] bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-800/30 flex items-center">✓ ATTACHED</span>
          ) : (
            <span className="text-slate-500 font-mono text-[10px] flex items-center">PENDING</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center"><Package className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Physical sample block</span>
          {hasSample ? (
            <span className={`font-bold font-mono text-[10px] px-2 py-0.5 rounded border flex items-center ${
              batch.sampleStatus === 'verified' 
                ? 'text-emerald-400 bg-emerald-950/20 border-emerald-800/30' 
                : 'text-amber-400 bg-amber-950/20 border-amber-800/30'
            }`}>
              {batch.sampleStatus.toUpperCase()}
            </span>
          ) : (
            <span className="text-slate-500 font-mono text-[10px] flex items-center">NOT REQUIRED</span>
          )}
        </div>
      </div>

      {/* 4. Active Status Badge */}
      <div className="border-t border-[#2A1E17] pt-4">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Passport Status</span>
        <div className={`w-full py-2.5 rounded-xl border text-center font-extrabold text-xs tracking-wider ${getStatusColor(batch.status)}`}>
          {getStatusLabel(batch.status)}
        </div>
      </div>

      {/* 5. Documents details dropdown */}
      <div className="pt-2">
        <button
          onClick={() => setShowDocs(!showDocs)}
          className="w-full text-slate-300 hover:text-white text-xs font-bold py-2 bg-[#120B08] hover:bg-[#261B15] border border-[#2A1E17] rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
        >
          <span>{showDocs ? 'Hide Uploaded Materials' : 'View Uploaded Materials'}</span>
          {showDocs ? <ChevronUp className="w-4 h-4 text-[#EA580C]" /> : <ChevronDown className="w-4 h-4 text-[#EA580C]" />}
        </button>

        {showDocs && (
          <div className="mt-3 bg-[#120B08] p-4 rounded-2xl border border-[#2A1E17] space-y-4 shadow-inner max-h-60 overflow-y-auto">
            {evidence.length === 0 && certifications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center font-mono py-2">No evidence uploaded yet.</p>
            ) : (
              <>
                {certifications.map(cert => (
                  <div key={cert.id} className="border-b border-[#2A1E17]/60 pb-3 last:border-0 last:pb-0">
                    <span className="text-[9px] font-bold text-[#EA580C] uppercase block mb-1">Certification Document</span>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-white">{cert.type}</p>
                        <p className="text-[10px] text-slate-400">Issuer: {cert.issuerName} • {cert.issuingAuthority}</p>
                        <p className="text-[9px] text-[#EAB308] font-mono mt-1">Number: {cert.certificateNumber}</p>
                      </div>
                      <a 
                        href={cert.documentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-[#EA580C] hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}

                {evidence.map(ev => {
                  return (
                    <div key={ev.id} className="border-b border-[#2A1E17]/60 pb-3 last:border-0 last:pb-0">
                      <span className="text-[9px] font-bold text-[#EAB308] uppercase block mb-1">
                        {ev.type.replace('_', ' ').toUpperCase()} EVIDENCE
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-300 font-medium">Uploaded: {new Date(ev.uploadedAt).toLocaleDateString()}</span>
                          <a 
                            href={ev.storagePath} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#1F1510] border border-[#2A1E17] text-slate-300 hover:text-white flex items-center text-[10px]"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> View
                          </a>
                        </div>
                        {ev.type.includes('grain') || ev.type.includes('raw') || ev.type.includes('angle') ? (
                          <img src={ev.storagePath} alt={ev.type} className="w-full h-24 object-cover rounded-lg border border-[#2A1E17]" />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
