import type { Role, User } from '@types';

/**
 * Get display name for user role
 *
 * @param role - User role from User type
 * @returns Formatted role display name
 *
 * @example
 * ```typescript
 * getRoleDisplay('ADMIN') // 'System Administrator'
 * getRoleDisplay('RISK_OFFICER') // 'Risk Management Officer'
 * ```
 */
export const getRoleDisplay = (role: User['role'] | Role | null | undefined): string => {
  if (!role) return '';
  if (typeof role === 'string') return role;
  if (typeof role === 'object') {
    return role.name || role.id || '';
  }
  return String(role);
};

/**
 * Get user initials from user object
 * Falls back to 'GA' for Global Admin if no user provided
 *
 * @param user - User object or null
 * @returns User initials (2 characters, uppercase)
 *
 * @example
 * ```typescript
 * getUserInitials({ username: 'John Doe', ... }) // 'JD'
 * getUserInitials({ email: 'john@example.com', ... }) // 'JO'
 * getUserInitials(null) // 'GA'
 * ```
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return 'GA';

  if (user.username) {
    const parts = user.username.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  }

  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }

  return 'U';
};

/**
 * Get display text for user status with color class
 *
 * @param status - User status
 * @returns Object with display text and Tailwind color classes
 *
 * @example
 * ```typescript
 * getUserStatusDisplay('ACTIVE')
 * // { text: 'Active', colorClass: 'bg-green-100 text-green-700' }
 * ```
 */
export const getUserStatusDisplay = (status: User['status']): {
  text: string;
  colorClass: string;
} => {
  const statusMap: Record<User['status'], { text: string; colorClass: string }> = {
    'ACTIVE': {
      text: 'Active',
      colorClass: 'bg-green-100 text-green-700',
    },
    'INACTIVE': {
      text: 'Inactive',
      colorClass: 'bg-gray-100 text-gray-700',
    },
    'SUSPENDED': {
      text: 'Suspended',
      colorClass: 'bg-red-100 text-red-700',
    },
  };

  return statusMap[status] || {
    text: status,
    colorClass: 'bg-gray-100 text-gray-700',
  };
};
