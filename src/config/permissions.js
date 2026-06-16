/**
 * Permissões base por perfil (código — sem tabelas role_permissions nesta fase).
 * `assistant` no banco equivale a receptionist no produto.
 */

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  PATIENTS_VIEW: 'patients.view',
  PATIENTS_CREATE: 'patients.create',
  PATIENTS_UPDATE: 'patients.update',
  PATIENTS_DELETE: 'patients.delete',
  APPOINTMENTS_VIEW: 'appointments.view',
  APPOINTMENTS_CREATE: 'appointments.create',
  APPOINTMENTS_UPDATE: 'appointments.update',
  APPOINTMENTS_DELETE: 'appointments.delete',
  ANAMNESES_VIEW: 'anamneses.view',
  ANAMNESES_CREATE: 'anamneses.create',
  ANAMNESES_UPDATE: 'anamneses.update',
  EVOLUTIONS_VIEW: 'evolutions.view',
  EVOLUTIONS_CREATE: 'evolutions.create',
  EVOLUTIONS_UPDATE: 'evolutions.update',
  FILES_VIEW: 'files.view',
  FILES_UPLOAD: 'files.upload',
  FILES_DOWNLOAD: 'files.download',
  PRESCRIPTIONS_VIEW: 'prescriptions.view',
  PRESCRIPTIONS_CREATE: 'prescriptions.create',
  PRESCRIPTIONS_UPDATE: 'prescriptions.update',
  BILLING_VIEW: 'billing.view',
  BILLING_MANAGE: 'billing.manage',
};

const ALL = Object.values(PERMISSIONS);

const PROFESSIONAL_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.PATIENTS_VIEW,
  PERMISSIONS.PATIENTS_CREATE,
  PERMISSIONS.PATIENTS_UPDATE,
  PERMISSIONS.APPOINTMENTS_VIEW,
  PERMISSIONS.APPOINTMENTS_CREATE,
  PERMISSIONS.APPOINTMENTS_UPDATE,
  PERMISSIONS.ANAMNESES_VIEW,
  PERMISSIONS.ANAMNESES_CREATE,
  PERMISSIONS.ANAMNESES_UPDATE,
  PERMISSIONS.EVOLUTIONS_VIEW,
  PERMISSIONS.EVOLUTIONS_CREATE,
  PERMISSIONS.EVOLUTIONS_UPDATE,
  PERMISSIONS.FILES_VIEW,
  PERMISSIONS.FILES_UPLOAD,
  PERMISSIONS.FILES_DOWNLOAD,
  PERMISSIONS.PRESCRIPTIONS_VIEW,
  PERMISSIONS.PRESCRIPTIONS_CREATE,
  PERMISSIONS.PRESCRIPTIONS_UPDATE,
];

/** assistant (DB) = receptionist (produto) */
const RECEPTIONIST_PERMISSIONS = [
  PERMISSIONS.DASHBOARD_VIEW,
  PERMISSIONS.PATIENTS_VIEW,
  PERMISSIONS.PATIENTS_CREATE,
  PERMISSIONS.PATIENTS_UPDATE,
  PERMISSIONS.APPOINTMENTS_VIEW,
  PERMISSIONS.APPOINTMENTS_CREATE,
  PERMISSIONS.APPOINTMENTS_UPDATE,
  PERMISSIONS.FILES_VIEW,
  PERMISSIONS.FILES_DOWNLOAD,
];

export const ROLE_PERMISSIONS = {
  admin: ALL,
  professional: PROFESSIONAL_PERMISSIONS,
  assistant: RECEPTIONIST_PERMISSIONS,
};

export function getPermissionsForRole(role) {
  if (role === 'admin') return [...ALL];
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(role, permission) {
  if (!permission) return true;
  if (role === 'admin') return true;
  return getPermissionsForRole(role).includes(permission);
}

export function getProfileLabel(role) {
  const map = {
    admin: 'admin',
    professional: 'professional',
    assistant: 'receptionist',
  };
  return map[role] || role;
}
