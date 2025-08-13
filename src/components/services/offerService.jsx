import { apiClient, API_ENDPOINTS } from '../utils/api';

export class OfferService {
  // Make new offer on property
  static async makeOffer(offerData) {
    return await apiClient.post(API_ENDPOINTS.MAKE_OFFER, offerData);
  }

  // Get offer by ID
  static async getById(offerId) {
    return await apiClient.get(API_ENDPOINTS.OFFER_BY_ID(offerId));
  }

  // Accept offer (seller action)
  static async acceptOffer(offerId) {
    return await apiClient.post(API_ENDPOINTS.ACCEPT_OFFER(offerId));
  }

  // Counter offer (seller action)
  static async counterOffer(offerId, counterAmount) {
    return await apiClient.post(API_ENDPOINTS.COUNTER_OFFER(offerId), { amount: counterAmount });
  }

  // Withdraw offer (investor action)
  static async withdrawOffer(offerId) {
    return await apiClient.post(API_ENDPOINTS.WITHDRAW_OFFER(offerId));
  }

  // Update offer
  static async update(offerId, updateData) {
    return await apiClient.put(API_ENDPOINTS.OFFER_BY_ID(offerId), updateData);
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