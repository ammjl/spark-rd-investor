
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useInvestments } from '../context/InvestmentContext';
import { Button } from '@/components/ui/button';
import { calculateROI } from '../utils/prioritization';
import { List, DollarSign, Calendar, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Backlog: React.FC = () => {
  const { backlog, removeInvestment } = useInvestments();

  return (
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
                <div key={investment.id} className="p-4 border rounded-md bg-gray-50 flex flex-col md:flex-row justify-between">
                  <div className="space-y-1 mb-2 md:mb-0">
                    <h3 className="font-medium">{investment.name}</h3>
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
                      <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                        <Users className="h-3 w-3" />
                        Value: {investment.customerValue}/10
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
                  <div className="flex items-center">
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
  );
};

export default Backlog;
