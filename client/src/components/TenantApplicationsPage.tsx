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
  age?: number;
  dateOfBirth?: string;
  employer?: string;
  yearsAtEmployer?: number;
  occupation?: string;
  tenantRating?: string;
  isIncomeConsistent?: boolean;
}

const TenantApplicationsPage: React.FC<TenantApplicationsPageProps> = ({ 
  setViewingTenantId, 
  onBuildingClick, 
  onUnitClick 
}) => {
  const [applications, setApplications] = useState<TenantApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const loadHardcodedApplications = () => {
      try {
        setLoading(true);
        
        // Hardcoded rental applications based on provided data
        const hardcodedApplications: TenantApplication[] = [
          {
            id: 'APP001',
            applicantName: 'Raiyan Rahman',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 120000,
            desiredMoveInDate: '2025-11-01',
            employmentStatus: 'Software Engineer at Grameenphone IT Division (3 years)',
            previousAddress: 'Previous rental history available',
            applicationDate: '2025-09-15',
            status: 'pending',
            rating: 4.8,
            verified: true,
            matchPercentage: 95,
            age: 29,
            dateOfBirth: '1996-02-02',
            employer: 'Grameenphone IT Division',
            yearsAtEmployer: 3,
            occupation: 'Software Engineer',
            tenantRating: '4.8 (previous 2 leases)',
            isIncomeConsistent: true
          },
          {
            id: 'APP002',
            applicantName: 'Niloy Hossain',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 45000,
            desiredMoveInDate: '2025-10-15',
            employmentStatus: 'Freelance Graphic Designer (2 years)',
            previousAddress: 'No previous rental history',
            applicationDate: '2025-09-20',
            status: 'pending',
            rating: undefined,
            verified: false,
            matchPercentage: 72,
            age: 24,
            dateOfBirth: '2001-07-17',
            employer: 'Self-employed (Upwork/Fiverr)',
            yearsAtEmployer: 2,
            occupation: 'Freelance Graphic Designer',
            tenantRating: 'None (first time renter)',
            isIncomeConsistent: false
          },
          {
            id: 'APP003',
            applicantName: 'Arif Mahmud',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 95000,
            desiredMoveInDate: '2025-12-01',
            employmentStatus: 'Senior Accountant at BRAC Bank (5 years)',
            previousAddress: 'Previous rental history available',
            applicationDate: '2025-09-18',
            status: 'pending',
            rating: 4.5,
            verified: true,
            matchPercentage: 88,
            age: 35,
            dateOfBirth: '1989-11-11',
            employer: 'BRAC Bank',
            yearsAtEmployer: 5,
            occupation: 'Senior Accountant',
            tenantRating: '4.5',
            isIncomeConsistent: true
          },
          {
            id: 'APP004',
            applicantName: 'Zarin Tasnim',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 70000,
            desiredMoveInDate: '2025-11-15',
            employmentStatus: 'Lecturer (Economics) at University of Dhaka (4 years)',
            previousAddress: 'Previous rental history available',
            applicationDate: '2025-09-22',
            status: 'pending',
            rating: 4.9,
            verified: true,
            matchPercentage: 92,
            age: 32,
            dateOfBirth: '1993-05-25',
            employer: 'University of Dhaka',
            yearsAtEmployer: 4,
            occupation: 'Lecturer (Economics)',
            tenantRating: '4.9',
            isIncomeConsistent: true
          },
          {
            id: 'APP005',
            applicantName: 'Ayaan Chowdhury',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 65000,
            desiredMoveInDate: '2025-10-30',
            employmentStatus: 'Junior Doctor (Resident) at Square Hospital (1 year)',
            previousAddress: 'No previous rental history',
            applicationDate: '2025-09-25',
            status: 'pending',
            rating: undefined,
            verified: true,
            matchPercentage: 78,
            age: 26,
            dateOfBirth: '1998-12-04',
            employer: 'Square Hospital',
            yearsAtEmployer: 1,
            occupation: 'Junior Doctor (Resident)',
            tenantRating: 'None (new renter)',
            isIncomeConsistent: true
          },
          {
            id: 'APP006',
            applicantName: 'Nusrat Jahan',
            unit: 'Available',
            property: 'Pending Assignment',
            monthlyIncome: 150000,
            desiredMoveInDate: '2025-11-30',
            employmentStatus: 'Fashion Entrepreneur - Owns "Nusrat Styles" (6 years)',
            previousAddress: 'Previous rental history available',
            applicationDate: '2025-09-12',
            status: 'pending',
            rating: 4.7,
            verified: true,
            matchPercentage: 93,
            age: 32,
            dateOfBirth: '1993-06-15', // Estimated since not provided
            employer: 'Owns boutique "Nusrat Styles"',
            yearsAtEmployer: 6,
            occupation: 'Fashion Entrepreneur',
            tenantRating: '4.7',
            isIncomeConsistent: false // Business income can vary
          }
        ];

        setApplications(hardcodedApplications);
        setError(null);
      } catch (err) {
        console.error('Error loading hardcoded applications:', err);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(() => {
      loadHardcodedApplications();
    }, 1000);
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
                  Monthly Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupation & Employer
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
                          {application.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{application.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {application.age} | Applied: {new Date(application.applicationDate).toLocaleDateString()}
                        </div>
                        {application.tenantRating && application.tenantRating !== 'None (first time renter)' && application.tenantRating !== 'None (new renter)' && (
                          <div className="text-xs text-green-600 font-medium">
                            Rating: {application.tenantRating}
                          </div>
                        )}
                        {(application.tenantRating === 'None (first time renter)' || application.tenantRating === 'None (new renter)') && (
                          <div className="text-xs text-orange-600 font-medium">
                            {application.tenantRating}
                          </div>
                        )}
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
                      <div>
                        <span className="font-medium text-gray-900">
                          ৳{application.monthlyIncome.toLocaleString()} BDT
                        </span>
                        {application.isIncomeConsistent === false && (
                          <div className="text-xs text-orange-600">~inconsistent</div>
                        )}
                        {application.isIncomeConsistent === true && (
                          <div className="text-xs text-green-600">stable</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{application.occupation}</div>
                      <div className="text-gray-600 text-xs">{application.employer}</div>
                      <div className="text-gray-500 text-xs">
                        {application.yearsAtEmployer} year{application.yearsAtEmployer !== 1 ? 's' : ''} experience
                      </div>
                    </div>
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
            <p className="text-gray-400">Applications will appear here when tenants apply for your units.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TenantApplicationsPage;
