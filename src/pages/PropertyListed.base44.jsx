
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bed, Bath, MapPin, Building, MessageSquare, Settings, HelpCircle, CheckCircle, Smartphone, Shield, HeadphonesIcon } from "lucide-react";
import { Property } from "@/api/entities";
import { Seller } from "@/api/entities";

const AnimatedTurtle = () => (
  <motion.div
    animate={{ 
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="text-8xl cursor-pointer"
    whileHover={{ scale: 1.2 }}
  >
    🐢
  </motion.div>
);

export default function PropertyListed() {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdParam = urlParams.get('seller_id');
    const propertyIdParam = urlParams.get('property_id');
    
    if (sellerIdParam && propertyIdParam) {
      loadData(sellerIdParam, propertyIdParam);
    } else {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  useEffect(() => {
    // Clear all seller progress from local storage upon completion
    localStorage.removeItem('moolahturtle_sellerId');
    localStorage.removeItem('propertyDetailsProgress');
    localStorage.removeItem('photoUploadProgress');
  }, []);

  const loadData = async (sellerId, propertyId) => {
    try {
      const sellers = await Seller.list();
      const currentSeller = sellers.find(s => s.id === sellerId);
      setSeller(currentSeller);

      const properties = await Property.filter({ id: propertyId });
      if (properties.length > 0) {
        setProperty(properties[0]);
      }

      // Update seller status
      await Seller.update(sellerId, { status: 'listed' });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  if (!seller || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Finalizing your listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center p-12 bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex justify-center mb-6">
              <AnimatedTurtle />
            </div>
            
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Great Job! Your Property is Now Listed.
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Thanks for trusting Moolahturtle! Your property is live on our marketplace.
            </motion.p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 mb-10">
              {/* Property Summary */}
              <motion.div 
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Building className="w-6 h-6 text-green-600" />
                  Your Property Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{property.address}</p>
                      <p className="text-sm text-gray-500">Property Location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Bed className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-green-500" />
                      <span className="font-medium">{property.bathrooms} Bathrooms</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Building className="w-5 h-5 mt-1 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">{property.property_type}</p>
                      <p className="text-sm text-gray-500">Property Type</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-green-800">Status: Active</p>
                    </div>
                    <p className="text-sm text-green-700">Your property is now visible to our network of verified investors.</p>
                  </div>
                </div>
              </motion.div>

              {/* What Happens Next */}
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h3 className="text-xl font-bold mb-6 text-blue-900">What Happens Next?</h3>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Review Offers</p>
                      <p className="text-sm text-blue-700">You'll start receiving no-obligation cash offers from our vetted investors via Text Message. If messages are too much you can reply STOP.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Transparency & Control</p>
                      <p className="text-sm text-blue-700">Review, accept, or counter offers directly from your phone. We will send you a short link to access your property details page.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <HeadphonesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Support & Guidance</p>
                      <p className="text-sm text-blue-700">Have questions? Our friendly turtle mascot is always here to help. Just click on the Turtle Icon.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="text-center bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
              <p className="text-lg text-gray-700 mb-6">
                <strong>Expect to hear from investors within 24-48 hours!</strong>
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="py-6 px-12 text-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl rounded-2xl"
                >
                  DONE
                  <CheckCircle className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
