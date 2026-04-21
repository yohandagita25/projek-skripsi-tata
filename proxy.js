import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {

  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  console.log("TOKEN:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"], // penting
    });

    const role = payload.role;

    // proteksi student
    if (pathname.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }

    // proteksi teacher
    if (pathname.startsWith("/teacher") && role !== "teacher") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    return NextResponse.next();

  } catch (err) {

    console.log("JWT ERROR:", err);

    return NextResponse.redirect(new URL("/login", request.url));

  }
}

export const config = {
  matcher: ["/student/:path*", "/teacher/:path*"]
};