import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const password = process.env.BASIC_AUTH_PASSWORD
  if (!password) {
    return NextResponse.next()
  }



  const authHeader = request.headers.get("authorization")
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ")
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded)
      const [, providedPassword] = decoded.split(":")
      if (providedPassword === password) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  })
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
}
