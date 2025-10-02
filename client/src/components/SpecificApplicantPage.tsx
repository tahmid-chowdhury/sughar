import React from 'react';

interface SpecificApplicantPageProps {
  applicantId?: string;
}

const SpecificApplicantPage: React.FC<SpecificApplicantPageProps> = ({ applicantId }) => {
  return (
    <div>
      <h1>Applicant Details</h1>
      <div className="applicant-info">
        {/* Applicant details will go here */}
        <p>Applicant ID: {applicantId}</p>
      </div>
    </div>
  );
};

export default SpecificApplicantPage;