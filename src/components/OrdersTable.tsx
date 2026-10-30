import type { Order } from "../lib/data";
import type { SortKey } from "../lib/stats";
import { money } from "../lib/stats";

interface Props {
  orders: Order[];
  sortKey: SortKey;
  dir: "asc" | "desc";
  onSort: (k: SortKey) => void;
}

const badge: Record<Order["status"], string> = {
  paid: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  refunded: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
};

export function OrdersTable({ orders, sortKey, dir, onSort }: Props) {
  const th = (k: SortKey, label: string) => (
    <th scope="col" aria-sort={sortKey === k ? (dir === "asc" ? "ascending" : "descending") : "none"} className="px-4 py-3 text-left">
      <button type="button" onClick={() => onSort(k)} className="font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-indigo-500">
        {label} {sortKey === k ? (dir === "asc" ? "▲" : "▼") : ""}
      </button>
    </th>
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">Orders</caption>
        <thead className="bg-slate-100 dark:bg-slate-900">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Order</th>
            {th("customer", "Customer")}
            <th scope="col" className="px-4 py-3 text-left font-semibold">Region</th>
            {th("date", "Date")}
            {th("amount", "Amount")}
            <th scope="col" className="px-4 py-3 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
          {orders.length === 0 && (
            <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No orders match these filters.</td></tr>
          )}
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="px-4 py-3 font-mono">{o.id}</td>
              <td className="px-4 py-3">{o.customer}</td>
              <td className="px-4 py-3">{o.region}</td>
              <td className="px-4 py-3 tabular-nums">{o.date}</td>
              <td className="px-4 py-3 tabular-nums">{money(o.amount)}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[o.status]}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
