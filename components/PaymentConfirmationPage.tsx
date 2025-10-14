import React from 'react';
import { Card } from './Card';
import { CheckCircle2 } from './icons';

interface PaymentConfirmationPageProps {
  onReturn: () => void;
}

const DetailRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center w-full text-sm">
        <p className="text-text-secondary">{label}</p>
        <p className="font-semibold text-text-main">{value}</p>
    </div>
);

export const PaymentConfirmationPage: React.FC<PaymentConfirmationPageProps> = ({ onReturn }) => {
    const confirmationDetails = {
        orderId: 'SUG-2025-09A1B2',
        amountPaid: '৳28,500.00',
        paymentDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };

    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-lg mx-auto relative">
                <Card className="text-center p-8 md:p-12 relative overflow-hidden">
                    {/* Ticket-style cutouts */}
                    <div className="absolute top-[230px] -left-5 w-10 h-10 bg-background rounded-full"></div>
                    <div className="absolute top-[230px] -right-5 w-10 h-10 bg-background rounded-full"></div>

                    <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center ring-8 ring-purple-50">
                        <CheckCircle2 className="w-12 h-12 text-purple-600" />
                    </div>
                    
                    <p className="text-sm font-semibold text-purple-600 mt-6">Great!</p>
                    <h1 className="text-3xl font-bold font-atkinson text-text-main mt-1">Payment Success</h1>
                    
                    <div className="space-y-3 mt-8">
                        <DetailRow label="Order ID" value={confirmationDetails.orderId} />
                        <DetailRow label="Amount Paid" value={confirmationDetails.amountPaid} />
                        <DetailRow label="Payment Date" value={confirmationDetails.paymentDate} />
                    </div>

                    <div className="my-8 border-t-2 border-dashed border-gray-200"></div>

                    <div className="space-y-2">
                        <p className="text-text-secondary">Total Paid</p>
                        <p className="text-4xl font-bold text-brand-pink">{confirmationDetails.amountPaid}</p>
                    </div>

                </Card>
                <div className="mt-8">
                    <button 
                        onClick={onReturn}
                        className="w-full bg-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        Return to Payments Hub
                    </button>
                </div>
            </div>
        </div>
    );
};
