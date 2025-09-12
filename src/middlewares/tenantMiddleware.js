export const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenant_id) {
    return res.status(403).json({ error: 'Tenant não definido para este usuário' })
  }

  req.tenant_id = req.user.tenant_id
  next()
}
