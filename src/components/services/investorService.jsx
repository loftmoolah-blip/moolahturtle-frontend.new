
import { apiClient, API_ENDPOINTS } from '../utils/api';

export class InvestorService {
  // Register new investor
  static async register(investorData) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_REGISTER, investorData);
  }

  // Login investor
  static async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.INVESTOR_LOGIN, credentials);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  }

  // Send SMS verification code
  static async sendVerificationCode(phone) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_VERIFY_PHONE, { phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(investorId, code) {
    return await apiClient.post(`${API_ENDPOINTS.INVESTOR_BY_ID(investorId)}/verify`, { code });
  }

  // Forgot Password
  static async forgotPassword(email) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_FORGOT_PASSWORD, { email });
  }

  // Reset Password
  static async resetPassword(token, password) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_RESET_PASSWORD, { token, password });
  }

  // Send email confirmation
  static async sendEmailConfirmation(email) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_SEND_EMAIL_CONFIRMATION, { email });
  }

  // Verify email with token
  static async verifyEmail(token) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_VERIFY_EMAIL, { token });
  }

  // Resend email confirmation
  static async resendEmailConfirmation(email) {
    return await apiClient.post(API_ENDPOINTS.INVESTOR_RESEND_EMAIL_CONFIRMATION, { email });
  }

  // Get current investor profile
  static async getProfile() {
    return await apiClient.get('/investors/me');
  }

  // Get investor by ID
  static async getById(investorId) {
    return await apiClient.get(API_ENDPOINTS.INVESTOR_BY_ID(investorId));
  }

  // Update investor
  static async update(investorId, updateData) {
    return await apiClient.put(API_ENDPOINTS.INVESTOR_BY_ID(investorId), updateData);
  }

  // Get leads for investor
  static async getLeads(investorId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams 
      ? `${API_ENDPOINTS.INVESTOR_LEADS(investorId)}?${queryParams}` 
      : API_ENDPOINTS.INVESTOR_LEADS(investorId);
    return await apiClient.get(endpoint);
  }

  // Logout
  static async logout() {
    apiClient.setToken(null);
    localStorage.removeItem('investorId');
    localStorage.removeItem('investorEmail');
  }

  // Get all investors (admin only)
  static async list() {
    return await apiClient.get(API_ENDPOINTS.INVESTORS);
  }
}

export default InvestorService;
