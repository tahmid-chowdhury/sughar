import React, { useState } from 'react';
import { Card } from './Card';

const DataPopulator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const populateTestData = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMessage('❌ Please log in first');
        return;
      }

      console.log('Populating test data...');
      const response = await fetch('/api/populate-test-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Test data populated successfully:', result);
        setMessage('✅ Test data populated successfully! Refresh the page to see the data.');
      } else {
        const errorText = await response.text();
        console.error('Failed to populate test data:', errorText);
        setMessage(`❌ Failed to populate test data: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error populating test data:', error);
      setMessage('❌ Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Development Helper</h3>
      <p className="text-sm text-gray-600 mb-4">
        If you're not seeing any tenant data, click below to populate the database with sample data:
      </p>
      
      <button
        onClick={populateTestData}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors mb-4"
      >
        {loading ? 'Populating Data...' : 'Populate Test Data'}
      </button>
      
      {message && (
        <div className={`text-sm p-3 rounded-lg ${
          message.includes('✅') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
      
      <details className="mt-4">
        <summary className="text-sm text-gray-500 cursor-pointer">What does this create?</summary>
        <ul className="text-xs text-gray-600 mt-2 space-y-1">
          <li>• 3 properties with units</li>
          <li>• Tenant users and lease agreements</li>
          <li>• Rental applications</li>
          <li>• Service requests and payments</li>
        </ul>
      </details>
    </Card>
  );
};

export default DataPopulator;