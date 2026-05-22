import { describe, expect, it } from "vitest";

import { formatInsightDate, formatRupiah, formatSessionDate } from "../../lib/formatting";

describe("formatting utilities", () => {
  it("formats rupiah values with Indonesian separators", () => {
    expect(formatRupiah(250000)).toBe("Rp 250.000");
  });

  it("formats session dates with time when provided", () => {
    expect(formatSessionDate("2026-05-20", "13:30")).toBe("Rabu, 20 Mei 2026 · 13:30");
  });

  it("formats insight dates without a time", () => {
    expect(formatInsightDate("2026-05-20")).toBe("20 Mei 2026");
  });
});