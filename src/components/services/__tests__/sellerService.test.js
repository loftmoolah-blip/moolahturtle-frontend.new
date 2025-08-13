import { describe, it, expect, vi } from 'vitest';

// Mock the apiClient to intercept HTTP requests
vi.mock('@/api/client', () => ({
  default: { post: vi.fn() }
}));

import apiClient from '@/api/client';
import SellerService from '@/components/services/sellerService';

describe('SellerService.register', () => {
  it('posts to /sellers/register with the provided data', async () => {
    const payload = { name: 'Jane Doe', phone: '1234567890' };
    apiClient.post.mockResolvedValue({ data: {} });

    await SellerService.register(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/sellers/register', payload);
  });
});
