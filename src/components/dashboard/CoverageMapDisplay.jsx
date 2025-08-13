import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ChevronDown, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Same US States data from registration
const US_STATES = {
  'Alabama': { x: 630, y: 380 },
  'Alaska': { x: 120, y: 450 },
  'Arizona': { x: 280, y: 350 },
  'Arkansas': { x: 520, y: 360 },
  'California': { x: 150, y: 320 },
  'Colorado': { x: 420, y: 290 },
  'Connecticut': { x: 720, y: 220 },
  'Delaware': { x: 700, y: 260 },
  'Florida': { x: 680, y: 450 },
  'Georgia': { x: 650, y: 380 },
  'Hawaii': { x: 280, y: 450 },
  'Idaho': { x: 340, y: 200 },
  'Illinois': { x: 570, y: 270 },
  'Indiana': { x: 590, y: 270 },
  'Iowa': { x: 520, y: 250 },
  'Kansas': { x: 450, y: 290 },
  'Kentucky': { x: 610, y: 310 },
  'Louisiana': { x: 520, y: 420 },
  'Maine': { x: 760, y: 180 },
  'Maryland': { x: 700, y: 270 },
  'Massachusetts': { x: 740, y: 210 },
  'Michigan': { x: 590, y: 210 },
  'Minnesota': { x: 500, y: 180 },
  'Mississippi': { x: 570, y: 380 },
  'Missouri': { x: 520, y: 290 },
  'Montana': { x: 380, y: 170 },
  'Nebraska': { x: 450, y: 260 },
  'Nevada': { x: 250, y: 280 },
  'New Hampshire': { x: 740, y: 200 },
  'New Jersey': { x: 710, y: 250 },
  'New Mexico': { x: 380, y: 350 },
  'New York': { x: 720, y: 210 },
  'North Carolina': { x: 670, y: 330 },
  'North Dakota': { x: 440, y: 170 },
  'Ohio': { x: 620, y: 270 },
  'Oklahoma': { x: 460, y: 330 },
  'Oregon': { x: 220, y: 220 },
  'Pennsylvania': { x: 680, y: 250 },
  'Rhode Island': { x: 750, y: 220 },
  'South Carolina': { x: 660, y: 360 },
  'South Dakota': { x: 440, y: 220 },
  'Tennessee': { x: 610, y: 340 },
  'Texas': { x: 450, y: 380 },
  'Utah': { x: 340, y: 280 },
  'Vermont': { x: 730, y: 190 },
  'Virginia': { x: 680, y: 300 },
  'Washington': { x: 260, y: 150 },
  'West Virginia': { x: 640, y: 290 },
  'Wisconsin': { x: 550, y: 200 },
  'Wyoming': { x: 380, y: 240 }
};

export default function CoverageMapDisplay({ investor, onEditCoverage }) {
  const [isOpen, setIsOpen] = useState(true);
  const coverageAreas = investor?.coverage_areas || [];
  const selectedStates = coverageAreas.map(area => area.state);

  return (
    <Card className="shadow-xl border-0 mb-8">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Your Coverage Areas</CardTitle>
                <p className="text-gray-600">
                  Monitoring {selectedStates.length} states for property leads
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditCoverage();
                }}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Coverage
              </Button>
              <motion.div
                  animate={{ rotate: isOpen ? 0 : -180 }}
                  transition={{ duration: 0.3 }}
              >
                  <ChevronDown className="w-6 h-6 text-gray-500" />
              </motion.div>
            </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
            >
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <div className="relative bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-xl overflow-hidden border border-gray-200" style={{ height: '400px' }}>
                            <svg viewBox="0 0 900 600" className="w-full h-full">
                                {Object.entries(US_STATES).map(([stateName, stateData]) => {
                                  const isSelected = selectedStates.includes(stateName);
                                  return (
                                    <g key={stateName}>
                                      <motion.circle
                                        cx={stateData.x}
                                        cy={stateData.y}
                                        r="15"
                                        fill={isSelected ? "#10b981" : "#cbd5e1"}
                                        stroke={isSelected ? "#059669" : "#94a3b8"}
                                        strokeWidth="2"
                                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                      />
                                      <text
                                        x={stateData.x}
                                        y={stateData.y + 25}
                                        textAnchor="middle"
                                        className={`text-xs font-medium pointer-events-none ${isSelected ? 'fill-emerald-700' : 'fill-gray-600'}`}
                                        style={{ fontSize: '10px' }}
                                      >
                                        {stateName}
                                      </text>
                                    </g>
                                  );
                                })}
                            </svg>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Selected States ({selectedStates.length})</h3>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                            {coverageAreas.map(area => (
                                <div key={area.state} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="font-medium text-emerald-900">{area.state}</div>
                                <div className="text-sm text-emerald-700 mt-1">
                                    {area.counties.length} counties selected
                                </div>
                                <div className="text-xs text-emerald-600 mt-2">
                                    {area.counties.slice(0, 3).join(', ')}
                                    {area.counties.length > 3 && ` +${area.counties.length - 3} more`}
                                </div>
                                </div>
                            ))}
                            {coverageAreas.length === 0 && (
                                <p className="text-gray-500 text-sm text-center py-4">
                                No coverage areas selected
                                </p>
                            )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}