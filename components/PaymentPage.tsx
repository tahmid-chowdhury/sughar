import React, { useState } from 'react';
import { Card } from './Card';
import { ArrowLeft, CreditCard, Bank, BkashLogo, PlusCircle } from './icons';

interface PaymentPageProps {
  onBack: () => void;
  onConfirm: () => void;
}

const savedPaymentMethods = [
    { id: 'checking-1234', type: 'Checking Account', details: 'Bank of BD - ...1234', icon: Bank },
    { id: 'credit-5678', type: 'Credit Card', details: 'Visa ending in 5678', icon: CreditCard },
    { id: 'debit-9012', type: 'Debit Card', details: 'Mastercard ending in 9012', icon: CreditCard },
    { id: 'bkash-3456', type: 'bKash', details: 'Account ...3456', icon: BkashLogo },
];

const NewCardForm = () => (
    <div className="space-y-4 pt-6 mt-6 border-t border-gray-100">
        <div>
            <label className="text-sm font-medium text-text-main">Card Number</label>
            <input type="text" placeholder="**** **** **** ****" className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm font-medium text-text-main">Expiry Date</label>
                <input type="text" placeholder="MM / YY" className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"/>
            </div>
            <div>
                <label className="text-sm font-medium text-text-main">CVC</label>
                <input type="text" placeholder="***" className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"/>
            </div>
        </div>
            <div>
            <label className="text-sm font-medium text-text-main">Name on Card</label>
            <input type="text" placeholder="John Doe" className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-secondary"/>
        </div>
    </div>
);

const PaymentMethodOption: React.FC<{
    id: string;
    icon: React.ElementType;
    type: string;
    details?: string;
    selectedMethod: string;
    onSelect: (id: string) => void;
}> = ({ id, icon: Icon, type, details, selectedMethod, onSelect }) => {
    const isSelected = selectedMethod === id;
    return (
        <label htmlFor={id} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected ? 'border-accent-secondary bg-purple-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
            <input
                type="radio"
                id={id}
                name="paymentMethod"
                value={id}
                checked={isSelected}
                onChange={() => onSelect(id)}
                className="h-5 w-5 text-accent-secondary focus:ring-accent-secondary border-gray-300"
            />
            <div className="ml-4 flex items-center">
                <Icon className={`w-8 h-8 mr-4 ${id === 'bkash-3456' ? '' : 'text-text-secondary'}`} />
                <div>
                    <p className="font-semibold text-text-main">{type}</p>
                    {details && <p className="text-sm text-text-secondary">{details}</p>}
                </div>
            </div>
        </label>
    );
}


export const PaymentPage: React.FC<PaymentPageProps> = ({ onBack, onConfirm }) => {
    const [selectedMethodId, setSelectedMethodId] = useState(savedPaymentMethods[0].id);

    const paymentDetails = [
        { label: 'Current Rent', amount: '৳25,000.00' },
        { label: 'Utility Charges', amount: '৳3,500.00' },
    ];
    const totalAmountDue = '৳28,500.00';

    return (
        <div className="container mx-auto">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payments Hub
            </button>
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Make a Payment</h1>
                <p className="text-text-secondary mt-1">Review your payment details and confirm your payment method.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Payment Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="font-atkinson text-xl font-bold text-text-main mb-6">Payment Method</h3>
                        
                        <div className="space-y-4">
                            {savedPaymentMethods.map(method => (
                                <PaymentMethodOption
                                    key={method.id}
                                    id={method.id}
                                    icon={method.icon}
                                    type={method.type}
                                    details={method.details}
                                    selectedMethod={selectedMethodId}
                                    onSelect={setSelectedMethodId}
                                />
                            ))}
                             <PaymentMethodOption
                                id="new"
                                icon={PlusCircle}
                                type="Add new credit/debit card"
                                selectedMethod={selectedMethodId}
                                onSelect={setSelectedMethodId}
                            />
                        </div>

                        {selectedMethodId === 'new' && <NewCardForm />}

                        <div className="mt-8">
                             <button onClick={onConfirm} className="w-full bg-accent-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-lg shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                Confirm Payment of {totalAmountDue}
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <Card>
                         <h3 className="font-atkinson text-xl font-bold text-text-main mb-6">Payment Summary</h3>
                         <div className="space-y-3 text-sm">
                            {paymentDetails.map(item => (
                                <div key={item.label} className="flex justify-between items-center">
                                    <p className="text-text-secondary">{item.label}</p>
                                    <p className="font-semibold text-text-main">{item.amount}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-100 my-4"></div>
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-text-main">Total Amount Due</p>
                            <p className="text-lg font-bold text-brand-pink">{totalAmountDue}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
