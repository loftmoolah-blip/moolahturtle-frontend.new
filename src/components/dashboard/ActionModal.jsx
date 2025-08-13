
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, AlertCircle, XCircle } from 'lucide-react';
import { useFormValidation, ValidatedInput, validationRules } from '@/components/common/FormValidation';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function ActionModal({ show, action, leadId, leads, onClose, onUpdate }) {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  
  const lead = leads.find(l => l.id === leadId);

  const offerSchema = {
    offerAmount: [
      validationRules.required('Please enter an amount.'),
      validationRules.numeric('Please enter a valid number.'),
      (val) => {
        const amount = parseFloat(val);
        if (isNaN(amount) || amount <= 0) return 'Please enter a valid positive amount.';
        return null;
      }
    ]
  };
  const form = useFormValidation({ offerAmount: '' }, offerSchema);
  
  useEffect(() => {
    if (show) {
      form.resetForm();
    }
  }, [show]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.validateForm()) {
        showError('Please correct the errors before submitting.');
        return;
    }

    const amount = parseFloat(form.values.offerAmount);

    if (action === 'Make New Offer') {
        const lastOfferInHistory = lead?.negotiationHistory?.[lead.negotiationHistory.length - 1];
        if (lastOfferInHistory && amount <= lastOfferInHistory.amount) {
            showError(`Your new offer must be higher than the last offer of ${formatPrice(lastOfferInHistory.amount)}.`);
            return;
        }
    }
    
    setLoading(true);

    try {
      // This is a mock update. In a real app, this would be an API call.
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newHistoryEntry = { type: 'investor', amount, timestamp: new Date() };
      let newStatus = 'Offer Made';
      let newHistory = [...(lead.negotiationHistory || []), newHistoryEntry];
      
      if (action === 'Make New Offer') {
          newHistory = [newHistoryEntry]; // Start new negotiation history
          newStatus = 'Offer Made';
      } else if (action === 'Counteroffer') {
          newStatus = 'Offer Made';
      } else if (action === 'Counter Back') {
          newStatus = 'Offer Made';
      }
      
      onUpdate(leadId, { dealStatus: newStatus, negotiationHistory: newHistory });
      success('Offer submitted successfully!');
      onClose();
    } catch (err) {
      console.error('Error performing action:', err);
      showError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdate(leadId, { dealStatus: 'New', negotiationHistory: [] });
      success('Offer withdrawn.');
      onClose();
    } catch(err) {
        console.error('Error withdrawing offer:', err);
        showError('Failed to withdraw offer.');
    } finally {
        setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderActionForm = () => {
    switch (action) {
      case 'Counteroffer':
      case 'Counter Back':
      case 'Make New Offer':
        const lastOffer = lead?.negotiationHistory?.[lead.negotiationHistory.length - 1];
        const round = Math.ceil(((lead?.negotiationHistory?.length || 0) + 1) / 2);

        return (
          <>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-500">Asking Price:</span>
                        <span className="font-semibold text-green-600 ml-2">
                            {formatPrice(lead?.askingPrice)}
                        </span>
                    </div>
                    {lastOffer?.type === 'seller' && (
                         <div>
                            <span className="text-gray-500">Seller Counter:</span>
                            <span className="font-semibold text-orange-600 ml-2">
                                {formatPrice(lastOffer.amount)}
                            </span>
                        </div>
                    )}
                </div>
                 {round <= 4 && (
                    <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                        {round === 4 ? 'This is the final round' : `You are on Round ${round} of 4`}
                    </p>
                )}
            </div>

            <ValidatedInput
                name="offerAmount"
                label="Your Offer Amount"
                type="number"
                placeholder="Enter your offer"
                value={form.values.offerAmount}
                error={form.errors.offerAmount}
                touched={form.touched.offerAmount}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                icon={<DollarSign className="w-4 h-4 text-gray-400" />}
                required
            />
          </>
        );
    
      case 'Withdraw Offer':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Confirm Withdrawal</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Are you sure you want to withdraw your offer? This will end the current negotiation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Action form for "{action}" coming soon...</p>
          </div>
        );
    }
  };

  const getActionButtonText = () => {
    switch (action) {
      case 'Counteroffer':
      case 'Counter Back':
      case 'Make New Offer':
        return 'Submit Offer';
      case 'Withdraw Offer':
        return 'Yes, Withdraw';
      default:
        return 'Submit';
    }
  };
  
  const getTitle = () => {
      if (action === 'Counter Back') return 'Make a Counteroffer';
      return action;
  }

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{getTitle()}</DialogTitle>
          {lead && (
            <p className="text-sm text-gray-600 mt-1">
              {lead.property?.address}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {renderActionForm()}

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type={action === 'Withdraw Offer' ? 'button' : 'submit'}
              onClick={action === 'Withdraw Offer' ? handleWithdraw : undefined}
              disabled={loading || (action !== 'Withdraw Offer' && !form.isValid)}
              className={action === 'Withdraw Offer' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            >
              {loading ? <LoadingSpinner size="small" showText={false} /> : getActionButtonText()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
