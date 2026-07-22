import sanitizeHtml from "sanitize-html";

/**
 * Problem statements are authored as HTML by admins and rendered with
 * `dangerouslySetInnerHTML` on the client. Sanitize on write so a stray
 * (or malicious) <script>/onerror payload can never reach a reader.
 */
export function sanitizeRichText(html: string | undefined | null): string {
  if (!html) return "";

  // The admin rich-text editor emits <p><br></p> for every blank line, which
  // renders as a large empty gap. Collapse those before sanitizing so
  // authored content doesn't end up full of holes.
  const collapsed = html
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .trim();

  return sanitizeHtml(collapsed, {
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
