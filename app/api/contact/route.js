import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Input Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Log the contact submission (can be expanded to send email or save to DB)
    console.log("New Contact Form Submission:", {
      name,
      email,
      phone: phone || "N/A",
      message,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received successfully."
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling contact submission:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
