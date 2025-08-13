import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/api/client";
import { Upload, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

export default function PhotoUploadGrid({ onComplete, setUploadedPhotos, uploadedPhotos }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadPromises = files.map(file => uploadFile('/files', file));
    
    try {
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.file_url);
      setUploadedPhotos(prev => [...prev, ...newUrls]);
    } catch (error) {
      console.error("Error uploading files:", error);
      // You might want to show an error to the user
    }
    
    setIsUploading(false);
  };

  const handleRemovePhoto = (urlToRemove) => {
    setUploadedPhotos(prev => prev.filter(url => url !== urlToRemove));
  };
  
  return (
    <Card className="shadow-2xl border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Upload Your Property Photos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <AnimatePresence>
            {uploadedPhotos.map((url) => (
              <Motion.div
                key={url}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative group aspect-square"
              >
                <img src={url} alt="Uploaded property" className="w-full h-full object-cover rounded-lg shadow-md" />
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleRemovePhoto(url)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => fileInputRef.current.click()}
            className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin mb-2" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-500 mb-2" />
                <span className="text-sm text-gray-500 text-center">Click to upload</span>
              </>
            )}
          </button>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
        />

        <div className="flex justify-end mt-8">
            <Button onClick={onComplete} className="py-6 px-8 text-lg" disabled={isUploading}>
                <CheckCircle className="mr-2" /> Complete
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
