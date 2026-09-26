const WEBHOOK_BASE = "https://worker-webhook.personalcloud-9b2.workers.dev";
const WEBHOOK_API_KEY = "Tm0q18jXrP7Q7Eqt";

export interface SessionBookingPayload {
  psikolog: string;
  tanggal: string;
  waktu: string;
  sesi: string;
  nama: string;
  email: string;
  whatsapp: string;
  catatan?: string;
}

export interface SurveyPayload {
  question_01: string;
  question_02: string;
  question_03: string;
  question_04: string;
  nama: string;
  email: string;
  whatsapp: string;
  catatan?: string;
}

export interface WebhookResult {
  ok: boolean;
  status: number;
  message: string;
}

async function postWebhook(path: string, body: Record<string, unknown>): Promise<WebhookResult> {
  try {
    const response = await fetch(`${WEBHOOK_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": WEBHOOK_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json()) as { success?: boolean; message?: string };

    return {
      ok: response.ok,
      status: response.status,
      message: data.message ?? (response.ok ? "Success" : "An error occurred."),
    };
  } catch {
    return { ok: false, status: 0, message: "Network error. Please check your connection and try again." };
  }
}

export function submitSessionBooking(payload: SessionBookingPayload): Promise<WebhookResult> {
  return postWebhook("/webhook/lumina/session", payload as unknown as Record<string, unknown>);
}

export function submitSurvey(payload: SurveyPayload): Promise<WebhookResult> {
  return postWebhook("/webhook/lumina/survey", payload as unknown as Record<string, unknown>);
}
