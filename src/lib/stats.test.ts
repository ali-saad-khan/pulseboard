import { describe, expect, it } from "vitest";
import { generateOrders } from "./data";
import { filterOrders, revenueByWeek, sortOrders, summarize } from "./stats";

const orders = generateOrders();
const all = { query: "", status: "all", region: "all" } as const;

describe("stats", () => {
  it("generates stable demo data", () => {
    expect(orders).toHaveLength(120);
    expect(generateOrders()[0]).toEqual(orders[0]);
  });
  it("filters by status and region", () => {
    const r = filterOrders(orders, { ...all, status: "refunded", region: "APAC" });
    expect(r.every((o) => o.status === "refunded" && o.region === "APAC")).toBe(true);
  });
  it("searches customer and id case-insensitively", () => {
    expect(filterOrders(orders, { ...all, query: "ord-1000" }).map((o) => o.id)).toEqual(["ORD-1000"]);
  });
  it("sorts by amount without mutating input", () => {
    const copy = [...orders];
    const s = sortOrders(orders, "amount", "asc");
    expect(s[0].amount).toBeLessThanOrEqual(s[1].amount);
    expect(orders).toEqual(copy);
  });
  it("counts revenue from paid orders only", () => {
    const paid = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0);
    expect(summarize(orders).revenue).toBeCloseTo(paid);
    expect(revenueByWeek(orders).reduce((s, w) => s + w.value, 0)).toBeCloseTo(paid);
  });
  it("handles empty input", () => {
    expect(summarize([])).toEqual({ revenue: 0, orders: 0, avgOrder: 0, refundRate: 0 });
  });
});
