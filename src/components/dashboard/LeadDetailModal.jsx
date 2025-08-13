
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Bed,
  Bath,
  MapPin,
  User,
  Phone,
  DollarSign,
  Calendar,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Maximize2,
  HelpCircle // Added HelpCircle icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeadDetailModal({ lead, onClose, onAction, getStatusColor }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!lead) return null;

  const { property, seller } = lead;

  // Organize photos by category
  const organizePhotos = () => {
    const photos = property?.photos || {};

    const organized = {
      hero: null,
      interior: [],
      exterior: [],
      bedrooms: [],
      bathrooms: []
    };

    // Set hero image (prefer exterior front, then interior living room)
    organized.hero = photos.exterior?.front || photos.interior?.living_room || null;

    // Interior photos
    if (photos.interior) {
      if (photos.interior.living_room) organized.interior.push({ url: photos.interior.living_room, title: 'Living Room' });
      if (photos.interior.kitchen) organized.interior.push({ url: photos.interior.kitchen, title: 'Kitchen' });
      if (photos.interior.dining_area) organized.interior.push({ url: photos.interior.dining_area, title: 'Dining Area' });
      if (photos.interior.air_handler) organized.interior.push({ url: photos.interior.air_handler, title: 'Air Handler' });
      if (photos.interior.water_heater) organized.interior.push({ url: photos.interior.water_heater, title: 'Water Heater' });
      if (photos.interior.electrical_panel) organized.interior.push({ url: photos.interior.electrical_panel, title: 'Electrical Panel' });
    }

    // Bedroom photos
    if (photos.interior?.bedrooms) {
      photos.interior.bedrooms.forEach((url, index) => {
        if (url) organized.bedrooms.push({ url, title: `Bedroom ${index + 1}` });
      });
    }

    // Bathroom photos
    if (photos.interior?.bathrooms) {
      photos.interior.bathrooms.forEach((url, index) => {
        if (url) organized.bathrooms.push({ url, title: `Bathroom ${index + 1}` });
      });
    }

    // Exterior photos
    if (photos.exterior) {
      if (photos.exterior.front && photos.exterior.front !== organized.hero) organized.exterior.push({ url: photos.exterior.front, title: 'Front View' });
      if (photos.exterior.left) organized.exterior.push({ url: photos.exterior.left, title: 'Left Side' });
      if (photos.exterior.right) organized.exterior.push({ url: photos.exterior.right, title: 'Right Side' });
      if (photos.exterior.back) organized.exterior.push({ url: photos.exterior.back, title: 'Back View' });
      if (photos.exterior.front_yard) organized.exterior.push({ url: photos.exterior.front_yard, title: 'Front Yard' });
      if (photos.exterior.back_yard) organized.exterior.push({ url: photos.exterior.back_yard, title: 'Back Yard' });
      if (photos.exterior.air_condenser) organized.exterior.push({ url: photos.exterior.air_condenser, title: 'Air Condenser' });
      if (photos.exterior.electrical_panel) organized.exterior.push({ url: photos.exterior.electrical_panel, title: 'Electrical Panel' });
      if (photos.exterior.meter_box) organized.exterior.push({ url: photos.exterior.meter_box, title: 'Meter Box' });
    }

    return organized;
  };

  const organizedPhotos = organizePhotos();

  // Create flat array for lightbox navigation
  const allPhotos = [
    organizedPhotos.hero ? { url: organizedPhotos.hero, title: 'Main View' } : null,
    ...organizedPhotos.interior,
    ...organizedPhotos.bedrooms,
    ...organizedPhotos.bathrooms,
    ...organizedPhotos.exterior
  ].filter(Boolean);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const openLightbox = (photoUrl) => {
    const index = allPhotos.findIndex(photo => photo.url === photoUrl);
    setCurrentImageIndex(index >= 0 ? index : 0);
    setShowLightbox(true);
  };

  const PhotoThumbnail = ({ photo, className = "" }) => (
    <div
      className={`relative cursor-pointer group overflow-hidden rounded-lg ${className}`}
      onClick={() => openLightbox(photo.url)}
    >
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-full object-cover transition-transform group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
        <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );

  const PhotoSection = ({ title, photos, columns = 3 }) => {
    if (photos.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-green-500" />
          {title} ({photos.length})
        </h4>
        <div className={`grid grid-cols-${columns} gap-2`}>
          {photos.slice(0, 6).map((photo, index) => (
            <PhotoThumbnail
              key={index}
              photo={photo}
              className="aspect-square"
            />
          ))}
          {photos.length > 6 && (
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors">
              <span className="text-sm font-medium">+{photos.length - 6} more</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Dialog open={!!lead} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center justify-between">
              Property Details
              <Badge className={getStatusColor(lead.dealStatus)}>
                {lead.dealStatus.charAt(0).toUpperCase() + lead.dealStatus.slice(1)}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Property & Seller Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="font-medium">{property?.address}</p>
                      <p className="text-sm text-gray-500">Property Address</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Home className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="font-medium text-sm">{property?.property_type}</p>
                      <p className="text-xs text-gray-500">Type</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Bed className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="font-medium text-sm">{property?.bedrooms}</p>
                      <p className="text-xs text-gray-500">Bedrooms</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Bath className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <p className="font-medium text-sm">{property?.bathrooms}</p>
                      <p className="text-xs text-gray-500">Bathrooms</p>
                    </div>
                  </div>

                  {/* Added separator and updated property details */}
                  <div className="border-t border-gray-100 my-4"></div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2 text-gray-800">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Property Condition
                      </h4>
                      {property?.condition && property.condition.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {property.condition.map((condition, index) => (
                            <Badge key={index} variant="outline" className="bg-orange-50 border-orange-200 text-orange-800">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Not specified</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2 text-gray-800">
                        <HelpCircle className="w-4 h-4 text-purple-500" /> {/* Changed icon */}
                        Reasons for Selling
                      </h4>
                      {property?.selling_reason && property.selling_reason.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {property.selling_reason.map((reason, index) => (
                            <Badge key={index} variant="outline" className="bg-purple-50 border-purple-200 text-purple-800">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Not specified</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2 text-gray-800">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Selling Timeline
                      </h4>
                      {property?.selling_timeline ? (
                        <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">{property.selling_timeline}</Badge>
                      ) : (
                         <p className="text-sm text-gray-500 italic">Not specified</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{seller?.full_name}</p>
                      <p className="text-sm text-gray-500">Seller Name</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium">{seller?.phone}</p>
                      <p className="text-sm text-gray-500">Contact Number</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-2 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-sm text-green-700 font-medium">Phone Verified</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-sm text-green-600">Asking Price</p>
                      <p className="text-xl font-bold text-green-800">
                        {formatPrice(lead.askingPrice)}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                      <p className="text-sm text-orange-600">Bottom Price</p>
                      <p className="text-xl font-bold text-orange-800">
                        {formatPrice(lead.bottomPrice)}
                      </p>
                    </div>
                  </div>

                  {lead.offerAmount && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <p className="text-sm text-blue-600">Your Current Offer</p>
                      <p className="text-xl font-bold text-blue-800">
                        {formatPrice(lead.offerAmount)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Photos */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Property Photos ({allPhotos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allPhotos.length > 0 ? (
                    <div className="space-y-6">
                      {/* Hero Image */}
                      {organizedPhotos.hero && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">Main View</h4>
                          <PhotoThumbnail
                            photo={{ url: organizedPhotos.hero, title: 'Main View' }}
                            className="aspect-video w-full"
                          />
                        </div>
                      )}

                      {/* Photo Categories */}
                      <PhotoSection title="Interior" photos={organizedPhotos.interior} />
                      <PhotoSection title="Bedrooms" photos={organizedPhotos.bedrooms} />
                      <PhotoSection title="Bathrooms" photos={organizedPhotos.bathrooms} />
                      <PhotoSection title="Exterior" photos={organizedPhotos.exterior} />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No photos available</h3>
                      <p className="text-gray-500">This property doesn't have any photos uploaded yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && allPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <div className="relative max-w-5xl max-h-5xl" onClick={(e) => e.stopPropagation()}>
              <img
                src={allPhotos[currentImageIndex]?.url}
                alt={allPhotos[currentImageIndex]?.title}
                className="max-w-full max-h-full object-contain"
              />

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20"
                onClick={() => setShowLightbox(false)}
              >
                <X className="w-6 h-6" />
              </Button>

              {allPhotos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full">
                <div className="text-center">
                  <p className="font-medium">{allPhotos[currentImageIndex]?.title}</p>
                  <p className="text-sm text-gray-300">{currentImageIndex + 1} of {allPhotos.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
