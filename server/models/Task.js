import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: 'General',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    studyHours: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    reminderAt: {
      type: Date,
      default: null,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Task', taskSchema)
