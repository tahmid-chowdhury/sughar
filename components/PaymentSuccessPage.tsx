
import React from 'react';
import { Card } from './Card';
import { CheckCircle2 } from './icons';

interface PaymentSuccessPageProps {
  orderId: string;
  amountPaid: number;
  paymentDate: string;
  onReturnToHub: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  orderId,
  amountPaid,
  paymentDate,
  onReturnToHub,
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-purple-600" />
            </div>
          </div>

          {/* Success Message */}
          <p className="text-purple-600 font-semibold mb-1">Great!</p>
          <h1 className="text-2xl font-bold font-atkinson text-text-main mb-6">Payment Success</h1>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Order ID</span>
              <span className="text-text-main font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Amount Paid</span>
              <span className="text-text-main font-medium">৳{amountPaid.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Payment Date</span>
              <span className="text-text-main font-medium">{paymentDate}</span>
            </div>
          </div>

          {/* Total Paid */}
          <div className="mb-6">
            <p className="text-sm text-text-secondary mb-2">Total Paid</p>
            <p className="text-4xl font-bold text-brand-pink">৳{amountPaid.toLocaleString()}.00</p>
          </div>
        </Card>

        {/* Return Button */}
        <button
          onClick={onReturnToHub}
          className="w-full mt-6 bg-brand-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Return to Payments Hub
        </button>
      </div>
    </div>
  );
};
