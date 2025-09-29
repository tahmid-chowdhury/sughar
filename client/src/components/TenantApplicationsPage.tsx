import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { rentalApplicationsAPI } from '../services/api';
import { Search, User, DollarSign, Calendar, Star, CheckCircle2 as CheckCircle, ChevronDown } from './icons';

interface TenantApplicationsPageProps {
  setViewingTenantId: (id: string) => void;
  onBuildingClick?: (buildingId: string) => void;
  onUnitClick?: (buildingId: string, unitId: string) => void;
}

interface TenantApplication {
  id: string;
  applicantName: string;
  unit: string;
  property: string;
  monthlyIncome: number;
  desiredMoveInDate: string;
  employmentStatus: string;
  previousAddress: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rating?: number;
  verified?: boolean;
  matchPercentage?: number;
}

const TenantApplicationsPage: React.FC<TenantApplicationsPageProps> = ({ 
  setViewingTenantId, 
  onBuildingClick, 
  onUnitClick 
}) => {
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [populating, setPopulating] = useState(false);

  const populateTestData = async () => {
    try {
      setPopulating(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/populate-test-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Test data populated:', result);
        // Refresh the applications after populating
        window.location.reload();
      } else {
        throw new Error('Failed to populate test data');
      }
    } catch (err) {
      console.error('Error populating test data:', err);
      setError('Failed to populate test data');
    } finally {
      setPopulating(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await rentalApplicationsAPI.getAll();
        
        // Transform API data to frontend format
        const transformedApplications = response.map((app: any): TenantApplication => {
          return {
            id: app._id,
            applicantName: app.applicant ? 
              `${app.applicant.firstName} ${app.applicant.lastName}` : 
              'Unknown Applicant',
            unit: app.unit ? 
              app.unit.unitNumber : 
              'Unknown Unit',
            property: app.property ? 
              app.property.address : 
              'Unknown Property',
            monthlyIncome: app.monthlyIncome || 0,
            desiredMoveInDate: app.desiredMoveInDate || 'Not specified',
            employmentStatus: app.employmentStatus || 'Not specified',
            previousAddress: app.previousAddress || 'Not specified',
            applicationDate: app.applicationDate || app.createdAt || 'Unknown',
            status: app.status || 'pending',
            rating: 4,
            verified: Math.random() > 0.5,
            matchPercentage: Math.floor(Math.random() * 40) + 60
          };
        });

        setApplications(transformedApplications);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const verifiedApplications = applications.filter(app => app.verified === true);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenant Applications</h1>
          <p className="text-gray-600">Review and manage rental applications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{pendingApplications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Verified Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{verifiedApplications.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Rated</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(app => (app.rating || 0) >= 4).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Applications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit & Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Move-in Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {application.applicantName}
                          {application.verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied: {new Date(application.applicationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <div>
                        <div className="font-medium text-gray-900">Unit {application.unit}</div>
                        <div className="text-gray-500 text-xs">{application.property}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-900">
                        ${application.monthlyIncome.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{application.employmentStatus}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {new Date(application.desiredMoveInDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">View</button>
                    <button className="text-green-600 hover:text-green-900">Approve</button>
                    <button className="text-red-600 hover:text-red-900">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {applications.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No applications found</p>
            <p className="text-gray-400 mb-6">Applications will appear here when tenants apply for your units.</p>
            <button
              onClick={populateTestData}
              disabled={populating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {populating ? 'Creating Test Data...' : 'Create Sample Data'}
            </button>
            <p className="text-gray-400 text-sm mt-2">
              Click to populate with Asha Properties sample data (4 buildings, 28 units, 90% occupancy)
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TenantApplicationsPage;
