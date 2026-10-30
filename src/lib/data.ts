export type Status = "paid" | "pending" | "refunded";
export interface Order {
  id: string;
  customer: string;
  region: "EMEA" | "APAC" | "AMER";
  amount: number;
  status: Status;
  date: string; // ISO yyyy-mm-dd
}

const names = ["Ayesha", "Omar", "Lena", "Hiro", "Maya", "Noah", "Sara", "Ivan", "Zoya", "Liam", "Nadia", "Ravi"];
const regions: Order["region"][] = ["EMEA", "APAC", "AMER"];
const statuses: Status[] = ["paid", "paid", "paid", "paid", "paid", "paid", "paid", "pending", "pending", "refunded", "paid", "paid"];

/** Deterministic pseudo-random generator so the demo data is stable across reloads and tests. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateOrders(count = 120): Order[] {
  const rnd = mulberry32(42);
  const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(2026, 9, 30) - Math.floor(rnd() * 90) * 86400000);
    return {
      id: `ORD-${1000 + i}`,
      customer: `${pick(names)} ${String.fromCharCode(65 + Math.floor(rnd() * 26))}.`,
      region: pick(regions),
      amount: Math.round((20 + rnd() * 480) * 100) / 100,
      status: pick(statuses),
      date: d.toISOString().slice(0, 10),
    };
  });
}
