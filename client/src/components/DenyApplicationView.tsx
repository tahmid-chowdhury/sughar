import React from 'react';

interface DenyApplicationViewProps {
  applicationId?: string;
  onDeny?: (reason: string) => void;
  onCancel?: () => void;
}

const DenyApplicationView: React.FC<DenyApplicationViewProps> = ({ onDeny, onCancel }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const reason = new FormData(form).get('reason') as string;
    onDeny?.(reason);
  };

  return (
    <div>
      <h2>Deny Application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reason">Reason for Denial</label>
          <textarea id="reason" name="reason" required />
        </div>
        <div>
          <button type="submit">Confirm Denial</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DenyApplicationView;