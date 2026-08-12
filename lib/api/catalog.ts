import { BACKEND_URL } from "@/config/api";
import { Cluster, Country, Program, Technology, Topic } from "@/types/catalog";

const DEFAULT_COUNTRIES: Country[] = [
  { id: 1, isoCode: "IN", name: "India", defaultLocal: "en-IN", timezone: "Asia/Kolkata", currencyCode: "INR", isActive: true },
  { id: 2, isoCode: "US", name: "United States", defaultLocal: "en-US", timezone: "America/New_York", currencyCode: "USD", isActive: true },
  { id: 3, isoCode: "GB", name: "United Kingdom", defaultLocal: "en-GB", timezone: "Europe/London", currencyCode: "GBP", isActive: true },
  { id: 4, isoCode: "AE", name: "UAE", defaultLocal: "ar-AE", timezone: "Asia/Dubai", currencyCode: "AED", isActive: true },
];

/**
 * Fetch all active countries from backend system countries module (GET /countries)
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/countries`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /countries returned status ${res.status}. Using default countries list.`);
      return DEFAULT_COUNTRIES;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_COUNTRIES;
  } catch (error) {
    console.warn("API getCountries network error. Using default countries list:", error);
    return DEFAULT_COUNTRIES;
  }
}

/**
 * Fetch all programs from backend with optional filters
 */
export async function getPrograms(params?: {
  countryId?: number;
  topicId?: number;
  technologyId?: number;
  status?: string;
}): Promise<Program[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.countryId) searchParams.append("countryId", String(params.countryId));
    if (params?.topicId) searchParams.append("topicId", String(params.topicId));
    if (params?.technologyId) searchParams.append("technologyId", String(params.technologyId));
    if (params?.status) searchParams.append("status", params.status);

    const res = await fetch(`${BACKEND_URL}/catalog/programs?${searchParams.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /catalog/programs returned status ${res.status}.`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.warn("API getPrograms error:", error);
    return [];
  }
}

/**
 * Fetch single program by ID or Slug
 */
export async function getProgramByIdOrSlug(idOrSlug: string): Promise<Program | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/catalog/programs/${idOrSlug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.warn("API getProgramByIdOrSlug error:", error);
    return null;
  }
}

/**
 * Fetch all clusters with topics
 */
export async function getClusters(): Promise<Cluster[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/catalog/clusters`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /catalog/clusters returned status ${res.status}.`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.warn("API getClusters error:", error);
    return [];
  }
}

/**
 * Fetch all topics
 */
export async function getTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/catalog/topics`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /catalog/topics returned status ${res.status}.`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.warn("API getTopics error:", error);
    return [];
  }
}

/**
 * Fetch all technologies
 */
export async function getTechnologies(): Promise<Technology[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/catalog/technologies`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /catalog/technologies returned status ${res.status}.`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.warn("API getTechnologies error:", error);
    return [];
  }
}
