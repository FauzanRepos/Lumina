import { describe, expect, it } from "vitest";

import { getQueryParam } from "../../lib/query";

describe("getQueryParam", () => {
  it("returns a string query param as-is", () => {
    expect(getQueryParam("burnout")).toBe("burnout");
  });

  it("normalizes array and undefined values to an empty string", () => {
    expect(getQueryParam(["burnout", "career"]) ).toBe("");
    expect(getQueryParam(undefined)).toBe("");
  });
});