import React from 'react';
import { CustomerCampaignLauncher } from './CustomerCampaignLauncher';
import { ArrowLeft } from 'lucide-react';

interface CustomRequestBuilderProps {
  selectedLocation?: { locality: string; pincode: string };
  onSubmitSuccess?: () => void;
  onBack?: () => void;
}

export const CustomRequestBuilder: React.FC<CustomRequestBuilderProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 pb-16">
      {onBack && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1F1510] hover:bg-[#261B15] text-slate-200 hover:text-white border border-[#3E2E24] text-xs font-extrabold transition-all shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Home / Artisans</span>
          </button>
        </div>
      )}
      <CustomerCampaignLauncher />
    </div>
  );
};
