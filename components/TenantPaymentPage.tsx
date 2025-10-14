
import React, { useState } from 'react';
import { Card } from './Card';
import { User, AppData } from '../types';
import { ArrowLeft, CreditCard, Building, Phone, Plus } from './icons';

interface TenantPaymentPageProps {
  currentUser: User;
  appData: AppData;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

type PaymentMethodType = 'checking' | 'credit' | 'debit' | 'bkash' | 'new';

const PaymentMethodOption: React.FC<{
  id: PaymentMethodType;
  icon: React.ElementType;
  iconBg?: string;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: (id: PaymentMethodType) => void;
}> = ({ id, icon: Icon, iconBg, title, subtitle, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center p-4 border rounded-lg transition-all ${
        selected ? 'border-brand-pink bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-center mr-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-brand-pink' : 'border-gray-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-brand-pink"></div>}
        </div>
      </div>
      <div className={`p-2 rounded-lg mr-4 ${iconBg || 'bg-gray-100'}`}>
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-text-main">{title}</p>
        <p className="text-xs text-text-secondary">{subtitle}</p>
      </div>
    </button>
  );
};

const AddNewCardOption: React.FC<{
  selected: boolean;
  onSelect: (id: PaymentMethodType) => void;
}> = ({ selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect('new')}
      className={`w-full flex items-center p-4 border-2 border-dashed rounded-lg transition-all ${
        selected ? 'border-brand-pink bg-pink-50' : 'border-purple-200 bg-purple-50 hover:border-purple-300'
      }`}
    >
      <div className="flex items-center justify-center mr-4">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-brand-pink' : 'border-purple-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-brand-pink"></div>}
        </div>
      </div>
      <Plus className="w-5 h-5 text-purple-600 mr-4" />
      <p className="text-sm font-semibold text-purple-600">Add new credit/debit card</p>
    </button>
  );
};

export const TenantPaymentPage: React.FC<TenantPaymentPageProps> = ({ currentUser, appData, onBack, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('checking');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');

  // Find the tenant profile for this user
  const tenantProfile = appData.tenants.find(t => t.name === currentUser.name);
  const tenantUnit = tenantProfile ? appData.units.find(u => u.currentTenantId === tenantProfile.id) : undefined;
  
  const monthlyRent = tenantUnit?.monthlyRent || 25000;
  const utilityCharges = 3500;
  const totalDue = monthlyRent + utilityCharges;

  const handleConfirmPayment = () => {
    // In a real app, this would process the payment
    onPaymentSuccess();
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <button 
        onClick={onBack}
        className="flex items-center text-sm text-text-secondary hover:text-text-main mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Payments Hub
      </button>

      <header className="mb-8">
        <h1 className="text-3xl font-bold font-atkinson text-text-main">Make a Payment</h1>
        <p className="text-text-secondary mt-1">Review your payment details and confirm your payment method.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Payment Method */}
        <div className="lg:col-span-2">
          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Payment Method</h3>
            
            <div className="space-y-3 mb-6">
              <PaymentMethodOption
                id="checking"
                icon={Building}
                title="Checking Account"
                subtitle="Bank of BD ···1234"
                selected={selectedMethod === 'checking'}
                onSelect={setSelectedMethod}
              />
              
              <PaymentMethodOption
                id="credit"
                icon={CreditCard}
                title="Credit Card"
                subtitle="Visa ending in 5678"
                selected={selectedMethod === 'credit'}
                onSelect={setSelectedMethod}
              />
              
              <PaymentMethodOption
                id="debit"
                icon={CreditCard}
                title="Debit Card"
                subtitle="Mastercard ending in 9012"
                selected={selectedMethod === 'debit'}
                onSelect={setSelectedMethod}
              />
              
              <PaymentMethodOption
                id="bkash"
                icon={Phone}
                iconBg="bg-pink-100"
                title="bKash"
                subtitle="Account ···3456"
                selected={selectedMethod === 'bkash'}
                onSelect={setSelectedMethod}
              />

              <AddNewCardOption
                selected={selectedMethod === 'new'}
                onSelect={setSelectedMethod}
              />
            </div>

            {/* Card Details Form (shown when 'new' is selected) */}
            {selectedMethod === 'new' && (
              <div className="pt-6 border-t space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="**** **** **** ****"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                      maxLength={7}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="***"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <button 
        onClick={handleConfirmPayment}
        className="w-full bg-brand-pink hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Confirm Payment of ৳{totalDue.toLocaleString()}.00
      </button>
          </Card>
        </div>

        {/* Right Column - Payment Summary */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-atkinson text-lg font-bold text-text-main mb-4">Payment Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Current Rent</span>
                <span className="text-text-main font-medium">৳{monthlyRent.toLocaleString()}.00</span>
              </div>
              
              <div className="flex justify-between pb-4 border-b">
                <span className="text-text-secondary">Utility Charges</span>
                <span className="text-text-main font-medium">৳{utilityCharges.toLocaleString()}.00</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="font-bold text-text-main">Total Amount Due</span>
                <span className="font-bold text-brand-pink text-lg">৳{totalDue.toLocaleString()}.00</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
