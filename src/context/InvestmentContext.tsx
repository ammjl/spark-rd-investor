
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Investment, BudgetInfo, SortOption } from '../types/investment';
import { calculatePriorityScore, divideInvestments } from '../utils/prioritization';
import { toast } from "@/components/ui/use-toast";

interface InvestmentContextType {
  investments: Investment[];
  priorityList: Investment[];
  backlog: Investment[];
  budget: BudgetInfo;
  sortOption: SortOption;
  addInvestment: (investment: Omit<Investment, 'id' | 'dateAdded' | 'priorityScore'>) => void;
  removeInvestment: (id: string) => void;
  updateBudget: (budget: number) => void;
  setSortOption: (option: SortOption) => void;
}

const initialBudget: BudgetInfo = {
  totalBudget: 500000,
  allocatedBudget: 0,
  remainingBudget: 500000
};

const defaultContext: InvestmentContextType = {
  investments: [],
  priorityList: [],
  backlog: [],
  budget: initialBudget,
  sortOption: SortOption.PriorityScore,
  addInvestment: () => {},
  removeInvestment: () => {},
  updateBudget: () => {},
  setSortOption: () => {}
};

const InvestmentContext = createContext<InvestmentContextType>(defaultContext);

export const useInvestments = () => useContext(InvestmentContext);

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [budget, setBudget] = useState<BudgetInfo>(initialBudget);
  const [priorityList, setPriorityList] = useState<Investment[]>([]);
  const [backlog, setBacklog] = useState<Investment[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.PriorityScore);

  // Calculate priority scores and update lists whenever investments or budget change
  useEffect(() => {
    // Add priority scores to investments
    const investmentsWithScores = investments.map(investment => ({
      ...investment,
      priorityScore: calculatePriorityScore(investment)
    }));

    // Divide into priority list and backlog based on budget
    const { priorityList: newPriorityList, backlog: newBacklog } = 
      divideInvestments(investmentsWithScores, budget.totalBudget);

    // Calculate allocated budget
    const allocatedBudget = newPriorityList.reduce(
      (sum, inv) => sum + inv.developmentCost + inv.marketingCost, 
      0
    );

    // Update state
    setInvestments(investmentsWithScores);
    setPriorityList(newPriorityList);
    setBacklog(newBacklog);
    setBudget({
      ...budget,
      allocatedBudget,
      remainingBudget: budget.totalBudget - allocatedBudget
    });
  }, [investments, budget.totalBudget]);

  const addInvestment = (newInvestment: Omit<Investment, 'id' | 'dateAdded' | 'priorityScore'>) => {
    const investment: Investment = {
      ...newInvestment,
      id: Math.random().toString(36).substring(2, 9),
      dateAdded: new Date(),
    };

    setInvestments(prev => [...prev, investment]);
    toast({
      title: "Investment added",
      description: `${investment.name} has been added to the assessment.`,
    });
  };

  const removeInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
    toast({
      title: "Investment removed",
      description: "The investment has been removed from the assessment.",
    });
  };

  const updateBudget = (newBudget: number) => {
    setBudget({
      ...budget,
      totalBudget: newBudget,
      remainingBudget: newBudget - budget.allocatedBudget
    });
    toast({
      title: "Budget updated",
      description: `R&D budget has been set to $${newBudget.toLocaleString()}.`,
    });
  };

  const value = {
    investments,
    priorityList,
    backlog,
    budget,
    sortOption,
    addInvestment,
    removeInvestment,
    updateBudget,
    setSortOption
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};
