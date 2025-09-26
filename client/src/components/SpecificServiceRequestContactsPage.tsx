import React from 'react';
import { Card } from './Card';
import { ContactCardData, SuggestedVendor, ServiceContact } from '../types';
import { Phone, Mail, HelpCircle, Star } from './icons';

interface SpecificServiceRequestContactsPageProps {
  contactCards: ContactCardData[];
  suggestedVendors: SuggestedVendor[];
}

const ContactInfoLine: React.FC<{ icon: React.ElementType, text: string }> = ({ icon: Icon, text }) => (
  <div className="flex items-center text-xs text-text-secondary mt-1">
    <Icon className="w-4 h-4 mr-2" />
    <span>{text}</span>
  </div>
);

const Contact: React.FC<{ contact: ServiceContact }> = ({ contact }) => (
    <div className="mt-2">
        {contact.role && <p className="text-xs font-semibold text-text-main mb-1">{contact.role}</p>}
        <div className="flex items-center">
            <img className="h-8 w-8 rounded-full object-cover" src={contact.avatar} alt={contact.name} />
            <div className="ml-3">
                <div className="flex items-center">
                    <p className="font-semibold text-text-main text-sm">{contact.name}</p>
                    {contact.rating && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold text-purple-800 bg-purple-100 rounded-full">
                            {contact.rating}
                        </span>
                    )}
                </div>
                 {contact.id && <p className="text-[11px] text-text-secondary">{contact.id}</p>}
            </div>
        </div>
        <div className="mt-2 space-y-1">
            <ContactInfoLine icon={Phone} text={contact.phone} />
            <ContactInfoLine icon={Mail} text={contact.email} />
        </div>
    </div>
);

const ContactCard: React.FC<{ card: ContactCardData }> = ({ card }) => (
  <Card className="!p-4">
    <h3 className="font-atkinson text-sm font-bold text-text-main">{card.title}</h3>
    {card.contacts.map((contact, index) => (
      <div key={index} className={card.contacts.length > 1 && index < card.contacts.length - 1 ? 'border-b border-gray-100 pb-2 mb-2' : ''}>
         <Contact contact={contact} />
      </div>
    ))}
    {(card.workScope || card.date) && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-text-secondary flex justify-between items-end">
            {card.workScope && <div><span className="font-semibold">Work Scope:</span><br/>{card.workScope}</div>}
            {card.date && <div className="text-right"><span className="font-semibold">{card.projectEtc}:</span><br/>{card.date}</div>}
        </div>
    )}
  </Card>
);

const DidYouKnowCard: React.FC = () => (
    <Card className="bg-pink-50 border border-pink-100">
        <div className="flex justify-between items-start">
            <h3 className="font-atkinson text-2xl font-bold text-brand-pink">Did you Know?</h3>
            <div className="p-1.5 bg-white rounded-full shadow-sm">
                <HelpCircle className="w-5 h-5 text-brand-pink" />
            </div>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
            SuGhar is all about accountability! We totally understand loyalty, but let us help you find out if your contractor is treating you right!
        </p>
        <p className="mt-4 text-sm text-text-main font-semibold">
            In a few simple steps, we’ll get quotes from contractors trusted by the SuGhar community like these! Ready to save money?
        </p>
    </Card>
);

const SuggestedVendorCard: React.FC<{ vendor: SuggestedVendor }> = ({ vendor }) => (
    <Card className="!p-3">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
            <img src={vendor.imageUrl} alt={vendor.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center mb-3">
            {vendor.logo === 'star' ? <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" /> :
             <span className="w-5 h-5 flex items-center justify-center font-bold text-sm bg-gray-200 rounded-full mr-2">{vendor.logo}</span>}
            <span className="text-sm font-bold text-text-main">{vendor.name}</span>
            <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold text-purple-800 bg-purple-100 rounded-full">
                {vendor.rating}
            </span>
        </div>
        <button className="w-full bg-accent-primary text-purple-800 font-bold py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors">
            Request a Quote
        </button>
    </Card>
);


export const SpecificServiceRequestContactsPage: React.FC<SpecificServiceRequestContactsPageProps> = ({ contactCards, suggestedVendors }) => {
  const col1Cards = contactCards.slice(0, 3);
  const col2Cards = contactCards.slice(3, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Column 1 */}
      <div className="flex flex-col space-y-6">
        {col1Cards.map((card, index) => <ContactCard key={index} card={card} />)}
      </div>

      {/* Column 2 */}
      <div className="flex flex-col space-y-6">
        {col2Cards.map((card, index) => <ContactCard key={index} card={card} />)}
      </div>

      {/* Column 3 */}
      <div className="space-y-6">
        <DidYouKnowCard />
        <div className="grid grid-cols-2 gap-4">
            {suggestedVendors.map((vendor, index) => <SuggestedVendorCard key={index} vendor={vendor} />)}
        </div>
      </div>
    </div>
  );
};