import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRightLeft, CheckCircle, XCircle, ShoppingCart, Info, User, Home, FileText, Handshake } from 'lucide-react';

const formatPrice = (price) => {
  if (typeof price !== 'number') return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export default function DealStatusCell({ lead }) {
  if (!lead) return <div>No lead data</div>;
  
  const { dealStatus, askingPrice, negotiationHistory = [], soldFor } = lead;
  
  // Safely get the last offers
  const lastInvestorOffer = negotiationHistory.length > 0 
    ? negotiationHistory.slice().reverse().find(o => o.type === 'investor') 
    : null;
  const lastSellerOffer = negotiationHistory.length > 0 
    ? negotiationHistory.slice().reverse().find(o => o.type === 'seller') 
    : null;
  const round = Math.ceil((negotiationHistory?.length || 0) / 2);

  const getStatusInfo = () => {
    switch (dealStatus) {
      case 'New':
        return {
          badge: <Badge variant="secondary">New</Badge>,
          content: (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-semibold text-gray-800">{formatPrice(askingPrice)}</p>
                </div>
              </div>
            </div>
          ),
        };
      case 'Offer Made':
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800">Offer Made</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-xs text-gray-500">Your Offer</span>
                  <p className="font-semibold text-blue-600">{formatPrice(lastInvestorOffer?.amount || 0)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">Waiting for seller...</p>
            </div>
          ),
        };
      case 'Countered':
        return {
          badge: <Badge className="bg-orange-100 text-orange-800">Countered ({round}/4)</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-xs text-gray-500">Your Offer</span>
                  <p className="font-medium text-gray-500 line-through">{formatPrice(lastInvestorOffer?.amount || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-orange-500" />
                <div>
                  <span className="text-xs text-gray-500">Seller Counter</span>
                  <p className="font-semibold text-orange-600">{formatPrice(lastSellerOffer?.amount || 0)}</p>
                </div>
              </div>
            </div>
          ),
        };
      case 'Pending Contract':
        const finalAmount = negotiationHistory.length > 0 ? negotiationHistory[negotiationHistory.length - 1]?.amount : askingPrice;
        return {
          badge: <Badge className="bg-blue-100 text-blue-800">Pending Contract</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <div>
                  <span className="text-xs text-gray-500">Agreed Price</span>
                  <p className="font-semibold text-blue-700">{formatPrice(finalAmount)}</p>
                </div>
              </div>
            </div>
          ),
        };
      case 'Under Contract':
        const contractAmount = negotiationHistory.length > 0 ? negotiationHistory[negotiationHistory.length - 1]?.amount : askingPrice;
        return {
          badge: <Badge className="bg-purple-100 text-purple-800">Under Contract</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Handshake className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="text-xs text-gray-500">Contract Price</span>
                  <p className="font-semibold text-purple-700">{formatPrice(contractAmount)}</p>
                </div>
              </div>
            </div>
          ),
        };
      case 'Offer Declined':
        return {
          badge: <Badge className="bg-red-100 text-red-800">Declined</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <div>
                  <span className="text-xs text-gray-500">Your Declined Offer</span>
                  <p className="font-semibold text-red-700 line-through">{formatPrice(lastInvestorOffer?.amount || 0)}</p>
                </div>
              </div>
            </div>
          ),
        };
      case 'Sold':
        return {
          badge: <Badge className="bg-gray-800 text-white">Sold</Badge>,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Was Asking</span>
                  <p className="font-medium text-green-600">{formatPrice(askingPrice)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="text-xs text-gray-500">Sold For</span>
                  <p className="font-semibold text-gray-700">{formatPrice(soldFor || 0)}</p>
                </div>
              </div>
            </div>
          ),
        };
      default:
        return { 
          badge: <Badge variant="outline">{dealStatus || 'Unknown'}</Badge>, 
          content: (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-green-500" />
                <div>
                  <span className="text-xs text-gray-500">Asking Price</span>
                  <p className="font-semibold text-green-600">{formatPrice(askingPrice || 0)}</p>
                </div>
              </div>
            </div>
          )
        };
    }
  };
  
  const { badge, content } = getStatusInfo();

  return (
    <div className="space-y-2">
      {badge}
      {content}
    </div>
  );
}