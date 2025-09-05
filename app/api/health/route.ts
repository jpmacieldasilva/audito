import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: Date.now(),
    service: "audito-backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
}
