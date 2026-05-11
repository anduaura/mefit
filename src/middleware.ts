import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "mefit_uid";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(req: NextRequest) {
  const existing = req.cookies.get(COOKIE_NAME)?.value;
  if (existing) return NextResponse.next();

  const id = crypto.randomUUID();
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_NAME,
    value: id,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
