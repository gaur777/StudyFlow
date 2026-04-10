import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    loginStreak: {
      type: Number,
      default: 1,
    },
    lastLoginDate: {
      type: String,
      default: null,
    },
    dailyGoalHours: {
      type: Number,
      default: 2,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('User', userSchema)
