const featuredCategories = [
  "Electronics",
  "Home & Living",
  "Beauty",
  "Fashion",
  "Business Tools",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
          JERTINA STORE
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Built for modern commerce, powered by intelligent systems.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Discover a storefront designed to scale with JERTINA’s product catalog,
          customer experiences, and future AI-driven commerce operations.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {featuredCategories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <a
            href="#featured"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white"
          >
            Explore products
          </a>
          <a
            href="#about"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900"
          >
            Learn more
          </a>
        </div>
      </section>
    </main>
  );
}
