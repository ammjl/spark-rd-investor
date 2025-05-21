
export interface Investment {
  id: string;
  name: string;
  description: string;
  developmentCost: number; // in currency
  ongoingSupportCost: number; // per year in currency
  marketingCost: number; // in currency
  timeFrame: number; // in months
  technicalFeasibility: number; // 1-10 scale
  fiscalValueToCustomer: number; // 1-10 scale
  marketOpportunity: number; // 1-10 scale
  customerValue: number; // average of the three above
  expectedRevenue: number; // in currency
  dateAdded: Date;
  priorityScore?: number; // calculated field
  manualPriority?: number; // for custom ordering
  approved?: boolean; // for approved status
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
