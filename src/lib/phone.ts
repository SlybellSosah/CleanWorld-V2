const E164 = /^\+[1-9]\d{7,14}$/;

/** Normalises a typed phone number to E.164, treating local numbers as South Sudan (+211). */
export function normalisePhone(raw: string): string | null {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("00")) digits = "+" + digits.slice(2);
  if (!digits.startsWith("+")) {
    if (/^0\d{9}$/.test(digits)) digits = "+211" + digits.slice(1);
    else if (/^9\d{8}$/.test(digits)) digits = "+211" + digits;
    else if (/^211\d{9}$/.test(digits)) digits = "+" + digits;
    else return null;
  }
  return E164.test(digits) ? digits : null;
}
