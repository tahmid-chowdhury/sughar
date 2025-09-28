import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Header } from './Header';
import { dashboardAPI, getAuthToken } from '../services/api';

export const DiagnosticsPage = () => {
  const [diagnostics, setDiagnostics] = useState({
    authToken: null as string | null,
    apiBaseUrl: '',
    connectivity: 'Unknown',
    authStatus: 'Unknown',
    serverResponse: null as any,
    error: null as string | null
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const token = getAuthToken();
    const apiBaseUrl = import.meta.env.VITE_API_URL || 
      (import.meta.env.MODE === 'development' ? 'http://localhost:5050' : '/api');

    setDiagnostics(prev => ({
      ...prev,
      authToken: token ? 'Present' : 'Missing',
      apiBaseUrl: apiBaseUrl
    }));

    // Test basic connectivity
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.status === 401) {
        setDiagnostics(prev => ({
          ...prev,
          connectivity: 'Connected',
          authStatus: 'Authentication Required',
          error: 'No valid authentication token'
        }));
      } else if (response.ok) {
        const data = await response.json();
        setDiagnostics(prev => ({
          ...prev,
          connectivity: 'Connected',
          authStatus: 'Authenticated',
          serverResponse: data,
          error: null
        }));
      } else {
        setDiagnostics(prev => ({
          ...prev,
          connectivity: 'Connected',
          authStatus: 'Error',
          error: `HTTP ${response.status}: ${response.statusText}`
        }));
      }
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        connectivity: 'Failed',
        error: error instanceof Error ? error.message : 'Unknown connection error'
      }));
    }

    // Test financial stats endpoint specifically if we have a token
    if (token) {
      try {
        const financialData = await dashboardAPI.getFinancialStats();
        setDiagnostics(prev => ({
          ...prev,
          serverResponse: { ...prev.serverResponse, financialStats: financialData }
        }));
      } catch (error) {
        console.error('Financial stats test failed:', error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <Header title="System Diagnostics" />

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">API Diagnostics</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Auth Token:</span>
              <span className={diagnostics.authToken === 'Present' ? 'text-green-600' : 'text-red-600'}>
                {diagnostics.authToken || 'Checking...'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">API Base URL:</span>
              <span className="text-blue-600">{diagnostics.apiBaseUrl || 'Loading...'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Server Connectivity:</span>
              <span className={
                diagnostics.connectivity === 'Connected' ? 'text-green-600' : 
                diagnostics.connectivity === 'Failed' ? 'text-red-600' : 'text-yellow-600'
              }>
                {diagnostics.connectivity}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Authentication Status:</span>
              <span className={
                diagnostics.authStatus === 'Authenticated' ? 'text-green-600' : 
                diagnostics.authStatus === 'Authentication Required' ? 'text-yellow-600' : 'text-red-600'
              }>
                {diagnostics.authStatus}
              </span>
            </div>
            
            {diagnostics.error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {diagnostics.error}
              </div>
            )}
          </div>
          
          <button 
            onClick={runDiagnostics}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Run Diagnostics Again
          </button>
        </Card>

        {diagnostics.serverResponse && (
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">Server Response</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(diagnostics.serverResponse, null, 2)}
            </pre>
          </Card>
        )}

        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Troubleshooting Steps</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>If Auth Token is Missing: Please log in to the application</li>
            <li>If Server Connectivity is Failed: Ensure the backend server is running on the correct port</li>
            <li>If Authentication Required: Check if your session has expired and try logging in again</li>
            <li>Check the browser console for additional error messages</li>
            <li>Verify the backend server is running: <code>cd server && npm run dev</code></li>
          </ul>
        </Card>
      </div>
    </div>
  );
};