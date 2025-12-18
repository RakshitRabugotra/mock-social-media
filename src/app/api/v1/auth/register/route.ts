/* eslint-disable @typescript-eslint/no-explicit-any */

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { chooseRandomAvatar } from "@/lib/avatars";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // REQUIRE USERNAME
    if (!username)
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    // REQUIRED EMAIL
    if (!email)
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    // REQUIRED PASSWORD
    if (!password)
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );

    // Connect to the DB
    await connectDB();
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // And then query and see if the user already exists with the given email
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });

    // BAD REQUEST IF EMAIL ALREADY IN USER
    if (user) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // CREATE THE USER AND REGISTER
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatarUrl: chooseRandomAvatar(),
    });
    // RETURN THE RESPONSe
    return NextResponse.json(
      { success: true, message: "Verification Email Sent!", user },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("error: ", err?.message);
    return NextResponse.json(
      {
        message: "Server Error",
        error: err?.message ?? err?.toString(),
      },
      {
        status: 500,
      }
    );
  }
}
