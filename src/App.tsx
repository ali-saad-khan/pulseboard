import { useEffect, useMemo, useState } from "react";
import { BarChart } from "./components/BarChart";
import { OrdersTable } from "./components/OrdersTable";
import { StatCard } from "./components/StatCard";
import { generateOrders } from "./lib/data";
import { filterOrders, money, revenueByWeek, sortOrders, summarize, type Filters, type SortKey } from "./lib/stats";

const ALL = generateOrders();
const PAGE = 10;

export default function App() {
  const [filters, setFilters] = useState<Filters>({ query: "", status: "all", region: "all" });
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const filtered = useMemo(() => filterOrders(ALL, filters), [filters]);
  const sorted = useMemo(() => sortOrders(filtered, sortKey, dir), [filtered, sortKey, dir]);
  const stats = useMemo(() => summarize(filtered), [filtered]);
  const weekly = useMemo(() => revenueByWeek(filtered), [filtered]);
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const current = Math.min(page, pages - 1);

  const update = (patch: Partial<Filters>) => { setFilters((f) => ({ ...f, ...patch })); setPage(0); };
  const onSort = (k: SortKey) => {
    if (k === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setDir("desc"); }
  };
  const field = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pulseboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sales analytics demo · React, TypeScript, Tailwind</p>
        </div>
        <button type="button" onClick={() => setDark((d) => !d)} aria-pressed={dark} className={field}>
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <form className="flex flex-wrap gap-3" role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="sr-only" htmlFor="q">Search orders</label>
        <input id="q" type="search" placeholder="Search customer or order ID" value={filters.query}
          onChange={(e) => update({ query: e.target.value })} className={`${field} min-w-60 flex-1`} />
        <label className="sr-only" htmlFor="status">Status</label>
        <select id="status" value={filters.status} onChange={(e) => update({ status: e.target.value as Filters["status"] })} className={field}>
          <option value="all">All statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="refunded">Refunded</option>
        </select>
        <label className="sr-only" htmlFor="region">Region</label>
        <select id="region" value={filters.region} onChange={(e) => update({ region: e.target.value as Filters["region"] })} className={field}>
          <option value="all">All regions</option><option value="EMEA">EMEA</option><option value="APAC">APAC</option><option value="AMER">AMER</option>
        </select>
      </form>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
        <StatCard label="Revenue (paid)" value={money(stats.revenue)} />
        <StatCard label="Orders" value={String(stats.orders)} />
        <StatCard label="Avg. paid order" value={money(stats.avgOrder)} />
        <StatCard label="Refund rate" value={`${(stats.refundRate * 100).toFixed(1)}%`} />
      </dl>

      <section aria-labelledby="chart-h" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 id="chart-h" className="mb-3 font-semibold">Weekly revenue</h2>
        <BarChart data={weekly} format={money} />
      </section>

      <OrdersTable orders={sorted.slice(current * PAGE, current * PAGE + PAGE)} sortKey={sortKey} dir={dir} onSort={onSort} />

      <nav aria-label="Pagination" className="flex items-center justify-between text-sm">
        <span aria-live="polite">{sorted.length} orders · page {current + 1} of {pages}</span>
        <div className="flex gap-2">
          <button type="button" className={field} disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</button>
          <button type="button" className={field} disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Next</button>
        </div>
      </nav>
    </div>
  );
}
