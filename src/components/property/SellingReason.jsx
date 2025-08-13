import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

const COMMON_REASONS = [
  "Relocating for work",
  "Downsizing", 
  "Upgrading to a larger home",
  "Financial difficulties",
  "Divorce/separation",
  "Inherited the property",
  "Job loss",
  "Medical expenses",
  "Tired of being a landlord",
  "Property needs too many repairs",
  "Market timing"
];

export default function SellingReason({ data, onNext, onBack }) {
  const [selectedReasons, setSelectedReasons] = useState(data.selling_reason || []);
  const [customReason, setCustomReason] = useState('');
  const [showOther, setShowOther] = useState(selectedReasons.includes('Other'));

  const handleReasonToggle = (reason) => {
    setSelectedReasons(prev => {
      if (reason === 'Other') {
        setShowOther(!prev.includes('Other'));
        if (prev.includes('Other')) {
          setCustomReason('');
          return prev.filter(r => r !== 'Other');
        } else {
          return [...prev, 'Other'];
        }
      }
      
      if (prev.includes(reason)) {
        return prev.filter(r => r !== reason);
      } else {
        return [...prev, reason];
      }
    });
  };

  const handleNext = () => {
    let finalReasons = [...selectedReasons];
    if (showOther && customReason.trim()) {
      finalReasons = finalReasons.filter(r => r !== 'Other');
      finalReasons.push(customReason.trim());
    }
    onNext({ selling_reason: finalReasons });
  };

  return (
    <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Why are you selling?</CardTitle>
            <p className="text-gray-600 mt-1">Select all that apply. This helps us understand your situation better.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-3">
          {COMMON_REASONS.map((reason) => {
            const isSelected = selectedReasons.includes(reason);
            
            return (
              <motion.div
                key={reason}
                className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleReasonToggle(reason)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleReasonToggle(reason)}
                  className="mt-1"
                />
                <span className="text-sm font-medium">{reason}</span>
              </motion.div>
            );
          })}
          
          {/* Other Option */}
          <motion.div
            className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
              showOther 
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
            }`}
            onClick={() => handleReasonToggle('Other')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Checkbox
              checked={showOther}
              onChange={() => handleReasonToggle('Other')}
              className="mt-1"
            />
            <span className="text-sm font-medium">Other (please specify)</span>
          </motion.div>
        </div>
        
        {showOther && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Input
              type="text"
              placeholder="Please tell us your specific reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="text-lg py-6"
            />
          </motion.div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Privacy Note:</strong> This information helps our investors understand your situation and provide better offers. It remains confidential.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={selectedReasons.length === 0 && !customReason.trim()}
            className="py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}