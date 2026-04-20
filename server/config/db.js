import mongoose from 'mongoose'

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI
  console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI)
  console.log("MONGODB_URI preview:", process.env.MONGODB_URI?.slice(0, 20))
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured in the environment.')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}
