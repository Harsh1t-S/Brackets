// Deterministic gradient-initials avatar, rendered as an inline SVG data URI.
// No uploads or external services needed — every user gets a unique image
// derived from their name.

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function avatarDataUri(name: string): string {
  const seed = name?.trim() || "?";
  const hash = hashString(seed);

  const hue = hash % 360;
  const hue2 = (hue + 45) % 360;

  const initials = seed
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},72%,46%)"/><stop offset="1" stop-color="hsl(${hue2},80%,58%)"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><text x="32" y="34" text-anchor="middle" dominant-baseline="central" font-family="Inter, ui-sans-serif, sans-serif" font-size="26" font-weight="700" fill="#fff">${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
