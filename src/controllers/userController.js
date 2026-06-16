import { userService } from '../services/userService.js';

export const listUsers = async (req, res) => {
  try {
    const users = await userService.list(req.user.tenant_id, req.query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
