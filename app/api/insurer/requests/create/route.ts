import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import InsurerProfile from "@/models/InsurerProfile";
import { getCurrentUser } from "@/lib/session";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'insurer') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await dbConnect();

    // 1. Get Insurer Profile ID
    const profile = await InsurerProfile.findOne({ userId: user.id });
    if (!profile) return NextResponse.json({ error: "Insurer profile not found" }, { status: 404 });
    if (profile.status !== 'Approved') return NextResponse.json({ error: "Account not approved" }, { status: 403 });

    // 2. Create Request
    const newRequest = await InsuranceRequest.create({
      insurerId: profile._id,
      claimReferenceNumber: body.claimReferenceNumber,
      vehicleDetails: body.vehicleDetails,
      requestedPartsList: body.requestedPartsList,
      officialDocumentUrl: body.officialDocumentUrl,
      status: 'Submitted'
    });

    return NextResponse.json({ success: true, id: newRequest._id });

  } catch (error: any) {
    console.error("Insurer Request Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}