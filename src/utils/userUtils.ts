import useAppStore from '../state/appStore';

type AppState = ReturnType<typeof useAppStore>;

export const getUserRole = (user: AppState['user']): 'guest' | 'client' | 'reader' | 'admin' => {
  if (!user.isAuthenticated) return 'guest';
  return user.role || 'client';
};

export const getUserRoleDisplay = (user: AppState['user']): string => {
  const role = getUserRole(user);
  return role.toUpperCase();
};

export const isAdmin = (user: AppState['user']): boolean => {
  return getUserRole(user) === 'admin';
};

export const isReader = (user: AppState['user']): boolean => {
  return getUserRole(user) === 'reader';
};

export const isClient = (user: AppState['user']): boolean => {
  return getUserRole(user) === 'client';
};

export const getDefaultDashboardRoute = (user: AppState['user']): string => {
  const role = getUserRole(user);
  switch (role) {
    case 'admin':
      return 'AdminDashboard';
    case 'reader':
      return 'ReaderDashboard';
    default:
      return 'Dashboard';
  }
};