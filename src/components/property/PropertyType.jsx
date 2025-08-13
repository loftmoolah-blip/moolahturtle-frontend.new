import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Building, Home } from "lucide-react";
import { motion } from "framer-motion";

const RESIDENTIAL_TYPES = [
  "House", "Condominium", "Townhouse", "Mobile/Manufactured", 
  "Duplex", "Triplex", "Fourplex", "Loft", "Studio", "Cabin"
];

const COMMERCIAL_TYPES = [
  "Apartment Building", "Motel", "Hostel", "Hotel", "Resort"
];

export default function PropertyType({ data, onNext, onBack }) {
  const [selectedType, setSelectedType] = useState(data.property_type || "");

  const handleNext = () => {
    onNext({ property_type: selectedType });
  };

  return (
    <Card className="shadow-2xl border-0 max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <Building className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">What type of property is it?</CardTitle>
            <p className="text-gray-600 mt-1">Select the option that best describes your property.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Residential Block */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900">Residential</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RESIDENTIAL_TYPES.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 text-left border-2 rounded-xl transition-all text-sm font-medium ${
                    selectedType === type 
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Commercial Block */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">Commercial</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {COMMERCIAL_TYPES.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 text-left border-2 rounded-xl transition-all text-sm font-medium ${
                    selectedType === type 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedType} 
            className="py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}