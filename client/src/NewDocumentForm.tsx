import React from 'react';

const NewDocumentForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload New Document</h2>
      <div>
        <label htmlFor="name">Document Name</label>
        <input type="text" id="name" name="name" required />
      </div>
      <div>
        <label htmlFor="file">File</label>
        <input type="file" id="file" name="file" required />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default NewDocumentForm;