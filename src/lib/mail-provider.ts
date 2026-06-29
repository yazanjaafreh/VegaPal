/** Best-effort webmail URL for common providers; null when unknown. */
export function getEmailProviderUrl(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return "https://mail.google.com";
  }
  if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com" ||
    domain.endsWith(".outlook.com") ||
    domain.endsWith(".hotmail.com") ||
    domain.endsWith(".live.com")
  ) {
    return "https://outlook.live.com";
  }
  if (domain === "yahoo.com" || domain.endsWith(".yahoo.com")) {
    return "https://mail.yahoo.com";
  }
  if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return "https://www.icloud.com/mail";
  }
  if (domain === "proton.me" || domain === "protonmail.com" || domain.endsWith(".proton.me")) {
    return "https://mail.proton.me";
  }

  return null;
}
