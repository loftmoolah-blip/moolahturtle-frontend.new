import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PhotoUploadGrid from '@/components/photos/PhotoUploadGrid';
import LeadService from '@/components/services/leadService';

export default function PhotoUpload() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const sellerIdParam = urlParams.get('seller_id');
  const propertyIdParam = urlParams.get('property_id');

  const handleComplete = async () => {
    const storedProperty = JSON.parse(localStorage.getItem('moolahturtle_property')) || {};
    const { sellerId: storedSellerId, ...property } = storedProperty;

    const finalSellerId = sellerIdParam || storedSellerId;
    const finalPropertyId = propertyIdParam || property.propertyId;

    try {
      await LeadService.create({
        sellerId: finalSellerId,
        property,
        photos: uploadedPhotos,
      });
      localStorage.removeItem('moolahturtle_property');
    } catch (error) {
      console.error('Error creating lead:', error);
    }

    navigate(createPageUrl(`PropertyListed?seller_id=${finalSellerId}&property_id=${finalPropertyId}`));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Photo Upload</h1>
      <PhotoUploadGrid
        uploadedPhotos={uploadedPhotos}
        setUploadedPhotos={setUploadedPhotos}
        onComplete={handleComplete}
      />
    </div>
  );
}
