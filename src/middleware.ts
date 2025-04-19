import { updateSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function middleware() {
  await updateSession();
  return NextResponse.next();
}
