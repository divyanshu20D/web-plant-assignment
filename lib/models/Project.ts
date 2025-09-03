import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
    title: string
    description?: string
    userId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const ProjectSchema = new Schema<IProject>({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
}, {
    timestamps: true,
})

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)