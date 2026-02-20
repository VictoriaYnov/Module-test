import axios from 'axios';
import { countUsers, getAllUsers, postUser } from '../api';

jest.mock('axios');

const mockUsers = Array(10).fill(null).map((_, i) => ({ id: i + 1, name: `User ${i + 1}` }));

afterEach(() => jest.clearAllMocks());

describe('countUsers', () => {
  it('should return the number of users', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    await expect(countUsers()).resolves.toBe(10);
  });

  it('should throw on network error', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(countUsers()).rejects.toThrow('Network Error');
  });
});

describe('getAllUsers', () => {
  it('should return the full list of users', async () => {
    axios.get.mockResolvedValue({ data: mockUsers });
    await expect(getAllUsers()).resolves.toEqual(mockUsers);
  });

  it('should throw on network error', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(getAllUsers()).rejects.toThrow('Network Error');
  });
});

describe('postUser', () => {
  it('should return the created user', async () => {
    axios.post.mockResolvedValue({ data: { id: 101 } });
    await expect(postUser({ name: 'Test' })).resolves.toEqual({ id: 101 });
  });

  it('should throw on server error', async () => {
    axios.post.mockRejectedValue(new Error('Server Error'));
    await expect(postUser({ name: 'Test' })).rejects.toThrow('Server Error');
  });
});
