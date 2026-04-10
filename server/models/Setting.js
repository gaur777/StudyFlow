import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    taskReminders: {
      type: Boolean,
      default: true,
    },
    dailySummary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Setting', settingSchema)
