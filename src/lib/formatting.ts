const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value).replace(/^Rp\s*/u, "Rp ");
}

export function formatSessionDate(date: string | Date | undefined | null, time?: string): string {
  if (!date) return time ? `Unknown · ${time}` : "Unknown";

  let dateValue: Date;
  if (date instanceof Date) {
    dateValue = date;
  } else if (typeof date === "string") {
    dateValue = date.includes("T") ? new Date(date) : new Date(`${date}T00:00:00`);
  } else {
    dateValue = new Date(String(date));
  }

  if (Number.isNaN(dateValue.getTime())) {
    const parsed = Date.parse(String(date));
    if (Number.isNaN(parsed)) return time ? `Unknown · ${time}` : "Unknown";
    dateValue = new Date(parsed);
  }

  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateValue);

  return time ? `${dateLabel} · ${time}` : dateLabel;
}

export function formatInsightDate(date: string | Date | undefined | null): string {
  if (!date) return "Unknown";

  let dateValue: Date;
  if (date instanceof Date) {
    dateValue = date;
  } else if (typeof date === "string") {
    dateValue = date.includes("T") ? new Date(date) : new Date(`${date}T00:00:00`);
  } else {
    dateValue = new Date(String(date));
  }

  if (Number.isNaN(dateValue.getTime())) {
    const parsed = Date.parse(String(date));
    if (Number.isNaN(parsed)) return "Unknown";
    dateValue = new Date(parsed);
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateValue);
}

export function formatDeploymentDate(dateTimeIso?: string | null): string {
  if (!dateTimeIso) return "Unknown";
  const d = new Date(dateTimeIso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}
