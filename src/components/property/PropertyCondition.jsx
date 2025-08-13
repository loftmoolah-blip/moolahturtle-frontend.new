import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const CONDITIONS = [
  "None, it's in perfect condition",
  "Nothing major, it's in good condition", 
  "Roof Needs Replacement",
  "Foundation Problems",
  "Structural Problems",
  "Flood/Storm/Fire damage",
  "Electrical Issues",
  "Air Conditioning Issues",
  "Boiler/Waterheater Issues",
  "Plumbing Issues"
];

export default function PropertyCondition({ data, onNext, onBack }) {
  const [selectedConditions, setSelectedConditions] = useState(data.condition || []);

  const handleConditionToggle = (condition) => {
    setSelectedConditions(prev => {
      // If selecting "perfect condition" or "good condition", clear others
      if ((condition === "None, it's in perfect condition" || condition === "Nothing major, it's in good condition") && !prev.includes(condition)) {
        return [condition];
      }
      
      // If selecting other issues, remove perfect/good condition
      if (condition !== "None, it's in perfect condition" && condition !== "Nothing major, it's in good condition") {
        const filtered = prev.filter(c => 
          c !== "None, it's in perfect condition" && 
          c !== "Nothing major, it's in good condition"
        );
        if (prev.includes(condition)) {
          return filtered.filter(c => c !== condition);
        } else {
          return [...filtered, condition];
        }
      }
      
      // Toggle normally
      if (prev.includes(condition)) {
        return prev.filter(c => c !== condition);
      } else {
        return [condition];
      }
    });
  };

  const handleNext = () => {
    onNext({ condition: selectedConditions });
  };

  return (
    <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">What's the property's condition?</CardTitle>
            <p className="text-gray-600 mt-1">Select all that apply. Be honest - we buy homes in any condition!</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {CONDITIONS.map((condition) => {
            const isSelected = selectedConditions.includes(condition);
            const isPerfectOrGood = condition.includes("perfect condition") || condition.includes("good condition");
            
            return (
              <motion.div
                key={condition}
                className={`flex items-start space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  isSelected 
                    ? (isPerfectOrGood ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50')
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handleConditionToggle(condition)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleConditionToggle(condition)}
                  className="mt-1"
                />
                <span className={`text-sm font-medium ${
                  isSelected 
                    ? (isPerfectOrGood ? 'text-green-700' : 'text-orange-700')
                    : 'text-gray-700'
                }`}>
                  {condition}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Tip:</strong> Being honest about your property's condition helps us provide more accurate offers and speeds up the process.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={selectedConditions.length === 0}
            className="py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}