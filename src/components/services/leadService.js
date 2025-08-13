import apiClient from '@/api/client';

export class LeadService {
  // Create a new lead
  static async create(leadData) {
    return await apiClient.post('/leads', leadData);
  }
}

export default LeadService;
