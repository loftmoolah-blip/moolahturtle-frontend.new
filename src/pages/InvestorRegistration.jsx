import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { InvestorService } from '@/components/services/investorService';
import RegistrationForm from '@/components/investors/RegistrationForm';
import CoverageMap from '@/components/investors/CoverageMap';
import { motion } from "framer-motion";

const TOTAL_STEPS = 2;

export default function InvestorRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [investorData, setInvestorData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    password: '',
    phone_verified: false,
    coverage_areas: []
  });

  // Load saved progress from localStorage when the component mounts
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('investorRegistrationProgress');
      if (savedProgress) {
        const { savedStep, savedData } = JSON.parse(savedProgress);
        setStep(savedStep || 1);
        setInvestorData(savedData || {});
      }
    } catch (error) {
      console.error("Could not load investor progress:", error);
      localStorage.removeItem('investorRegistrationProgress');
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const progress = {
      savedStep: step,
      savedData: investorData
    };
    localStorage.setItem('investorRegistrationProgress', JSON.stringify(progress));
  }, [step, investorData]);

  const handleFormSubmit = (data) => {
    setInvestorData(prev => ({ ...prev, ...data, phone_verified: true }));
    setStep(2);
  };
  
  const handleCoverageSubmit = async (coverageData) => {
    const finalData = { ...investorData, coverage_areas: coverageData };
    try {
      const newInvestor = await InvestorService.register(finalData);
      localStorage.removeItem('investorRegistrationProgress');
      navigate(createPageUrl("InvestorSuccess") + `?investor_id=${newInvestor.id}`);
    } catch (error) {
      console.error("Failed to create investor:", error);
    }
  };

  const handleBack = () => {
    setStep(1);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                transition={{ ease: "easeInOut", duration: 0.5 }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">Step {step} of {TOTAL_STEPS}</p>
        </div>
        
        {step === 1 ? (
          <RegistrationForm onSubmit={handleFormSubmit} initialData={investorData} />
        ) : (
          <CoverageMap onBack={handleBack} onSubmit={handleCoverageSubmit} />
        )}
      </div>
    </div>
  );
}