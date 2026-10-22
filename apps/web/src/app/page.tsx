const categories = [
  "Cleaning Tools",
  "Kitchen Gadgets",
  "Home Organization",
  "Storage Solutions",
  "Laundry Products",
  "Travel Organizers",
  "Car Accessories",
  "Office Organization",
];

const featuredProducts = [
  {
    name: "Under-Sink Organizer",
    description:
      "A practical storage concept for making better use of limited cabinet space.",
    status: "Concept preview",
  },
  {
    name: "Kitchen Drawer Divider",
    description:
      "An organization concept designed to make everyday kitchen tools easier to find.",
    status: "Concept preview",
  },
  {
    name: "Foldable Laundry Basket",
    description:
      "A space-saving laundry solution for homes where storage space matters.",
    status: "Concept preview",
  },
  {
    name: "Travel Compression Cubes",
    description:
      "A packing concept intended to help organize clothing and travel essentials.",
    status: "Concept preview",
  },
  {
    name: "Car Seat Gap Organizer",
    description:
      "A compact organization concept for keeping frequently used car essentials together.",
    status: "Concept preview",
  },
  {
    name: "Desk Cable Organizer",
    description:
      "A workspace organization concept designed to help reduce visible cable clutter.",
    status: "Concept preview",
  },
];

const benefits = [
  {
    title: "Practical first",
    text: "Products chosen to solve daily problems in a simple, useful way.",
  },
  {
    title: "Easy to scale",
    text: "A storefront structure built to grow with new collections and categories.",
  },
  {
    title: "Designed around life",
    text: "A clean shopping experience that supports the JERTINA brand direction.",
  },
];

const stats = [
  { value: "120+", label: "Curated products" },
  { value: "5", label: "Core collections" },
  { value: "1", label: "Clear brand vision" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f2eb] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(15,23,42,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(15,23,42,0.08),_transparent_30%)]" />
        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="inline-flex items-center rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-slate-500 backdrop-blur">
              JERTINA STORE
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Built for modern commerce,
              <span className="block text-slate-500">powered by intelligent systems.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Discover a storefront designed to scale with JERTINA&apos;s product catalog,
              customer experiences, and future AI-driven commerce operations.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                >
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <a
                href="#featured"
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
              >
                Explore products
              </a>
              <a
                href="#about"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:-translate-y-0.5"
              >
                Learn more
              </a>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-slate-900/10 blur-2xl" />
            <div className="absolute -right-8 bottom-10 h-28 w-28 rounded-full bg-amber-300/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Featured collection</p>
                  <h2 className="mt-3 text-3xl font-semibold">Everyday essentials</h2>
                </div>
                <div className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-200">
                  New season
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white/8 p-5 backdrop-blur">
                  <p className="text-sm text-slate-300">Best seller</p>
                  <p className="mt-2 text-lg font-medium">Smart Desk Organizer</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    A practical workspace upgrade with a clean, modular design.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/8 p-5 backdrop-blur">
                    <p className="text-sm text-slate-300">Problem solved</p>
                    <p className="mt-2 text-lg font-medium">Less clutter</p>
                  </div>
                  <div className="rounded-3xl bg-white/8 p-5 backdrop-blur">
                    <p className="text-sm text-slate-300">Built for</p>
                    <p className="mt-2 text-lg font-medium">Daily use</p>
                  </div>
                </div>

                <div className="rounded-3xl bg-gradient-to-r from-white/10 to-white/5 p-5 backdrop-blur">
                  <p className="text-sm text-slate-300">Brand direction</p>
                  <p className="mt-2 text-lg font-medium">Designed around your life.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
                Featured products
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                Everyday solutions with clean, practical design.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              These are placeholder products for the storefront layout, but the structure is ready
              for real product listings, collections, and catalog growth.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="group rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-52 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 text-sm font-medium text-slate-500">
                  Product image
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-base font-semibold">{product.status}</p>
                  <span className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white">
                    Concept preview
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[#f5f2eb]">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">
              About JERTINA
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              A retail brand built for clarity, usefulness, and growth.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-300">
            JERTINA brings together useful products, clear presentation, and a system designed
            to support future catalog expansion, customer experience, and AI operations.
          </p>
        </div>
      </section>
    </main>
  );
}
