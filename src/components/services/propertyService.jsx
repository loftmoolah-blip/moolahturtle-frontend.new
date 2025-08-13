import apiClient from '@/api/client';

export class PropertyService {
  // Create new property
  static async create(propertyData) {
    return await apiClient.post('/properties', propertyData);
  }

  // Get property by ID
  static async getById(propertyId) {
    return await apiClient.get(`/properties/${propertyId}`);
  }

  // Update property
  static async update(propertyId, updateData) {
    return await apiClient.put(`/properties/${propertyId}`, updateData);
  }

  // Upload property photos
  static async uploadPhotos(propertyId, photos) {
    const uploadPromises = [];
    
    // Handle different photo categories
    Object.entries(photos).forEach(([category, categoryPhotos]) => {
      if (Array.isArray(categoryPhotos)) {
        categoryPhotos.forEach((photo, index) => {
          if (photo instanceof File) {
            uploadPromises.push(
              apiClient.uploadFile(`/properties/${propertyId}/photos`, photo)
                .then(result => ({ category, index, ...result }))
            );
          }
        });
      } else if (categoryPhotos instanceof File) {
        uploadPromises.push(
          apiClient.uploadFile(`/properties/${propertyId}/photos`, categoryPhotos)
            .then(result => ({ category, ...result }))
        );
      }
    });

    return await Promise.all(uploadPromises);
  }

  // Get all properties
  static async list(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/properties?${queryParams}` : '/properties';
    return await apiClient.get(endpoint);
  }

  // Delete property
  static async delete(propertyId) {
    return await apiClient.delete(`/properties/${propertyId}`);
  }
}

export default PropertyService;
