export function openSaleSmartlyChat() {
  const ssq = typeof window !== "undefined" ? window.ssq : null;
  if (!ssq) return;
  if (typeof ssq.push === "function") {
    ssq.push("chatOpen");
    return;
  }
  if (typeof ssq === "function") {
    ssq("chatOpen");
  }
}
