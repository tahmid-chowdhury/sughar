import React from 'react';
import { Card } from './Card';
import {
    ACCOUNT_DETAILS_DATA,
    BILLING_PLAN_DATA,
    PAYMENT_METHOD_DATA,
    INVOICE_HISTORY_DATA,
    TEAM_MEMBERS_DATA,
    NOTIFICATION_SETTINGS_DATA
} from '../constants';
import { AccountDetails, BillingPlan, PaymentMethod, Invoice, TeamMember, NotificationSetting, InvoiceStatus } from '../types';
import { Mail, Phone, MoreHorizontal, UserPlus, Download, CreditCard, Calendar } from './icons';

const ProfileCard: React.FC<{ user: AccountDetails }> = ({ user }) => (
    <Card className="flex flex-col items-center text-center">
        <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full mb-4 ring-4 ring-purple-100" />
        <h2 className="text-2xl font-bold font-atkinson text-text-main">{user.name}</h2>
        <p className="text-sm text-text-secondary">{user.role}</p>
        <button className="w-full mt-6 bg-accent-secondary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-purple-600 transition-colors">
            Edit Profile
        </button>
        <div className="w-full text-left mt-6 pt-6 border-t border-gray-100 space-y-3">
            <div className="flex items-center text-sm text-text-secondary">
                <Mail className="w-4 h-4 mr-3" />
                <span>{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
                <Phone className="w-4 h-4 mr-3" />
                <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center text-sm text-text-secondary">
                <Calendar className="w-4 h-4 mr-3" />
                <span>Member since {user.memberSince}</span>
            </div>
        </div>
    </Card>
);

const InvoiceStatusPill: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
    const styles = {
        [InvoiceStatus.Paid]: 'bg-status-success text-status-success-text',
        [InvoiceStatus.Pending]: 'bg-status-warning text-status-warning-text',
        [InvoiceStatus.Failed]: 'bg-status-error text-status-error-text',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>{status}</span>;
}

const PlanBillingCard: React.FC<{ plan: BillingPlan, paymentMethod: PaymentMethod, invoices: Invoice[] }> = ({ plan, paymentMethod, invoices }) => (
    <Card>
        <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Plan & Billing</h3>
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
                <p className="text-xs text-text-secondary">Current Plan</p>
                <p className="text-sm font-semibold text-text-main">{plan.name}</p>
            </div>
            <div>
                <p className="text-xs text-text-secondary">Price</p>
                <p className="text-sm font-semibold text-text-main">${plan.price}/{plan.billingCycle.slice(0, 2)}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
                <p className="text-xs text-text-secondary">Next Payment</p>
                <p className="text-sm font-semibold text-text-main">{plan.nextPayment}</p>
            </div>
             <div className="col-span-2 md:col-span-1">
                <button className="w-full h-full bg-accent-primary text-purple-800 font-bold text-sm rounded-md hover:bg-purple-200 transition-colors">
                    Upgrade Plan
                </button>
            </div>
        </div>
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
                 <CreditCard className="w-5 h-5 mr-3 text-text-secondary"/>
                 <p className="text-sm text-text-main">Payment Method: <span className="font-semibold">{paymentMethod.cardType} **** {paymentMethod.lastFour}</span></p>
            </div>
            <button className="text-sm font-medium text-accent-secondary hover:underline">Update</button>
        </div>
        
        <div className="mt-6">
             <h4 className="font-atkinson text-lg font-bold text-text-main mb-2">Billing History</h4>
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="text-left text-gray-500">
                        <tr className="border-b border-gray-100">
                            <th className="py-2 font-medium">Invoice ID</th>
                            <th className="py-2 font-medium">Date</th>
                            <th className="py-2 font-medium">Amount</th>
                            <th className="py-2 font-medium">Status</th>
                            <th className="py-2 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b border-gray-100 last:border-b-0">
                                <td className="py-3 font-medium text-text-main">{invoice.id}</td>
                                <td className="py-3 text-text-secondary">{invoice.date}</td>
                                <td className="py-3 text-text-secondary">${invoice.amount.toFixed(2)}</td>
                                <td className="py-3"><InvoiceStatusPill status={invoice.status} /></td>
                                <td className="py-3 text-right">
                                    <button className="text-accent-secondary hover:text-purple-700">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </Card>
);

const TeamMembersCard: React.FC<{ members: TeamMember[] }> = ({ members }) => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-atkinson text-xl font-bold text-text-main">Team Members</h3>
            <button className="flex items-center bg-accent-primary text-purple-800 font-bold py-2 px-3 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
            </button>
        </div>
        <div className="space-y-3">
            {members.map(member => (
                <div key={member.id} className="flex items-center p-2 rounded-lg hover:bg-gray-50">
                    <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-3 flex-grow">
                        <p className="font-semibold text-text-main text-sm">{member.name}</p>
                        <p className="text-xs text-text-secondary">{member.role}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5"/>
                    </button>
                </div>
            ))}
        </div>
    </Card>
);

const NotificationToggle: React.FC<{checked: boolean}> = ({ checked }) => {
    return (
        <div className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${checked ? 'bg-accent-secondary' : 'bg-gray-300'}`}>
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    );
};

const NotificationSettingsCard: React.FC<{ settings: NotificationSetting[] }> = ({ settings }) => (
    <Card>
         <h3 className="font-atkinson text-xl font-bold text-text-main mb-4">Notifications</h3>
         <div className="space-y-4">
            {settings.map(setting => (
                <div key={setting.id} className="flex items-start">
                    <div className="flex-grow pr-4">
                        <p className="font-semibold text-text-main text-sm">{setting.label}</p>
                        <p className="text-xs text-text-secondary">{setting.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div>
                            <p className="text-xs text-center text-text-secondary mb-1">Email</p>
                            <NotificationToggle checked={setting.email} />
                        </div>
                         <div>
                            <p className="text-xs text-center text-text-secondary mb-1">Push</p>
                            <NotificationToggle checked={setting.push} />
                        </div>
                    </div>
                </div>
            ))}
         </div>
    </Card>
);

export const AccountOverviewPage: React.FC = () => {
    return (
        <div className="container mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-atkinson text-text-main">Account Overview</h1>
                <p className="text-text-secondary mt-1">Manage your profile, billing, and team settings.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1">
                    <ProfileCard user={ACCOUNT_DETAILS_DATA} />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    <PlanBillingCard plan={BILLING_PLAN_DATA} paymentMethod={PAYMENT_METHOD_DATA} invoices={INVOICE_HISTORY_DATA} />
                    <TeamMembersCard members={TEAM_MEMBERS_DATA} />
                    <NotificationSettingsCard settings={NOTIFICATION_SETTINGS_DATA} />
                </div>
            </div>
        </div>
    );
};