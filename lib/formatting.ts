const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(value: number): string {
  return rupiahFormatter.format(value).replace(/^Rp\s*/u, "Rp ");
}

export function formatSessionDate(date: string, time?: string): string {
  const dateValue = new Date(`${date}T00:00:00`);
  const dateLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateValue);

  return time ? `${dateLabel} · ${time}` : dateLabel;
}

export function formatInsightDate(date: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}