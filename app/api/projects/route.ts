import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Project from '@/lib/models/Project'
import { requireAuth } from '@/lib/middleware'

export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const authUser = requireAuth(request)

        const projects = await Project.find({ userId: authUser.userId })
            .sort({ updatedAt: -1 })

        return NextResponse.json({ projects })
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        console.error('Get projects error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const authUser = requireAuth(request)
        const { title, description } = await request.json()

        // Validation
        if (!title) {
            return NextResponse.json(
                { error: 'Project title is required' },
                { status: 400 }
            )
        }

        const project = await Project.create({
            title,
            description,
            userId: authUser.userId,
        })

        return NextResponse.json({ project })
    } catch (error) {
        if (error instanceof Error && error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        console.error('Create project error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}