// frontend/app/api/users/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Call the backend API endpoint
    const res = await fetch("http://localhost:4000/users"); // <-- your backend server
    if (!res.ok) {
      throw new Error("Failed to fetch users from backend");
    }

    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to fetch users" }, { status: 500 });
  }
}