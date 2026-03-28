const API_BASE = "http://localhost:5000/api";

export async function apiGet(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPost(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function apiPatch(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Multimodal ingest helpers
export async function ingestFile(file: File) {
  const base64 = await fileToBase64(file);
  const mimeType = file.type;

  if (mimeType.startsWith("audio/")) {
    return apiPost("/ingest/audio", { audioBase64: base64, mimeType });
  } else if (mimeType.startsWith("image/")) {
    return apiPost("/ingest/image", { imageBase64: base64, mimeType });
  } else if (mimeType === "application/pdf") {
    return apiPost("/ingest/document", { documentBase64: base64, mimeType });
  } else {
    return apiPost("/ingest/document", { documentBase64: base64, mimeType });
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Convenience fetchers for each view
export const getMessages = (params?: string) => apiGet(`/messages${params ? `?${params}` : ""}`);
export const getCases = (params?: string) => apiGet(`/cases${params ? `?${params}` : ""}`);
export const getStaff = () => apiGet("/staff");
export const getCaseStats = () => apiGet("/cases/stats");
export const getDashboard = (role: string) => apiGet(`/dashboard/${role}`);
export const getTrends = () => apiGet("/trends/latest");
export const getSatisfactionStats = () => apiGet("/orchestrate/satisfaction/stats");
export const processCase = (messageId: string) => apiPost("/orchestrate/process-case", { messageId });