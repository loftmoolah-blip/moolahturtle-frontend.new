import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PhotoUploadIntro({ onStart, onSkip }) {
  return (
    <Card className="shadow-2xl border-0 text-center">
      <CardHeader>
        <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4"
        >
          <Camera className="w-12 h-12 text-green-600" />
        </motion.div>
        <CardTitle className="text-3xl font-bold">Showcase Your Property</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Properties with photos get 3x more offers! Uploading photos is highly recommended, but you can skip for now if you prefer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={onStart} className="w-full sm:w-auto py-6 px-8 text-lg">
                    <ArrowRight className="mr-2" /> Start Upload
                </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={onSkip} className="w-full sm:w-auto py-6 px-8 text-lg">
                    <SkipForward className="mr-2" /> Skip For Now
                </Button>
            </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}