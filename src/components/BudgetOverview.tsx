
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvestments } from '../context/InvestmentContext';
import { Progress } from '@/components/ui/progress';
import { DollarSign, ArrowDown, ArrowUp } from 'lucide-react';

const BudgetOverview: React.FC = () => {
  const { budget, priorityList } = useInvestments();
  
  const percentAllocated = (budget.allocatedBudget / budget.totalBudget) * 100;
  const formattedPercent = percentAllocated.toFixed(1);
  
  // Calculate total development and marketing costs
  const developmentCost = priorityList.reduce((sum, inv) => sum + inv.developmentCost, 0);
  const marketingCost = priorityList.reduce((sum, inv) => sum + inv.marketingCost, 0);
  const supportCost = priorityList.reduce((sum, inv) => sum + inv.ongoingSupportCost, 0);
  
  // Calculate expected revenue from priority list
  const expectedRevenue = priorityList.reduce((sum, inv) => sum + inv.expectedRevenue, 0);
  
  // Calculate ROI for the portfolio
  const totalCost = budget.allocatedBudget;
  const portfolioRoi = totalCost > 0 ? expectedRevenue / totalCost : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            R&D Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${budget.allocatedBudget.toLocaleString()} 
            <span className="text-xs font-normal text-muted-foreground ml-1">
              of ${budget.totalBudget.toLocaleString()}
            </span>
          </div>
          <Progress value={percentAllocated} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {formattedPercent}% of total budget allocated
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <ArrowDown className="h-4 w-4 mr-1" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Development</span>
                <span className="font-medium">${developmentCost.toLocaleString()}</span>
              </div>
              <Progress value={(developmentCost / budget.totalBudget) * 100} className="h-1 mt-1" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Marketing</span>
                <span className="font-medium">${marketingCost.toLocaleString()}</span>
              </div>
              <Progress value={(marketingCost / budget.totalBudget) * 100} className="h-1 mt-1" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ongoing Support (yearly)</span>
                <span className="font-medium">${supportCost.toLocaleString()}</span>
              </div>
              <Progress value={(supportCost / budget.totalBudget) * 100} className="h-1 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <ArrowUp className="h-4 w-4 mr-1" />
            Expected Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${expectedRevenue.toLocaleString()}</div>
          <div className="flex items-center mt-2">
            <span className={`text-sm inline-flex items-center ${
              portfolioRoi >= 1 ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="font-medium mr-1">ROI: {portfolioRoi.toFixed(2)}x</span>
              {portfolioRoi >= 1 ? 
                <ArrowUp className="h-3 w-3" /> : 
                <ArrowDown className="h-3 w-3" />
              }
            </span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Remaining Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${budget.remainingBudget.toLocaleString()}</div>
          <Progress 
            value={(budget.remainingBudget / budget.totalBudget) * 100} 
            className="h-2 mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-2">
            {((budget.remainingBudget / budget.totalBudget) * 100).toFixed(1)}% of budget remaining
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOverview;
