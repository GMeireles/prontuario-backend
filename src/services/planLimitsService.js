import db from '../models/index.js';
import { subscriptionService } from './subscriptionService.js';
import { tenantAccessService } from './tenantAccessService.js';

const { User, Patient } = db;

function limitError(message = 'Limite do plano atingido.') {
  const err = new Error(message);
  err.status = 403;
  err.code = 'PLAN_LIMIT';
  return err;
}

export const planLimitsService = {
  async getLimits(tenantId) {
    const subscription = await subscriptionService.ensureForTenant(tenantId);
    return subscription?.plan || null;
  },

  async assertCanCreateUser(tenantId) {
    const plan = await this.getLimits(tenantId);
    if (!plan?.max_users) return;

    const usage = await tenantAccessService.getUsage(tenantId);
    if (usage.users >= plan.max_users) {
      throw limitError('Limite de usuários do plano atingido.');
    }
  },

  async assertCanCreatePatient(tenantId) {
    const plan = await this.getLimits(tenantId);
    if (!plan?.max_patients) return;

    const usage = await tenantAccessService.getUsage(tenantId);
    if (usage.patients >= plan.max_patients) {
      throw limitError('Limite de pacientes do plano atingido.');
    }
  }
};
