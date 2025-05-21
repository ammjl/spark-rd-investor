
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Investment, SortOption } from '../types/investment';
import { useInvestments } from '../context/InvestmentContext';
import { Button } from '@/components/ui/button';
import { calculateROI, getPriorityClass } from '../utils/prioritization';
import { ChartBar, DollarSign, Calendar, Users, ArrowUp, ArrowDown, Edit, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import BudgetExceededDialog from './BudgetExceededDialog';
import { toast } from "@/components/ui/use-toast";

const PriorityList: React.FC = () => {
  const {
    priorityList,
    removeInvestment,
    sortOption,
    setSortOption,
    budget,
    setSelectedInvestment,
    moveInvestment,
    reorderPriorityList
  } = useInvestments();
  
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [selectedInvestmentForBudget, setSelectedInvestmentForBudget] = useState<{
    name: string;
    cost: number;
  } | null>(null);

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const handleEdit = (investment: Investment) => {
    setSelectedInvestment(investment);
  };

  const handleMoveToBacklog = (investment: Investment) => {
    moveInvestment(investment.id, 'priority', 'backlog');
    toast({
      title: "Investment moved",
      description: `${investment.name} has been moved to backlog.`
    });
  };
  
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderPriorityList(index, index - 1);
    }
  };
  
  const handleMoveDown = (index: number) => {
    if (index < priorityList.length - 1) {
      reorderPriorityList(index, index + 1);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ChartBar className="mr-2 h-5 w-5" />
              <CardTitle>Investment Theme Priority List</CardTitle>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {priorityList.length} investments
            </Badge>
          </div>
          <CardDescription>
            Investments that fit within the current R&D budget of ${budget.totalBudget.toLocaleString()}.
          </CardDescription>
          <div className="flex justify-end">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SortOption.PriorityScore}>Priority Score</SelectItem>
                <SelectItem value={SortOption.ROI}>ROI</SelectItem>
                <SelectItem value={SortOption.Cost}>Cost</SelectItem>
                <SelectItem value={SortOption.CustomerValue}>Customer Value</SelectItem>
                <SelectItem value={SortOption.TimeFrame}>Time Frame</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {priorityList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No investments in the priority list yet. Add investments to see them here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Cost
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Time
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Value
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      ROI
                    </div>
                  </TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorityList.map((investment, index) => {
                  const roi = calculateROI(investment);
                  const priorityClass = getPriorityClass(investment.priorityScore || 0);
                  const totalCost = investment.developmentCost + investment.marketingCost;
                  return (
                    <TableRow 
                      key={investment.id} 
                      className={priorityClass}
                    >
                      <TableCell className="font-medium">
                        <div>
                          {investment.name}
                          <div className="text-xs text-muted-foreground md:hidden">
                            ${totalCost.toLocaleString()} • {investment.timeFrame} months
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatCurrency(totalCost)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {investment.timeFrame} months
                      </TableCell>
                      <TableCell>
                        <div className="group relative">
                          <div>{investment.customerValue}/10</div>
                          <div className="absolute left-0 top-full mt-1 bg-white p-2 rounded shadow-lg z-10 w-56 hidden group-hover:block">
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
                        </div>
                      </TableCell>
                      <TableCell>
                        {roi.toFixed(1)}x
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={investment.priorityScore! >= 0.7 ? "bg-green-50 text-green-700 border-green-200" : investment.priorityScore! >= 0.4 ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-red-50 text-red-700 border-red-200"}>
                          {(investment.priorityScore! * 10).toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <div className="flex flex-wrap gap-1 justify-end">
                          <div className="flex space-x-1">
                            {index > 0 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMoveUp(index)}
                                title="Move Up"
                              >
                                <MoveUp className="h-4 w-4" />
                              </Button>
                            )}
                            {index < priorityList.length - 1 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleMoveDown(index)}
                                title="Move Down"
                              >
                                <MoveDown className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="flex space-x-1">
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
                              onClick={() => handleMoveToBacklog(investment)}
                              title="Move to Backlog"
                            >
                              <ArrowDown className="h-4 w-4" />
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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

export default PriorityList;
