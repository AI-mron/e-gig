export type ServiceCategory = 'tv_repair' | 'harvesting';

export interface FictionalRecommendation {
  recommender: string;
  avatar?: string;
  text: string;
  relationship?: string;
}

export interface PastJob {
  title: string;
  location: string;
  date: string;
  category: string;
}

export interface Worker {
  id: string;
  name: string;
  category: ServiceCategory;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  similarJobs: number;
  location: string;
  serviceAreas: string[];
  diagnosticRate?: number; // for tv_repair (diagnosis only)
  dailyRate?: number;      // for harvesting (per day labour)
  canLeadCrew?: boolean;   // crew leader
  skills: string[];
  bio: string;
  experienceYears: number;
  languages: string[];
  isAvailableTomorrowAfternoon: boolean;
  isAvailableSaturday: boolean;
  fictionalRecommendation?: FictionalRecommendation | null;
  sampleWorkHistory: PastJob[];
  identityCheckedDemo: boolean;
}

export interface JobRequirements {
  rawQuery: string;
  category: ServiceCategory | null;
  location: string;
  requestedDate: string;
  requestedTime: string;
  workerCount: number;
  budgetKes: number | null;
  durationDays: number;
  taskDetails: string;
  preferNetwork: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  clarificationField?: keyof JobRequirements | null;
}

export interface MatchedWorker {
  worker: Worker;
  score: number;
  reasons: string[];
  isEligible: boolean;
  ineligibilityReason?: string;
  effectiveRate: number; // diagnosticRate or dailyRate
}

export interface CrewMatchResult {
  eligibleWorkers: MatchedWorker[];
  selectedWorkers: Worker[];
  requiredCount: number;
  hasLeader: boolean;
  labourTotal: number;
  customerFee: number;
  totalPayable: number;
  isBudgetSufficient: boolean;
  budgetDifference: number;
  allRequirementsMet: boolean;
  statusMessage?: string;
}

export interface DemoBooking {
  referenceId: string;
  createdAt: string;
  requirements: JobRequirements;
  workers: Worker[];
  labourTotal: number;
  customerFee: number;
  totalPayable: number;
  workerFee: number;
  workerNetTotal: number;
  itemisedWorkers: {
    workerId: string;
    name: string;
    role: string;
    isLeader: boolean;
    labour: number;
    workerFee: number;
    netEarnings: number;
  }[];
}

export interface GeminiInterpretation {
  category: ServiceCategory | null;
  location: string | null;
  requestedDate: string | null;
  requestedTime: string | null;
  workerCount: number | null;
  budgetKes: number | null;
  durationDays: number | null;
  taskDetails: string | null;
  preferNetwork: boolean | null;
  clarificationQuestion?: string | null;
}

export interface ServerStatusResponse {
  geminiAvailable: boolean;
  model: string;
  mode: 'gemini' | 'fallback';
}
