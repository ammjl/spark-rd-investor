
export interface Investment {
  id: string;
  name: string;
  description: string;
  developmentCost: number; // in currency
  ongoingSupportCost: number; // per year in currency
  marketingCost: number; // in currency
  timeFrame: number; // in months
  customerValue: number; // 1-10 scale
  expectedRevenue: number; // in currency
  dateAdded: Date;
  priorityScore?: number; // calculated field
}

export interface BudgetInfo {
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
}

export enum SortOption {
  PriorityScore = "priorityScore",
  ROI = "roi",
  Cost = "cost",
  CustomerValue = "customerValue",
  TimeFrame = "timeFrame"
}
