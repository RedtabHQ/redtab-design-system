import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { userApi } from '@/features/users/services/userApi';
import { DEFAULT_TIMEZONE } from '@/utils/dateFormatter';

interface TimezoneContextValue {
  timezone: string;
}

const TimezoneContext = createContext<TimezoneContextValue>({ timezone: DEFAULT_TIMEZONE });

export const useTimezone = () => useContext(TimezoneContext);

interface TimezoneProviderProps {
  children: ReactNode;
}

export const TimezoneProvider = ({ children }: TimezoneProviderProps) => {
  const user = useAuthStore((state) => state.user);
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);

  useEffect(() => {
    if (!user?.id) {
      setTimezone(DEFAULT_TIMEZONE);
      return;
    }

    let cancelled = false;
    userApi.getUserSettings(user.id).then((settings) => {
      if (cancelled) return;
      const tz = settings.preferences?.timezone;
      if (tz) setTimezone(tz);
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [user?.id]);

  return (
    <TimezoneContext.Provider value={{ timezone }}>
      {children}
    </TimezoneContext.Provider>
  );
};
