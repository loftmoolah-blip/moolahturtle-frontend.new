
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Investor } from '@/api/entities';
import { useToast } from '@/components/common/Toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// US States data with counties
const US_STATES = {
  'Alabama': { counties: ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Tuscaloosa'] },
  'Alaska': { counties: ['Anchorage', 'Fairbanks North Star', 'Matanuska-Susitna'] },
  'Arizona': { counties: ['Maricopa', 'Pima', 'Pinal', 'Yavapai', 'Mohave'] },
  'Arkansas': { counties: ['Pulaski', 'Washington', 'Benton', 'Faulkner', 'Saline'] },
  'California': { counties: ['Los Angeles', 'San Diego', 'Orange', 'Riverside', 'San Bernardino'] },
  'Colorado': { counties: ['Denver', 'El Paso', 'Jefferson', 'Arapahoe', 'Adams'] },
  'Connecticut': { counties: ['Fairfield', 'Hartford', 'New Haven', 'Litchfield', 'New London'] },
  'Delaware': { counties: ['New Castle', 'Kent', 'Sussex'] },
  'Florida': { counties: ['Miami-Dade', 'Broward', 'Palm Beach', 'Orange', 'Hillsborough'] },
  'Georgia': { counties: ['Fulton', 'Gwinnett', 'DeKalb', 'Cobb', 'Clayton'] },
  'Hawaii': { counties: ['Honolulu', 'Hawaii', 'Maui', 'Kauai'] },
  'Idaho': { counties: ['Ada', 'Canyon', 'Kootenai', 'Bonneville', 'Bannock'] },
  'Illinois': { counties: ['Cook', 'DuPage', 'Lake', 'Will', 'Kane'] },
  'Indiana': { counties: ['Marion', 'Lake', 'Allen', 'Hamilton', 'St. Joseph'] },
  'Iowa': { counties: ['Polk', 'Linn', 'Scott', 'Johnson', 'Black Hawk'] },
  'Kansas': { counties: ['Johnson', 'Sedgwick', 'Shawnee', 'Wyandotte', 'Douglas'] },
  'Kentucky': { counties: ['Jefferson', 'Fayette', 'Kenton', 'Boone', 'Warren'] },
  'Louisiana': { counties: ['Orleans', 'Jefferson', 'East Baton Rouge', 'St. Tammany', 'Lafayette'] },
  'Maine': { counties: ['Cumberland', 'York', 'Penobscot', 'Kennebec', 'Androscoggin'] },
  'Maryland': { counties: ['Montgomery', 'Prince George\'s', 'Baltimore', 'Anne Arundel', 'Howard'] },
  'Massachusetts': { counties: ['Middlesex', 'Worcester', 'Essex', 'Suffolk', 'Norfolk'] },
  'Michigan': { counties: ['Wayne', 'Oakland', 'Macomb', 'Kent', 'Genesee'] },
  'Minnesota': { counties: ['Hennepin', 'Ramsey', 'Dakota', 'Anoka', 'Washington'] },
  'Mississippi': { counties: ['Hinds', 'Harrison', 'DeSoto', 'Jackson', 'Madison'] },
  'Missouri': { counties: ['St. Louis', 'Jackson', 'St. Charles', 'Jefferson', 'Clay'] },
  'Montana': { counties: ['Yellowstone', 'Missoula', 'Gallatin', 'Flathead', 'Cascade'] },
  'Nebraska': { counties: ['Douglas', 'Lancaster', 'Sarpy', 'Hall', 'Buffalo'] },
  'Nevada': { counties: ['Clark', 'Washoe', 'Carson City', 'Lyon', 'Elko'] },
  'New Hampshire': { counties: ['Hillsborough', 'Rockingham', 'Merrimack', 'Strafford', 'Belknap'] },
  'New Jersey': { counties: ['Bergen', 'Essex', 'Middlesex', 'Hudson', 'Union'] },
  'New Mexico': { counties: ['Bernalillo', 'Santa Fe', 'Dona Ana', 'Sandoval', 'San Juan'] },
  'New York': { counties: ['Kings', 'Queens', 'New York', 'Suffolk', 'Bronx'] },
  'North Carolina': { counties: ['Mecklenburg', 'Wake', 'Guilford', 'Forsyth', 'Cumberland'] },
  'North Dakota': { counties: ['Cass', 'Burleigh', 'Grand Forks', 'Ward', 'Stark'] },
  'Ohio': { counties: ['Cuyahoga', 'Franklin', 'Hamilton', 'Montgomery', 'Summit'] },
  'Oklahoma': { counties: ['Oklahoma', 'Tulsa', 'Cleveland', 'Comanche', 'Canadian'] },
  'Oregon': { counties: ['Multnomah', 'Washington', 'Clackamas', 'Marion', 'Lane'] },
  'Pennsylvania': { counties: ['Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Chester'] },
  'Rhode Island': { counties: ['Providence', 'Kent', 'Washington', 'Newport', 'Bristol'] },
  'South Carolina': { counties: ['Greenville', 'Richland', 'Charleston', 'Lexington', 'Horry'] },
  'South Dakota': { counties: ['Minnehaha', 'Pennington', 'Lincoln', 'Brown', 'Codington'] },
  'Tennessee': { counties: ['Davidson', 'Shelby', 'Knox', 'Hamilton', 'Rutherford'] },
  'Texas': { counties: ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis'] },
  'Utah': { counties: ['Salt Lake', 'Utah', 'Davis', 'Weber', 'Washington'] },
  'Vermont': { counties: ['Chittenden', 'Rutland', 'Washington', 'Windsor', 'Addison'] },
  'Virginia': { counties: ['Fairfax', 'Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond'] },
  'Washington': { counties: ['King', 'Pierce', 'Snohomish', 'Spokane', 'Clark'] },
  'West Virginia': { counties: ['Kanawha', 'Berkeley', 'Jefferson', 'Wood', 'Cabell'] },
  'Wisconsin': { counties: ['Milwaukee', 'Dane', 'Waukesha', 'Brown', 'Racine'] },
  'Wyoming': { counties: ['Laramie', 'Natrona', 'Campbell', 'Sweetwater', 'Fremont'] }
};

export default function CoverageEditModal({ show, investor, onClose, onUpdate }) {
  const { success, error } = useToast();
  const [selectedStates, setSelectedStates] = useState(() => {
    return investor?.coverage_areas?.map(area => area.state) || [];
  });
  const [selectedCounties, setSelectedCounties] = useState(() => {
    const counties = {};
    investor?.coverage_areas?.forEach(area => {
      counties[area.state] = area.counties || [];
    });
    return counties;
  });
  const [zoomedState, setZoomedState] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStateClick = (stateName) => {
    if (!selectedStates.includes(stateName)) {
      setSelectedStates(prev => [...prev, stateName]);
      setSelectedCounties(prev => ({
        ...prev,
        [stateName]: []
      }));
    }
    setZoomedState(stateName);
  };

  const handleStateRemove = (stateName) => {
    setSelectedStates(prev => prev.filter(s => s !== stateName));
    setSelectedCounties(prev => {
      const newCounties = { ...prev };
      delete newCounties[stateName];
      return newCounties;
    });
    if (zoomedState === stateName) {
      setZoomedState(null);
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const coverageData = selectedStates.map(state => ({
        state,
        counties: selectedCounties[state] || []
      }));
      
      // Update investor coverage areas
      await Investor.update(investor.id, { coverage_areas: coverageData });
      onUpdate(coverageData);
      success('Coverage areas updated successfully!');
      onClose();
    } catch (err) {
      error(err.message || 'Error updating coverage areas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-green-500" />
            Edit Your Coverage Areas
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - State Selection */}
          <div className="lg:col-span-2">
            {!zoomedState ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Select States</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {Object.keys(US_STATES).map(stateName => (
                    <motion.button
                      key={stateName}
                      onClick={() => handleStateClick(stateName)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedStates.includes(stateName)
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : 'bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium">{stateName}</div>
                      {selectedStates.includes(stateName) && (
                        <div className="text-xs text-green-600 mt-1">
                          {selectedCounties[stateName]?.length || 0} counties
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Select Counties in {zoomedState}</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => setZoomedState(null)}
                    className="text-sm"
                  >
                    ← Back to States
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {US_STATES[zoomedState]?.counties.map(countyName => (
                    <motion.button
                      key={countyName}
                      onClick={() => handleCountyToggle(zoomedState, countyName)}
                      className={`p-3 rounded-lg text-left transition-all ${
                        selectedCounties[zoomedState]?.includes(countyName)
                          ? 'bg-green-100 border-2 border-green-500 text-green-800'
                          : 'bg-gray-100 border-2 border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{countyName}</span>
                        {selectedCounties[zoomedState]?.includes(countyName) && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Selected Areas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Selected States ({selectedStates.length})</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {selectedStates.map(state => (
                <div key={state} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-emerald-900">{state}</div>
                      <div className="text-sm text-emerald-700 mt-1">
                        {selectedCounties[state]?.length || 0} counties selected
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStateRemove(state)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedCounties[state]?.length > 0 && (
                    <div className="text-xs text-emerald-600 mt-2">
                      {selectedCounties[state].slice(0, 3).join(', ')}
                      {selectedCounties[state].length > 3 && ` +${selectedCounties[state].length - 3} more`}
                    </div>
                  )}
                </div>
              ))}
              {selectedStates.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">
                  No states selected yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading || selectedStates.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? <LoadingSpinner size="small" showText={false} /> : 'Update Coverage Areas'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
