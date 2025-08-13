
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Property } from "@/api/entities";
import { motion } from "framer-motion";

import PropertyAddress from "@/components/property/PropertyAddress";
import PropertyType from "@/components/property/PropertyType";
import PropertyRooms from "@/components/property/PropertyRooms";
import PropertyCondition from "@/components/property/PropertyCondition";
import SellingReason from "@/components/property/SellingReason";
import PropertyPricing from "@/components/property/PropertyPricing";
import SellingTimeline from "@/components/property/SellingTimeline";

const TOTAL_STEPS = 7;

export default function PropertyDetails() {
  const navigate = useNavigate();
  const { search } = useLocation(); // Hook to read URL query parameters
  const [sellerId, setSellerId] = useState(null);
  const [step, setStep] = useState(1);
  const [propertyData, setPropertyData] = useState({
    address: "",
    latitude: null,
    longitude: null,
    property_type: "",
    bedrooms: 0, // Initialized as 0 as per outline
    bathrooms: 0, // Initialized as 0 as per outline
    condition: [],
    selling_reason: [],
    desired_price: "", // Initialized as empty string as per outline
    bottom_price: "", // Initialized as empty string as per outline
    selling_timeline: ""
  });

  // Effect to load sellerId from URL or localStorage and saved progress
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const idFromUrl = searchParams.get('seller_id');
    const idFromStorage = localStorage.getItem('moolahturtle_sellerId');
    const currentSellerId = idFromUrl || idFromStorage; // Prioritize URL param, then localStorage

    if (!currentSellerId) {
      // If no seller ID found anywhere, redirect to registration
      navigate(createPageUrl('Register'));
      return;
    }

    setSellerId(currentSellerId);
    if (idFromUrl) {
        // If seller_id is present in the URL, it's the most authoritative. Store it.
        localStorage.setItem('moolahturtle_sellerId', idFromUrl);
    }

    try {
        const savedProgress = localStorage.getItem('propertyDetailsProgress');
        if (savedProgress) {
            const { savedStep, savedData } = JSON.parse(savedProgress);
            // Load progress ONLY if the seller_id in saved data matches the current sellerId
            // This prevents loading progress for a different seller.
            if(savedData.seller_id === currentSellerId) {
                setStep(savedStep || 1); // Fallback to step 1 if savedStep is falsy
                // Merge savedData with default propertyData, ensuring all fields are present
                setPropertyData(prev => ({ ...prev, ...savedData }));
            } else {
                // If saved progress is for a different seller, clear it to start fresh for the current seller
                localStorage.removeItem('propertyDetailsProgress');
            }
        }
    } catch(error) {
        console.error("Could not load property details progress:", error);
        // Clear corrupted or unreadable data to prevent future errors
        localStorage.removeItem('propertyDetailsProgress');
    }
  }, [search, navigate]); // Dependencies: search for initial seller_id check, navigate for redirection

  // Effect to save progress to localStorage whenever step, propertyData, or sellerId changes
  useEffect(() => {
    // Only save if sellerId is available
    if(sellerId) {
        const progress = {
            savedStep: step,
            savedData: { ...propertyData, seller_id: sellerId } // Ensure seller_id is part of savedData
        };
        localStorage.setItem('propertyDetailsProgress', JSON.stringify(progress));
    }
  }, [step, propertyData, sellerId]); // Dependencies: step, propertyData, sellerId

  // New utility functions for managing step navigation
  const nextStep = () => setStep(prev => prev < TOTAL_STEPS ? prev + 1 : prev);
  const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : prev);

  // Utility function to update propertyData state
  const updatePropertyData = (data) => {
    setPropertyData(prev => ({ ...prev, ...data }));
  };

  const handleFinalSubmit = async () => {
    try {
      const newProperty = await Property.create({
        ...propertyData,
        seller_id: sellerId,
        // Parse numerical fields from string to number before sending to API
        // bedrooms and bathrooms are already numbers if initialized as 0, but parsing handles potential string inputs from forms
        bedrooms: typeof propertyData.bedrooms === 'string' ? parseInt(propertyData.bedrooms, 10) : propertyData.bedrooms,
        bathrooms: typeof propertyData.bathrooms === 'string' ? parseFloat(propertyData.bathrooms) : propertyData.bathrooms,
        desired_price: propertyData.desired_price ? parseFloat(propertyData.desired_price) : null,
        bottom_price: propertyData.bottom_price ? parseFloat(propertyData.bottom_price) : null
      });
      // Clear progress from localStorage upon successful submission
      localStorage.removeItem('propertyDetailsProgress');
      // Navigate to PhotoUploadIntro page with the new property ID
      navigate(createPageUrl(`PhotoUploadIntro?property_id=${newProperty.id}`));
    } catch (error) {
      console.error("Failed to create property:", error);
      // TODO: Implement user-facing error notification here
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return <PropertyAddress propertyData={propertyData} onNext={nextStep} updateData={updatePropertyData} />;
      case 2:
        return <PropertyType propertyData={propertyData} onNext={nextStep} onBack={prevStep} updateData={updatePropertyData} />;
      case 3:
        return <PropertyRooms propertyData={propertyData} onNext={nextStep} onBack={prevStep} updateData={updatePropertyData} />;
      case 4:
        return <PropertyCondition propertyData={propertyData} onNext={nextStep} onBack={prevStep} updateData={updatePropertyData} />;
      case 5:
        return <SellingReason propertyData={propertyData} onNext={nextStep} onBack={prevStep} updateData={updatePropertyData} />;
      case 6:
        return <PropertyPricing propertyData={propertyData} onNext={nextStep} onBack={prevStep} updateData={updatePropertyData} />;
      case 7: // SellingTimeline is the final step
        // For the final step's 'onNext', trigger the form submission.
        // SellingTimeline component is expected to call updateData first, then onNext.
        return <SellingTimeline propertyData={propertyData} onNext={handleFinalSubmit} onBack={prevStep} updateData={updatePropertyData} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-sm"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-3">
            <p className="text-sm text-gray-600">Step {step} of {TOTAL_STEPS}</p>
            <p className="text-sm font-medium text-green-600">{Math.round((step / TOTAL_STEPS) * 100)}% Complete</p>
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step} // Key prop to trigger re-animation on step change
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full" // Ensure the step content takes full width within the max-w-6xl container
        >
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
}
