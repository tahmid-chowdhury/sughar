import React from 'react';

interface DocumentTableProps {
  documents?: any[];
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents = [] }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {documents.map((doc, index) => (
          <tr key={index}>
            <td>{doc.name}</td>
            <td>{doc.type}</td>
            <td>{doc.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DocumentTable;