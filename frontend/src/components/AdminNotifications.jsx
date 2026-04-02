import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const empty = {
  title: "", message: "", type: "info",
  bgColor: "#eff6ff", textColor: "#1d4ed8", borderColor: "#3b82f6",
  icon: "📢", link: "", linkText: "", active: false,
};

const typePresets = {
  info:    { bg: "#eff6ff", text: "#1d4ed8", border: "#3b82f6", label: "Info",    dot: "#3b82f6" },
  warning: { bg: "#fffbeb", text: "#92400e", border: "#f59e0b", label: "Warning", dot: "#f59e0b" },
  success: { bg: "#f0fdf4", text: "#065f46", border: "#10b981", label: "Success", dot: "#10b981" },
  error:   { bg: "#fef2f2", text: "#991b1b", border: "#ef4444", label: "Error",   dot: "#ef4444" },
};

export default function AdminNotifications() {
  const [list, setList]     = useState([]);
  const [form, setForm]     = useState(empty);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => axiosInstance.get("/notifications/admin").then(r => setList(r.data));
  useEffect(() => { load(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const applyPreset = (type) => {
    const p = typePresets[type];
    setForm(f => ({ ...f, type, bgColor: p.bg, textColor: p.text, borderColor: p.border }));
  };

  const save = async () => {
    setSaving(true);
    try {
      editId
        ? await axiosInstance.put(`/notifications/${editId}`, form)
        : await axiosInstance.post("/notifications", form);
      setForm(empty);
      setEditId(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (n) => {
    setEditId(n._id);
    setForm({
      title: n.title, message: n.message, type: n.type,
      bgColor: n.bgColor, textColor: n.textColor, borderColor: n.borderColor,
      icon: n.icon, link: n.link, linkText: n.linkText, active: n.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (window.confirm("Delete this notification?")) {
      await axiosInstance.delete(`/notifications/${id}`);
      load();
    }
  };

  const toggleActive = async (n) => {
    await axiosInstance.put(`/notifications/${n._id}`, { ...n, active: !n.active });
    load();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .an-root { font-family: 'DM Sans', sans-serif; background: #f8f7f4; min-height: 100vh; padding: 40px 24px; }
        .an-page { max-width: 860px; margin: 0 auto; }

        .an-heading { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 4px; }
        .an-subheading { font-size: 13px; color: #94a3b8; font-weight: 400; margin-bottom: 32px; }

        /* Preview */
        .an-preview-wrap { margin-bottom: 28px; }
        .an-preview-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; }
        .an-preview-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 18px; border-radius: 12px; border-left: 4px solid;
          transition: all 0.3s ease;
        }
        .an-preview-bar span { font-size: 14px; line-height: 1.5; }
        .an-preview-btn { background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.6; padding: 0 4px; }

        /* Card */
        .an-card {
          background: #fff; border-radius: 20px; padding: 32px;
          border: 1px solid #e8e5df; margin-bottom: 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);
        }

        .an-card-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: #94a3b8; margin-bottom: 20px; }

        /* Type Pills */
        .an-type-row { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
        .an-type-pill {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px; border: 1.5px solid #e2e8f0;
          font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          background: #fff; color: #64748b;
        }
        .an-type-pill.active { border-color: currentColor; background: #f8faff; }
        .an-type-pill .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* Grid */
        .an-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .an-grid-full { grid-column: 1 / -1; }

        .an-field label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #94a3b8; margin-bottom: 7px; }
        .an-field input, .an-field textarea, .an-field select {
          width: 100%; border: 1.5px solid #e8e5df; border-radius: 10px;
          padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif;
          background: #fafaf9; color: #0f172a; outline: none; transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .an-field input:focus, .an-field textarea:focus, .an-field select:focus { border-color: #0ea5e9; background: #fff; }
        .an-field textarea { resize: vertical; }

        /* Color row */
        .an-color-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .an-color-field label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #94a3b8; margin-bottom: 7px; }
        .an-color-swatch { display: flex; align-items: center; gap: 10px; border: 1.5px solid #e8e5df; border-radius: 10px; padding: 8px 12px; background: #fafaf9; cursor: pointer; }
        .an-color-swatch input[type=color] { width: 28px; height: 28px; border: none; background: none; cursor: pointer; padding: 0; border-radius: 6px; }
        .an-color-swatch span { font-size: 12px; color: #64748b; font-family: monospace; }

        /* Toggle */
        .an-toggle-row { display: flex; align-items: center; gap: 12px; }
        .an-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
        .an-toggle input { opacity: 0; width: 0; height: 0; }
        .an-toggle-slider {
          position: absolute; inset: 0; border-radius: 999px;
          background: #e2e8f0; cursor: pointer; transition: 0.3s;
        }
        .an-toggle-slider:before {
          content: ''; position: absolute; width: 18px; height: 18px;
          border-radius: 50%; background: white; top: 3px; left: 3px;
          transition: 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .an-toggle input:checked + .an-toggle-slider { background: #10b981; }
        .an-toggle input:checked + .an-toggle-slider:before { transform: translateX(20px); }
        .an-toggle-label { font-size: 14px; font-weight: 500; color: #374151; }
        .an-toggle-hint { font-size: 12px; color: #94a3b8; }

        /* Buttons */
        .an-btn-row { display: flex; gap: 10px; margin-top: 8px; }
        .an-btn-primary {
          padding: 11px 28px; background: #0f172a; color: #fff; border: none;
          border-radius: 10px; font-family: 'Syne', sans-serif; font-size: 13px;
          font-weight: 700; letter-spacing: 0.3px; cursor: pointer; transition: all 0.2s;
        }
        .an-btn-primary:hover { background: #1e293b; transform: translateY(-1px); }
        .an-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .an-btn-ghost {
          padding: 11px 20px; background: transparent; color: #64748b;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .an-btn-ghost:hover { border-color: #94a3b8; color: #374151; }

        /* Divider */
        .an-divider { display: flex; align-items: center; gap: 16px; margin: 36px 0 24px; }
        .an-divider-line { flex: 1; height: 1px; background: #e8e5df; }
        .an-divider-text { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #94a3b8; white-space: nowrap; }

        /* Notification list items */
        .an-item {
          background: #fff; border-radius: 16px; padding: 18px 20px;
          border: 1px solid #e8e5df; display: flex; justify-content: space-between;
          align-items: center; gap: 16px; transition: box-shadow 0.2s;
          margin-bottom: 10px;
        }
        .an-item:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
        .an-item-left { display: flex; align-items: flex-start; gap: 14px; flex: 1; min-width: 0; }
        .an-item-icon { font-size: 20px; margin-top: 2px; flex-shrink: 0; }
        .an-item-body { flex: 1; min-width: 0; }
        .an-item-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
        .an-item-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #0f172a; }
        .an-badge {
          font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          padding: 2px 8px; border-radius: 999px;
        }
        .an-badge-active { background: #dcfce7; color: #166534; }
        .an-badge-inactive { background: #f1f5f9; color: #64748b; }
        .an-badge-type { background: #f0f9ff; color: #0369a1; }
        .an-item-msg { font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .an-color-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }

        .an-item-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .an-act-btn {
          padding: 6px 12px; border-radius: 8px; border: none; font-size: 12px;
          font-weight: 600; cursor: pointer; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
        }
        .an-act-activate { background: #dcfce7; color: #166534; }
        .an-act-activate:hover { background: #bbf7d0; }
        .an-act-deactivate { background: #fef9c3; color: #854d0e; }
        .an-act-deactivate:hover { background: #fef08a; }
        .an-act-edit { background: #f0f9ff; color: #0369a1; }
        .an-act-edit:hover { background: #e0f2fe; }
        .an-act-delete { background: #fff1f2; color: #be123c; }
        .an-act-delete:hover { background: #ffe4e6; }

        .an-empty { text-align: center; padding: 48px 24px; color: #94a3b8; }
        .an-empty-icon { font-size: 40px; margin-bottom: 12px; }
        .an-empty-text { font-size: 14px; }

        @media (max-width: 640px) {
          .an-grid { grid-template-columns: 1fr; }
          .an-color-row { grid-template-columns: 1fr; }
          .an-item { flex-direction: column; align-items: flex-start; }
          .an-item-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      <div className="an-root">
        <div className="an-page">

          <h1 className="an-heading">Notifications</h1>
          <p className="an-subheading">Manage banners shown to users on the homepage</p>

          {/* Live Preview */}
          {form.title && (
            <div className="an-preview-wrap">
              <div className="an-preview-label">Live Preview</div>
              <div className="an-preview-bar" style={{ background: form.bgColor, borderLeftColor: form.borderColor, color: form.textColor }}>
                <span>{form.icon} <strong>{form.title}:</strong> {form.message}
                  {form.link && <a href={form.link} style={{ marginLeft: 10, textDecoration: 'underline', fontWeight: 600 }}>{form.linkText || 'Learn More'}</a>}
                </span>
                <button className="an-preview-btn" style={{ color: form.textColor }}>✕</button>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="an-card">
            <div className="an-card-title">{editId ? "✏️ Editing notification" : "✦ New notification"}</div>

            {/* Type Presets */}
            <div className="an-type-row">
              {Object.entries(typePresets).map(([key, p]) => (
                <button key={key} className={`an-type-pill ${form.type === key ? 'active' : ''}`}
                  style={form.type === key ? { color: p.dot, borderColor: p.dot } : {}}
                  onClick={() => applyPreset(key)}>
                  <span className="dot" style={{ background: p.dot }} />
                  {p.label}
                </button>
              ))}
            </div>

            <div className="an-grid">
              <div className="an-field">
                <label>Title *</label>
                <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. System Maintenance" />
              </div>

              <div className="an-field">
                <label>Icon (emoji)</label>
                <input value={form.icon} onChange={e => set("icon", e.target.value)} placeholder="📢" />
              </div>

              <div className="an-field an-grid-full">
                <label>Message *</label>
                <textarea rows={3} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Write your notification message..." />
              </div>

              <div className="an-field">
                <label>Link URL (optional)</label>
                <input value={form.link} onChange={e => set("link", e.target.value)} placeholder="https://..." />
              </div>

              <div className="an-field">
                <label>Link Button Text</label>
                <input value={form.linkText} onChange={e => set("linkText", e.target.value)} placeholder="Learn More" />
              </div>
            </div>

            {/* Colors */}
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>Custom Colors</div>
              <div className="an-color-row">
                {[['bgColor','Background'], ['textColor','Text'], ['borderColor','Border']].map(([k, label]) => (
                  <div key={k} className="an-color-field">
                    <label>{label}</label>
                    <div className="an-color-swatch">
                      <input type="color" value={form[k]} onChange={e => set(k, e.target.value)} />
                      <span>{form[k]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active toggle */}
            <div className="an-toggle-row" style={{ marginBottom: 24 }}>
              <label className="an-toggle">
                <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} />
                <span className="an-toggle-slider" />
              </label>
              <div>
                <div className="an-toggle-label">Active</div>
                <div className="an-toggle-hint">Show this notification on homepage</div>
              </div>
            </div>

            <div className="an-btn-row">
              <button className="an-btn-primary" onClick={save} disabled={saving || !form.title || !form.message}>
                {saving ? "Saving..." : editId ? "Update Notification" : "Create Notification"}
              </button>
              {editId && (
                <button className="an-btn-ghost" onClick={() => { setForm(empty); setEditId(null); }}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="an-divider">
            <div className="an-divider-line" />
            <div className="an-divider-text">All Notifications ({list.length})</div>
            <div className="an-divider-line" />
          </div>

          {list.length === 0 ? (
            <div className="an-empty">
              <div className="an-empty-icon">🔔</div>
              <div className="an-empty-text">No notifications yet. Create one above.</div>
            </div>
          ) : list.map(n => (
            <div key={n._id} className="an-item">
              <div className="an-item-left">
                <div className="an-color-dot" style={{ background: n.borderColor }} />
                <div className="an-item-icon">{n.icon}</div>
                <div className="an-item-body">
                  <div className="an-item-top">
                    <span className="an-item-title">{n.title}</span>
                    <span className={`an-badge ${n.active ? 'an-badge-active' : 'an-badge-inactive'}`}>
                      {n.active ? "Live" : "Draft"}
                    </span>
                    <span className="an-badge an-badge-type">{n.type}</span>
                  </div>
                  <div className="an-item-msg">{n.message}</div>
                </div>
              </div>
              <div className="an-item-actions">
                <button className={`an-act-btn ${n.active ? 'an-act-deactivate' : 'an-act-activate'}`} onClick={() => toggleActive(n)}>
                  {n.active ? "Deactivate" : "Activate"}
                </button>
                <button className="an-act-btn an-act-edit" onClick={() => startEdit(n)}>Edit</button>
                <button className="an-act-btn an-act-delete" onClick={() => remove(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}