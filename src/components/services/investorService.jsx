
import { apiClient, API_ENDPOINTS } from '../utils/api';

export class InvestorService {
  // Register new investor
  static async register(investorData) {
    return await apiClient.post(API_ENDPOINTS.investors.register, investorData);
  }

  // Login investor
  static async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.auth.login, credentials);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  }

  // Send SMS verification code
  static async sendVerificationCode(phone) {
    return await apiClient.post(API_ENDPOINTS.investors.verifyPhone, { phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(investorId, code) {
    return await apiClient.post(API_ENDPOINTS.investors.verify(investorId), { code });
  }

  // Forgot Password
  static async forgotPassword(email) {
    return await apiClient.post(API_ENDPOINTS.investors.forgotPassword, { email });
  }

  // Reset Password
  static async resetPassword(token, password) {
    return await apiClient.post(API_ENDPOINTS.investors.resetPassword, { token, password });
  }

  // Send email confirmation
  static async sendEmailConfirmation(email) {
    return await apiClient.post(API_ENDPOINTS.investors.sendEmailConfirmation, { email });
  }

  // Verify email with token
  static async verifyEmail(token) {
    return await apiClient.post(API_ENDPOINTS.investors.verifyEmail, { token });
  }

  // Resend email confirmation
  static async resendEmailConfirmation(email) {
    return await apiClient.post(API_ENDPOINTS.investors.resendEmailConfirmation, { email });
  }

  // Get current investor profile
  static async getProfile() {
    return await apiClient.get(API_ENDPOINTS.investors.me);
  }

  // Get investor by ID
  static async getById(investorId) {
    return await apiClient.get(API_ENDPOINTS.investors.byId(investorId));
  }

  // Update investor
  static async update(investorId, updateData) {
    return await apiClient.put(API_ENDPOINTS.investors.byId(investorId), updateData);
  }

  // Get leads for investor
  static async getLeads(investorId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams
      ? `${API_ENDPOINTS.investors.leads(investorId)}?${queryParams}`
      : API_ENDPOINTS.investors.leads(investorId);
    return await apiClient.get(endpoint);
  }

  // Logout
  static async logout() {
    apiClient.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('investorId');
    localStorage.removeItem('investorEmail');
  }

  // Get all investors (admin only)
  static async list() {
    return await apiClient.get(API_ENDPOINTS.investors.base);
  }
}

export default InvestorService;
