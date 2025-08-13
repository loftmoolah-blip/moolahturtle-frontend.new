import { apiClient, API_ENDPOINTS } from '../utils/api';

export class PropertyService {
  // Create new property
  static async create(propertyData) {
    return await apiClient.post(API_ENDPOINTS.PROPERTIES, propertyData);
  }

  // Get property by ID
  static async getById(propertyId) {
    return await apiClient.get(API_ENDPOINTS.PROPERTY_BY_ID(propertyId));
  }

  // Update property
  static async update(propertyId, updateData) {
    return await apiClient.put(API_ENDPOINTS.PROPERTY_BY_ID(propertyId), updateData);
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
              apiClient.uploadFile(API_ENDPOINTS.UPLOAD_PHOTOS(propertyId), photo)
                .then(result => ({ category, index, ...result }))
            );
          }
        });
      } else if (categoryPhotos instanceof File) {
        uploadPromises.push(
          apiClient.uploadFile(API_ENDPOINTS.UPLOAD_PHOTOS(propertyId), categoryPhotos)
            .then(result => ({ category, ...result }))
        );
      }
    });

    return await Promise.all(uploadPromises);
  }

  // Get all properties
  static async list(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `${API_ENDPOINTS.PROPERTIES}?${queryParams}` : API_ENDPOINTS.PROPERTIES;
    return await apiClient.get(endpoint);
  }

  // Delete property
  static async delete(propertyId) {
    return await apiClient.delete(API_ENDPOINTS.PROPERTY_BY_ID(propertyId));
  }
}

export default PropertyService;