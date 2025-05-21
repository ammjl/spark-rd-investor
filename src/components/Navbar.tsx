
import React from 'react';
import { useInvestments } from '../context/InvestmentContext';
import { 
  Briefcase, 
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { budget, updateBudget } = useInvestments();
  const [newBudget, setNewBudget] = useState(budget.totalBudget.toString());
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBudgetUpdate = () => {
    const budgetValue = parseFloat(newBudget);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      updateBudget(budgetValue);
      setDialogOpen(false);
    }
  };

  return (
    <nav className="bg-investment-darkBlue text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6" />
          <h1 className="text-xl font-bold">R&D Investment Assessment Tool</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-blue-700 px-3 py-1 rounded">
            <DollarSign className="h-5 w-5 text-white mr-1" />
            <span className="font-medium">Budget: ${budget.totalBudget.toLocaleString()}</span>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white text-blue-900 hover:bg-gray-100">
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set R&D Budget</DialogTitle>
                <DialogDescription>
                  Set the total available budget for R&D investments.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="budget">Budget Amount</Label>
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">$</span>
                    <Input
                      type="number"
                      id="budget"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBudgetUpdate}>
                  Update Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
