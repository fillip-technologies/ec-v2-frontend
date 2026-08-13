import { BACKEND_URL } from "@/config/api";
import studentData from "@/config/studentData.json";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch Student Overview progress metrics, recent AI evaluation review, and capstone project tracks
 */
export async function getStudentOverview() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/overview`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`GET /student/overview returned status ${res.status}. Falling back to studentData.json.`);
      return studentData;
    }

    return await res.json();
  } catch (error) {
    console.warn("API getStudentOverview error. Using studentData.json fallback:", error);
    return studentData;
  }
}

/**
 * Fetch Student Profile info
 */
export async function getStudentProfile() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/profile`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return studentData.profile;
    }

    return await res.json();
  } catch (error) {
    return studentData.profile;
  }
}

export async function getStudentWorkspace() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/workspace`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data?.selectedProjects && Array.isArray(data.selectedProjects)) {
      return data.selectedProjects.map((ep: any) => ({
        id: ep.project.id,
        title: ep.project.title,
        description: ep.project.description,
        orderIndex: ep.orderIndex,
        workspaceTemplate: {
          id: ep.workspace?.workspaceTemplateId || ep.project.id,
          version: ep.workspace?.templateVersion || 1,
          steps: (ep.workspace?.steps || []).map((st: any) => ({
            id: st.id,
            title: st.title,
            description: st.description,
            orderIndex: st.orderIndex,
            status: st.progress?.status || "LOCKED",
            tasks: st.tasks || [],
          })),
        },
      }));
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Fetch all enrolled programs for logged in student
 */
export async function getStudentPrograms() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/programs`, {
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
    return [];
  }
}

/**
 * Fetch Student Submissions
 */
export async function getStudentSubmissions() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/submissions`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return studentData.submissions;
    }

    return await res.json();
  } catch (error) {
    return studentData.submissions;
  }
}

/**
 * Submit Task Deliverable for a Workspace Step
 */
export async function submitStudentTask(workspaceStepId: number, payloadUrl: string) {
  const res = await fetch(`${BACKEND_URL}/student/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ workspaceStepId, payloadUrl }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to submit task deliverable");
  }

  return await res.json();
}

/**
 * Fetch Student Rubrics
 */
export async function getStudentRubrics() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/rubrics`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return studentData.rubrics;
    }

    return await res.json();
  } catch (error) {
    return studentData.rubrics;
  }
}

/**
 * Fetch Student Certificates
 */
export async function getStudentCertificates() {
  try {
    const res = await fetch(`${BACKEND_URL}/student/certificates`, {
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
    return [];
  }
}
