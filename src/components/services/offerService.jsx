import apiClient from '@/api/client';

export class OfferService {
  // Make new offer on property
  static async makeOffer(offerData) {
    return await apiClient.post('/offers', offerData);
  }

  // Get offer by ID
  static async getById(offerId) {
    return await apiClient.get(`/offers/${offerId}`);
  }

  // Accept offer (seller action)
  static async acceptOffer(offerId) {
    return await apiClient.post(`/offers/${offerId}/accept`);
  }

  // Counter offer (seller action)
  static async counterOffer(offerId, counterAmount) {
    return await apiClient.post(`/offers/${offerId}/counter`, { amount: counterAmount });
  }

  // Withdraw offer (investor action)
  static async withdrawOffer(offerId) {
    return await apiClient.post(`/offers/${offerId}/withdraw`);
  }

  // Update offer
  static async update(offerId, updateData) {
    return await apiClient.put(`/offers/${offerId}`, updateData);
  }

  // Get offers for a property
  static async getPropertyOffers(propertyId) {
    return await apiClient.get(`/properties/${propertyId}/offers`);
  }

  // Get offers made by investor
  static async getInvestorOffers(investorId) {
    return await apiClient.get(`/investors/${investorId}/offers`);
  }
}

export default OfferService;
