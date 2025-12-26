import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import InsurerProfile from "@/models/InsurerProfile";
import { getCurrentUser } from "@/lib/session";
/* eslint-disable @typescript-eslint/no-explicit-any */


export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    await dbConnect();

    // Check if already exists
    const existing = await InsurerProfile.findOne({ userId: user.id });
    if (existing) {
      return NextResponse.json({ error: "Application already submitted." }, { status: 400 });
    }



    const existingEmail = await InsurerProfile.findOne({ officialEmail: body.officialEmail });
    if (existingEmail) {
      return NextResponse.json({ 
        error: "This Official Email is already registered by another partner." 
      }, { status: 400 });
    }




    await InsurerProfile.create({
      userId: user.id,
      companyName: body.companyName,
      branchName: body.branchName,
      tinNumber: body.tinNumber,
      licenseDocument: body.licenseDocument,
      officialEmail: body.officialEmail,
      officialPhone: body.officialPhone,
      status: 'Pending' // Important: Admin must change this to 'Approved'
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Insurer Reg Error:", error);
        if (error.code === 11000) {
      return NextResponse.json({ error: "An account with this Email or User ID already exists." }, { status: 400 });
    }

    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}