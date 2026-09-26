export function getQueryParam(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}
