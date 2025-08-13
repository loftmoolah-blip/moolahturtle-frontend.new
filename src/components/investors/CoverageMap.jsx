import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, MapPin, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// US States data with simplified positioning for the map
const US_STATES = {
  'Alabama': { x: 630, y: 380, counties: ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Tuscaloosa'] },
  'Alaska': { x: 120, y: 450, counties: ['Anchorage', 'Fairbanks North Star', 'Matanuska-Susitna'] },
  'Arizona': { x: 280, y: 350, counties: ['Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Mohave'] },
  'Arkansas': { x: 520, y: 360, counties: ['Pulaski', 'Washington', 'Benton', 'Faulkner', 'Saline'] },
  'California': { x: 150, y: 320, counties: ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino'] },
  'Colorado': { x: 420, y: 290, counties: ['Denver', 'El Paso', 'Jefferson', 'Arapahoe', 'Adams'] },
  'Connecticut': { x: 720, y: 220, counties: ['Fairfield', 'Hartford', 'New Haven', 'Litchfield', 'New London'] },
  'Delaware': { x: 700, y: 260, counties: ['New Castle', 'Kent', 'Sussex'] },
  'Florida': { x: 680, y: 450, counties: ['Miami-Dade', 'Broward', 'Palm Beach', 'Orange', 'Hillsborough'] },
  'Georgia': { x: 650, y: 380, counties: ['Fulton', 'Gwinnett', 'DeKalb', 'Cobb', 'Clayton'] },
  'Hawaii': { x: 280, y: 450, counties: ['Honolulu', 'Hawaii', 'Maui', 'Kauai'] },
  'Idaho': { x: 340, y: 200, counties: ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Bannock'] },
  'Illinois': { x: 570, y: 270, counties: ['Cook', 'DuPage', 'Lake', 'Will', 'Kane'] },
  'Indiana': { x: 590, y: 270, counties: ['Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph'] },
  'Iowa': { x: 520, y: 250, counties: ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk'] },
  'Kansas': { x: 450, y: 290, counties: ['Johnson', 'Sedgwick', 'Shawnee', 'Wyandotte', 'Douglas'] },
  'Kentucky': { x: 610, y: 310, counties: ['Jefferson', 'Fayette', 'Kenton', 'Boone', 'Warren'] },
  'Louisiana': { x: 520, y: 420, counties: ['Orleans', 'Jefferson', 'East Baton Rouge', 'St. Tammany', 'Lafayette'] },
  'Maine': { x: 760, y: 180, counties: ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin'] },
  'Maryland': { x: 700, y: 270, counties: ['Montgomery', 'Prince George\'s', 'Baltimore', 'Anne Arundel', 'Howard'] },
  'Massachusetts': { x: 740, y: 210, counties: ['Middlesex', 'Worcester', 'Essex', 'Suffolk', 'Norfolk'] },
  'Michigan': { x: 590, y: 210, counties: ['Wayne', 'Oakland', 'Macomb', 'Kent', 'Genesee'] },
  'Minnesota': { x: 500, y: 180, counties: ['Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington'] },
  'Mississippi': { x: 570, y: 380, counties: ['Hinds', 'Harrison', 'DeSoto', 'Jackson', 'Madison'] },
  'Missouri': { x: 520, y: 290, counties: ['St. Louis', 'Jackson', 'St. Charles', 'Jefferson', 'Clay'] },
  'Montana': { x: 380, y: 170, counties: ['Yellowstone', 'Missoula', 'Gallatin', 'Flathead', 'Cascade'] },
  'Nebraska': { x: 450, y: 260, counties: ['Douglas', 'Lancaster', 'Sarpy', 'Hall', 'Buffalo'] },
  'Nevada': { x: 250, y: 280, counties: ['Clark', 'Washoe', 'Carson City', 'Lyon', 'Elko'] },
  'New Hampshire': { x: 740, y: 200, counties: ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Belknap'] },
  'New Jersey': { x: 710, y: 250, counties: ['Bergen', 'Essex', 'Middlesex', 'Hudson', 'Union'] },
  'New Mexico': { x: 380, y: 350, counties: ['Bernalillo', 'Santa Fe', 'Dona Ana', 'Sandoval', 'San Juan'] },
  'New York': { x: 720, y: 210, counties: ['Kings', 'Queens', 'New York', 'Suffolk', 'Bronx'] },
  'North Carolina': { x: 670, y: 330, counties: ['Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Cumberland'] },
  'North Dakota': { x: 440, y: 170, counties: ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Stark'] },
  'Ohio': { x: 620, y: 270, counties: ['Cuyahoga', 'Franklin', 'Hamilton', 'Montgomery', 'Summit'] },
  'Oklahoma': { x: 460, y: 330, counties: ['Oklahoma', 'Tulsa', 'Cleveland', 'Comanche', 'Canadian'] },
  'Oregon': { x: 220, y: 220, counties: ['Multnomah', 'Washington', 'Clackamas', 'Marion', 'Lane'] },
  'Pennsylvania': { x: 680, y: 250, counties: ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Chester'] },
  'Rhode Island': { x: 750, y: 220, counties: ['Providence', 'Kent', 'Washington', 'Newport', 'Bristol'] },
  'South Carolina': { x: 660, y: 360, counties: ['Greenville', 'Richland', 'Charleston', 'Lexington', 'Horry'] },
  'South Dakota': { x: 440, y: 220, counties: ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Codington'] },
  'Tennessee': { x: 610, y: 340, counties: ['Davidson', 'Shelby', 'Knox', 'Hamilton', 'Rutherford'] },
  'Texas': { x: 450, y: 380, counties: ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis'] },
  'Utah': { x: 340, y: 280, counties: ['Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington'] },
  'Vermont': { x: 730, y: 190, counties: ['Chittenden', 'Rutland', 'Washington', 'Windsor', 'Addison'] },
  'Virginia': { x: 680, y: 300, counties: ['Fairfax', 'Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond'] },
  'Washington': { x: 260, y: 150, counties: ['King', 'Pierce', 'Snohomish', 'Spokane', 'Clark'] },
  'West Virginia': { x: 640, y: 290, counties: ['Kanawha', 'Berkeley', 'Cabell', 'Wood', 'Monongalia'] },
  'Wisconsin': { x: 550, y: 200, counties: ['Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine'] },
  'Wyoming': { x: 380, y: 240, counties: ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Fremont'] }
};

export default function CoverageMap({ onBack, onSubmit }) {
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState({});
  const [activeState, setActiveState] = useState(null);

  const handleStateClick = (stateName) => {
    setActiveState(stateName);
    if (!selectedStates.includes(stateName)) {
        setSelectedStates(prev => [...prev, stateName]);
        setSelectedCounties(prev => ({ ...prev, [stateName]: [] }));
    }
  };

  const handleRemoveState = (stateName) => {
    setSelectedStates(prev => prev.filter(s => s !== stateName));
    setSelectedCounties(prev => {
      const newCounties = { ...prev };
      delete newCounties[stateName];
      return newCounties;
    });
    if (activeState === stateName) {
      setActiveState(null);
    }
  };

  const handleCountyToggle = (stateName, countyName) => {
    setSelectedCounties(prev => ({
      ...prev,
      [stateName]: prev[stateName]?.includes(countyName)
        ? prev[stateName].filter(c => c !== countyName)
        : [...(prev[stateName] || []), countyName]
    }));
  };

  const handleComplete = () => {
    const coverageData = selectedStates.map(state => ({
      state,
      counties: selectedCounties[state] || []
    }));
    onSubmit(coverageData);
  };

  return (
    <Card className="shadow-none border-0 bg-transparent">
        <CardHeader className="text-left px-0">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold">Select Your Coverage Areas</CardTitle>
                    <p className="text-gray-600 mt-1">Click on states where you want to receive property leads</p>
                </div>
            </div>
        </CardHeader>

        <CardContent className="p-0 mt-6">
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Interactive Map */}
                <div className="lg:col-span-2">
                    <Card className="bg-white border border-gray-200 shadow-sm h-full">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-center">United States Coverage Map</CardTitle>
                            <p className="text-sm text-gray-500 text-center">Click on any state to select and zoom in</p>
                        </CardHeader>
                        <CardContent>
                            <div className="relative bg-gradient-to-br from-blue-50/50 to-blue-100/50 rounded-xl overflow-hidden border border-gray-200" style={{ height: '550px' }}>
                                <svg
                                    viewBox="0 0 900 600"
                                    className="w-full h-full"
                                >
                                    {Object.entries(US_STATES).map(([stateName, stateData]) => {
                                        const isSelected = selectedStates.includes(stateName);
                                        const isActive = activeState === stateName;
                                        return (
                                            <g key={stateName} onClick={() => handleStateClick(stateName)} className="cursor-pointer">
                                                <motion.circle
                                                    cx={stateData.x}
                                                    cy={stateData.y}
                                                    r={isActive ? "18" : "15"}
                                                    fill={isSelected ? "#3b82f6" : "#cbd5e1"}
                                                    stroke={isActive ? "#1d4ed8" : "#a0aec0"}
                                                    strokeWidth="1.5"
                                                    whileHover={{ r: 18 }}
                                                />
                                                <text
                                                    x={stateData.x}
                                                    y={stateData.y + 25}
                                                    textAnchor="middle"
                                                    className="text-xs font-medium fill-gray-600 pointer-events-none"
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    {stateName}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-100">
                                    <div className="text-xs font-medium text-gray-700 mb-2">Legend:</div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-300 rounded-full border border-gray-400"></div>
                                            <span className="text-xs text-gray-600">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full border border-blue-600"></div>
                                            <span className="text-xs text-gray-600">Selected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Selected States ({selectedStates.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {selectedStates.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No states selected</p>
                            ) : (
                                <div className="space-y-2">
                                    {selectedStates.map(stateName => (
                                        <div key={stateName} className={`flex items-center justify-between p-3 rounded-lg border ${activeState === stateName ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                                            <span className="font-semibold text-gray-800">{stateName}</span>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-300">
                                                    {selectedCounties[stateName]?.length || 0} counties
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleRemoveState(stateName)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <AnimatePresence>
                        {activeState && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <Card className="border border-green-200 bg-white shadow-sm">
                                    <CardHeader className="pb-4 bg-green-50/50">
                                        <CardTitle className="text-lg text-green-800">{activeState} Counties</CardTitle>
                                        <p className="text-sm text-green-700">Select specific counties in {activeState}</p>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                            {(US_STATES[activeState]?.counties || []).map(countyName => {
                                                const isSelected = selectedCounties[activeState]?.includes(countyName);
                                                return (
                                                    <button
                                                        key={countyName}
                                                        onClick={() => handleCountyToggle(activeState, countyName)}
                                                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-green-500 bg-green-100 text-green-900 font-semibold' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span>{countyName}</span>
                                                            {isSelected && <Check className="w-5 h-5 text-green-600" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <Button variant="ghost" className="w-full mt-4 text-gray-600 hover:bg-gray-100" onClick={() => setActiveState(null)}>
                                            Back to States
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex justify-between items-center mt-10">
                <Button variant="outline" onClick={onBack} className="py-6 px-8 text-lg">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </Button>
                <Button onClick={handleComplete} disabled={selectedStates.length === 0} className="py-6 px-8 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg">
                    Complete Registration <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}