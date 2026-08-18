import { BACKEND_URL } from "@/config/api";
import { apiClient as fetch } from "./client";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * GET /admin/overview
 * Fetch high-level platform telemetry metrics
 */
export async function getAdminOverview() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/overview`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminOverview error:", error);
    return null;
  }
}

/**
 * GET /admin/colleges
 * Fetch list of registered B2B college institutions
 */
export async function getAdminColleges(status?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (status) searchParams.append("status", status);

    const res = await fetch(`${BACKEND_URL}/admin/colleges?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminColleges error:", error);
    return [];
  }
}

/**
 * PATCH /admin/colleges/:id/status
 * Approve or reject a college institution
 */
export async function updateCollegeStatus(id: number, status: string) {
  const res = await fetch(`${BACKEND_URL}/admin/colleges/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update college status");
  }

  return await res.json();
}

/**
 * GET /admin/users
 * Fetch list of platform users
 */
export async function getAdminUsers(role?: string, status?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (role) searchParams.append("role", role);
    if (status) searchParams.append("status", status);

    const res = await fetch(`${BACKEND_URL}/admin/users?${searchParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminUsers error:", error);
    return [];
  }
}

/**
 * PATCH /admin/users/:id/status
 * Update user account status
 */
export async function updateUserStatus(id: number, status: string) {
  const res = await fetch(`${BACKEND_URL}/admin/users/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update user status");
  }

  return await res.json();
}

/**
 * GET /admin/submissions
 * Fetch list of student task submissions
 */
export async function getAdminSubmissions() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/submissions`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminSubmissions error:", error);
    return [];
  }
}

/**
 * PATCH /admin/submissions/:id/review
 * Approve or reject student task submission
 */
export async function reviewSubmission(id: number, status: "PASSED" | "NEEDS_WORK" | "EVALUATING", score?: number, feedback?: string) {
  const res = await fetch(`${BACKEND_URL}/admin/submissions/${id}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status, score, feedback }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to submit review");
  }

  return await res.json();
}

/**
 * GET /orders
 * Fetch all student orders and payment attempts (Admin / Super Admin)
 */
export async function getAdminOrders() {
  try {
    const res = await fetch(`${BACKEND_URL}/orders`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminOrders error:", error);
    return [];
  }
}

/**
 * GET /admin/students/:id
 * Fetch 360-degree student portfolio, academic profile, enrollment tracks,
 * workspace progression, orders & billing audit, and certificates (Admin / Super Admin)
 */
export async function getAdminStudentDetail(id: number) {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/students/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch student details (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("API getAdminStudentDetail error:", error);
    throw error;
  }
}

/**
 * GET /admin/students
 * Fetch all registered student accounts with academic & enrollment stats
 */
export async function getAdminStudents() {
  try {
    const res = await fetch(`${BACKEND_URL}/admin/students`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("API getAdminStudents error:", error);
    return [];
  }
}
