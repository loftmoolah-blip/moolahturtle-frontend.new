import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Calendar, Zap, Clock, Coffee } from "lucide-react";
import { motion } from "framer-motion";

const TIMELINE_OPTIONS = [
  { 
    value: "ASAP", 
    icon: <Zap />, 
    title: "ASAP", 
    description: "I need to sell immediately",
    color: "red"
  },
  { 
    value: "Within 30 days", 
    icon: <ChevronsRight />, 
    title: "Within 30 days", 
    description: "I'd like to close within a month",
    color: "orange"
  },
  { 
    value: "Within 60 days", 
    icon: <Calendar />, 
    title: "Within 60 days", 
    description: "I can wait up to 2 months",
    color: "yellow"
  },
  { 
    value: "Within 90 days", 
    icon: <Clock />, 
    title: "Within 90 days", 
    description: "I have up to 3 months",
    color: "green"
  },
  { 
    value: "No rush", 
    icon: <Coffee />, 
    title: "No rush", 
    description: "I'm flexible with timing",
    color: "blue"
  }
];

// Import missing icon
import { ChevronsRight } from "lucide-react";

export default function SellingTimeline({ data, onNext, onBack }) {
  const [selectedTimeline, setSelectedTimeline] = useState(data.selling_timeline || "");

  const handleNext = () => {
    onNext({ selling_timeline: selectedTimeline });
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      red: isSelected ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-200 hover:bg-red-50',
      orange: isSelected ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50',
      yellow: isSelected ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-yellow-200 hover:bg-yellow-50',
      green: isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-green-200 hover:bg-green-50',
      blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50'
    };
    return colors[color];
  };

  return (
    <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">How quickly are you looking to sell?</CardTitle>
            <p className="text-gray-600 mt-1">We can close on your schedule, fast or slow.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {TIMELINE_OPTIONS.map((option) => {
            const isSelected = selectedTimeline === option.value;
            
            return (
              <motion.button
                key={option.value}
                onClick={() => setSelectedTimeline(option.value)}
                className={`w-full flex items-center text-left p-6 border-2 rounded-xl transition-all ${
                  getColorClasses(option.color, isSelected)
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className={`mr-4 p-3 rounded-full ${
                  isSelected 
                    ? `bg-${option.color}-200` 
                    : 'bg-gray-100'
                }`}>
                  {React.cloneElement(option.icon, { 
                    className: `w-6 h-6 ${
                      isSelected 
                        ? `text-${option.color}-700` 
                        : 'text-gray-600'
                    }` 
                  })}
                </div>
                <div>
                  <p className="text-lg font-semibold">{option.title}</p>
                  <p className="text-sm opacity-80 mt-1">{option.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">
            <strong>Good news:</strong> We can accommodate any timeline. Fast closings available in as little as 7-10 days!
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedTimeline}
            className="py-6 px-8 text-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-xl"
          >
            Complete Property Details <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}