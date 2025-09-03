import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        // For JWT-based auth, logout is mainly handled on the client side
        // by removing the token from localStorage
        // But we can still provide this endpoint for consistency

        return NextResponse.json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}