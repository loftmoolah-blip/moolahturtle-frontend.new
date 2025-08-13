import { apiClient, API_ENDPOINTS } from '../utils/api';

export class SellerService {
  // Register new seller
  static async register(sellerData) {
    return await apiClient.post(API_ENDPOINTS.SELLER_REGISTER, sellerData);
  }

  // Send SMS verification code — backend expects both name and phone
  static async sendVerificationCode(name, phone) {
    return await apiClient.post(API_ENDPOINTS.SELLER_VERIFY_PHONE, { name, phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(phone, code) {
    return await apiClient.post(API_ENDPOINTS.SELLER_VERIFY_CODE, { phone, code });
  }

  // Get seller by ID
  static async getById(sellerId) {
    return await apiClient.get(API_ENDPOINTS.SELLER_BY_ID(sellerId));
  }

  // Update seller
  static async update(sellerId, updateData) {
    return await apiClient.put(API_ENDPOINTS.SELLER_BY_ID(sellerId), updateData);
  }

  // Get all sellers (admin only)
  static async list() {
    return await apiClient.get(API_ENDPOINTS.SELLERS);
  }
}

export default SellerService;
