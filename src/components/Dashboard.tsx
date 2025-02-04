import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  CreditCard,
  LogOut
} from 'lucide-react';
import { fetchExpenseData } from '../utils/googleSheets';
import { useAuth } from '../context/AuthContext';
import { categories } from '../utils/constants';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState('week');
  const [chartData, setChartData] = useState<any>(null);
  const [totals, setTotals] = useState({
    total: 0,
    monthly: 0,
    largest: 0
  });

  useEffect(() => {
    loadExpenseData();
  }, [dateRange]);

  const loadExpenseData = async () => {
    try {
      const data = await fetchExpenseData();
      setExpenses(data.expenses);
      setTotals({
        total: data.totals.weekly,
        monthly: data.totals.monthly,
        largest: data.totals.largest
      });
      generateChartData(data.expenses);
    } catch (error) {
      console.error('Error loading expense data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data: any[]) => {
    const chartData = {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Daily Expenses',
          data: data.map(item => item.amount),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };
    setChartData(chartData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Finance Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/expenses')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add Expense
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Expenses
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totals.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Monthly Average
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totals.monthly}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Largest Expense
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totals.largest}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Expense Trends
              </h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="year">Last 12 Months</option>
              </select>
            </div>
            {chartData && (
              <div className="h-96">
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Category Breakdown
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${Math.floor(Math.random() * 1000)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;