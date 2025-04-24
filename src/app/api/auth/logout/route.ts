import "server-only";
import { deleteSession } from "@/lib/session";

export async function GET() {
  try {
    await deleteSession();
    return Response.json(
      { success: true, message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 } // 500 for server error
    );
  }
}
