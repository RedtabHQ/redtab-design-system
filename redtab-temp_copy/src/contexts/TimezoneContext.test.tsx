import { render, screen, waitFor } from '@testing-library/react';
import { TimezoneProvider, useTimezone } from './TimezoneContext';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/features/users/services/userApi';
import type { User } from '@types';

vi.mock('@/stores/authStore');
vi.mock('@/features/users/services/userApi');

const TestConsumer = () => {
  const { timezone } = useTimezone();
  return <div data-testid="tz">{timezone}</div>;
};

interface AuthStoreState {
  user: User | null;
}

function mockAuthStoreWith(state: AuthStoreState) {
  vi.mocked(useAuthStore).mockImplementation(<T,>(selector?: (s: AuthStoreState) => T) => {
    if (typeof selector === 'function') return selector(state) as T;
    return state as T;
  });
}

const mockUser: User = {
  id: 'u1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
};

describe('TimezoneContext', () => {
  it('returns timezone from user settings', async () => {
    mockAuthStoreWith({ user: mockUser });
    vi.mocked(userApi.getUserSettings).mockResolvedValue({
      preferences: { timezone: 'Asia/Kathmandu', language: 'en', currency: 'NPR' },
      notifications: { email: true, sms: false, whatsapp: false },
      security: { twoFactorEnabled: false, sessionTimeout: 30 },
    });

    render(
      <TimezoneProvider>
        <TestConsumer />
      </TimezoneProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tz').textContent).toBe('Asia/Kathmandu');
    });
  });

  it('defaults to Asia/Kathmandu when no user', async () => {
    mockAuthStoreWith({ user: null });

    render(
      <TimezoneProvider>
        <TestConsumer />
      </TimezoneProvider>
    );

    expect(screen.getByTestId('tz').textContent).toBe('Asia/Kathmandu');
  });
});
