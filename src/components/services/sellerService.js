import apiClient from '@/api/client';

export class SellerService {
  // Register new seller
  static async register(sellerData) {
    return await apiClient.post('/sellers/register', sellerData);
  }

  // Send SMS verification code — backend expects both name and phone
  static async sendVerificationCode(name, phone) {
    return await apiClient.post('/sellers/verify-phone', { name, phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(phone, code) {
    return await apiClient.post('/sellers/verify-code', { phone, code });
  }

  // Get seller by ID
  static async getById(sellerId) {
    return await apiClient.get(`/sellers/${sellerId}`);
  }

  // Update seller
  static async update(sellerId, updateData) {
    return await apiClient.put(`/sellers/${sellerId}`, updateData);
  }

  // Get all sellers (admin only)
  static async list() {
    return await apiClient.get('/sellers');
  }
}

export default SellerService;

