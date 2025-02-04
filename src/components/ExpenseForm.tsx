import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { submitToGoogleSheets } from '../utils/googleSheets';

interface ExpenseEntry {
  description: string;
  note: string;
  amount: string;
}

interface ExpenseData {
  date: string;
  [key: string]: string | ExpenseEntry;
}

const CATEGORIES = [
  { id: 'Food', label: 'Fod', name: 'Food' },
  { id: 'Bills', label: 'Bls', name: 'Bills' },
  { id: 'Housing', label: 'Hsg', name: 'Housing' },
  { id: 'Transports', label: 'Tsp', name: 'Transports' },
  { id: 'Shopping', label: 'Spg', name: 'Shopping' },
  { id: 'Personal_Discretionary', label: 'Prl', name: 'Personal' },
  { id: 'Income', label: 'Inc', name: 'Income' },
  { id: 'Credit_Card', label: 'Crd', name: 'Credit Card' },
  { id: 'Cashback', label: 'Cbk', name: 'Cashback' }
];

function ExpenseForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formData, setFormData] = useState<ExpenseData>({
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    // Initialize form data with empty values for each category
    const initialData: ExpenseData = {
      date: new Date().toISOString().split('T')[0]
    };
    CATEGORIES.forEach(category => {
      initialData[category.id] = {
        description: '',
        note: '',
        amount: ''
      };
    });
    setFormData(initialData);
  }, []);

  const handleInputChange = (
    categoryId: string,
    field: 'description' | 'note' | 'amount',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] as ExpenseEntry),
        [field]: value
      }
    }));
  };

  const displayModal = (message: string) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const validateForm = () => {
    let valid = true;
    CATEGORIES.forEach(category => {
      const entry = formData[category.id] as ExpenseEntry;
      if ((entry.amount && !entry.description) || (!entry.amount && entry.description)) {
        valid = false;
        displayModal(`Please provide both description and amount for ${category.name}`);
      }
    });
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    displayModal('Submitting form...');
    
    try {
      await submitToGoogleSheets(formData);
      displayModal('Expense added successfully!');
      // Reset form after successful submission
      const resetData = {
        date: new Date().toISOString().split('T')[0]
      };
      CATEGORIES.forEach(category => {
        resetData[category.id] = {
          description: '',
          note: '',
          amount: ''
        };
      });
      setFormData(resetData);
    } catch (error) {
      displayModal('Error: Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Daily Expenses</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date:
            </label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ctg</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {CATEGORIES.map((category) => {
                  const entry = formData[category.id] as ExpenseEntry;
                  return (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.label}
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={entry?.description || ''}
                          onChange={(e) => handleInputChange(category.id, 'description', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <textarea
                          value={entry?.note || ''}
                          onChange={(e) => handleInputChange(category.id, 'note', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          step="0.01"
                          value={entry?.amount || ''}
                          onChange={(e) => handleInputChange(category.id, 'amount', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <p className="text-sm text-gray-500">{modalMessage}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseForm;