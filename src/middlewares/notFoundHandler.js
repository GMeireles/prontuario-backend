export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' })
}
