import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-passwordHash')

    if (!user) {
      return response.status(401).json({ message: 'User account not found.' })
    }

    request.user = user
    return next()
  } catch {
    return response.status(401).json({ message: 'Invalid or expired session.' })
  }
}
