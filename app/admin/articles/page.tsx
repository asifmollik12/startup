"use client";
import { useState, useEffect } from "react";
import { Article } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Star, Search, Clock, Tag, X } from "lucide-react";
import ArticleModal from "@/components/admin/ArticleModal";
import Toast from "@/components/admin/Toast";

type Category = { _id: string; name: string; slug: string; color: string; description: string };

export default function AdminArticles() {
  const [tab, setTab] = useState<"articles" | "categories">("articles");

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [editing, setEditing] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catForm, setCatForm] = useState({ name: "", slug: "", color: "#C8102E", description: "" });
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toast = (msg: string) => { setToastMsg(msg); setShowToast(false); setTimeout(() => setShowToast(true), 10); };

  useEffect(() => {
    fetch("/api/articles").then(r => r.json()).then(data => setArticles(data.map((a: any) => ({ ...a, id: a._id })))).finally(() => setLoading(false));
    fetch("/api/categories").then(r => r.json()).then(data => setCategories(data.map((c: any) => ({ ...c, _id: c._id }))));
  }, []);

  const filtered = articles.filter(a =>
    (filterCat === "All" || a.category === filterCat) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (data: Article) => {
    if (creating) {
      const res = await fetch("/api/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const created = await res.json();
      setArticles(prev => [{ ...created, id: created._id }, ...prev]);
      toast("Article created");
    } else {
      const res = await fetch(`/api/articles/${data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await res.json();
      setArticles(prev => prev.map(a => a.id === data.id ? { ...updated, id: updated._id } : a));
      toast("Article updated");
    }
    setEditing(null); setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setArticles(prev => prev.filter(a => a.id !== id));
    setDeleteId(null); toast("Article deleted");
  };

  // Category handlers
  const handleCatSave = async () => {
    if (!catForm.name) return;
    const slug = catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, "-");
    if (editingCat) {
      const res = await fetch(`/api/categories/${editingCat._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...catForm, slug }) });
      const updated = await res.json();
      setCategories(prev => prev.map(c => c._id === editingCat._id ? { ...updated, _id: updated._id } : c));
      toast("Category updated");
    } else {
      const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...catForm, slug }) });
      const created = await res.json();
      setCategories(prev => [...prev, { ...created, _id: created._id }]);
      toast("Category created");
    }
    setCatForm({ name: "", slug: "", color: "#C8102E", description: "" });
    setEditingCat(null);
  };

  const handleCatDelete = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories(prev => prev.filter(c => c._id !== id));
    setDeleteCatId(null); toast("Category deleted");
  };

  const allCats = ["All", ...categories.map(c => c.name), ...Array.from(new Set(articles.map(a => a.category))).filter(c => !categories.find(cat => cat.name === c))];

  return (
    <div className="space-y-5">
      <Toast message={toastMsg} show={showToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">News Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage articles and categories</p>
        </div>
        {tab === "articles" && (
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={16} /> Add New Article
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        <button onClick={() => setTab("articles")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "articles" ? "border-brand-red text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          <Star size={14} /> Articles ({articles.length})
        </button>
        <button onClick={() => setTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "categories" ? "border-brand-red text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          <Tag size={14} /> Categories ({categories.length})
        </button>
      </div>

      {tab === "articles" && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="search" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {allCats.slice(0, 8).map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${filterCat === cat ? "bg-brand-red text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Author</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">Loading...</td></tr>}
                  {!loading && filtered.map(article => (
                    <tr key={article.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {article.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={article.coverImage} alt="" className="w-12 h-9 object-cover rounded flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-white line-clamp-1">{article.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Clock size={10} /> {article.readTime} min read</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">{article.category}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 hidden lg:table-cell text-xs">{article.author}</td>
                      <td className="px-5 py-4 text-gray-400 hidden lg:table-cell text-xs">{formatDate(article.publishedAt)}</td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {article.featured ? (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold w-fit"><Star size={9} /> Featured</span>
                        ) : (
                          <span className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded font-medium">Published</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditing(article)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => setDeleteId(article.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No articles found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create/Edit Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">{editingCat ? "Edit Category" : "New Category"}</h2>
              {editingCat && <button onClick={() => { setEditingCat(null); setCatForm({ name: "", slug: "", color: "#C8102E", description: "" }); }} className="text-gray-500 hover:text-white"><X size={15} /></button>}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Category Name</label>
                <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" placeholder="e.g. Fintech" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug</label>
                <input value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors font-mono" placeholder="fintech" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={catForm.color} onChange={e => setCatForm({ ...catForm, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-sm text-gray-400 font-mono">{catForm.color}</span>
                  <span className="text-xs px-3 py-1 rounded-full font-medium text-white" style={{ backgroundColor: catForm.color }}>{catForm.name || "Preview"}</span>
                </div>
              </div>
              <button onClick={handleCatSave} className="w-full bg-brand-red text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                {editingCat ? "Update Category" : "Create Category"}
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="font-semibold text-white text-sm">All Categories ({categories.length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {categories.length === 0 && <p className="px-5 py-8 text-center text-gray-500 text-sm">No categories yet.</p>}
              {categories.map(cat => (
                <div key={cat._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{cat.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{cat.slug}</p>
                  </div>
                  <span className="text-xs text-gray-500">{articles.filter(a => a.category === cat.name).length} articles</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEditingCat(cat); setCatForm({ name: cat.name, slug: cat.slug, color: cat.color, description: cat.description }); }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteCatId(cat._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {(editing || creating) && (
        <ArticleModal article={creating ? null : editing} onSave={handleSave} onClose={() => { setEditing(null); setCreating(false); }} />
      )}

      {/* Delete Article */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Article?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category */}
      {deleteCatId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Category?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteCatId(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => handleCatDelete(deleteCatId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
