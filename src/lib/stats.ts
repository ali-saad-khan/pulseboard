import type { Order } from "./data";

export type SortKey = "date" | "amount" | "customer";
export interface Filters { query: string; status: "all" | Order["status"]; region: "all" | Order["region"] }

export function filterOrders(orders: Order[], f: Filters): Order[] {
  const q = f.query.trim().toLowerCase();
  return orders.filter(
    (o) =>
      (f.status === "all" || o.status === f.status) &&
      (f.region === "all" || o.region === f.region) &&
      (!q || o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)),
  );
}

export function sortOrders(orders: Order[], key: SortKey, dir: "asc" | "desc"): Order[] {
  const m = dir === "asc" ? 1 : -1;
  return [...orders].sort((a, b) => {
    const x = a[key], y = b[key];
    return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * m;
  });
}

/** Revenue counts paid orders only; refunds and pending payments are excluded. */
export function summarize(orders: Order[]) {
  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((s, o) => s + o.amount, 0);
  return {
    revenue,
    orders: orders.length,
    avgOrder: paid.length ? revenue / paid.length : 0,
    refundRate: orders.length ? orders.filter((o) => o.status === "refunded").length / orders.length : 0,
  };
}

export function revenueByWeek(orders: Order[]): { label: string; value: number }[] {
  const buckets = new Map<string, number>();
  for (const o of orders) {
    if (o.status !== "paid") continue;
    const d = new Date(o.date + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); // Monday of that week
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + o.amount);
  }
  return [...buckets].sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value }));
}

export const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
