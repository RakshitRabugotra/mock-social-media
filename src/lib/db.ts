import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// @ts-expect-error Trying to access an unknown global property
let cached = global.mongoose;

if (!cached) {
  // @ts-expect-error Trying to create our own unknown global property
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.prom1ise) {
    const opts = {
      bufferCommands: false, // Recommended for Next.js to avoid buffering issues
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
