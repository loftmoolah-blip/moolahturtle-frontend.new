import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Seller } from "@/api/entities";
import { Property } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bed, Bath, MapPin, Building, MessageSquare, Settings, HelpCircle, CheckCircle } from "lucide-react";

export default function Congratulations() {
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdParam = urlParams.get('seller_id');
    if (sellerIdParam) {
      loadData(sellerIdParam);
    } else {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  const loadData = async (sellerId) => {
    try {
      // Assuming you can get a single seller by ID, or filtering a list
      const allSellers = await Seller.list();
      const currentSeller = allSellers.find(s => s.id === sellerId);
      setSeller(currentSeller);

      if (currentSeller) {
        const properties = await Property.filter({ seller_id: currentSeller.id });
        if (properties.length > 0) {
          setProperty(properties[0]);
        }
      }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="text-center p-8 bg-green-50 border-b">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="text-8xl mx-auto mb-6"
            >
              🐢
            </motion.div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Great Job! Your Property is Now Listed.
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Thanks for trusting Moolahturtle! Your property is live on our marketplace.
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Property Summary */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">Your Property Summary</h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <span>{property.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{property.property_type}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bed className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
                <ul className="space-y-4 text-gray-700">
                   <li className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <span><b>Review Offers:</b> You'll start receiving no-obligation cash offers from our vetted investors via Text Message. You can reply STOP at any time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Settings className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <span><b>Transparency & Control:</b> Review, accept, or counter offers directly from your phone. We will send you a short link to access your property details page.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <span><b>Support & Guidance:</b> Have questions? Our friendly turtle mascot is always here to help. Just click on the Turtle Icon.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate(createPageUrl("Home"))}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-10 py-4 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform group"
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