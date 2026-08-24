/** Display labels for roles (maps legacy seller → reseller). */
export function formatRole(role) {
  if (!role) return "";
  const normalized = String(role) === "seller" ? "reseller" : String(role);
  return normalized.replace(/_/g, " ");
}
