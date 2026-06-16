import { billingService } from '../services/billingService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listPlans = async (req, res) => {
  try {
    const plans = await billingService.listPlans();
    return successResponse(res, plans);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const getSubscription = async (req, res) => {
  try {
    const data = await billingService.getSubscription(req.tenant_id);
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 500);
  }
};

export const createCheckout = async (req, res) => {
  try {
    const result = await billingService.createCheckout(req.tenant_id, req.body, req.user);
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};

export const createPortal = async (req, res) => {
  try {
    const result = await billingService.createPortal(req.tenant_id);
    return successResponse(res, result);
  } catch (err) {
    return errorResponse(res, err.message, null, err.status || 400);
  }
};
