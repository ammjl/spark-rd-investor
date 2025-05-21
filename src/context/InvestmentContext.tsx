import React, { createContext, useContext, useState, useEffect } from 'react';
import { Investment, BudgetInfo, SortOption } from '../types/investment';
import { calculatePriorityScore, divideInvestments, calculateCustomerValue, sortInvestments } from '../utils/prioritization';
import { toast } from "@/components/ui/use-toast";

interface InvestmentContextType {
  investments: Investment[];
  priorityList: Investment[];
  backlog: Investment[];
  budget: BudgetInfo;
  sortOption: SortOption;
  selectedInvestment: Investment | null;
  addInvestment: (investment: Omit<Investment, 'id' | 'dateAdded' | 'priorityScore' | 'customerValue' | 'manualPriority' | 'approved'>) => void;
  updateInvestment: (investment: Investment) => void;
  removeInvestment: (id: string) => void;
  updateBudget: (budget: number) => void;
  setSortOption: (option: SortOption) => void;
  setSelectedInvestment: (investment: Investment | null) => void;
  moveInvestment: (investmentId: string, fromList: 'priority' | 'backlog', toList: 'priority' | 'backlog') => void;
  reorderPriorityList: (startIndex: number, endIndex: number) => void;
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
  selectedInvestment: null,
  addInvestment: () => {},
  updateInvestment: () => {},
  removeInvestment: () => {},
  updateBudget: () => {},
  setSortOption: () => {},
  setSelectedInvestment: () => {},
  moveInvestment: () => {},
  reorderPriorityList: () => {}
};

const InvestmentContext = createContext<InvestmentContextType>(defaultContext);

export const useInvestments = () => useContext(InvestmentContext);

export const InvestmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [budget, setBudget] = useState<BudgetInfo>(initialBudget);
  const [priorityList, setPriorityList] = useState<Investment[]>([]);
  const [backlog, setBacklog] = useState<Investment[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.PriorityScore);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);

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
    
    // Apply sorting before setting lists
    const sortedPriorityList = sortInvestments(newPriorityList, sortOption);
    setPriorityList(sortedPriorityList);
    setBacklog(newBacklog);
    setBudget({
      ...budget,
      allocatedBudget,
      remainingBudget: budget.totalBudget - allocatedBudget
    });
  }, [investments, budget.totalBudget, sortOption]);

  const addInvestment = (newInvestment: Omit<Investment, 'id' | 'dateAdded' | 'priorityScore' | 'customerValue' | 'manualPriority' | 'approved'>) => {
    // Calculate customer value as the average of the three inputs
    const customerValue = calculateCustomerValue(
      newInvestment.technicalFeasibility,
      newInvestment.fiscalValueToCustomer,
      newInvestment.marketOpportunity
    );
    
    const investment: Investment = {
      ...newInvestment,
      customerValue,
      id: Math.random().toString(36).substring(2, 9),
      dateAdded: new Date(),
      approved: false,
      manualPriority: investments.length // Add to the end of the list by default
    };

    setInvestments(prev => [...prev, investment]);
    toast({
      title: "Investment added",
      description: `${investment.name} has been added to the assessment.`,
    });
  };

  const updateInvestment = (updatedInvestment: Investment) => {
    // Calculate customer value as the average of the three inputs
    const customerValue = calculateCustomerValue(
      updatedInvestment.technicalFeasibility,
      updatedInvestment.fiscalValueToCustomer,
      updatedInvestment.marketOpportunity
    );
    
    const investment = {
      ...updatedInvestment,
      customerValue,
    };

    setInvestments(prev => prev.map(inv => inv.id === investment.id ? investment : inv));
    toast({
      title: "Investment updated",
      description: `${investment.name} has been updated.`,
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

  const moveInvestment = (investmentId: string, fromList: 'priority' | 'backlog', toList: 'priority' | 'backlog') => {
    const investment = investments.find(inv => inv.id === investmentId);
    if (!investment) return;

    // If moving from backlog to priority list, check if it would exceed budget
    if (fromList === 'backlog' && toList === 'priority') {
      const investmentCost = investment.developmentCost + investment.marketingCost;
      if (investmentCost > budget.remainingBudget) {
        toast({
          title: "Budget exceeded",
          description: "This investment cannot be moved to the priority list as it would exceed the budget.",
          variant: "destructive"
        });
        return;
      }
      
      // Update the investments array directly
      setInvestments(prev => prev.map(inv => 
        inv.id === investmentId ? { ...inv, approved: false } : inv
      ));
      
      toast({
        title: "Investment moved",
        description: `${investment.name} has been moved to the priority list.`,
      });
    } 
    // If moving from priority list to backlog, mark as approved
    else if (fromList === 'priority' && toList === 'backlog') {
      setInvestments(prev => prev.map(inv => 
        inv.id === investmentId ? { ...inv, approved: true } : inv
      ));
      
      toast({
        title: "Investment approved",
        description: `${investment.name} has been approved and moved to the backlog.`,
      });
    }
  };

  const reorderPriorityList = (startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;
    
    const newPriorityList = [...priorityList];
    const [removed] = newPriorityList.splice(startIndex, 1);
    newPriorityList.splice(endIndex, 0, removed);
    
    // Update manualPriority for all items
    const updatedPriorityList = newPriorityList.map((item, index) => ({
      ...item,
      manualPriority: index
    }));
    
    // Update investments with new manualPriority values
    setInvestments(prev => prev.map(inv => {
      const updatedInv = updatedPriorityList.find(item => item.id === inv.id);
      return updatedInv || inv;
    }));
    
    setPriorityList(updatedPriorityList);
  };

  const value = {
    investments,
    priorityList,
    backlog,
    budget,
    sortOption,
    selectedInvestment,
    addInvestment,
    updateInvestment,
    removeInvestment,
    updateBudget,
    setSortOption,
    setSelectedInvestment,
    moveInvestment,
    reorderPriorityList
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};
