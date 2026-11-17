const E164_OTHER = /^\+(?!211)[1-9]\d{7,14}$/;
const E164_SS = /^\+211[19]\d{8}$/;

/** Normalises a typed phone number to E.164, treating local numbers as South Sudan (+211). */
export function normalisePhone(raw: string): string | null {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("00")) digits = "+" + digits.slice(2);
  if (digits.startsWith("+2110") && digits.length === 14) {
    digits = "+211" + digits.slice(5);
  } else if (!digits.startsWith("+")) {
    if (/^0[19]\d{8}$/.test(digits)) digits = "+211" + digits.slice(1);
    else if (/^[19]\d{8}$/.test(digits)) digits = "+211" + digits;
    else if (/^2110[19]\d{8}$/.test(digits)) digits = "+211" + digits.slice(4);
    else if (/^211[19]\d{8}$/.test(digits)) digits = "+" + digits;
    else return null;
  }
  return E164_SS.test(digits) || E164_OTHER.test(digits) ? digits : null;
}
