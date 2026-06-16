import db from '../models/index.js';

const { Plan } = db;

export const planService = {
  listActive() {
    return Plan.findAll({
      where: { active: true },
      order: [['price_cents', 'ASC']]
    });
  },

  findById(id) {
    return Plan.findByPk(id);
  },

  findBySlug(slug) {
    return Plan.findOne({ where: { slug, active: true } });
  },

  async resolvePlan({ planId, planSlug }) {
    if (planId) return Plan.findByPk(planId);
    if (planSlug) return this.findBySlug(planSlug);
    return null;
  }
};
