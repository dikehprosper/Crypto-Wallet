// @ts-ignore
import User from "@/models/userModel";
// @ts-ignore
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log(email);

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user with such email" },
        { status: 400 }
      );
    }

   

    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
      fullname: user.fullname
    });

    return NextResponse.json({
      message: "Password reset mail sent successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
