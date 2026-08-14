export interface UserGeoLocation {
  countryCode: string;
  currency: string;
  countryName: string;
}

/**
 * Detect visitor location and currency dynamically via IP Geolocation API
 */
export async function detectUserGeoLocation(): Promise<UserGeoLocation> {
  try {
    const res = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
    if (!res.ok) throw new Error('IP geolocation API failed');

    const data = await res.json();
    return {
      countryCode: data.country_code || 'IN',
      currency: data.currency || 'INR',
      countryName: data.country_name || 'India',
    };
  } catch (error) {
    console.warn('Currency detection fallback to INR (India):', error);
    return {
      countryCode: 'IN',
      currency: 'INR',
      countryName: 'India',
    };
  }
}
