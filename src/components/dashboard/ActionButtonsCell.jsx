
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  ArrowRightLeft, 
  Eye, 
  CheckCircle,
  XCircle,
  PlusCircle,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeclinedActionMenuItem from './DeclinedActionMenuItem';

export default function ActionButtonsCell({ lead, onAction, onLeadClick }) {
  const { dealStatus, negotiationHistory = [] } = lead;

  const renderActions = () => {
    switch (dealStatus) {
      case 'New':
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
               <DropdownMenuItem onClick={() => onLeadClick(lead)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAction('Buy at Asking Price', lead.id)}>
                <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                Buy at Asking Price
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('Counteroffer', lead.id)}>
                <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-500" />
                Counteroffer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case 'Offer Made':
      case 'Countered':
        const isFinalRound = Math.ceil((negotiationHistory?.length || 0) / 2) >= 4;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
              <DropdownMenuItem onClick={() => onLeadClick(lead)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {dealStatus === 'Countered' && (
                <DropdownMenuItem onClick={() => onAction('Accept Counter', lead.id)}>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Accept Counter
                </DropdownMenuItem>
              )}
              
              {dealStatus === 'Countered' && !isFinalRound && (
                <DropdownMenuItem onClick={() => onAction('Counter Back', lead.id)}>
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-500" />
                  Counter Back
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={() => onAction('Withdraw Offer', lead.id)}>
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                Withdraw Offer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case 'Offer Declined':
        const lastDeclinedOffer = negotiationHistory[negotiationHistory.length - 1];
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
              <DropdownMenuItem onClick={() => onLeadClick(lead)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {lastDeclinedOffer ? (
                <DeclinedActionMenuItem 
                  lastOfferTimestamp={lastDeclinedOffer.timestamp}
                  onAction={() => onAction('Make New Offer', lead.id)}
                />
              ) : (
                <DropdownMenuItem onClick={() => onAction('Make New Offer', lead.id)}>
                  <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
                   Make New Offer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case 'Pending Contract':
      case 'Under Contract':
      case 'Sold':
        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onLeadClick(lead)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );

      default:
        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onLeadClick(lead)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
    }
  };

  return (
    <div className="flex items-center justify-end">
      {renderActions()}
    </div>
  );
}
