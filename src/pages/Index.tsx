
import React from 'react';
import { InvestmentProvider } from '../context/InvestmentContext';
import Navbar from '../components/Navbar';
import InvestmentForm from '../components/InvestmentForm';
import PriorityList from '../components/PriorityList';
import Backlog from '../components/Backlog';
import BudgetOverview from '../components/BudgetOverview';
import EditInvestmentModal from '../components/EditInvestmentModal';
import { DragDropContext } from 'react-beautiful-dnd';

const Index = () => {
  return (
    <InvestmentProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <BudgetOverview />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="order-2 lg:order-1 lg:col-span-2">
              <div className="space-y-6">
                <PriorityList />
                <Backlog />
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <InvestmentForm />
            </div>
          </div>
          
          <EditInvestmentModal />
        </main>
      </div>
    </InvestmentProvider>
  );
};

export default Index;
