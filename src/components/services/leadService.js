import apiClient from '@/api/client';

export class LeadService {
  // Create a new lead
  static async create(leadData) {
    const { data } = await apiClient.post('/api/leads', leadData);

    try {
      await apiClient.post(`/api/leads/${data.id}/notify-seller`);
    } catch (error) {
      console.error('Failed to notify seller:', error);
    }

    try {
      await apiClient.post(`/api/leads/${data.id}/notify-investors`);
    } catch (error) {
      console.error('Failed to notify investors:', error);
    }

    return data;
  }
}

export default LeadService;
