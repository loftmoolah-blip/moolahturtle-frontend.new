import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, SkipForward, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedTurtle = () => (
  <motion.div
    animate={{ 
      y: [0, -8, 0],
      rotate: [0, 3, -3, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="text-6xl"
  >
    🐢
  </motion.div>
);

export default function PhotoUploadIntro() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdParam = urlParams.get('seller_id');
    const propertyIdParam = urlParams.get('property_id');
    
    if (sellerIdParam && propertyIdParam) {
      setSellerId(sellerIdParam);
      setPropertyId(propertyIdParam);
    } else {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  const handleStartUpload = () => {
    navigate(createPageUrl(`PhotoUpload?seller_id=${sellerId}&property_id=${propertyId}`));
  };

  const handleSkip = () => {
    navigate(createPageUrl(`PropertyListed?seller_id=${sellerId}&property_id=${propertyId}`));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center py-12 px-4">
      <Card className="shadow-2xl border-0 text-center max-w-2xl mx-auto">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-6">
            <AnimatedTurtle />
          </div>
          
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-6"
          >
            <Camera className="w-12 h-12 text-green-600" />
          </motion.div>
          
          <CardTitle className="text-3xl lg:text-4xl font-bold">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Almost There! Final Step
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <p className="text-xl text-gray-700 leading-relaxed">
              Your property is almost listed in our marketplace. To help investors evaluate and make fair offers, we strongly encourage you to upload photos of your property.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="w-6 h-6 text-yellow-600" />
                <p className="font-semibold text-yellow-800">Why Upload Photos?</p>
              </div>
              <ul className="text-sm text-yellow-700 space-y-2 text-left">
                <li>• Properties with photos get 3x more offers</li>
                <li>• Helps ensure faster offers and transparent dealings</li>
                <li>• Allows investors to provide more accurate valuations</li>
                <li>• Builds trust and confidence in your listing</li>
              </ul>
            </div>
            
            <p className="text-lg text-gray-600">
              Uploading photos is <strong>optional</strong>, but <strong>highly recommended</strong>. Your choice—add photos now or skip this step.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleStartUpload} 
                className="w-full sm:w-auto py-6 px-8 text-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl"
              >
                <Camera className="mr-3 w-5 h-5" />
                Upload Photos
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                onClick={handleSkip} 
                className="w-full sm:w-auto py-6 px-8 text-lg border-2 hover:bg-gray-50"
              >
                <SkipForward className="mr-3 w-5 h-5" />
                Skip For Now
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}