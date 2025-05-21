
import { Investment, SortOption } from "../types/investment";

// Calculate ROI (Return on Investment)
export const calculateROI = (investment: Investment): number => {
  const totalCost = investment.developmentCost + 
                    investment.marketingCost + 
                    (investment.ongoingSupportCost * (investment.timeFrame / 12));
  
  // Avoid division by zero
  if (totalCost === 0) return 0;
  
  return investment.expectedRevenue / totalCost;
};

// Calculate priority score based on multiple factors
export const calculatePriorityScore = (investment: Investment): number => {
  const roi = calculateROI(investment);
  const timeEfficiency = 12 / investment.timeFrame; // Shorter time = higher score
  const customerValueWeight = investment.customerValue / 10; // Normalize to 0-1
  
  // Weighted score calculation
  // ROI is the main factor (50%), followed by customer value (30%) and time efficiency (20%)
  return (roi * 0.5) + (customerValueWeight * 0.3) + (timeEfficiency * 0.2);
};

// Sort investments based on selected option
export const sortInvestments = (
  investments: Investment[],
  sortBy: SortOption
): Investment[] => {
  return [...investments].sort((a, b) => {
    switch (sortBy) {
      case SortOption.PriorityScore:
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      case SortOption.ROI:
        return calculateROI(b) - calculateROI(a);
      case SortOption.Cost:
        const costA = a.developmentCost + a.marketingCost + a.ongoingSupportCost;
        const costB = b.developmentCost + b.marketingCost + b.ongoingSupportCost;
        return costA - costB; // Lower costs first
      case SortOption.CustomerValue:
        return b.customerValue - a.customerValue;
      case SortOption.TimeFrame:
        return a.timeFrame - b.timeFrame; // Shorter timeframe first
      default:
        return (b.priorityScore || 0) - (a.priorityScore || 0);
    }
  });
};

// Divide investments into priority list and backlog based on available budget
export const divideInvestments = (
  investments: Investment[],
  totalBudget: number
): {
  priorityList: Investment[];
  backlog: Investment[];
} => {
  // First, sort by priority score
  const sortedInvestments = sortInvestments(
    investments,
    SortOption.PriorityScore
  );

  const priorityList: Investment[] = [];
  const backlog: Investment[] = [];
  let allocatedBudget = 0;

  for (const investment of sortedInvestments) {
    const investmentCost = investment.developmentCost + investment.marketingCost;
    
    if (allocatedBudget + investmentCost <= totalBudget) {
      priorityList.push(investment);
      allocatedBudget += investmentCost;
    } else {
      backlog.push(investment);
    }
  }

  return { priorityList, backlog };
};

// Get priority class based on score
export const getPriorityClass = (score: number): string => {
  if (score >= 0.7) return "priority-high";
  if (score >= 0.4) return "priority-medium";
  return "priority-low";
};
