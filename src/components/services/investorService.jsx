import apiClient from '@/api/client';

export class InvestorService {
  // Register new investor
  static async register(investorData) {
    return await apiClient.post('/investors/register', investorData);
  }

  // Login investor
  static async login(credentials) {
    const { data } = await apiClient.post('/auth/login', credentials);
    return data;
  }

  // Send SMS verification code
  static async sendVerificationCode(phone) {
    return await apiClient.post('/investors/verify-phone', { phone });
  }

  // Verify phone number with OTP
  static async verifyPhone(investorId, code) {
    return await apiClient.post(`/investors/${investorId}/verify`, { code });
  }

  // Forgot Password
  static async forgotPassword(email) {
    return await apiClient.post('/investors/forgot-password', { email });
  }

  // Reset Password
  static async resetPassword(token, password) {
    return await apiClient.post('/investors/reset-password', { token, password });
  }

  // Send email confirmation
  static async sendEmailConfirmation(email) {
    return await apiClient.post('/investors/send-email-confirmation', { email });
  }

  // Verify email with token
  static async verifyEmail(token) {
    return await apiClient.post('/investors/verify-email', { token });
  }

  // Resend email confirmation
  static async resendEmailConfirmation(email) {
    return await apiClient.post('/investors/resend-email-confirmation', { email });
  }

  // Get current investor profile
  static async getProfile() {
    return await apiClient.get('/investors/me');
  }

  // Get investor by ID
  static async getById(investorId) {
    return await apiClient.get(`/investors/${investorId}`);
  }

  // Update investor
  static async update(investorId, updateData) {
    return await apiClient.put(`/investors/${investorId}`, updateData);
  }

  // Get leads for investor
  static async getLeads(investorId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams
      ? `/investors/${investorId}/leads?${queryParams}`
      : `/investors/${investorId}/leads`;
    return await apiClient.get(endpoint);
  }

  // Logout
  static async logout() {
    await apiClient.post('/auth/logout');
  }

  // Get all investors (admin only)
  static async list() {
    return await apiClient.get('/investors');
  }
}

export default InvestorService;

