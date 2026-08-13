import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { EscrowOrder, ArtisanWallet } from '../types/escrow';

interface EscrowContextType {
  order: EscrowOrder;
  wallet: ArtisanWallet;
  submitMilestoneProof: (milestoneId: string, images: string[]) => void;
  approveMilestone: (milestoneId: string) => void;
  withdrawWalletFunds: (amount: number) => void;
}

const defaultOrder: EscrowOrder = {
  orderId: 'KARAGIR-99210',
  productTitle: 'Custom Oak & Sagwan Teak Dining Table',
  buyerName: 'Vikramaditya Deshmukh',
  artisanName: 'Satpur Royal Sofa & Teak Wood Works',
  totalBudget: 50000,
  escrowVaultBalance: 50000,
  milestones: [
    {
      id: 'm1',
      stageNumber: 1,
      title: 'Raw Material Selection',
      description: 'Selected seasoned White Oak and Sagwan Teak planks. Verified grain pattern, moisture content (<9%), and absence of knots.',
      percentageSplit: 30,
      grossAmount: 15000,
      netAmount: 14250,
      status: 'IN_PROGRESS',
      proofImages: []
    },
    {
      id: 'm2',
      stageNumber: 2,
      title: 'Framing & Joinery Assembly',
      description: 'Main frame assembled using traditional mortise and tenon joints. Brass inlay channels carved and prepared.',
      percentageSplit: 40,
      grossAmount: 20000,
      netAmount: 19000,
      status: 'LOCKED',
      proofImages: []
    },
    {
      id: 'm3',
      stageNumber: 3,
      title: 'Polishing, Finishing & Delivery',
      description: 'Final organic beeswax polishing, quality inspection, and secure packaging for local delivery.',
      percentageSplit: 30,
      grossAmount: 15000,
      netAmount: 14250,
      status: 'LOCKED',
      proofImages: []
    }
  ]
};

const defaultWallet: ArtisanWallet = {
  availableBalance: 0,
  totalEarned: 0,
  pendingEscrow: 50000,
  payoutBank: {
    accountName: 'Satpur Teak Works',
    accountNumber: '•••• 4091',
    ifsc: 'HDFC0000240',
    bankName: 'HDFC Bank'
  },
  transactions: []
};

const EscrowContext = createContext<EscrowContextType | undefined>(undefined);

export const EscrowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [order, setOrder] = useState<EscrowOrder>(defaultOrder);
  const [wallet, setWallet] = useState<ArtisanWallet>(defaultWallet);

  const submitMilestoneProof = (milestoneId: string, images: string[]) => {
    setOrder(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, status: 'PROOF_SUBMITTED', proofImages: images, submittedAt: new Date().toLocaleString() }
          : m
      )
    }));
  };

  const approveMilestone = (milestoneId: string) => {
    setOrder(prev => {
      const updatedMilestones = [...prev.milestones];
      const mIndex = updatedMilestones.findIndex(m => m.id === milestoneId);
      
      if (mIndex === -1) return prev;
      
      const milestone = updatedMilestones[mIndex];
      updatedMilestones[mIndex] = {
        ...milestone,
        status: 'APPROVED_AND_PAID',
        approvedAt: new Date().toLocaleString()
      };

      // Unlock next milestone
      if (mIndex + 1 < updatedMilestones.length) {
        updatedMilestones[mIndex + 1] = {
          ...updatedMilestones[mIndex + 1],
          status: 'IN_PROGRESS'
        };
      }

      setWallet(w => ({
        ...w,
        availableBalance: w.availableBalance + milestone.netAmount,
        totalEarned: w.totalEarned + milestone.netAmount,
        pendingEscrow: w.pendingEscrow - milestone.grossAmount,
        transactions: [
          {
            id: `txn_${Date.now()}`,
            type: 'MILESTONE_RELEASE',
            amount: milestone.netAmount,
            timestamp: new Date().toLocaleString(),
            status: 'COMPLETED',
            referenceId: milestone.id
          },
          ...w.transactions
        ]
      }));

      return {
        ...prev,
        escrowVaultBalance: prev.escrowVaultBalance - milestone.grossAmount,
        milestones: updatedMilestones
      };
    });
  };

  const withdrawWalletFunds = (amount: number) => {
    if (amount <= 0 || amount > wallet.availableBalance) return;
    
    setWallet(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      transactions: [
        {
          id: `wth_${Date.now()}`,
          type: 'BANK_WITHDRAWAL',
          amount: amount,
          timestamp: new Date().toLocaleString(),
          status: 'COMPLETED',
          referenceId: `IMPS${Math.floor(Math.random() * 9000000000) + 1000000000}`
        },
        ...prev.transactions
      ]
    }));
  };

  return (
    <EscrowContext.Provider value={{ order, wallet, submitMilestoneProof, approveMilestone, withdrawWalletFunds }}>
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => {
  const context = useContext(EscrowContext);
  if (!context) throw new Error('useEscrow must be used within an EscrowProvider');
  return context;
};
