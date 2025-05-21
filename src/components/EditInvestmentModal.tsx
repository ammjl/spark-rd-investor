
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  ArrowUp,
  Wrench,
  TrendingUp,
  PieChart
} from 'lucide-react';
import { useInvestments } from '../context/InvestmentContext';
import { Investment } from '../types/investment';
import { calculateCustomerValue } from '../utils/prioritization';
import { Badge } from '@/components/ui/badge';

// Form schema validation
const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  developmentCost: z.coerce.number().positive('Must be a positive number'),
  ongoingSupportCost: z.coerce.number().min(0, 'Cannot be negative'),
  marketingCost: z.coerce.number().min(0, 'Cannot be negative'),
  timeFrame: z.coerce.number().min(1, 'Minimum 1 month').max(36, 'Maximum 36 months'),
  technicalFeasibility: z.coerce.number().min(1, 'Minimum value 1').max(10, 'Maximum value 10'),
  fiscalValueToCustomer: z.coerce.number().min(1, 'Minimum value 1').max(10, 'Maximum value 10'),
  marketOpportunity: z.coerce.number().min(1, 'Minimum value 1').max(10, 'Maximum value 10'),
  expectedRevenue: z.coerce.number().positive('Must be a positive number'),
});

type FormValues = z.infer<typeof formSchema>;

const EditInvestmentModal: React.FC = () => {
  const { 
    selectedInvestment, 
    setSelectedInvestment, 
    updateInvestment 
  } = useInvestments();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedInvestment ? {
      name: selectedInvestment.name,
      description: selectedInvestment.description,
      developmentCost: selectedInvestment.developmentCost,
      ongoingSupportCost: selectedInvestment.ongoingSupportCost,
      marketingCost: selectedInvestment.marketingCost,
      timeFrame: selectedInvestment.timeFrame,
      technicalFeasibility: selectedInvestment.technicalFeasibility,
      fiscalValueToCustomer: selectedInvestment.fiscalValueToCustomer,
      marketOpportunity: selectedInvestment.marketOpportunity,
      expectedRevenue: selectedInvestment.expectedRevenue,
    } : {
      name: '',
      description: '',
      developmentCost: 0,
      ongoingSupportCost: 0,
      marketingCost: 0,
      timeFrame: 12,
      technicalFeasibility: 5,
      fiscalValueToCustomer: 5,
      marketOpportunity: 5,
      expectedRevenue: 0,
    },
  });
  
  React.useEffect(() => {
    if (selectedInvestment) {
      form.reset({
        name: selectedInvestment.name,
        description: selectedInvestment.description,
        developmentCost: selectedInvestment.developmentCost,
        ongoingSupportCost: selectedInvestment.ongoingSupportCost,
        marketingCost: selectedInvestment.marketingCost,
        timeFrame: selectedInvestment.timeFrame,
        technicalFeasibility: selectedInvestment.technicalFeasibility,
        fiscalValueToCustomer: selectedInvestment.fiscalValueToCustomer,
        marketOpportunity: selectedInvestment.marketOpportunity,
        expectedRevenue: selectedInvestment.expectedRevenue,
      });
    }
  }, [selectedInvestment, form]);

  const technicalFeasibility = form.watch('technicalFeasibility');
  const fiscalValueToCustomer = form.watch('fiscalValueToCustomer');
  const marketOpportunity = form.watch('marketOpportunity');
  
  const customerValue = calculateCustomerValue(
    technicalFeasibility, 
    fiscalValueToCustomer, 
    marketOpportunity
  );

  const onSubmit = (data: FormValues) => {
    if (!selectedInvestment) return;
    
    const updatedInvestment: Investment = {
      ...selectedInvestment,
      name: data.name,
      description: data.description,
      developmentCost: data.developmentCost,
      ongoingSupportCost: data.ongoingSupportCost,
      marketingCost: data.marketingCost,
      timeFrame: data.timeFrame,
      technicalFeasibility: data.technicalFeasibility,
      fiscalValueToCustomer: data.fiscalValueToCustomer,
      marketOpportunity: data.marketOpportunity,
      customerValue: customerValue,
      expectedRevenue: data.expectedRevenue,
    };
    
    updateInvestment(updatedInvestment);
    setSelectedInvestment(null);
  };

  const handleClose = () => {
    setSelectedInvestment(null);
  };

  if (!selectedInvestment) {
    return null;
  }

  return (
    <Dialog open={!!selectedInvestment} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Investment</DialogTitle>
          <DialogDescription>
            Update the details of this investment.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature X Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Brief description of the investment" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="developmentCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Development Cost
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input className="pl-7" type="number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ongoingSupportCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Ongoing Support (yearly)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input className="pl-7" type="number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="marketingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Marketing Cost
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input className="pl-7" type="number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expectedRevenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        Expected Revenue
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input className="pl-7" type="number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="timeFrame"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Time Frame (months)
                    </FormLabel>
                    <div className="flex items-center space-x-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={36}
                          step={1}
                          value={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <span className="font-medium w-12 text-right">{value} mo</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 border rounded-md p-4 bg-gray-50">
                <h3 className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Customer Value Assessment
                </h3>
                
                <FormField
                  control={form.control}
                  name="technicalFeasibility"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Wrench className="h-4 w-4 mr-1" />
                        Technical Feasibility (1-10)
                      </FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <span className="font-medium w-12 text-right">{value}/10</span>
                      </div>
                      <FormDescription>
                        How technically feasible is this to implement?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fiscalValueToCustomer"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Fiscal Value to Customer (1-10)
                      </FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <span className="font-medium w-12 text-right">{value}/10</span>
                      </div>
                      <FormDescription>
                        How much fiscal value does this provide to customers?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="marketOpportunity"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Market Opportunity (1-10)
                      </FormLabel>
                      <div className="flex items-center space-x-4">
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                            className="w-full"
                          />
                        </FormControl>
                        <span className="font-medium w-12 text-right">{value}/10</span>
                      </div>
                      <FormDescription>
                        How strong is the market opportunity?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium text-sm flex items-center">
                    <PieChart className="h-4 w-4 mr-1" />
                    Average Customer Value Score:
                  </span>
                  <Badge className="text-lg" variant={customerValue >= 7 ? "default" : customerValue >= 4 ? "secondary" : "outline"}>
                    {customerValue}/10
                  </Badge>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvestmentModal;
