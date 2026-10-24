import { WORKERS } from '../data/workers';
import type { JobRequirements, MatchedWorker, ServiceCategory } from '../types';
import { CUSTOMER_FEE_RATE } from './pricing';

export interface MatchingResult {
  category: ServiceCategory | null;
  location: string;
  workerCount: number;
  eligibleWorkers: MatchedWorker[];
  ineligibleWorkers: MatchedWorker[];
  minimumPossibleBudgetKes: number;
  isBudgetTooLow: boolean;
  isCrewInsufficient: boolean;
  unsupportedLocation: boolean;
  unsupportedCategory: boolean;
  hasLeaderAvailable: boolean;
  suggestedCrewIds: string[];
}

export function matchWorkers(requirements: JobRequirements): MatchingResult {
  const { category, location, requestedDate, requestedTime, workerCount, budgetKes, preferNetwork } = requirements;

  // Check supported category
  if (!category || (category !== 'tv_repair' && category !== 'harvesting')) {
    return {
      category: null,
      location,
      workerCount,
      eligibleWorkers: [],
      ineligibleWorkers: [],
      minimumPossibleBudgetKes: 0,
      isBudgetTooLow: false,
      isCrewInsufficient: false,
      unsupportedLocation: false,
      unsupportedCategory: true,
      hasLeaderAvailable: false,
      suggestedCrewIds: []
    };
  }

  // Filter workers in category
  const categoryWorkers = WORKERS.filter((w) => w.category === category);

  // Normalize location check
  const locLower = (location || '').toLowerCase().trim();
  const isNairobiArea = locLower.includes('kilimani') || locLower.includes('nairobi') || locLower.includes('westlands');
  const isNakuruArea = locLower.includes('nakuru') || locLower.includes('njoro') || locLower.includes('rongai');

  // Unsupported location check
  if (category === 'tv_repair' && !isNairobiArea && locLower.length > 0) {
    return {
      category,
      location,
      workerCount,
      eligibleWorkers: [],
      ineligibleWorkers: [],
      minimumPossibleBudgetKes: 0,
      isBudgetTooLow: false,
      isCrewInsufficient: false,
      unsupportedLocation: true,
      unsupportedCategory: false,
      hasLeaderAvailable: false,
      suggestedCrewIds: []
    };
  }

  if (category === 'harvesting' && !isNakuruArea && locLower.length > 0) {
    return {
      category,
      location,
      workerCount,
      eligibleWorkers: [],
      ineligibleWorkers: [],
      minimumPossibleBudgetKes: 0,
      isBudgetTooLow: false,
      isCrewInsufficient: false,
      unsupportedLocation: true,
      unsupportedCategory: false,
      hasLeaderAvailable: false,
      suggestedCrewIds: []
    };
  }

  // Check time / slot availability
  const isTomorrowSlot = (requestedDate || '').toLowerCase().includes('tomorrow') ||
                         (requestedTime || '').toLowerCase().includes('afternoon');
  const isSaturdaySlot = (requestedDate || '').toLowerCase().includes('saturday');

  const eligibleWorkers: MatchedWorker[] = [];
  const ineligibleWorkers: MatchedWorker[] = [];

  for (const worker of categoryWorkers) {
    let isEligible = true;
    let ineligibilityReason = '';

    // Check availability
    if (isTomorrowSlot && !worker.isAvailableTomorrowAfternoon) {
      isEligible = false;
      ineligibilityReason = 'Unavailable in the requested tomorrow afternoon slot';
    } else if (isSaturdaySlot && !worker.isAvailableSaturday) {
      isEligible = false;
      ineligibilityReason = 'Unavailable on Saturday';
    }

    // Location check
    if (isEligible && locLower.length > 0) {
      const matchesArea = worker.serviceAreas.some(area => area.toLowerCase().includes(locLower) || locLower.includes(area.toLowerCase())) ||
                          worker.location.toLowerCase().includes(locLower);
      if (!matchesArea) {
        isEligible = false;
        ineligibilityReason = `Does not serve ${location}`;
      }
    }

    // Calculate score & reasons
    let score = worker.rating * 10 + worker.similarJobs * 2;
    const reasons: string[] = [];

    if (worker.category === 'tv_repair') {
      reasons.push(`${worker.similarJobs} similar TV repairs`);
      reasons.push(`Serves ${worker.serviceAreas.slice(0, 2).join(', ')}`);
      if (worker.fictionalRecommendation) {
        reasons.push(`Recommended by ${worker.fictionalRecommendation.recommender} · Demo network`);
        if (preferNetwork) {
          score += 25; // boost network recommendation
        }
      }
    } else {
      // Harvesting
      if (worker.canLeadCrew) {
        reasons.push(`Crew Leader · Coordinates team`);
      }
      reasons.push(`${worker.reviewCount} completed farm jobs`);
      reasons.push(`Based in ${worker.location}`);
      if (worker.fictionalRecommendation) {
        reasons.push(`Recommended by ${worker.fictionalRecommendation.recommender} · Demo network`);
        if (preferNetwork) {
          score += 25;
        }
      }
    }

    const matchedWorker: MatchedWorker = {
      worker,
      score,
      reasons,
      isEligible,
      ineligibilityReason: ineligibilityReason || undefined,
      effectiveRate: worker.category === 'tv_repair' ? (worker.diagnosticRate || 0) : (worker.dailyRate || 0)
    };

    if (isEligible) {
      eligibleWorkers.push(matchedWorker);
    } else {
      ineligibleWorkers.push(matchedWorker);
    }
  }

  // Sort eligible workers by score descending
  eligibleWorkers.sort((a, b) => b.score - a.score);

  // Check crew capacity & leader
  const effectiveCount = category === 'tv_repair' ? 1 : Math.max(1, workerCount);
  const isCrewInsufficient = eligibleWorkers.length < effectiveCount;
  const hasLeaderAvailable = eligibleWorkers.some(m => m.worker.canLeadCrew);

  // Compute minimum possible budget
  let minimumPossibleBudgetKes = 0;
  if (category === 'tv_repair') {
    if (eligibleWorkers.length > 0) {
      const minRate = Math.min(...eligibleWorkers.map(w => w.effectiveRate));
      minimumPossibleBudgetKes = Math.round(minRate * (1 + CUSTOMER_FEE_RATE));
    }
  } else {
    // For harvesting crew: needs effectiveCount workers, including at least 1 leader if count > 1
    if (eligibleWorkers.length >= effectiveCount) {
      const leaders = eligibleWorkers.filter(w => w.worker.canLeadCrew);

      if (effectiveCount === 1) {
        const minRate = Math.min(...eligibleWorkers.map(w => w.effectiveRate));
        minimumPossibleBudgetKes = Math.round(minRate * (1 + CUSTOMER_FEE_RATE));
      } else if (leaders.length > 0) {
        // Cheapest leader + cheapest (effectiveCount - 1) workers
        const sortedLeaders = [...leaders].sort((a, b) => a.effectiveRate - b.effectiveRate);
        const cheapestLeader = sortedLeaders[0];
        const remaining = eligibleWorkers.filter(w => w.worker.id !== cheapestLeader.worker.id)
          .sort((a, b) => a.effectiveRate - b.effectiveRate);
        const selected = [cheapestLeader, ...remaining.slice(0, effectiveCount - 1)];
        const sumLabour = selected.reduce((acc, curr) => acc + curr.effectiveRate, 0);
        minimumPossibleBudgetKes = Math.round(sumLabour * (1 + CUSTOMER_FEE_RATE));
      }
    }
  }

  const isBudgetTooLow = !!(budgetKes && budgetKes > 0 && budgetKes < minimumPossibleBudgetKes);

  // Find the highest-scoring affordable combination, preserving the requested count.
  let suggestedCrewIds: string[] = [];
  let bestScore = -Infinity;
  const choose = (start: number, chosen: MatchedWorker[]) => {
    if (chosen.length === effectiveCount) {
      if (category === 'harvesting' && effectiveCount > 1 && !chosen.some(m => m.worker.canLeadCrew)) return;
      const total = Math.round(chosen.reduce((sum, m) => sum + m.effectiveRate, 0) * (1 + CUSTOMER_FEE_RATE));
      if (budgetKes == null || total > budgetKes) return;
      const score = chosen.reduce((sum, m) => sum + m.score, 0);
      if (score > bestScore) { bestScore = score; suggestedCrewIds = chosen.map(m => m.worker.id); }
      return;
    }
    for (let i = start; i < eligibleWorkers.length; i++) choose(i + 1, [...chosen, eligibleWorkers[i]]);
  };
  if (!isCrewInsufficient && !isBudgetTooLow) choose(0, []);

  return {
    category,
    location,
    workerCount: effectiveCount,
    eligibleWorkers,
    ineligibleWorkers,
    minimumPossibleBudgetKes,
    isBudgetTooLow,
    isCrewInsufficient,
    unsupportedLocation: false,
    unsupportedCategory: false,
    hasLeaderAvailable,
    suggestedCrewIds
  };
}
