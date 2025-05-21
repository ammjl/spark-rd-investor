
import { Investment } from "../types/investment";

// Helper function to create dates in the past few weeks
const getRandomPastDate = () => {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return pastDate;
};

export const mockInvestments: Omit<Investment, 'id' | 'priorityScore'>[] = [
  // High ROI, quick implementation
  {
    name: "API Performance Optimization",
    description: "Improve API response times by implementing caching and query optimization",
    developmentCost: 45000,
    ongoingSupportCost: 5000,
    marketingCost: 0,
    timeFrame: 2,
    customerValue: 8,
    expectedRevenue: 150000,
    dateAdded: getRandomPastDate()
  },
  // High customer value, medium cost
  {
    name: "Mobile App Redesign",
    description: "Modernize the user interface of our mobile application to improve user experience",
    developmentCost: 120000,
    ongoingSupportCost: 15000,
    marketingCost: 30000,
    timeFrame: 4,
    customerValue: 9,
    expectedRevenue: 350000,
    dateAdded: getRandomPastDate()
  },
  // Long-term strategic investment
  {
    name: "AI-Powered Recommendation Engine",
    description: "Develop an AI system to provide personalized product recommendations",
    developmentCost: 280000,
    ongoingSupportCost: 45000,
    marketingCost: 60000,
    timeFrame: 9,
    customerValue: 10,
    expectedRevenue: 950000,
    dateAdded: getRandomPastDate()
  },
  // Low cost, quick win
  {
    name: "Bug Fix Package",
    description: "Address top 10 customer-reported bugs in the current product",
    developmentCost: 30000,
    ongoingSupportCost: 2000,
    marketingCost: 0,
    timeFrame: 1,
    customerValue: 7,
    expectedRevenue: 75000,
    dateAdded: getRandomPastDate()
  },
  // Medium ROI, important for compliance
  {
    name: "Security Compliance Upgrade",
    description: "Implement new security features to meet upcoming regulatory requirements",
    developmentCost: 90000,
    ongoingSupportCost: 12000,
    marketingCost: 5000,
    timeFrame: 3,
    customerValue: 6,
    expectedRevenue: 120000,
    dateAdded: getRandomPastDate()
  },
  // Very expensive but potentially transformative
  {
    name: "Blockchain Integration Platform",
    description: "Develop infrastructure to support blockchain-based transactions and contracts",
    developmentCost: 350000,
    ongoingSupportCost: 60000,
    marketingCost: 80000,
    timeFrame: 12,
    customerValue: 8,
    expectedRevenue: 1200000,
    dateAdded: getRandomPastDate()
  },
  // Low cost experimental feature
  {
    name: "Voice Command Prototype",
    description: "Create a prototype for voice-activated features in our product",
    developmentCost: 35000,
    ongoingSupportCost: 8000,
    marketingCost: 15000,
    timeFrame: 2,
    customerValue: 7,
    expectedRevenue: 100000,
    dateAdded: getRandomPastDate()
  },
  // Medium cost, high customer value
  {
    name: "Offline Mode Implementation",
    description: "Add capability for users to work with the application without internet connection",
    developmentCost: 110000,
    ongoingSupportCost: 18000,
    marketingCost: 25000,
    timeFrame: 5,
    customerValue: 9,
    expectedRevenue: 400000,
    dateAdded: getRandomPastDate()
  },
  // Quick implementation, moderate return
  {
    name: "Dashboard Enhancement",
    description: "Add new data visualization and reporting features to the analytics dashboard",
    developmentCost: 60000,
    ongoingSupportCost: 10000,
    marketingCost: 5000,
    timeFrame: 2,
    customerValue: 8,
    expectedRevenue: 150000,
    dateAdded: getRandomPastDate()
  }
];
