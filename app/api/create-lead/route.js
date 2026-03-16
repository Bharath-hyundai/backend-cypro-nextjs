import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendToCypro } from "@/lib/cypro";

import { connectDB } from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";

const recentLeads = new Map();

export async function POST(req) {

  await connectDB();

  const body = await req.json();

  const {
    firstName,
    lastName,
    mobileNumber,
    makeName,
    makeId,
    modelId,
    modelName,
    emailId,
    city,
    pincode,
  } = body;

  try {

    const requestId = uuidv4();

    console.log("Incoming Lead:", {
      requestId,
      firstName,
      mobileNumber,
      modelName,
    });

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number" },
        { status: 400 }
      );
    }

    const duplicateKey = `${mobileNumber}-${modelId}`;

    if (recentLeads.has(duplicateKey)) {
      return NextResponse.json({
        success: false,
        message: "Duplicate lead ignored",
      });
    }

    recentLeads.set(duplicateKey, Date.now());

    const payload = {
      firstName,
      lastName: lastName || "",
      mobileNumber,
      makeName,
      makeId,
      modelId,
      modelName,
      emailId: emailId || "",
      city: city || "",
      pincode: pincode || "",
    };

    const response = await sendToCypro(payload);

    await Lead.create({
      name: firstName,
      mobile: mobileNumber,
      email: emailId,
      model: modelName,
      city,
      makeId,
      modelId,
      status: "SUCCESS",
      retryCount: 0,
      error: "",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Lead sent",
      data: response.data,
    });

  } catch (error) {

    console.error("Cypro Error:", error);

    await Lead.create({
      name: firstName,
      mobile: mobileNumber,
      email: emailId || "",
      model: modelName,
      city,
      makeId,
      modelId,
      status: "FAILED",
      retryCount: 0,
      error: error.message,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });

  }
}