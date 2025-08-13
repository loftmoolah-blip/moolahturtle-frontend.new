import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useToast } from '@/components/common/Toast';

export default function PropertyAddress({ onNext, updateData, propertyData }) {
  const [address, setAddress] = useState(propertyData.address || '');
  const [isValidated, setIsValidated] = useState(!!(propertyData.latitude && propertyData.longitude));
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleValidateAddress = async () => {
    if (!address) {
      error("Please enter an address first.");
      return;
    }
    setLoading(true);
    
    // In a real application, this would call the Google Geocoding API.
    // We are simulating this call.
    // Note: The Google Maps API script and key must be loaded for this to work.
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Simulated successful response from Google Maps API
      const validatedData = {
        address: `${address}, Anytown, USA 12345`, // A formatted address from Google
        latitude: 34.0522, // Example Latitude for LA
        longitude: -118.2437, // Example Longitude for LA
      };
      
      setAddress(validatedData.address);
      updateData(validatedData);
      setIsValidated(true);
      success("Address validated successfully!");

    } catch (err) {
      console.error("Geocoding failed:", err);
      error("Could not validate address. Please check it and try again.");
      setIsValidated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">What's the property address?</CardTitle>
            <p className="text-gray-600 mt-1">We need this to find investors in your area.</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter property address"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setIsValidated(false); // Reset validation on change
            }}
            className="flex-grow p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            disabled={loading}
          />
          <Button onClick={handleValidateAddress} disabled={loading || !address} className="py-4 px-6 text-base">
            {loading ? <LoadingSpinner size="small" showText={false} /> : "Validate Address"}
          </Button>
        </div>

        {isValidated && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Address is valid and confirmed.</span>
            </div>
            
            {/* Google Map Embed Placeholder */}
            {/* NOTE: To make this work, you need to load the Google Maps JS API script with an API Key.
                This usually involves adding a <script> tag to your main index.html file.
                The URL would look like: 
                <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap" async defer></script>
            */}
            <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              <p>Map Preview Placeholder</p>
              {/* This iframe is an example of how you might embed the map */}
              {/* <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(propertyData.address)}`}>
              </iframe> */}
            </div>
          </motion.div>
        )}

        <div className="flex justify-end">
          <Button onClick={onNext} disabled={!isValidated} className="py-6 px-8 text-lg">
            Next <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </motion.div>
  );
}