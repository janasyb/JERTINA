"use client";

import { useEffect, useState, type FormEvent } from "react";

type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";
type StatusFilter = "ALL" | ProductStatus;

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { products: number };
};

type ProductImage = { id?: string; url: string; altText?: string | null; sortOrder?: number };
type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  status: ProductStatus;
  price: string | number;
  currency: string;
  stockQty: number;
  categoryId?: string | null;
  category?: Category | null;
  images?: ProductImage[];
  updatedAt?: string;
};

type Overview = {
  products: { total: number; active: number; draft: number; lowStock: number };
  orders: number;
  customers: number;
};

type ProductListResponse = {
  items: Product[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type ProductForm = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  currency: string;
  stockQty: string;
  categoryId: string;
  status: ProductStatus;
  imagesText: string;
};

async function requestJson<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers, cache: "no-store", credentials: "same-origin" });
  const payload: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
      ? payload.error
      : `Request failed (${response.status}).`;
    throw new Error(message);
  }
  return payload as T;
}

function toSlug(value: string): string {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function money(value: string | number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value));
  } catch {
    return `${currency} ${Number(value).toFixed(2)}`;
  }
}

function newProductForm(): ProductForm {
  return { name: "", slug: "", sku: "", description: "", price: "", currency: "USD", stockQty: "0", categoryId: "", status: "DRAFT", imagesText: "" };
}

