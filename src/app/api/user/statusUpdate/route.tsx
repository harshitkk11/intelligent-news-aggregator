import { supabase } from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("userId", userId)
      .single();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    } else if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 means "no rows found" — not an error
      console.error(
        "API/USER/STUTUS_UPDATE: Error fetching existing user:",
        fetchError.message
      );
      return Response.json(
        {
          success: false,
          message: "Failed to fetch user",
        },
        { status: 500 }
      );
    }

    if (user.isNew) {
      const { error: insertError } = await supabase
        .from("users")
        .update([
          {
            isNew: false,
          },
        ])
        .eq("userId", userId)
        .single();

      if (insertError) {
        console.error(
          "API/USER/STUTUS_UPDATE: Error updating user status:",
          insertError.message
        );
        return Response.json(
          {
            success: false,
            message: "Failed to update user status",
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: "Status updated.",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User is not new.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API/USER/STUTUS_UPDATE: Error during updating status:",
      error
    );
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
