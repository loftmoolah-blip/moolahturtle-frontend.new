import { apiClient, API_ENDPOINTS } from '../utils/api';

export class SellerService {
  // Register new seller
  static async register(sellerData) {
    return await apiClient.post(API_ENDPOINTS.sellers.register, sellerData);
  }

  // Send SMS verification code
  static async sendVerificationCode(phone) {
    return await apiClient.post(API_ENDPOINTS.sellers.verifyPhone, { phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(sellerId, code) {
    return await apiClient.post(API_ENDPOINTS.sellers.verify(sellerId), { code });
  }

  // Get seller by ID
  static async getById(sellerId) {
    return await apiClient.get(API_ENDPOINTS.sellers.byId(sellerId));
  }

  // Update seller
  static async update(sellerId, updateData) {
    return await apiClient.put(API_ENDPOINTS.sellers.byId(sellerId), updateData);
  }

  // Get all sellers (admin only)
  static async list() {
    return await apiClient.get(API_ENDPOINTS.sellers.base);
  }
}

export default SellerService;