/**
 * Centralized Currency & Formatting Helper Utilities
 */

/**
 * Convert 2-letter ISO country code (e.g. "IN", "US", "GB", "AE") into Flag Emoji dynamically
 */
export function getFlagEmoji(isoCode: string): string {
  if (!isoCode || isoCode.length !== 2) return "🌐";
  try {
    const codePoints = isoCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

/**
 * Dynamically extract currency symbol for any 3-letter ISO 4217 code (INR, USD, GBP, EUR, AED, etc.)
 */
export function getCurrencySymbol(currencyCode = "INR"): string {
  try {
    return (0)
      .toLocaleString("en", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, "")
      .trim();
  } catch {
    const symbolMap: Record<string, string> = {
      INR: "₹",
      USD: "$",
      GBP: "£",
      EUR: "€",
      AED: "AED ",
    };
    return symbolMap[currencyCode.toUpperCase()] || currencyCode.toUpperCase() + " ";
  }
}

/**
 * Dynamically format numerical price into formatted string with symbol (e.g. ₹2,999, $49)
 */
export function formatPrice(amount?: number | null, currencyCode = "INR"): string {
  if (amount == null || isNaN(amount)) {
    return `${getCurrencySymbol(currencyCode)}0`;
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${getCurrencySymbol(currencyCode)}${amount.toLocaleString()}`;
  }
}

/**
 * Detect visitor location and currency dynamically via IP Geolocation API
 */
export async function detectUserCurrency(): Promise<{
  countryCode: string;
  currency: string;
  countryName: string;
}> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (!res.ok) throw new Error("IP geolocation API failed");

    const data = await res.json();
    return {
      countryCode: data.country_code || "IN",
      currency: data.currency || "INR",
      countryName: data.country_name || "India",
    };
  } catch (error) {
    console.warn("Currency detection fallback to INR (India):", error);
    return {
      countryCode: "IN",
      currency: "INR",
      countryName: "India",
    };
  }
}
