import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { NodeHtmlMarkdown } from "node-html-markdown";

import { routing } from "./i18n/routing";

// https://next-intl.dev/docs/routing/setup
const i18nProxy = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  if (request.headers.get("Accept") === "text/markdown") {
    const internalRequest = new Request(request);
    internalRequest.headers.set("Accept", "text/html");
    const internalResponse = await fetch(internalRequest);
    const html = await internalResponse.text();
    const markdown = NodeHtmlMarkdown.translate(html);

    return new NextResponse(markdown, {
      headers: { "Content-Type": "text/markdown" },
    });
  }

  return i18nProxy(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
