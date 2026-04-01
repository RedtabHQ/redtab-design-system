/**
 * Parses a hex color string into its RGB components.
 * Accepts 3-digit and 6-digit hex strings, with or without a leading `#`.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.replace(/^#/, '');

  let full: string;
  if (sanitized.length === 3) {
    full = sanitized
      .split('')
      .map((c) => c + c)
      .join('');
  } else if (sanitized.length === 6) {
    full = sanitized;
  } else {
    return null;
  }

  const int = parseInt(full, 16);
  if (isNaN(int)) return null;

  return {
    r: (int >> 16) & 0xff,
    g: (int >> 8) & 0xff,
    b: int & 0xff,
  };
}

/**
 * Converts individual RGB channel values into a hex color string (e.g. `#1a2b3c`).
 * Each channel is clamped to the 0–255 range.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Lightens a hex color by mixing it toward white.
 * `amount` is a value between 0 (no change) and 1 (pure white).
 */
export function lighten(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = Math.max(0, Math.min(1, amount));
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor,
  );
}

/**
 * Darkens a hex color by mixing it toward black.
 * `amount` is a value between 0 (no change) and 1 (pure black).
 */
export function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const factor = Math.max(0, Math.min(1, amount));
  return rgbToHex(
    rgb.r * (1 - factor),
    rgb.g * (1 - factor),
    rgb.b * (1 - factor),
  );
}

/**
 * Returns an `rgba()` CSS string for the given hex color at the specified opacity.
 * `opacity` is a value between 0 (fully transparent) and 1 (fully opaque).
 */
export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const clamped = Math.max(0, Math.min(1, opacity));
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamped})`;
}
