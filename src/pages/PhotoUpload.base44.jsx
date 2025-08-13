import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadFile } from "@/api/integrations";
import { Property } from "@/api/entities";
import { Upload, Trash2, CheckCircle, Loader2, Camera, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoUpload() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [property, setProperty] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState({
    interior: {
      bedrooms: [],
      bathrooms: [],
      living_room: "",
      kitchen: "",
      dining_area: "",
      air_handler: "",
      water_heater: "",
      electrical_panel: ""
    },
    exterior: {
      front: "",
      left: "",
      right: "",
      back: "",
      front_yard: "",
      back_yard: "",
      air_condenser: "",
      electrical_panel: "",
      meter_box: ""
    }
  });
  
  const fileInputRef = useRef(null);
  const [currentUploadSlot, setCurrentUploadSlot] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sellerIdParam = urlParams.get('seller_id');
    const propertyIdParam = urlParams.get('property_id');
    
    if (sellerIdParam && propertyIdParam) {
      setSellerId(sellerIdParam);
      setPropertyId(propertyIdParam);
      loadProperty(propertyIdParam);
    } else {
      navigate(createPageUrl("Home"));
    }
  }, [navigate]);

  const loadProperty = async (id) => {
    try {
      const properties = await Property.filter({ id });
      if (properties.length > 0) {
        const prop = properties[0];
        setProperty(prop);
        
        // Initialize bedroom and bathroom slots based on property data
        const bedroomSlots = Array(prop.bedrooms).fill("");
        const bathroomSlots = Array(Math.ceil(prop.bathrooms)).fill("");
        
        setUploadedPhotos(prev => ({
          ...prev,
          interior: {
            ...prev.interior,
            bedrooms: bedroomSlots,
            bathrooms: bathroomSlots
          }
        }));
      }
    } catch (error) {
      console.error("Error loading property:", error);
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0 || !currentUploadSlot) return;

    setIsUploading(true);
    
    try {
      const uploadPromises = files.map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const urls = results.map(res => res.file_url);
      
      const { section, key, index } = currentUploadSlot;
      
      setUploadedPhotos(prev => {
        const newPhotos = { ...prev };
        if (index !== undefined) {
          // Array slot (bedrooms/bathrooms)
          newPhotos[section][key][index] = urls[0];
        } else {
          // Single slot
          newPhotos[section][key] = urls[0];
        }
        return newPhotos;
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
    
    setIsUploading(false);
    setCurrentUploadSlot(null);
  };

  const handleSlotClick = (section, key, index) => {
    setCurrentUploadSlot({ section, key, index });
    fileInputRef.current.click();
  };

  const handleRemovePhoto = (section, key, index) => {
    setUploadedPhotos(prev => {
      const newPhotos = { ...prev };
      if (index !== undefined) {
        newPhotos[section][key][index] = "";
      } else {
        newPhotos[section][key] = "";
      }
      return newPhotos;
    });
  };

  const cleanPhotosForSaving = (photos) => {
    const cleanedPhotos = {
      interior: {
        bedrooms: photos.interior.bedrooms.filter(url => url && url.trim() !== ""),
        bathrooms: photos.interior.bathrooms.filter(url => url && url.trim() !== "")
      },
      exterior: {}
    };

    // Clean single photo fields - only include if they have actual URLs
    const interiorFields = ['living_room', 'kitchen', 'dining_area', 'air_handler', 'water_heater', 'electrical_panel'];
    interiorFields.forEach(field => {
      if (photos.interior[field] && photos.interior[field].trim() !== "") {
        cleanedPhotos.interior[field] = photos.interior[field];
      }
    });

    const exteriorFields = ['front', 'left', 'right', 'back', 'front_yard', 'back_yard', 'air_condenser', 'electrical_panel', 'meter_box'];
    exteriorFields.forEach(field => {
      if (photos.exterior[field] && photos.exterior[field].trim() !== "") {
        cleanedPhotos.exterior[field] = photos.exterior[field];
      }
    });

    return cleanedPhotos;
  };

  const handleComplete = async () => {
    try {
      const cleanedPhotos = cleanPhotosForSaving(uploadedPhotos);
      await Property.update(propertyId, { photos: cleanedPhotos });
      navigate(createPageUrl(`PropertyListed?seller_id=${sellerId}&property_id=${propertyId}`));
    } catch (error) {
      console.error("Error saving photos:", error);
    }
  };

  const PhotoSlot = ({ section, slotKey, index, title, required = false }) => {
    const photo = index !== undefined 
      ? uploadedPhotos[section][slotKey]?.[index]
      : uploadedPhotos[section][slotKey];
    
    const hasPhoto = photo && photo.trim() !== "";
    
    return (
      <motion.div
        className="relative"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {required && <Badge variant="secondary" className="text-xs">Required</Badge>}
        </div>
        
        <button
          onClick={() => handleSlotClick(section, slotKey, index)}
          className="relative w-full aspect-video border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 transition-colors bg-gray-50 hover:bg-green-50"
          disabled={isUploading}
        >
          {hasPhoto ? (
            <>
              <img 
                src={photo} 
                alt={title} 
                className="w-full h-full object-cover rounded-xl" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemovePhoto(section, slotKey, index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              {isUploading && currentUploadSlot?.section === section && currentUploadSlot?.key === slotKey && currentUploadSlot?.index === index ? (
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              ) : (
                <>
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm">Click to upload</span>
                </>
              )}
            </div>
          )}
        </button>
      </motion.div>
    );
  };

  if (!property) return <div>Loading...</div>;

  // Calculate filled slots
  const bedroomPhotos = uploadedPhotos.interior.bedrooms.filter(url => url && url.trim() !== "").length;
  const bathroomPhotos = uploadedPhotos.interior.bathrooms.filter(url => url && url.trim() !== "").length;
  
  const interiorSinglePhotos = ['living_room', 'kitchen', 'dining_area', 'air_handler', 'water_heater', 'electrical_panel']
    .filter(field => uploadedPhotos.interior[field] && uploadedPhotos.interior[field].trim() !== "").length;
  
  const exteriorPhotos = ['front', 'left', 'right', 'back', 'front_yard', 'back_yard', 'air_condenser', 'electrical_panel', 'meter_box']
    .filter(field => uploadedPhotos.exterior[field] && uploadedPhotos.exterior[field].trim() !== "").length;
  
  const totalSlots = property.bedrooms + Math.ceil(property.bathrooms) + 15; // Other slots
  const filledSlots = bedroomPhotos + bathroomPhotos + interiorSinglePhotos + exteriorPhotos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-2xl border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Upload Your Property Photos</CardTitle>
                  <p className="text-gray-600">High-quality images help investors assess your property faster</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold text-green-600">{filledSlots}/{totalSlots}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Interior Photos */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">🏠</span>
                Interior Photos
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Dynamic Bedroom Slots */}
                {Array(property.bedrooms).fill().map((_, idx) => (
                  <PhotoSlot
                    key={`bedroom-${idx}`}
                    section="interior"
                    slotKey="bedrooms"
                    index={idx}
                    title={`Bedroom ${idx + 1}`}
                    required={true}
                  />
                ))}
                
                {/* Dynamic Bathroom Slots */}
                {Array(Math.ceil(property.bathrooms)).fill().map((_, idx) => (
                  <PhotoSlot
                    key={`bathroom-${idx}`}
                    section="interior"
                    slotKey="bathrooms"
                    index={idx}
                    title={`Bathroom ${idx + 1}`}
                    required={true}
                  />
                ))}
                
                <PhotoSlot section="interior" slotKey="living_room" title="Living Room" required={true} />
                <PhotoSlot section="interior" slotKey="kitchen" title="Kitchen Area" required={true} />
                <PhotoSlot section="interior" slotKey="dining_area" title="Dining Area" />
                <PhotoSlot section="interior" slotKey="air_handler" title="Air Handler" />
                <PhotoSlot section="interior" slotKey="water_heater" title="Water Heater" />
                <PhotoSlot section="interior" slotKey="electrical_panel" title="Interior Electrical Panel" />
              </div>
            </div>

            {/* Exterior Photos */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">🌅</span>
                Exterior Photos
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <PhotoSlot section="exterior" slotKey="front" title="Front Side" required={true} />
                <PhotoSlot section="exterior" slotKey="left" title="Left Side" />
                <PhotoSlot section="exterior" slotKey="right" title="Right Side" />
                <PhotoSlot section="exterior" slotKey="back" title="Back Side" />
                <PhotoSlot section="exterior" slotKey="front_yard" title="Front Yard" />
                <PhotoSlot section="exterior" slotKey="back_yard" title="Back Yard" />
                <PhotoSlot section="exterior" slotKey="air_condenser" title="Air Condenser" />
                <PhotoSlot section="exterior" slotKey="electrical_panel" title="Electrical Panel" />
                <PhotoSlot section="exterior" slotKey="meter_box" title="Meter Box" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleComplete} 
                className="py-6 px-8 text-lg bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-xl" 
                disabled={isUploading}
              >
                <CheckCircle className="mr-3 w-5 h-5" />
                {filledSlots > 0 ? 'Complete with Photos' : 'Complete without Photos'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple={false}
          accept="image/*"
        />
      </div>
    </div>
  );
}