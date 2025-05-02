import { supabase } from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Check if user already exists in the database.
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("userId", userId)
      .single();

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exist",
        },
        { status: 400 }
      );
    } else if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found" — not an error
      console.error(
        "API/AUTH/SIGNUP: Error checking existing user:",
        fetchError.message
      );
      return Response.json(
        {
          success: false,
          message: "Failed to check existing user",
        },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          userId,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(
        "API/AUTH/SIGNUP: Error inserting new user:",
        insertError.message
      );
      return Response.json(
        {
          success: false,
          message: "Failed to create user",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API/AUTH/SIGNUP: Error during user registration:", error);
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
