import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Bed, Bath, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

const Counter = ({ label, icon, value, onUpdate, step = 1, min = 0 }) => (
  <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl bg-white">
    <div className="flex items-center gap-4">
      {React.cloneElement(icon, { className: "w-6 h-6 text-green-500" })}
      <span className="text-lg font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex items-center gap-4">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onUpdate(Math.max(min, value - step))}
        disabled={value <= min}
        className="h-10 w-10"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <span className="text-2xl font-bold w-16 text-center text-gray-900">{value}</span>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => onUpdate(value + step)}
        className="h-10 w-10"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default function PropertyRooms({ data, onNext, onBack }) {
  const [bedrooms, setBedrooms] = useState(data.bedrooms || 2);
  const [bathrooms, setBathrooms] = useState(data.bathrooms || 1);

  const handleNext = () => {
    onNext({ bedrooms, bathrooms });
  };

  return (
    <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Bed className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">How many beds and baths?</CardTitle>
            <p className="text-gray-600 mt-1">This helps us determine the property's value.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Counter 
            label="Bedrooms" 
            icon={<Bed />} 
            value={bedrooms} 
            onUpdate={setBedrooms}
            min={0}
          />
          <Counter 
            label="Bathrooms" 
            icon={<Bath />} 
            value={bathrooms} 
            onUpdate={setBathrooms}
            step={0.5}
            min={0}
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Bathrooms can be counted in half increments (e.g., 1.5 = 1 full bath + 1 half bath).
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            className="py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}