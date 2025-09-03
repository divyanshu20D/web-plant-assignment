import mongoose, { Document, Schema } from 'mongoose'

export interface ITask extends Document {
    title: string
    description?: string
    status: 'todo' | 'in-progress' | 'done'
    dueDate?: Date
    projectId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo',
    },
    dueDate: {
        type: Date,
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project ID is required'],
    },
}, {
    timestamps: true,
})

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)