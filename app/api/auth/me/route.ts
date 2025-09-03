import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import { requireAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = requireAuth(request)

        const user = await User.findById(authUser.userId).select('-password')
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            user: {
                id: user._id,
                email: user.email,
            },
        })
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}