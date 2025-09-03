import { NextRequest } from 'next/server'
import { verifyToken } from './auth'

export interface AuthenticatedRequest extends NextRequest {
    user?: {
        userId: string
        email: string
    }
}

export function getAuthUser(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.substring(7)
        const decoded = verifyToken(token)

        return {
            userId: decoded.userId,
            email: decoded.email,
        }
    } catch (error) {
        return null
    }
}

export function requireAuth(request: NextRequest) {
    const user = getAuthUser(request)

    if (!user) {
        throw new Error('Authentication required')
    }

    return user
}