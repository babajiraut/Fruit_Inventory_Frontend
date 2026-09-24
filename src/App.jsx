import {
  Apple,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  Edit3,
  Filter,
  Leaf,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { fruitApi } from "./api";

const categories = ["All", "Tropical", "Citrus", "Berry", "Melon", "Stone Fruit", "Other"];

const emptyForm = {
  name: "",
  category: "Tropical",
  price: "",
  quantity: "",
  unit: "kg",
  origin: "",
  image: "",
  description: "",
  featured: false
};

const fallbackImages = {
  Apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85",
  Banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85",
  Mango: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85",
  Orange: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=85",
  Strawberry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85",
  Watermelon: "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&w=900&q=85"
};

function App() {
  const [fruits, setFruits] = useState([]);
  const [stats, setStats] = useState({ totalFruits: 0, totalQuantity: 0, totalValue: 0, categories: 0 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [fruitRes, statsRes] = await Promise.all([
        fruitApi.list({ search, category, sort }),
        fruitApi.stats()
      ]);
      setFruits(fruitRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [search, category, sort]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2800);
  };

  const openCreate = () => {
    setForm(emptyForm);
    setModal("create");
  };

  const openEdit = (fruit) => {
    setForm({
      ...fruit,
      price: fruit.price,
      quantity: fruit.quantity
    });
    setModal("edit");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || Number(form.price) < 0 || Number(form.quantity) < 0) {
      showToast("Please enter valid fruit details.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity)
      };

      if (modal === "create") {
        await fruitApi.create(payload);
        showToast("Fruit added to your inventory.");
      } else {
        await fruitApi.update(form._id, payload);
        showToast("Fruit updated successfully.");
      }

      setModal(null);
      await load();
    } catch (error) {
      showToast(error.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (fruit) => {
    if (!window.confirm(`Delete ${fruit.name}? This cannot be undone.`)) return;

    try {
      await fruitApi.remove(fruit._id);
      showToast(`${fruit.name} deleted.`);
      await load();
    } catch (error) {
      showToast(error.response?.data?.message || "Could not delete fruit.");
    }
  };

  const totalValue = useMemo(
    () => fruits.reduce((sum, fruit) => sum + fruit.price * fruit.quantity, 0),
    [fruits]
  );

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon"><Leaf size={22} /></div>
          <div>
            <div className="brand-name">FruitVault</div>
            <div className="brand-sub">Fresh inventory studio</div>
          </div>
        </div>
        <div className="top-actions">
          <span className="live-dot"><span /> Atlas connected</span>
          <button className="primary-btn" onClick={openCreate}><Plus size={18} /> Add fruit</button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="eyebrow"><Sparkles size={15} /> INVENTORY CONTROL</span>
            <h1>Fresh stock,<br /><span>beautifully managed.</span></h1>
            <p>Track your fruit collection, prices and stock levels from one clean workspace.</p>
          </div>
          <div className="hero-orbit">
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="hero-fruit">🍓</div>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard icon={<Apple />} label="Fruit varieties" value={stats.totalFruits} accent="violet" />
          <StatCard icon={<Package />} label="Units in stock" value={stats.totalQuantity} accent="green" />
          <StatCard icon={<CircleDollarSign />} label="Inventory value" value={`₹${stats.totalValue.toLocaleString("en-IN")}`} accent="orange" />
          <StatCard icon={<BarChart3 />} label="Categories" value={stats.categories} accent="blue" />
        </section>

        <section className="workspace">
          <div className="toolbar">
            <div className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fruits, origin, description..."
              />
              {search && <button className="clear-search" onClick={() => setSearch("")}><X size={16} /></button>}
            </div>

            <div className="toolbar-right">
              <div className="select-wrap">
                <Filter size={16} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
              <div className="select-wrap">
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low</option>
                  <option value="price-high">Price: High</option>
                  <option value="name">Name: A–Z</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </div>
          </div>

          <div className="section-heading">
            <div>
              <h2>Fruit collection</h2>
              <p>{fruits.length} result{fruits.length !== 1 ? "s" : ""} · live from MongoDB Atlas</p>
            </div>
            <div className="inventory-value">Visible value <strong>₹{totalValue.toLocaleString("en-IN")}</strong></div>
          </div>

          {loading ? (
            <div className="state-card"><div className="spinner" /><span>Loading your fresh inventory...</span></div>
          ) : fruits.length === 0 ? (
            <div className="state-card empty-state">
              <div className="empty-icon">🍊</div>
              <h3>No fruits found</h3>
              <p>Try a different search or add your first fruit.</p>
              <button className="primary-btn" onClick={openCreate}><Plus size={17} /> Add first fruit</button>
            </div>
          ) : (
            <div className="fruit-grid">
              {fruits.map((fruit) => (
                <FruitCard key={fruit._id} fruit={fruit} onEdit={openEdit} onDelete={remove} />
              ))}
            </div>
          )}
        </section>
      </main>

      {modal && (
        <FruitModal
          mode={modal}
          form={form}
          setForm={setForm}
          onClose={() => setModal(null)}
          onSubmit={submit}
          saving={saving}
        />
      )}

      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`stat-card ${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function FruitCard({ fruit, onEdit, onDelete }) {
  const image = fruit.image || fallbackImages[fruit.name] || "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=900&q=85";
  const stockLow = fruit.quantity < 5;

  return (
    <article className="fruit-card">
      <div className="fruit-image-wrap">
        <img src={image} alt={fruit.name} onError={(e) => { e.currentTarget.src = fallbackImages[fruit.name] || fallbackImages.Apple; }} />
        <span className="category-badge">{fruit.category}</span>
        {fruit.featured && <span className="featured-badge">✦ Featured</span>}
        <div className="card-actions">
          <button title="Edit" onClick={() => onEdit(fruit)}><Edit3 size={16} /></button>
          <button title="Delete" onClick={() => onDelete(fruit)}><Trash2 size={16} /></button>
        </div>
      </div>
      <div className="fruit-body">
        <div className="fruit-title-row">
          <div>
            <h3>{fruit.name}</h3>
            <p>{fruit.origin || "Local farm"}</p>
          </div>
          <div className="price"><small>₹</small>{fruit.price}<span>/{fruit.unit}</span></div>
        </div>
        <p className="description">{fruit.description || "Fresh, quality fruit ready for your collection."}</p>
        <div className="stock-row">
          <div className={`stock ${stockLow ? "low" : ""}`}><span /> {fruit.quantity} {fruit.unit} in stock</div>
          <span className="stock-value">₹{(fruit.price * fruit.quantity).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </article>
  );
}

function FruitModal({ mode, form, setForm, onClose, onSubmit, saving }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow"><Leaf size={14} /> FRUITVAULT</span>
            <h2>{mode === "create" ? "Add a fresh fruit" : "Edit fruit details"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X /></button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label>Fruit name<input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Alphonso Mango" /></label>
            <label>Category<select value={form.category} onChange={(e) => update("category", e.target.value)}>{categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}</select></label>
            <label>Price / unit<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="120" /></label>
            <label>Quantity<input required type="number" min="0" step="0.1" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="10" /></label>
            <label>Unit<select value={form.unit} onChange={(e) => update("unit", e.target.value)}><option>kg</option><option>piece</option><option>box</option><option>dozen</option></select></label>
            <label>Origin<input value={form.origin} onChange={(e) => update("origin", e.target.value)} placeholder="Ratnagiri, Maharashtra" /></label>
            <label className="full">Image URL<input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." /></label>
            <label className="full">Description<textarea rows="3" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short description of the fruit..." /></label>
            <label className="checkbox full"><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /><span>Mark as featured</span></label>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
            <button className="primary-btn" disabled={saving}>{saving ? "Saving..." : mode === "create" ? "Add fruit" : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;