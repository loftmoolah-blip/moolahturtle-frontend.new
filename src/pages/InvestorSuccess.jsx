import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { PartyPopper, CheckCircle } from 'lucide-react';

const TurtleMascot = () => (
  <motion.div
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    className="text-9xl"
  >
    🐢
  </motion.div>
);

export default function InvestorSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 text-center overflow-hidden">
        <CardContent className="p-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="mx-auto w-24 h-24"
          >
            <TurtleMascot />
          </motion.div>
          
          <h1 className="text-4xl font-bold mt-6 mb-4">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              You're All Set!
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Congratulations and welcome to the Moolahturtle investor network. You'll start receiving qualified property leads in your selected coverage areas shortly.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate(createPageUrl("InvestorDashboard"))}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform group"
            >
              Go to Dashboard
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}