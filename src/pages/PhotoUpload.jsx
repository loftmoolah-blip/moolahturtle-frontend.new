import { useState } from 'react';
import PhotoUploadGrid from '@/components/photos/PhotoUploadGrid';

export default function PhotoUpload() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const handleComplete = () => {
    // For now we just log the uploaded URLs; further actions can be added later
    console.log('Uploaded photo URLs:', uploadedPhotos);
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

