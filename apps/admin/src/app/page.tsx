const tiles = [
  { label: "Products", value: "128", description: "Manage catalog and listings" },
  { label: "Orders", value: "42", description: "Track fulfillment and payments" },
  { label: "Inventory", value: "96%", description: "Monitor stock health" },
  { label: "Customers", value: "1.2k", description: "Review customer activity" },
];

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
            JERTINA ADMIN
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Operations Dashboard</h1>
          <p className="max-w-2xl text-slate-300">
            Internal command center for the commerce platform. Built for speed, clarity,
            and accountable operations.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map((tile) => (
            <article
              key={tile.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/10"
            >
              <p className="text-sm font-medium text-slate-300">{tile.label}</p>
              <p className="mt-4 text-4xl font-bold text-white">{tile.value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{tile.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Operational priorities</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Review pending product approvals</li>
              <li>• Monitor order exceptions and cancellations</li>
              <li>• Confirm inventory thresholds for fast-moving items</li>
              <li>• Track support backlog and service issues</li>
            </ul>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Current status</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Portal mode: scaffold</p>
              <p>Access control: planned</p>
              <p>Audit logging: planned</p>
              <p>Analytics integration: planned</p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
