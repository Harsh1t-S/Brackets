import sanitizeHtml from "sanitize-html";

/**
 * Problem statements are authored as HTML by admins and rendered with
 * `dangerouslySetInnerHTML` on the client. Sanitize on write so a stray
 * (or malicious) <script>/onerror payload can never reach a reader.
 */
export function sanitizeRichText(html: string | undefined | null): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s",
      "ul", "ol", "li", "code", "pre", "blockquote",
      "h1", "h2", "h3", "h4", "span", "sub", "sup", "a",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      span: ["class"],
      code: ["class"],
      pre: ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Never let an author target a window or leak the referrer.
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });
}
