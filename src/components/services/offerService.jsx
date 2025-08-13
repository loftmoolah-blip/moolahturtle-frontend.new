import { apiClient, API_ENDPOINTS } from '../utils/api';

export class OfferService {
  // Make new offer on property
  static async makeOffer(offerData) {
    return await apiClient.post(API_ENDPOINTS.offers.base, offerData);
  }

  // Get offer by ID
  static async getById(offerId) {
    return await apiClient.get(API_ENDPOINTS.offers.byId(offerId));
  }

  // Accept offer (seller action)
  static async acceptOffer(offerId) {
    return await apiClient.post(API_ENDPOINTS.offers.accept(offerId));
  }

  // Counter offer (seller action)
  static async counterOffer(offerId, counterAmount) {
    return await apiClient.post(API_ENDPOINTS.offers.counter(offerId), { amount: counterAmount });
  }

  // Withdraw offer (investor action)
  static async withdrawOffer(offerId) {
    return await apiClient.post(API_ENDPOINTS.offers.withdraw(offerId));
  }

  // Update offer
  static async update(offerId, updateData) {
    return await apiClient.put(API_ENDPOINTS.offers.byId(offerId), updateData);
  }

  // Get offers for a property
  static async getPropertyOffers(propertyId) {
    return await apiClient.get(API_ENDPOINTS.properties.offers(propertyId));
  }

  // Get offers made by investor
  static async getInvestorOffers(investorId) {
    return await apiClient.get(API_ENDPOINTS.investors.offers(investorId));
  }
}

export default OfferService;