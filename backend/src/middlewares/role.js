// Role-based guard to restrict endpoints to admin users.

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' })
  }
  next()
}

