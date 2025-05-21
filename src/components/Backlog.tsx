
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useInvestments } from '../context/InvestmentContext';
import { Button } from '@/components/ui/button';
import { calculateROI, wouldExceedBudget } from '../utils/prioritization';
import { List, DollarSign, Calendar, Users, Edit, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BudgetExceededDialog from './BudgetExceededDialog';
import { Investment } from '../types/investment';

const Backlog: React.FC = () => {
  const { 
    backlog, 
    removeInvestment, 
    setSelectedInvestment, 
    moveInvestment, 
    budget 
  } = useInvestments();
  
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [selectedInvestmentForBudget, setSelectedInvestmentForBudget] = useState<{
    name: string;
    cost: number;
    id: string;
  } | null>(null);

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment);
  };

  const handleMoveInvestment = (investment: Investment) => {
    const totalCost = investment.developmentCost + investment.marketingCost;
    
    // Check if would exceed budget
    if (wouldExceedBudget(investment, budget.remainingBudget)) {
      setSelectedInvestmentForBudget({
        name: investment.name,
        cost: totalCost,
        id: investment.id
      });
      setBudgetDialogOpen(true);
      return;
    }
    
    moveInvestment(investment.id, 'backlog', 'priority');
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <List className="mr-2 h-5 w-5" />
              <CardTitle>Investment Backlog</CardTitle>
            </div>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {backlog.length} investments
            </Badge>
          </div>
          <CardDescription>
            Investments that don't fit within the current budget but should be considered when more budget becomes available.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backlog.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No investments in the backlog. All investments fit in the current budget.
            </div>
          ) : (
            <div className="space-y-3">
              {backlog.map((investment) => {
                const roi = calculateROI(investment);
                const totalCost = investment.developmentCost + investment.marketingCost;
                
                return (
                  <div 
                    key={investment.id} 
                    className={`p-4 border rounded-md ${investment.approved ? 'bg-green-50 border-green-200' : 'bg-gray-50'} flex flex-col md:flex-row justify-between`}
                  >
                    <div className="space-y-1 mb-2 md:mb-0 flex-grow">
                      <div className="flex items-center">
                        <h3 className="font-medium">{investment.name}</h3>
                        {investment.approved && (
                          <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                            Approved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{investment.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200">
                          <DollarSign className="h-3 w-3" />
                          ${totalCost.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 border-purple-200">
                          <Calendar className="h-3 w-3" />
                          {investment.timeFrame} months
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 group relative">
                          <Users className="h-3 w-3" />
                          Value: {investment.customerValue}/10
                          
                          <div className="absolute left-0 bottom-full mb-1 bg-white p-2 rounded shadow-lg z-10 w-48 hidden group-hover:block">
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Technical Feasibility:</span>
                                <span>{investment.technicalFeasibility}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Fiscal Value:</span>
                                <span>{investment.fiscalValueToCustomer}/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Market Opportunity:</span>
                                <span>{investment.marketOpportunity}/10</span>
                              </div>
                            </div>
                          </div>
                        </Badge>
                        <Badge variant="outline" className={
                          roi >= 2 ? "bg-green-50 text-green-700 border-green-200" :
                          roi >= 1 ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }>
                          ROI: {roi.toFixed(1)}x
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveInvestment(investment)}
                        className="flex items-center"
                      >
                        <ArrowUp className="h-4 w-4 mr-1" />
                        Move to Priority
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(investment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => removeInvestment(investment.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <BudgetExceededDialog
        open={budgetDialogOpen}
        onClose={() => setBudgetDialogOpen(false)}
        investmentName={selectedInvestmentForBudget?.name || ""}
        investmentCost={selectedInvestmentForBudget?.cost || 0}
        remainingBudget={budget.remainingBudget}
      />
    </>
  );
};

export default Backlog;
