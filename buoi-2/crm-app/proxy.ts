import { NextResponse, type NextRequest } from "next/server";

// Bảo vệ bản demo khi deploy. Local dev không hỏi mật khẩu.
// Đặt APP_PASSWORD trên Vercel; trình duyệt sẽ hỏi mật khẩu (Basic Auth).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Các đường dẫn tự bảo vệ hoặc cần công khai.
  if (
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/health") ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  const password = process.env.APP_PASSWORD;
  if (!password || process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const pass = decoded.split(":").slice(1).join(":");
      if (pass === password) return NextResponse.next();
    } catch {
      // rơi xuống 401
    }
  }

  return new NextResponse("Cần mật khẩu để xem bản demo.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="CRM Coc Coc demo", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