function productToForm(product: Product): ProductForm {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description ?? "",
    price: String(product.price),
    currency: product.currency,
    stockQty: String(product.stockQty),
    categoryId: product.categoryId ?? "",
    status: product.status,
    imagesText: (product.images ?? []).map((image) => image.url).join("\n"),
  };
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [form, setForm] = useState<ProductForm | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryFormVisible, setCategoryFormVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadOverview() {
    const data = await requestJson<Overview>("/api/admin/overview");
    setOverview(data);
  }

  async function loadCategories() {
    const data = await requestJson<{ items: Category[] }>("/api/admin/categories");
    setCategories(data.items);
  }

  async function loadProducts(page = 1, nextStatus: StatusFilter = statusFilter, nextQuery = query) {
    const search = new URLSearchParams({ page: String(page), limit: "50", status: nextStatus, q: nextQuery.trim() });
    const data = await requestJson<ProductListResponse>(`/api/admin/products?${search.toString()}`);
    setProducts(data.items);
    setPagination(data.pagination);
  }

  async function loadWorkspace() {
    setError("");
    try {
      await Promise.all([loadOverview(), loadCategories(), loadProducts(1)]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the admin workspace.");
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await requestJson<{ authenticated: boolean }>("/api/auth/session");
        if (!active) return;
        setAuthenticated(session.authenticated);
        if (session.authenticated) await loadWorkspace();
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Could not check the admin session.");
      } finally {
        if (active) setCheckingSession(false);
      }
    })();
    return () => { active = false; };
    // The initial session check intentionally runs once when the page loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginBusy(true);
    setError("");
    try {
      await requestJson<{ authenticated: boolean }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
      setPassword("");
      await loadWorkspace();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleLogout() {
    try {
      await requestJson<{ authenticated: boolean }>("/api/auth/logout", { method: "POST", body: "{}" });
    } finally {
      setAuthenticated(false);
      setOverview(null);
      setProducts([]);
      setCategories([]);
      setForm(null);
      setNotice("");
      setError("");
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try { await loadProducts(1, statusFilter, query); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not search products."); }
    finally { setBusy(false); }
  }

  function startNewProduct() {
    setError("");
    setNotice("");
    setForm(newProductForm());
  }

  function startEdit(product: Product) {
    setError("");
    setNotice("");
    setForm(productToForm(product));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    if (form.status === "ACTIVE" && (!form.id || products.find((item) => item.id === form.id)?.status !== "ACTIVE")) {
      const confirmed = window.confirm("Only activate this product after you have verified the supplier, product quality, true unit cost, selling price, delivery arrangements, and available stock. Activate it now?");
      if (!confirmed) return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    const images = form.imagesText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((url) => ({ url, altText: form.name.trim() }));
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      sku: form.sku.trim(),
      description: form.description.trim() || null,
      price: form.price,
      currency: form.currency,
      stockQty: Number(form.stockQty),
      categoryId: form.categoryId || null,
      status: form.status,
      images,
    };
    try {
      if (form.id) {
        await requestJson<{ item: Product }>(`/api/admin/products/${encodeURIComponent(form.id)}`, { method: "PATCH", body: JSON.stringify(payload) });
        setNotice("Product updated.");
      } else {
        await requestJson<{ item: Product }>("/api/admin/products", { method: "POST", body: JSON.stringify(payload) });
        setNotice("Product saved as a catalog record. Review it before activation.");
      }
      setForm(null);
      await Promise.all([loadOverview(), loadProducts(1)]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this product.");
    } finally {
      setBusy(false);
    }
  }

  async function archiveProduct(product: Product) {
    if (!window.confirm(`Archive “${product.name}”? This removes it from the active storefront but preserves historical order records.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await requestJson<{ item: Product }>(`/api/admin/products/${encodeURIComponent(product.id)}`, { method: "DELETE", body: "{}" });
      setNotice(`“${product.name}” was archived.`);
      await Promise.all([loadOverview(), loadProducts(pagination.page)]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not archive this product.");
    } finally {
      setBusy(false);
    }
  }

  async function createCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await requestJson<{ item: Category }>("/api/admin/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName.trim(), slug: toSlug(categoryName), description: categoryDescription.trim() || null }),
      });
      setCategoryName("");
      setCategoryDescription("");
      setCategoryFormVisible(false);
      setNotice("Category created.");
      await loadCategories();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create this category.");
    } finally {
      setBusy(false);
    }
  }

  async function changePage(nextPage: number) {
    setBusy(true);
    setError("");
    try { await loadProducts(nextPage); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load that page."); }
    finally { setBusy(false); }
  }

  if (checkingSession) {
    return <main className="auth-screen"><div className="auth-card"><span className="brand-mark">J</span><p className="eyebrow">JERTINA OPERATIONS</p><h1>Checking secure session</h1><p className="muted">Connecting to the local admin workspace…</p></div></main>;
  }

  if (!authenticated) {
    return (
      <main className="auth-screen">
        <form className="auth-card" onSubmit={handleLogin}>
          <span className="brand-mark">J</span>
          <p className="eyebrow">JERTINA OPERATIONS</p>
          <h1>Admin sign in</h1>
          <p className="muted">Sign in to manage catalog records. The privileged API token stays on the server and is never sent to this browser.</p>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <label className="field-label" htmlFor="admin-password">Admin password</label>
          <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={20} className="input" />
          <button className="button button-primary button-full" disabled={loginBusy}>{loginBusy ? "Signing in…" : "Sign in securely"}</button>
          <p className="fine-print">Local development access. Do not expose this portal publicly until production identity, permissions, and deployment controls are configured.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="topbar">
        <div className="brand-lockup"><span className="brand-mark brand-mark-small">J</span><div><strong>JERTINA</strong><span>OPERATIONS</span></div></div>
        <div className="topbar-right"><span className="environment-pill"><span /> Local workspace</span><button className="button button-quiet" onClick={() => void loadWorkspace()}>Refresh data</button><button className="button button-outline" onClick={() => void handleLogout()}>Sign out</button></div>
      </header>

      <div className="page-container">
        <section className="page-heading">
          <div><p className="eyebrow">CATALOG MANAGEMENT</p><h1>Products & inventory</h1><p className="muted">Manage verified merchandise, catalog drafts, categories, and stock in one place.</p></div>
          <button className="button button-primary" onClick={startNewProduct}>＋ New product</button>
        </section>

        {error && <div className="alert alert-error" role="alert"><strong>Action needs attention</strong><span>{error}</span><button className="alert-dismiss" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
        {notice && <div className="alert alert-success" role="status"><span>{notice}</span><button className="alert-dismiss" onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

        <section className="metrics-grid" aria-label="Live store metrics">
          <article className="metric-card"><span className="metric-label">Total catalog records</span><strong>{overview?.products.total ?? "—"}</strong><span className="metric-foot">Drafts and archived included</span></article>
          <article className="metric-card"><span className="metric-label">Active storefront items</span><strong>{overview?.products.active ?? "—"}</strong><span className="metric-foot">Visible to shoppers</span></article>
          <article className="metric-card"><span className="metric-label">Draft products</span><strong>{overview?.products.draft ?? "—"}</strong><span className="metric-foot">Not published</span></article>
          <article className="metric-card metric-card-warn"><span className="metric-label">Low stock · active</span><strong>{overview?.products.lowStock ?? "—"}</strong><span className="metric-foot">Five units or fewer</span></article>
        </section>

        {form && (
          <section className="panel editor-panel" aria-labelledby="product-editor-title">
            <div className="panel-heading"><div><p className="eyebrow">CATALOG RECORD</p><h2 id="product-editor-title">{form.id ? "Edit product" : "Create product draft"}</h2><p className="muted">New products default to draft and are not published automatically.</p></div><button className="button button-quiet" onClick={() => setForm(null)}>Cancel</button></div>
            <form onSubmit={saveProduct} className="product-form">
              <div className="form-grid">
                <div className="field field-span-2"><label className="field-label" htmlFor="product-name">Product name *</label><input id="product-name" className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value, slug: form.id ? form.slug : toSlug(event.target.value) })} maxLength={160} required /></div>
                <div className="field"><label className="field-label" htmlFor="product-sku">SKU *</label><input id="product-sku" className="input" value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value.toUpperCase() })} maxLength={64} pattern="[A-Za-z0-9][A-Za-z0-9._-]*" title="Use letters, numbers, dots, underscores, and hyphens." required /></div>
                <div className="field"><label className="field-label" htmlFor="product-slug">URL slug *</label><input id="product-slug" className="input" value={form.slug} onChange={(event) => setForm({ ...form, slug: toSlug(event.target.value) })} maxLength={180} required /></div>
                <div className="field field-span-2"><label className="field-label" htmlFor="product-description">Description</label><textarea id="product-description" className="input textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={5000} rows={3} /></div>
                <div className="field"><label className="field-label" htmlFor="product-price">Selling price *</label><input id="product-price" className="input" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></div>
                <div className="field"><label className="field-label" htmlFor="product-currency">Currency</label><select id="product-currency" className="input" value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value })}><option value="USD">USD — US dollar</option><option value="GHS">GHS — Ghana cedi</option><option value="GBP">GBP — Pound sterling</option><option value="EUR">EUR — Euro</option></select></div>
                <div className="field"><label className="field-label" htmlFor="product-stock">Stock quantity *</label><input id="product-stock" className="input" type="number" min="0" step="1" value={form.stockQty} onChange={(event) => setForm({ ...form, stockQty: event.target.value })} required /></div>
                <div className="field"><label className="field-label" htmlFor="product-category">Category</label><select id="product-category" className="input" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })}><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
                <div className="field"><label className="field-label" htmlFor="product-status">Catalog status</label><select id="product-status" className="input" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProductStatus })}><option value="DRAFT">Draft</option><option value="ACTIVE">Active · published</option><option value="ARCHIVED">Archived</option></select></div>
                <div className="field field-span-2"><label className="field-label" htmlFor="product-images">Image URLs (optional, one URL per line)</label><textarea id="product-images" className="input textarea" value={form.imagesText} onChange={(event) => setForm({ ...form, imagesText: event.target.value })} placeholder="https://…" rows={2} /><span className="field-help">Use stable HTTP or HTTPS image URLs. Upload management is not included in this milestone.</span></div>
              </div>
              <div className="form-footer"><p className="fine-print">Verify supplier, quality, landed cost, delivery, and stock before publishing a product as Active.</p><button className="button button-primary" disabled={busy}>{busy ? "Saving…" : form.id ? "Save changes" : "Create draft"}</button></div>
            </form>
          </section>
        )}

        <div className="content-grid">
          <section className="panel catalog-panel">
            <div className="panel-heading"><div><h2>Product catalog</h2><p className="muted">{pagination.total} record{pagination.total === 1 ? "" : "s"} · live database results</p></div><span className="live-indicator"><span /> Connected</span></div>
            <form className="catalog-filters" onSubmit={handleSearch}>
              <label className="search-wrap"><span aria-hidden="true">⌕</span><input aria-label="Search products" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or SKU" /></label>
              <select aria-label="Filter by status" className="input filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="ALL">All statuses</option><option value="DRAFT">Draft</option><option value="ACTIVE">Active</option><option value="ARCHIVED">Archived</option></select>
              <button className="button button-secondary" disabled={busy}>Search</button>
            </form>
            {products.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">◇</div><h3>No products found</h3><p>{pagination.total === 0 && !query.trim() && statusFilter === "ALL" ? "The database has no product records yet. Add a verified product or save a draft to get started." : "Try another search or status filter."}</p><button className="button button-primary" onClick={startNewProduct}>Create first product</button></div>
            ) : (
              <div className="table-scroll"><table className="product-table"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{products.map((product) => <tr key={product.id}>
                <td><div className="product-cell"><div className="product-thumb">{product.images?.[0]?.url ? <img src={product.images[0].url} alt="" loading="lazy" /> : <span>J</span>}</div><div><strong>{product.name}</strong><small>{product.slug}</small></div></div></td>
                <td className="mono-cell">{product.sku}</td><td>{product.category?.name ?? "—"}</td><td className="price-cell">{money(product.price, product.currency)}</td><td><span className={product.stockQty <= 5 ? "stock-low" : "stock-normal"}>{product.stockQty}</span></td><td><span className={`status status-${product.status.toLowerCase()}`}>{product.status}</span></td><td><div className="row-actions"><button className="text-button" onClick={() => startEdit(product)}>Edit</button>{product.status !== "ARCHIVED" && <button className="text-button text-button-danger" onClick={() => void archiveProduct(product)}>Archive</button>}</div></td>
              </tr>)}</tbody></table></div>
            )}
            <div className="pagination-bar"><span>Page {pagination.page} of {Math.max(1, pagination.totalPages)}</span><div><button className="button button-outline button-small" disabled={busy || pagination.page <= 1} onClick={() => void changePage(pagination.page - 1)}>Previous</button><button className="button button-outline button-small" disabled={busy || pagination.totalPages === 0 || pagination.page >= pagination.totalPages} onClick={() => void changePage(pagination.page + 1)}>Next</button></div></div>
          </section>

          <aside className="panel category-panel">
            <div className="panel-heading"><div><h2>Categories</h2><p className="muted">{categories.length} stored categories</p></div><button className="icon-button" onClick={() => setCategoryFormVisible(!categoryFormVisible)} aria-label={categoryFormVisible ? "Close category form" : "Add category"}>{categoryFormVisible ? "×" : "+"}</button></div>
            {categoryFormVisible && <form className="category-form" onSubmit={createCategory}><label className="field-label" htmlFor="category-name">Category name *</label><input id="category-name" className="input" value={categoryName} onChange={(event) => setCategoryName(event.target.value)} maxLength={120} required /><label className="field-label" htmlFor="category-description">Description</label><textarea id="category-description" className="input textarea" value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} rows={2} maxLength={2000} /><button className="button button-primary button-full" disabled={busy}>Create category</button></form>}
            <div className="category-list">{categories.map((category) => <div className="category-row" key={category.id}><div><strong>{category.name}</strong><small>{category.slug}</small></div><span>{category._count?.products ?? 0}</span></div>)}</div>
            <div className="category-note"><strong>Catalog rule</strong><p>Categories organize products; they do not imply stock availability. Only products marked Active appear in the public catalog.</p></div>
          </aside>
        </div>

        <section className="operational-footer"><div><span className="footer-dot" /><strong>Database-backed workspace</strong><span>Metrics, products, and categories load from the JERTINA API.</span></div><p>Admin API credentials remain server-side. This local admin password is not a production identity system.</p></section>
      </div>
    </main>
  );
}
