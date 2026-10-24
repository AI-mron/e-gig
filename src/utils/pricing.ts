import type { Worker } from '../types';

export const CUSTOMER_FEE_RATE = 0.05; // 5% added to labour
export const WORKER_FEE_RATE = 0.05;   // 5% deducted from labour

export interface WorkerCostItem {
  workerId: string;
  workerName: string;
  role: string;
  isLeader: boolean;
  labourRate: number;
  workerFee: number;
  workerNetEarnings: number;
}

export interface PricingSummary {
  labourTotal: number;
  customerFee: number;
  totalPayable: number;
  workerFeeTotal: number;
  workerNetTotal: number;
  platformRevenue: number;
  items: WorkerCostItem[];
}

/**
 * Calculates pricing with integer precision (rounding to nearest whole KSh)
 * Ensures crew totals strictly match sum of line items.
 */
export function calculatePricing(workers: Worker[]): PricingSummary {
  let labourTotal = 0;
  let workerFeeTotal = 0;
  let workerNetTotal = 0;

  const items: WorkerCostItem[] = workers.map((worker) => {
    const rate = worker.category === 'tv_repair' 
      ? (worker.diagnosticRate || 0) 
      : (worker.dailyRate || 0);

    const workerFee = Math.round(rate * WORKER_FEE_RATE);
    const workerNetEarnings = rate - workerFee;

    labourTotal += rate;
    workerFeeTotal += workerFee;
    workerNetTotal += workerNetEarnings;

    return {
      workerId: worker.id,
      workerName: worker.name,
      role: worker.category === 'tv_repair'
        ? 'Diagnostic visit'
        : (worker.canLeadCrew ? 'Crew Leader (rate includes coordination)' : 'Crew Member'),
      isLeader: !!worker.canLeadCrew && worker.category === 'harvesting',
      labourRate: rate,
      workerFee,
      workerNetEarnings
    };
  });

  const customerFee = Math.round(labourTotal * CUSTOMER_FEE_RATE);
  const totalPayable = labourTotal + customerFee;
  const platformRevenue = customerFee + workerFeeTotal;

  return {
    labourTotal,
    customerFee,
    totalPayable,
    workerFeeTotal,
    workerNetTotal,
    platformRevenue,
    items
  };
}

export function formatKes(amount: number): string {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}
