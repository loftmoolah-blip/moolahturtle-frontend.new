import { describe, it, expect, vi } from 'vitest';

vi.mock('@/api/client', () => ({
  default: { post: vi.fn() },
}));

import apiClient from '@/api/client';
import { InvestorService } from '@/components/services/investorService';

describe('InvestorService.register', () => {
  it('posts to /investors/register and returns response data', async () => {
    const payload = { name: 'Alice' };
    const mockResponse = { data: { id: 123 } };
    apiClient.post.mockResolvedValueOnce(mockResponse);

    const result = await InvestorService.register(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/investors/register', payload);
    expect(result).toEqual(mockResponse.data);
  });

  it('propagates errors from apiClient.post', async () => {
    const payload = { name: 'Bob' };
    const error = new Error('Request failed');
    apiClient.post.mockRejectedValueOnce(error);

    await expect(InvestorService.register(payload)).rejects.toThrow(error);
    expect(apiClient.post).toHaveBeenCalledWith('/investors/register', payload);
  });
});
