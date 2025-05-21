
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BudgetExceededDialogProps {
  open: boolean;
  onClose: () => void;
  investmentName: string;
  investmentCost: number;
  remainingBudget: number;
}

const BudgetExceededDialog: React.FC<BudgetExceededDialogProps> = ({
  open,
  onClose,
  investmentName,
  investmentCost,
  remainingBudget
}) => {
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Budget Limit Exceeded</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              You cannot move <strong>{investmentName}</strong> to the priority list as it would exceed your available budget.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Investment cost:</span> 
                <span className="font-semibold text-red-600">{formatCurrency(investmentCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining budget:</span>
                <span className="font-semibold text-green-600">{formatCurrency(remainingBudget)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Budget shortfall:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(investmentCost - remainingBudget)}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BudgetExceededDialog;
