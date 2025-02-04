// Mock data for development - replace with actual Google Sheets API integration
const mockExpenseData = {
  expenses: [
    { date: '2024-03-01', amount: 300, category: 'food' },
    { date: '2024-03-02', amount: 450, category: 'transport' },
    { date: '2024-03-03', amount: 200, category: 'utilities' },
    { date: '2024-03-04', amount: 600, category: 'housing' },
    { date: '2024-03-05', amount: 400, category: 'entertainment' },
    { date: '2024-03-06', amount: 350, category: 'shopping' },
    { date: '2024-03-07', amount: 500, category: 'healthcare' }
  ],
  totals: {
    weekly: 2800,
    monthly: 8500,
    largest: 850
  }
};

export async function submitToGoogleSheets(data: any) {
  // For development, just log the data and return a success response
  console.log('Submitting data:', data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Expense added successfully!' });
    }, 1000);
  });
}

export async function fetchExpenseData() {
  // For development, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExpenseData);
    }, 1000);
  });
}