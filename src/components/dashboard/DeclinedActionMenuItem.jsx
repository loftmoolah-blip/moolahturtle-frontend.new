import React, { useState, useEffect } from 'react';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Clock, ArrowRightLeft } from 'lucide-react';

export default function DeclinedActionMenuItem({ lastOfferTimestamp, onAction }) {
  const canCounterAfter = new Date(new Date(lastOfferTimestamp).getTime() + 24 * 60 * 60 * 1000);

  const getTimeLeft = () => {
    const now = new Date();
    const diff = canCounterAfter.getTime() - now.getTime();
    
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    if (minutes > 0) return `in ${minutes}m`;
    return `in <1m`;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    if (timeLeft) {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft());
      }, 1000 * 30); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [lastOfferTimestamp]);

  const canCounter = !timeLeft;

  return (
    <DropdownMenuItem onClick={onAction} disabled={!canCounter}>
      {canCounter ? (
        <>
          <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-500" />
          <span>Counteroffer</span>
        </>
      ) : (
        <>
          <Clock className="mr-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-500 text-xs">Counter {timeLeft}</span>
        </>
      )}
    </DropdownMenuItem>
  );
}