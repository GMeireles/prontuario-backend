// controllers/userController.js
import db from "../models/index.js";

const { User } = db;

export const listUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const where = { tenant_id: req.user.tenant_id };
    if (role) where.role = role; // se passar ?role=professional, filtra

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "role"],
      order: [["name", "ASC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};