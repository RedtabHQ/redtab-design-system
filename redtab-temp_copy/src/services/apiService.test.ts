import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApiService } from '@/lib/apiService';
import { apiClient } from '@/lib/api';

vi.mock('@/lib/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

interface TestResource {
  id: string;
  name: string;
  description?: string;
}

describe('ApiService', () => {
  let service: ApiService<TestResource>;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ApiService<TestResource>('/test-resources');
  });

  describe('getAll', () => {
    it('should fetch all resources without params', async () => {
      const mockResponse = {
        data: [
          { id: '1', name: 'Resource 1' },
          { id: '2', name: 'Resource 2' },
        ],
        total: 2,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll();

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch resources with pagination params', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Resource 1' }],
        total: 10,
        page: 2,
        pageSize: 5,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll({ page: 2, pageSize: 5 });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources?page=2&pageSize=5');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch resources with sorting params', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Resource A' }],
        total: 5,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll({ sortBy: 'name', sortOrder: 'asc' });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources?sortBy=name&sortOrder=asc');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch resources with search param', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Searched Resource' }],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll({ search: 'searched' });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources?search=searched');
      expect(result).toEqual(mockResponse);
    });

    it('should fetch resources with filter params', async () => {
      const mockResponse = {
        data: [{ id: '1', name: 'Active Resource' }],
        total: 1,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll({ status: 'active', category: 'test' });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources?status=active&category=test');
      expect(result).toEqual(mockResponse);
    });

    it('should skip undefined and null params', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await service.getAll({ page: 1, search: undefined, filter: null });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources?page=1');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should fetch resource by string ID', async () => {
      const mockResource = { id: '123', name: 'Test Resource' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResource);

      const result = await service.getById('123');

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/123');
      expect(result).toEqual(mockResource);
    });

    it('should fetch resource by number ID', async () => {
      const mockResource = { id: '456', name: 'Test Resource' };

      vi.mocked(apiClient.get).mockResolvedValue(mockResource);

      const result = await service.getById(456);

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/456');
      expect(result).toEqual(mockResource);
    });

    it('should handle resource not found error', async () => {
      const mockError = new Error('Resource not found');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(service.getById('nonexistent')).rejects.toThrow('Resource not found');
    });
  });

  describe('create', () => {
    it('should create a new resource', async () => {
      const createData = { name: 'New Resource', description: 'Test description' };
      const mockResource = { id: '789', ...createData };

      vi.mocked(apiClient.post).mockResolvedValue(mockResource);

      const result = await service.create(createData);

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources', createData);
      expect(result).toEqual(mockResource);
    });

    it('should handle validation error', async () => {
      const mockError = new Error('Validation failed');
      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(service.create({ name: '' })).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    it('should update resource with PUT', async () => {
      const updateData = { name: 'Updated Resource', description: 'Updated' };
      const mockResource = { id: '123', ...updateData };

      vi.mocked(apiClient.put).mockResolvedValue(mockResource);

      const result = await service.update('123', updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/test-resources/123', updateData);
      expect(result).toEqual(mockResource);
    });

    it('should update resource with number ID', async () => {
      const updateData = { name: 'Updated' };
      const mockResource = { id: '456', name: 'Updated' };

      vi.mocked(apiClient.put).mockResolvedValue(mockResource);

      const result = await service.update(456, updateData);

      expect(apiClient.put).toHaveBeenCalledWith('/test-resources/456', updateData);
      expect(result).toEqual(mockResource);
    });
  });

  describe('patch', () => {
    it('should partially update resource', async () => {
      const patchData = { description: 'Patched description' };
      const mockResource = { id: '123', name: 'Resource', description: 'Patched description' };

      vi.mocked(apiClient.patch).mockResolvedValue(mockResource);

      const result = await service.patch('123', patchData);

      expect(apiClient.patch).toHaveBeenCalledWith('/test-resources/123', patchData);
      expect(result).toEqual(mockResource);
    });
  });

  describe('delete', () => {
    it('should delete a resource by string ID', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await service.delete('123');

      expect(apiClient.delete).toHaveBeenCalledWith('/test-resources/123');
    });

    it('should delete a resource by number ID', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await service.delete(456);

      expect(apiClient.delete).toHaveBeenCalledWith('/test-resources/456');
    });

    it('should handle delete error', async () => {
      const mockError = new Error('Cannot delete resource');
      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(service.delete('123')).rejects.toThrow('Cannot delete resource');
    });
  });

  describe('bulkDelete', () => {
    it('should bulk delete resources with string IDs', async () => {
      vi.mocked(apiClient.post).mockResolvedValue(undefined);

      await service.bulkDelete(['1', '2', '3']);

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources/bulk-delete', {
        ids: ['1', '2', '3'],
      });
    });

    it('should bulk delete resources with number IDs', async () => {
      vi.mocked(apiClient.post).mockResolvedValue(undefined);

      await service.bulkDelete([1, 2, 3]);

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources/bulk-delete', {
        ids: [1, 2, 3],
      });
    });

    it('should bulk delete resources with mixed IDs', async () => {
      vi.mocked(apiClient.post).mockResolvedValue(undefined);

      await service.bulkDelete(['1', 2, '3']);

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources/bulk-delete', {
        ids: ['1', 2, '3'],
      });
    });
  });

  describe('count', () => {
    it('should get resource count without filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ count: 42 });

      const result = await service.count();

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/count');
      expect(result).toBe(42);
    });

    it('should get resource count with filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ count: 10 });

      const result = await service.count({ status: 'active', type: 'test' });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/count?status=active&type=test');
      expect(result).toBe(10);
    });

    it('should skip undefined and null filters', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ count: 5 });

      const result = await service.count({ status: 'active', category: undefined });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/count?status=active');
      expect(result).toBe(5);
    });
  });

  describe('exists', () => {
    it('should return true if resource exists', async () => {
      vi.mocked(apiClient.get).mockResolvedValue({ id: '123', name: 'Resource' });

      const result = await service.exists('123');

      expect(result).toBe(true);
    });

    it('should return false if resource does not exist', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'));

      const result = await service.exists('nonexistent');

      expect(result).toBe(false);
    });
  });

  describe('query', () => {
    it('should perform custom query without params', async () => {
      const mockResult = { data: [{ id: '1', name: 'Result' }] };

      vi.mocked(apiClient.get).mockResolvedValue(mockResult);

      const result = await service.query('custom-endpoint');

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/custom-endpoint');
      expect(result).toEqual(mockResult);
    });

    it('should perform custom query with params', async () => {
      const mockResult = { data: [{ id: '1', name: 'Filtered Result' }] };

      vi.mocked(apiClient.get).mockResolvedValue(mockResult);

      const result = await service.query('search', { query: 'test', limit: 10 });

      expect(apiClient.get).toHaveBeenCalledWith('/test-resources/search?query=test&limit=10');
      expect(result).toEqual(mockResult);
    });
  });

  describe('mutate', () => {
    it('should perform custom mutation without data', async () => {
      const mockResult = { success: true };

      vi.mocked(apiClient.post).mockResolvedValue(mockResult);

      const result = await service.mutate('activate');

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources/activate', undefined);
      expect(result).toEqual(mockResult);
    });

    it('should perform custom mutation with data', async () => {
      const mutationData = { action: 'approve', comments: 'Looks good' };
      const mockResult = { success: true, data: { id: '123', status: 'approved' } };

      vi.mocked(apiClient.post).mockResolvedValue(mockResult);

      const result = await service.mutate('approve', mutationData);

      expect(apiClient.post).toHaveBeenCalledWith('/test-resources/approve', mutationData);
      expect(result).toEqual(mockResult);
    });
  });
});
