import { describe, it, expect, vi } from 'vitest';

vi.mock('@/api/client', () => ({
  default: { post: vi.fn() },
}));

import apiClient from '@/api/client';
import { LeadService } from '@/components/services/leadService';

describe('LeadService.create', () => {
  it('posts to /leads and triggers notifications', async () => {
    const payload = { name: 'John Doe' };

    apiClient.post
      .mockResolvedValueOnce({ data: { id: 1 } })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await LeadService.create(payload);

    expect(apiClient.post).toHaveBeenNthCalledWith(1, '/leads', payload);
    expect(apiClient.post).toHaveBeenNthCalledWith(2, '/leads/1/notify-seller');
    expect(apiClient.post).toHaveBeenNthCalledWith(3, '/leads/1/notify-investors');
  });
});
