import { NextResponse, type NextRequest } from "next/server";

/** Only `/` runs this: send Khmer-preferring browsers to /km, everyone else to /en. */
export function proxy(request: NextRequest) {
  // Browsers list languages in preference order; take the first one we support.
  const lang =
    (request.headers.get("accept-language") ?? "")
      .split(",")
      .map((tag) => tag.trim().slice(0, 2).toLowerCase())
      .find((tag) => tag === "km" || tag === "en") ?? "en";
  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}

export const config = { matcher: "/" };
