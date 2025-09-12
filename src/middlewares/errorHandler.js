export const errorHandler = (err, req, res, next) => {
  console.error('🔥 Erro capturado:', err)

  // Erro de validação (ex: Sequelize)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Erro de validação',
      details: err.errors.map(e => e.message)
    })
  }

  // Erro de autenticação/autorização
  if (err.status === 401) {
    return res.status(401).json({ error: 'Não autorizado' })
  }
  if (err.status === 403) {
    return res.status(403).json({ error: 'Proibido' })
  }

  // Erro genérico
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  })
}
