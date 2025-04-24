import { supabase } from "@/lib/dbConnect";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed token:", hashedToken);

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("passwordResetToken, passwordResetExpires")
      .eq("passwordResetToken", hashedToken)
      .gte("passwordResetExpires", new Date().toISOString())
      .single();
    console.log("User data:", user, "Fetch error:", fetchError);

    if (!user || fetchError) {
      return Response.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Token is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating token:", error);
    return Response.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
