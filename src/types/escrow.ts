export type MilestoneStatus = 'LOCKED' | 'IN_PROGRESS' | 'PROOF_SUBMITTED' | 'APPROVED_AND_PAID';

export interface Milestone {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  percentageSplit: number; // e.g. 30, 40, 30
  grossAmount: number;
  netAmount: number; // gross - 5% fee
  status: MilestoneStatus;
  proofImages: string[];
  submittedAt?: string;
  approvedAt?: string;
}

export interface EscrowOrder {
  orderId: string;
  productTitle: string;
  buyerName: string;
  artisanName: string;
  totalBudget: number;
  escrowVaultBalance: number;
  milestones: Milestone[];
}

export interface ArtisanWallet {
  availableBalance: number;
  totalEarned: number;
  pendingEscrow: number;
  payoutBank: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  transactions: {
    id: string;
    type: 'MILESTONE_RELEASE' | 'BANK_WITHDRAWAL';
    amount: number;
    timestamp: string;
    status: 'COMPLETED' | 'PENDING';
    referenceId: string;
  }[];
}
