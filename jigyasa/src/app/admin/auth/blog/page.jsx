// "use client";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import * as XLSX from "xlsx"; // npm install xlsx
// import {
//     BookOpen, Type, AlignLeft, CheckCircle2, Loader2,
//     Sparkles, X, Trash2, User, ImagePlus, RefreshCw, ArrowLeft,
//     ChevronRight, Tag, Pencil, Save, FileText, FileSpreadsheet,
//     Download, AlertCircle, Table2, Upload, Eye,
// } from "lucide-react";
// import Link from "next/link";
// import Footer from "@/components/Footer";

// const API_AUTH = "http://localhost:4000/api/auth";
// const API_BLOGS = "http://localhost:4000/api/blogs";

// const BLOG_CATEGORIES = [
//     "Health", "Medical Services", "Cardiology", "Neurology",
//     "Orthopedics", "Pediatrics", "Dermatology", "Research", "Uncategorized",
// ];

// // ─────────────────────────────────────────
// // Excel parsing helpers
// // ─────────────────────────────────────────
// function findHeaderRow(ws) {
//     const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z100");
//     for (let r = range.s.r; r <= Math.min(range.e.r, 10); r++) {
//         for (let c = range.s.c; c <= range.e.c; c++) {
//             const cell = ws[XLSX.utils.encode_cell({ r, c })];
//             if (cell && String(cell.v ?? "").toLowerCase().trim() === "title") return r;
//         }
//     }
//     return 0;
// }

// function parseWorksheet(ws) {
//     const headerRow = findHeaderRow(ws);
//     const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z1000");
//     const headers = [];
//     for (let c = range.s.c; c <= range.e.c; c++) {
//         const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c })];
//         headers.push(cell ? String(cell.v ?? "").trim() : `col_${c}`);
//     }
//     // Skip hint row
//     let dataStart = headerRow + 1;
//     const titleIdx = headers.findIndex(h => h.toLowerCase() === "title");
//     if (titleIdx >= 0) {
//         const hintCell = ws[XLSX.utils.encode_cell({ r: dataStart, c: titleIdx })];
//         const hintVal = hintCell ? String(hintCell.v ?? "").toLowerCase() : "";
//         if (hintVal.startsWith("e.g.") || hintVal.includes("cloudinary")) dataStart++;
//     }
//     const rows = [];
//     for (let r = dataStart; r <= range.e.r; r++) {
//         const obj = {}; let hasVal = false;
//         for (let c = range.s.c; c <= range.e.c; c++) {
//             const cell = ws[XLSX.utils.encode_cell({ r, c })];
//             const val = cell ? String(cell.v ?? "").trim() : "";
//             obj[headers[c] || `col_${c}`] = val;
//             if (val) hasVal = true;
//         }
//         if (hasVal) rows.push(obj);
//     }
//     return rows;
// }

// function parseBlogRow(row) {
//     const norm = s => s.toLowerCase().replace(/[\s_]+/g, "");
//     const get = key => {
//         const match = Object.keys(row).find(k => norm(k) === norm(key));
//         return match ? String(row[match] ?? "").trim() : "";
//     };
//     const title = get("title");
//     const author = get("author");
//     const category = get("category");
//     const excerpt = get("excerpt") || get("shortexcerpt");
//     const content = get("content") || get("fullcontent");
//     const coverImage = get("coverimage") || get("cover") || get("coverurl") || get("imageurl") || "";

//     if (title.toLowerCase().startsWith("e.g.") || title.toLowerCase() === "title" || !title) return null;

//     const errors = [];
//     if (!title) errors.push("Title is required");
//     if (!author) errors.push("Author is required");
//     if (!excerpt) errors.push("Excerpt is required");
//     if (!content) errors.push("Content is required");
//     if (!coverImage || !coverImage.startsWith("http")) errors.push("Cover image URL required (must start with http)");

//     // Category: accept exact match or default to Uncategorized (just warn)
//     const resolvedCat = BLOG_CATEGORIES.includes(category) ? category : "Uncategorized";
//     if (category && !BLOG_CATEGORIES.includes(category))
//         errors.push(`Unknown category "${category}" — will save as "Uncategorized"`);

//     return { title, author, category: resolvedCat, excerpt, content, coverImage, errors, valid: errors.length === 0 };
// }

// export default function AdminBlogs() {
//     const router = useRouter();

//     // ── auth ──
//     const [checking, setChecking] = useState(true);

//     // ── tab ──
//     const [activeTab, setActiveTab] = useState("manual");

//     // ── manual form ──
//     const [form, setForm] = useState({ title: "", author: "", category: "", excerpt: "", content: "" });
//     const [coverFile, setCoverFile] = useState(null);
//     const [coverPreview, setCoverPreview] = useState(null);
//     const [dragOver, setDragOver] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const [error, setError] = useState("");
//     const coverRef = useRef(null);

//     // ── bulk ──
//     const [bulkFile, setBulkFile] = useState(null);
//     const [bulkRows, setBulkRows] = useState([]);
//     const [bulkDragOver, setBulkDragOver] = useState(false);
//     const [bulkImporting, setBulkImporting] = useState(false);
//     const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
//     const [bulkErrors, setBulkErrors] = useState([]);
//     const [bulkDone, setBulkDone] = useState(false);
//     const [previewRow, setPreviewRow] = useState(null);

//     // ── list ──
//     const [blogs, setBlogs] = useState([]);
//     const [listLoading, setListLoading] = useState(true);
//     const [deletingId, setDeletingId] = useState(null);

//     // ── edit ──
//     const [editBlog, setEditBlog] = useState(null);
//     const [editForm, setEditForm] = useState({ title: "", author: "", category: "", excerpt: "", content: "" });
//     const [editCoverFile, setEditCoverFile] = useState(null);
//     const [editCoverPreview, setEditCoverPreview] = useState(null);
//     const [editLoading, setEditLoading] = useState(false);
//     const [editError, setEditError] = useState("");
//     const [editSuccess, setEditSuccess] = useState(false);
//     const editCoverRef = useRef(null);

//     useEffect(() => {
//         (async () => {
//             try { await axios.get(`${API_AUTH}/me`, { withCredentials: true }); }
//             catch { router.push("/admin/auth/login"); }
//             finally { setChecking(false); }
//         })();
//     }, []);

//     const fetchBlogs = async () => {
//         setListLoading(true);
//         try { const res = await axios.get(API_BLOGS, { withCredentials: true }); setBlogs(res.data); }
//         catch (err) { console.error("Fetch blogs:", err); }
//         finally { setListLoading(false); }
//     };
//     useEffect(() => { if (!checking) fetchBlogs(); }, [checking]);

//     // ── image helpers ──
//     const handleCover = (file) => {
//         if (!file) return;
//         if (!file.type.startsWith("image/")) { setError("Please select a valid image (JPG, PNG, WebP)."); return; }
//         if (file.size > 4 * 1024 * 1024) { setError("Image too large — max 4MB."); return; }
//         setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); setError("");
//     };
//     const handleEditCover = (file) => {
//         if (!file) return;
//         if (!file.type.startsWith("image/")) { setEditError("Please select a valid image (JPG, PNG, WebP)."); return; }
//         if (file.size > 4 * 1024 * 1024) { setEditError("Image too large — max 4MB."); return; }
//         setEditCoverFile(file); setEditCoverPreview(URL.createObjectURL(file)); setEditError("");
//     };
//     const convertToBase64 = (file) => new Promise((res, rej) => {
//         const r = new FileReader(); r.readAsDataURL(file);
//         r.onload = () => res(r.result); r.onerror = rej;
//     });

//     // ── manual submit ──
//     const handleSubmit = async (e) => {
//         e.preventDefault(); setLoading(true); setError("");
//         try {
//             const payload = { ...form };
//             if (coverFile) payload.coverImage = await convertToBase64(coverFile);
//             await axios.post(API_BLOGS, payload, { withCredentials: true, headers: { "Content-Type": "application/json" }, maxBodyLength: Infinity });
//             setSuccess(true);
//             setForm({ title: "", author: "", category: "", excerpt: "", content: "" });
//             setCoverFile(null); setCoverPreview(null);
//             if (coverRef.current) coverRef.current.value = "";
//             setTimeout(() => setSuccess(false), 3500);
//             fetchBlogs();
//         } catch (err) {
//             const msg = err?.response?.data?.message || (err?.response?.status === 413 ? "File too large." : null) || err?.message || "Upload failed.";
//             setError(msg);
//         } finally { setLoading(false); }
//     };

//     // ── Excel parse ──
//     const handleExcelFile = (file) => {
//         if (!file) return;
//         setBulkFile(file); setBulkRows([]); setBulkErrors([]); setBulkDone(false);
//         const reader = new FileReader();
//         reader.onload = (ev) => {
//             try {
//                 const wb = XLSX.read(ev.target.result, { type: "array" });
//                 const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes("blog")) || wb.SheetNames[0];
//                 const ws = wb.Sheets[sheetName];
//                 const raw = parseWorksheet(ws);
//                 if (!raw.length) { setBulkErrors(["No data rows found."]); return; }
//                 const parsed = raw.map(parseBlogRow).filter(Boolean);
//                 if (!parsed.length) { setBulkErrors(["All rows were skipped — please fill in real data."]); return; }
//                 setBulkRows(parsed);
//             } catch (err) { setBulkErrors([`Parse error: ${err.message}`]); }
//         };
//         reader.readAsArrayBuffer(file);
//     };

//     const validRows = bulkRows.filter(r => r.valid);
//     const invalidRows = bulkRows.filter(r => !r.valid);

//     // ── bulk import ──
//     const handleBulkImport = async () => {
//         if (!validRows.length) return;
//         setBulkImporting(true); setBulkProgress({ done: 0, total: validRows.length });
//         const errs = [];
//         for (let i = 0; i < validRows.length; i++) {
//             const row = validRows[i];
//             try {
//                 await axios.post(API_BLOGS, {
//                     title: row.title, author: row.author, category: row.category,
//                     excerpt: row.excerpt, content: row.content,
//                     coverImage: row.coverImage, // Cloudinary URL string
//                     useUrl: true,               // tells backend to store as URL, not decode base64
//                 }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
//             } catch (err) {
//                 errs.push(`Row ${i + 1} ("${row.title}"): ${err?.response?.data?.message || err.message}`);
//             }
//             setBulkProgress({ done: i + 1, total: validRows.length });
//         }
//         setBulkErrors(errs); setBulkImporting(false); setBulkDone(true);
//         fetchBlogs();
//     };

//     const resetBulk = () => { setBulkFile(null); setBulkRows([]); setBulkErrors([]); setBulkDone(false); setBulkImporting(false); };

//     // ── template download ──
//     const downloadTemplate = () => {
//         const wb = XLSX.utils.book_new();
//         const ws = XLSX.utils.aoa_to_sheet([
//             ["title", "author", "category", "excerpt", "content", "coverimage"],
//             ["e.g. 5 Warning Signs of Heart Disease", "Dr. Anjali Sharma", "Cardiology", "Short preview text...", "Full article body goes here...", "https://res.cloudinary.com/your-cloud/image/upload/cover.jpg"],
//         ]);
//         ws["!cols"] = [{ wch: 42 }, { wch: 22 }, { wch: 18 }, { wch: 48 }, { wch: 70 }, { wch: 60 }];
//         XLSX.utils.book_append_sheet(wb, ws, "Blog Import");
//         XLSX.writeFile(wb, "blog_bulk_import_template.xlsx");
//     };

//     // ── delete ──
//     const handleDelete = async (id) => {
//         if (!confirm("Delete this blog post? This cannot be undone.")) return;
//         setDeletingId(id);
//         try { await axios.delete(`${API_BLOGS}/${id}`, { withCredentials: true }); setBlogs(prev => prev.filter(b => b.id !== id)); }
//         catch (err) { alert(err?.response?.data?.message || "Failed to delete."); }
//         finally { setDeletingId(null); }
//     };

//     // ── edit ──
//     const openEdit = (blog) => {
//         setEditBlog(blog);
//         setEditForm({ title: blog.title || "", author: blog.author || "", category: blog.category || "", excerpt: blog.excerpt || "", content: blog.content || "" });
//         setEditCoverFile(null); setEditCoverPreview(null); setEditError(""); setEditSuccess(false);
//     };
//     const closeEdit = () => { setEditBlog(null); setEditCoverFile(null); setEditCoverPreview(null); setEditError(""); setEditSuccess(false); };

//     const handleEditSubmit = async (e) => {
//         e.preventDefault(); setEditLoading(true); setEditError("");
//         try {
//             const payload = { ...editForm };
//             if (editCoverFile) payload.coverImage = await convertToBase64(editCoverFile);
//             await axios.patch(`${API_BLOGS}/${editBlog.id}`, payload, { withCredentials: true, headers: { "Content-Type": "application/json" }, maxBodyLength: Infinity });
//             setBlogs(prev => prev.map(b => b.id === editBlog.id ? { ...b, ...editForm } : b));
//             setEditSuccess(true);
//             setTimeout(() => { setEditSuccess(false); closeEdit(); }, 1800);
//         } catch (err) {
//             setEditError(err?.response?.data?.message || (err?.response?.status === 413 ? "File too large." : null) || err?.message || "Update failed.");
//         } finally { setEditLoading(false); }
//     };

//     const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

//     if (checking) return (
//         <div style={{ minHeight: "100vh", background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <Loader2 style={{ width: 28, height: 28, color: "#14b8a6", animation: "b-spin 1s linear infinite" }} />
//         </div>
//     );

//     // ── category pills (reused in both forms) ──
//     const CatPills = ({ value, onChange }) => (
//         <div className="b-cat-row">
//             {BLOG_CATEGORIES.map(cat => (
//                 <button key={cat} type="button" className={`b-cat-pill ${value === cat ? "sel" : ""}`} onClick={() => onChange(cat)}>
//                     {cat}
//                 </button>
//             ))}
//         </div>
//     );

//     return (
//         <>
//             <style>{`
//                 @keyframes b-spin  { to { transform: rotate(360deg); } }
//                 @keyframes b-modal { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
//                 @keyframes b-toast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
//                 @keyframes b-fade  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

//                 .b-root *,.b-root *::before,.b-root *::after { box-sizing:border-box; }
//                 .b-root { min-height:100vh; background:#f0fdfa; font-family:'Satoshi',system-ui,sans-serif; }

//                 /* topbar */
//                 .b-topbar { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-bottom:1px solid rgba(20,184,166,.12); padding:10px 20px; }
//                 .b-topbar a { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; }
//                 .b-topbar a:hover { color:#0d9488; }
//                 .b-topbar-cur { font-size:12px; font-weight:600; color:#0d9488; }

//                 /* layout */
//                 .b-layout { display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:1100px; margin:0 auto; padding:14px 14px 20px; align-items:start; }
//                 @media (max-width:820px) { .b-layout { grid-template-columns:1fr; } }

//                 /* card */
//                 .b-card { background:white; border-radius:16px; border:1px solid rgba(20,184,166,.12); box-shadow:0 4px 20px rgba(13,148,136,.1); overflow:hidden; display:flex; flex-direction:column; }
//                 .b-card-hdr { background:linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
//                 .b-card-hdr h2 { font-size:14px; font-weight:700; color:white; margin:0; letter-spacing:-.2px; }
//                 .b-card-hdr p  { font-size:11px; color:rgba(255,255,255,.6); margin:2px 0 0; }
//                 .b-body { padding:14px 16px 16px; flex:1; overflow-y:auto; }

//                 /* tabs */
//                 .b-tabs { display:flex; border-bottom:2px solid rgba(20,184,166,.1); margin-bottom:14px; }
//                 .b-tab { flex:1; padding:9px 10px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; gap:6px; color:#94a3b8; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; font-family:inherit; }
//                 .b-tab.active { color:#0d9488; border-bottom-color:#14b8a6; background:linear-gradient(180deg,transparent,rgba(20,184,166,.04)); }
//                 .b-tab:hover:not(.active) { color:#0d9488; background:rgba(20,184,166,.04); }

//                 /* fields */
//                 .b-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
//                 @media (max-width:480px) { .b-row2 { grid-template-columns:1fr; } }
//                 .b-field { margin-bottom:10px; }
//                 .b-lbl { display:block; font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#0d9488; margin-bottom:4px; }
//                 .b-inp-wrap { position:relative; }
//                 .b-inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex; align-items:center; }
//                 .b-inp-icon.top { top:10px; transform:none; }
//                 .b-inp-wrap:focus-within .b-inp-icon { color:#14b8a6; }
//                 .b-inp { width:100%; padding:8px 10px 8px 32px; border:1.5px solid #e2f4f2; border-radius:9px; font-size:13px; color:#0f172a; background:#fafffe; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
//                 .b-inp:focus { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.1); background:white; }
//                 .b-inp::placeholder { color:#b0cec9; }
//                 .b-inp.ta { min-height:72px; resize:vertical; line-height:1.5; padding-top:9px; }
//                 .b-inp.ta-lg { min-height:130px; }

//                 /* category pills */
//                 .b-cat-row { display:flex; gap:5px; flex-wrap:wrap; margin-top:6px; }
//                 .b-cat-pill { padding:4px 10px; border-radius:100px; font-size:10px; font-weight:700; cursor:pointer; transition:all .15s; border:1.5px solid #e2f4f2; background:#fafffe; color:#64748b; }
//                 .b-cat-pill.sel { background:#14b8a6; color:white; border-color:#14b8a6; }
//                 .b-cat-pill:hover:not(.sel) { border-color:#14b8a6; color:#0d9488; }

//                 /* upload */
//                 .b-upload { border:1.5px dashed rgba(20,184,166,.35); border-radius:10px; padding:14px 10px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
//                 .b-upload:hover,.b-upload.drag { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
//                 .b-upload input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; z-index:2; width:100%; height:100%; }
//                 .b-upload-t { font-size:12px; font-weight:600; color:#0d9488; margin-top:6px; }
//                 .b-upload-s { font-size:10px; color:#94a3b8; margin-top:2px; }

//                 .b-img-prev { position:relative; border-radius:10px; overflow:hidden; }
//                 .b-img-prev img { width:100%; height:130px; object-fit:cover; display:block; }
//                 .b-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.45),transparent); display:flex; align-items:flex-end; justify-content:space-between; padding:6px 8px; }
//                 .b-prev-badge { font-size:10px; font-weight:600; color:white; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:100px; display:flex; align-items:center; gap:4px; }
//                 .b-remove-btn { font-size:10px; font-weight:600; color:white; background:rgba(239,68,68,.85); padding:3px 8px; border-radius:100px; border:none; cursor:pointer; display:flex; align-items:center; gap:3px; }

//                 .b-divider { height:1px; background:linear-gradient(90deg,transparent,#e2f4f2,transparent); margin:10px 0; }

//                 .b-submit { width:100%; padding:11px; background:linear-gradient(135deg,#064e3b 0%,#0f766e 40%,#14b8a6 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; box-shadow:0 4px 16px rgba(20,184,166,.35); margin-top:10px; font-family:inherit; }
//                 .b-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(20,184,166,.45); }
//                 .b-submit:disabled { opacity:.7; cursor:not-allowed; }

//                 /* bulk */
//                 .b-bulk-drop { border:2px dashed rgba(20,184,166,.35); border-radius:14px; padding:28px 20px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; }
//                 .b-bulk-drop.drag,.b-bulk-drop:hover { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
//                 .b-bulk-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; z-index:2; }
//                 .b-bulk-drop-icon { width:44px; height:44px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
//                 .b-bulk-drop h3 { font-size:14px; font-weight:700; color:#0d9488; margin:0 0 4px; }
//                 .b-bulk-drop p  { font-size:11px; color:#64748b; margin:0; }

//                 .b-dl-btn { display:inline-flex; align-items:center; gap:6px; background:white; border:1.5px solid #b2f5ea; color:#0d9488; font-size:11px; font-weight:700; padding:7px 14px; border-radius:8px; cursor:pointer; margin-top:10px; transition:all .2s; font-family:inherit; }
//                 .b-dl-btn:hover { background:#f0fdfa; border-color:#14b8a6; transform:translateY(-1px); }

//                 .b-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(20,184,166,.15); margin-top:12px; animation:b-fade .3s ease both; }
//                 .b-table { width:100%; border-collapse:collapse; font-size:11px; }
//                 .b-table th { background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; font-size:10px; letter-spacing:.5px; }
//                 .b-table td { padding:7px 10px; border-bottom:1px solid #f0fdfa; vertical-align:middle; max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
//                 .b-table tr:last-child td { border-bottom:none; }
//                 .b-table tr:nth-child(even) td { background:#f8fffd; }
//                 .b-table tr:hover td { background:#e6fef9; }
//                 .b-table .err-row td { background:#fff5f5 !important; }

//                 .b-bdg { display:inline-flex; align-items:center; gap:3px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; white-space:nowrap; }
//                 .b-bdg.ok  { background:#f0fdfa; color:#0d9488; border:1px solid #b2f5ea; }
//                 .b-bdg.err { background:#fff5f5; color:#ef4444; border:1px solid #fecaca; }
//                 .b-url { font-size:9px; color:#14b8a6; text-decoration:none; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px; }
//                 .b-url:hover { text-decoration:underline; }

//                 .b-bulk-stats { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0; }
//                 .b-stat-chip { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; font-size:11px; font-weight:700; }
//                 .b-progress-bar { height:6px; background:#e2f4f2; border-radius:100px; overflow:hidden; margin:10px 0; }
//                 .b-progress-fill { height:100%; background:linear-gradient(90deg,#064e3b,#14b8a6); border-radius:100px; transition:width .3s ease; }

//                 /* list */
//                 .b-list-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(20,184,166,.1); background:linear-gradient(to right,#f0fdfa,white); }
//                 .b-list-hdr h3 { font-size:13px; font-weight:700; color:#0f172a; margin:0; }
//                 .b-list-hdr p  { font-size:11px; color:#64748b; margin:2px 0 0; }
//                 .b-row { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #f5fffe; transition:background .15s; }
//                 .b-row:last-child { border-bottom:none; }
//                 .b-row:hover { background:#f0fdfa; }
//                 .b-cover { width:54px; height:40px; border-radius:8px; flex-shrink:0; background:#e8f5f3; overflow:hidden; display:flex; align-items:center; justify-content:center; }
//                 .b-cover img { width:100%; height:100%; object-fit:cover; display:block; }
//                 .b-info { flex:1; min-width:0; }
//                 .b-title { font-size:13px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
//                 .b-cat  { font-size:10px; font-weight:600; color:#14b8a6; margin-top:1px; }
//                 .b-meta { font-size:10px; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px; }
//                 .b-status-pill { flex-shrink:0; font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; }
//                 .b-icon-btn { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .18s; background:none; }
//                 .b-icon-btn:disabled { opacity:.5; cursor:not-allowed; pointer-events:none; }
//                 .b-icon-btn.teal { border-color:#b2f5ea; background:#f0fdfa; color:#0d9488; }
//                 .b-icon-btn.teal:hover { background:#0d9488; color:white; border-color:#0d9488; }
//                 .b-icon-btn.red  { border-color:#fecaca; background:#fff5f5; color:#ef4444; }
//                 .b-icon-btn.red:hover  { background:#ef4444; color:white; border-color:#ef4444; }
//                 .b-refresh-btn { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:#0d9488; background:#f0fdfa; border:1px solid #b2f5ea; padding:5px 10px; border-radius:8px; cursor:pointer; transition:background .2s; }
//                 .b-refresh-btn:hover { background:#ccfbf1; }

//                 /* modals */
//                 .b-backdrop { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:12px; background:rgba(0,0,0,.52); backdrop-filter:blur(7px); }
//                 .b-modal { background:white; border-radius:18px; width:100%; max-width:560px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.22); animation:b-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
//                 .b-preview-modal { background:white; border-radius:18px; width:100%; max-width:480px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:b-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
//                 .b-modal-hdr { padding:14px 18px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; background:linear-gradient(135deg,#064e3b,#0f766e,#14b8a6); }
//                 .b-modal-hdr p  { color:rgba(255,255,255,.6); font-size:10px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 2px; }
//                 .b-modal-hdr h2 { font-size:15px; font-weight:700; color:white; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:420px; }
//                 .b-modal-close { width:28px; height:28px; border-radius:50%; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.15); flex-shrink:0; }
//                 .b-modal-close:hover { background:rgba(255,255,255,.28); }
//                 .b-modal-body { padding:14px 18px 18px; }

//                 .b-err { display:flex; align-items:flex-start; gap:7px; background:#fff5f5; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; line-height:1.5; }
//                 .b-ok  { display:flex; align-items:center; gap:7px; background:#f0fdfa; border:1px solid #b2f5ea; color:#0d9488; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
//                 .b-cancel-btn { flex:1; border:1.5px solid #e2e8f0; background:#f8fafc; color:#64748b; font-weight:600; font-size:13px; padding:9px; border-radius:9px; cursor:pointer; transition:background .2s; font-family:inherit; }
//                 .b-cancel-btn:hover { background:#f1f5f9; }

//                 .b-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:10px 22px; border-radius:100px; font-size:13px; font-weight:600; box-shadow:0 8px 30px rgba(13,148,136,.45); z-index:99999; display:flex; align-items:center; gap:7px; white-space:nowrap; animation:b-toast .4s ease both; pointer-events:none; }

//                 @media (max-width:480px) { .b-layout { padding:10px 10px 14px; gap:10px; } .b-body { padding:10px 12px 12px; } .b-card-hdr { padding:12px 14px; } }
//             `}</style>

//             <div className="b-root">
//                 {/* topbar */}
//                 <div className="b-topbar">
//                     <Link href="/admin/auth/dashboard"><ArrowLeft size={13} /> Dashboard</Link>
//                     <ChevronRight size={11} style={{ color: "#cbd5e1" }} />
//                     <span className="b-topbar-cur">Blogs</span>
//                 </div>

//                 <div className="b-layout">

//                     {/* ══ LEFT CARD ══ */}
//                     <div className="b-card">
//                         <div className="b-card-hdr">
//                             <div>
//                                 <h2>{activeTab === "manual" ? "Add Blog Post" : "Bulk Import via Excel"}</h2>
//                                 <p>{activeTab === "manual" ? "Publish a new article or health tip" : "Import multiple posts at once"}</p>
//                             </div>
//                             <BookOpen size={16} color="rgba(255,255,255,.7)" />
//                         </div>

//                         <div className="b-body">
//                             {/* tabs */}
//                             <div className="b-tabs">
//                                 <button className={`b-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
//                                     <FileText size={13} /> Manual Entry
//                                 </button>
//                                 <button className={`b-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
//                                     <FileSpreadsheet size={13} /> Bulk Import
//                                 </button>
//                             </div>

//                             {/* ══ MANUAL FORM ══ */}
//                             {activeTab === "manual" && (
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="b-row2">
//                                         <div className="b-field">
//                                             <label className="b-lbl">Blog Title</label>
//                                             <div className="b-inp-wrap">
//                                                 <div className="b-inp-icon"><Type size={13} /></div>
//                                                 <input type="text" className="b-inp" placeholder="e.g. Heart Health Tips" required
//                                                     value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
//                                             </div>
//                                         </div>
//                                         <div className="b-field">
//                                             <label className="b-lbl">Author Name</label>
//                                             <div className="b-inp-wrap">
//                                                 <div className="b-inp-icon"><User size={13} /></div>
//                                                 <input type="text" className="b-inp" placeholder="Dr. Anjali Sharma" required
//                                                     value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="b-field">
//                                         <label className="b-lbl"><Tag size={10} style={{ display: "inline", marginRight: 4 }} />Category</label>
//                                         <CatPills value={form.category} onChange={cat => setForm({ ...form, category: cat })} />
//                                     </div>
//                                     <div className="b-field">
//                                         <label className="b-lbl">Short Excerpt</label>
//                                         <div className="b-inp-wrap">
//                                             <div className="b-inp-icon top"><FileText size={13} /></div>
//                                             <textarea className="b-inp ta" placeholder="Shown as preview text on blog listing page..." required
//                                                 value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
//                                         </div>
//                                     </div>
//                                     <div className="b-field">
//                                         <label className="b-lbl">Full Content</label>
//                                         <div className="b-inp-wrap">
//                                             <div className="b-inp-icon top"><AlignLeft size={13} /></div>
//                                             <textarea className="b-inp ta ta-lg" placeholder="Write the full blog post here..." required
//                                                 value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
//                                         </div>
//                                     </div>
//                                     <div className="b-divider" />
//                                     <div className="b-field" style={{ marginBottom: 0 }}>
//                                         <label className="b-lbl"><ImagePlus size={10} style={{ display: "inline", marginRight: 4 }} />Cover Image <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(max 4MB)</span></label>
//                                         {!coverPreview ? (
//                                             <div className={`b-upload ${dragOver ? "drag" : ""}`}
//                                                 onDragOver={e => { e.preventDefault(); setDragOver(true); }}
//                                                 onDragLeave={() => setDragOver(false)}
//                                                 onDrop={e => { e.preventDefault(); setDragOver(false); handleCover(e.dataTransfer.files[0]); }}>
//                                                 <input type="file" accept="image/*" ref={coverRef} onChange={e => handleCover(e.target.files[0])} />
//                                                 <ImagePlus size={20} color="#14b8a6" />
//                                                 <div className="b-upload-t">Click or drag cover image</div>
//                                                 <div className="b-upload-s">JPG · PNG · WebP · max 4MB</div>
//                                             </div>
//                                         ) : (
//                                             <div className="b-img-prev">
//                                                 <img src={coverPreview} alt="cover" />
//                                                 <div className="b-img-overlay">
//                                                     <div className="b-prev-badge"><CheckCircle2 size={9} /> Cover ready</div>
//                                                     <button type="button" className="b-remove-btn" onClick={() => { setCoverFile(null); setCoverPreview(null); if (coverRef.current) coverRef.current.value = ""; }}>
//                                                         <X size={9} /> Remove
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                     {error && <div className="b-err" style={{ marginTop: 10 }}><X size={12} style={{ flexShrink: 0, marginTop: 1 }} /><span>{error}</span></div>}
//                                     <button type="submit" className="b-submit" disabled={loading}>
//                                         {loading ? <><Loader2 size={15} style={{ animation: "b-spin 1s linear infinite" }} /> Publishing...</> : <><Sparkles size={15} /> Publish Blog</>}
//                                     </button>
//                                 </form>
//                             )}

//                             {/* ══ BULK IMPORT ══ */}
//                             {activeTab === "bulk" && (
//                                 <div>
//                                     {/* Step 1 – template */}
//                                     <div style={{ background: "linear-gradient(135deg,#f0fdfa,#e6fef9)", border: "1px solid #b2f5ea", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
//                                         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
//                                             <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                                 <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>1</span>
//                                             </div>
//                                             <span style={{ fontWeight: 700, fontSize: 12, color: "#0d9488" }}>Download the Template</span>
//                                         </div>
//                                         <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px", lineHeight: 1.6 }}>
//                                             Fill columns: <b>title</b>, <b>author</b>, <b>category</b>, <b>excerpt</b>, <b>content</b>, <b>coverimage</b> (Cloudinary URL).
//                                         </p>
//                                         <button className="b-dl-btn" onClick={downloadTemplate}>
//                                             <Download size={12} /> Download Excel Template
//                                         </button>
//                                     </div>

//                                     {/* Step 2 – upload */}
//                                     <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//                                         <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                                             <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>2</span>
//                                         </div>
//                                         <span style={{ fontWeight: 700, fontSize: 12, color: "#0d9488" }}>Upload Filled Spreadsheet</span>
//                                     </div>

//                                     {!bulkFile ? (
//                                         <div className={`b-bulk-drop ${bulkDragOver ? "drag" : ""}`}
//                                             onDragOver={e => { e.preventDefault(); setBulkDragOver(true); }}
//                                             onDragLeave={() => setBulkDragOver(false)}
//                                             onDrop={e => { e.preventDefault(); setBulkDragOver(false); handleExcelFile(e.dataTransfer.files[0]); }}>
//                                             <input type="file" accept=".xlsx,.xls,.csv" onChange={e => handleExcelFile(e.target.files[0])} />
//                                             <div className="b-bulk-drop-icon"><FileSpreadsheet size={22} color="white" /></div>
//                                             <h3>Drop your Excel file here</h3>
//                                             <p>or click to browse · .xlsx · .xls · .csv</p>
//                                         </div>
//                                     ) : (
//                                         <div>
//                                             {/* file bar */}
//                                             <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdfa", border: "1px solid #b2f5ea", borderRadius: 9, padding: "8px 12px", marginBottom: 10 }}>
//                                                 <FileSpreadsheet size={15} color="#0d9488" />
//                                                 <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bulkFile.name}</span>
//                                                 <button onClick={resetBulk} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: 0 }}><X size={13} /></button>
//                                             </div>

//                                             {/* stats */}
//                                             {bulkRows.length > 0 && (
//                                                 <div className="b-bulk-stats">
//                                                     <div className="b-stat-chip" style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #b2f5ea" }}><Table2 size={11} /> {bulkRows.length} rows</div>
//                                                     <div className="b-stat-chip" style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #b2f5ea" }}><CheckCircle2 size={11} /> {validRows.length} valid</div>
//                                                     {invalidRows.length > 0 && <div className="b-stat-chip" style={{ background: "#fff5f5", color: "#ef4444", border: "1px solid #fecaca" }}><AlertCircle size={11} /> {invalidRows.length} invalid</div>}
//                                                 </div>
//                                             )}

//                                             {/* preview table */}
//                                             {bulkRows.length > 0 && (
//                                                 <>
//                                                     <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#0d9488", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
//                                                         <Eye size={11} /> Preview — click a row to inspect
//                                                     </div>
//                                                     <div className="b-table-wrap">
//                                                         <table className="b-table">
//                                                             <thead><tr>
//                                                                 <th>#</th><th>Status</th><th>Title</th><th>Author</th><th>Category</th><th>Cover URL</th>
//                                                             </tr></thead>
//                                                             <tbody>
//                                                                 {bulkRows.map((row, i) => (
//                                                                     <tr key={i} className={row.valid ? "" : "err-row"} style={{ cursor: "pointer" }} onClick={() => setPreviewRow(row)}>
//                                                                         <td style={{ color: "#94a3b8", fontSize: 10 }}>{i + 1}</td>
//                                                                         <td>{row.valid ? <span className="b-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="b-bdg err"><X size={8} /> Error</span>}</td>
//                                                                         <td style={{ fontWeight: 600, color: "#0f172a" }}>{row.title || <span style={{ color: "#cbd5e1" }}>—</span>}</td>
//                                                                         <td style={{ color: "#64748b" }}>{row.author || "—"}</td>
//                                                                         <td><span className="b-bdg ok">{row.category}</span></td>
//                                                                         <td>{row.coverImage ? <a className="b-url" href={row.coverImage} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{row.coverImage}</a> : <span style={{ color: "#fca5a5", fontSize: 10 }}>missing</span>}</td>
//                                                                     </tr>
//                                                                 ))}
//                                                             </tbody>
//                                                         </table>
//                                                     </div>

//                                                     {/* validation issues */}
//                                                     {invalidRows.length > 0 && (
//                                                         <div style={{ marginTop: 10, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 12px" }}>
//                                                             <div style={{ fontWeight: 700, fontSize: 11, color: "#ef4444", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} /> Validation Issues</div>
//                                                             {invalidRows.map((row, i) => (
//                                                                 <div key={i} style={{ fontSize: 10, color: "#ef4444", marginBottom: 4 }}>
//                                                                     <b>"{row.title || "untitled"}":</b> {row.errors.join("; ")}
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     )}
//                                                 </>
//                                             )}

//                                             {/* parse errors */}
//                                             {bulkErrors.filter(() => !bulkDone).map((err, i) => (
//                                                 <div key={i} className="b-err" style={{ marginTop: 8 }}><AlertCircle size={12} /> {err}</div>
//                                             ))}

//                                             {/* progress */}
//                                             {bulkImporting && (
//                                                 <div style={{ marginTop: 10 }}>
//                                                     <div style={{ fontSize: 11, color: "#0d9488", fontWeight: 600, marginBottom: 4 }}>Importing {bulkProgress.done} / {bulkProgress.total}...</div>
//                                                     <div className="b-progress-bar"><div className="b-progress-fill" style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} /></div>
//                                                 </div>
//                                             )}

//                                             {/* done */}
//                                             {bulkDone && (
//                                                 <div className="b-ok" style={{ marginTop: 10 }}>
//                                                     <CheckCircle2 size={13} />
//                                                     <span>Imported {validRows.length - bulkErrors.length} of {validRows.length} posts!{bulkErrors.length > 0 && ` (${bulkErrors.length} failed)`}</span>
//                                                 </div>
//                                             )}

//                                             {!bulkDone && validRows.length > 0 && (
//                                                 <button className="b-submit" style={{ marginTop: 14 }} disabled={bulkImporting} onClick={handleBulkImport}>
//                                                     {bulkImporting
//                                                         ? <><Loader2 size={15} style={{ animation: "b-spin 1s linear infinite" }} /> Importing {bulkProgress.done}/{bulkProgress.total}...</>
//                                                         : <><Upload size={15} /> Import {validRows.length} Post{validRows.length !== 1 ? "s" : ""} <ChevronRight size={13} /></>}
//                                                 </button>
//                                             )}
//                                             {bulkDone && (
//                                                 <button className="b-submit" style={{ marginTop: 10 }} onClick={resetBulk}>
//                                                     <RefreshCw size={14} /> Import Another File
//                                                 </button>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* ══ RIGHT CARD: BLOGS LIST ══ */}
//                     <div className="b-card">
//                         <div className="b-list-hdr">
//                             <div>
//                                 <h3>All Blog Posts</h3>
//                                 <p>{blogs.length} post{blogs.length !== 1 ? "s" : ""} published</p>
//                             </div>
//                             <button className="b-refresh-btn" onClick={fetchBlogs} disabled={listLoading}>
//                                 <RefreshCw size={11} style={listLoading ? { animation: "b-spin 1s linear infinite" } : {}} /> Refresh
//                             </button>
//                         </div>
//                         <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
//                             {listLoading ? (
//                                 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
//                                     <Loader2 style={{ width: 24, height: 24, color: "#14b8a6", animation: "b-spin 1s linear infinite" }} />
//                                 </div>
//                             ) : blogs.length === 0 ? (
//                                 <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 12 }}>No blog posts yet.</div>
//                             ) : (
//                                 blogs.map(blog => (
//                                     <div key={blog.id} className="b-row">
//                                         <div className="b-cover">
//                                             {blog.coverImage
//                                                 ? <img src={`${API_BLOGS}/${blog.id}/cover`} alt={blog.title} onError={e => { e.target.style.display = "none"; }} />
//                                                 : <BookOpen size={16} color="#0d9488" />}
//                                         </div>
//                                         <div className="b-info">
//                                             <div className="b-title">{blog.title}</div>
//                                             <div className="b-cat">{blog.category || "Uncategorized"}</div>
//                                             <div className="b-meta">
//                                                 {blog.author && <span>✍️ {blog.author}</span>}
//                                                 {blog.createdAt && <span style={{ marginLeft: 6 }}>📅 {formatDate(blog.createdAt)}</span>}
//                                             </div>
//                                         </div>
//                                         <span className="b-status-pill" style={{ background: blog.status === "published" ? "#f0fdfa" : "#f8fafc", color: blog.status === "published" ? "#0d9488" : "#64748b", border: `1px solid ${blog.status === "published" ? "#b2f5ea" : "#e2e8f0"}` }}>
//                                             {blog.status || "draft"}
//                                         </span>
//                                         <button className="b-icon-btn teal" title="Edit" onClick={() => openEdit(blog)}><Pencil size={12} /></button>
//                                         <button className="b-icon-btn red" title="Delete" disabled={deletingId === blog.id} onClick={() => handleDelete(blog.id)}>
//                                             {deletingId === blog.id ? <Loader2 size={12} style={{ animation: "b-spin 1s linear infinite" }} /> : <Trash2 size={12} />}
//                                         </button>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 </div>
//                 <Footer />
//             </div>

//             {/* ══ ROW PREVIEW MODAL ══ */}
//             {previewRow && (
//                 <div className="b-backdrop" onClick={() => setPreviewRow(null)}>
//                     <div className="b-preview-modal" onClick={e => e.stopPropagation()}>
//                         <div className="b-modal-hdr">
//                             <div style={{ minWidth: 0 }}><p>Row Preview</p><h2>{previewRow.title || "Untitled"}</h2></div>
//                             <button className="b-modal-close" onClick={() => setPreviewRow(null)}><X size={13} /></button>
//                         </div>
//                         <div className="b-modal-body">
//                             {previewRow.coverImage && (
//                                 <img src={previewRow.coverImage} alt="cover"
//                                     style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginBottom: 10, display: "block" }}
//                                     onError={e => { e.target.style.display = "none"; }} />
//                             )}
//                             <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
//                                 <span className="b-bdg ok">{previewRow.category}</span>
//                                 <span className="b-bdg ok" style={{ background: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}>✍️ {previewRow.author}</span>
//                                 {previewRow.valid ? <span className="b-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="b-bdg err"><X size={8} /> Has errors</span>}
//                             </div>
//                             <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>Excerpt</p>
//                             <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>{previewRow.excerpt}</p>
//                             <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>Content preview</p>
//                             <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px", maxHeight: 80, overflow: "hidden" }}>
//                                 {previewRow.content?.slice(0, 300)}{previewRow.content?.length > 300 ? "…" : ""}
//                             </p>
//                             {previewRow.errors.length > 0 && (
//                                 <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", marginBottom: 10 }}>
//                                     {previewRow.errors.map((err, i) => <div key={i} style={{ fontSize: 11, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={10} /> {err}</div>)}
//                                 </div>
//                             )}
//                             <button className="b-cancel-btn" style={{ marginTop: 6, width: "100%" }} onClick={() => setPreviewRow(null)}>Close</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ══ EDIT MODAL ══ */}
//             {editBlog && (
//                 <div className="b-backdrop" onClick={closeEdit}>
//                     <div className="b-modal" onClick={e => e.stopPropagation()}>
//                         <div className="b-modal-hdr">
//                             <div style={{ minWidth: 0 }}><p>Editing Blog Post</p><h2>{editBlog.title}</h2></div>
//                             <button className="b-modal-close" onClick={closeEdit}><X size={13} /></button>
//                         </div>
//                         <div className="b-modal-body">
//                             <form onSubmit={handleEditSubmit}>
//                                 <div className="b-row2">
//                                     <div className="b-field">
//                                         <label className="b-lbl">Blog Title</label>
//                                         <div className="b-inp-wrap"><div className="b-inp-icon"><Type size={13} /></div>
//                                             <input type="text" className="b-inp" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
//                                         </div>
//                                     </div>
//                                     <div className="b-field">
//                                         <label className="b-lbl">Author Name</label>
//                                         <div className="b-inp-wrap"><div className="b-inp-icon"><User size={13} /></div>
//                                             <input type="text" className="b-inp" required value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="b-field">
//                                     <label className="b-lbl">Category</label>
//                                     <CatPills value={editForm.category} onChange={cat => setEditForm({ ...editForm, category: cat })} />
//                                 </div>
//                                 <div className="b-field">
//                                     <label className="b-lbl">Short Excerpt</label>
//                                     <div className="b-inp-wrap"><div className="b-inp-icon top"><FileText size={13} /></div>
//                                         <textarea className="b-inp ta" value={editForm.excerpt} onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })} />
//                                     </div>
//                                 </div>
//                                 <div className="b-field">
//                                     <label className="b-lbl">Full Content</label>
//                                     <div className="b-inp-wrap"><div className="b-inp-icon top"><AlignLeft size={13} /></div>
//                                         <textarea className="b-inp ta ta-lg" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
//                                     </div>
//                                 </div>
//                                 <div className="b-field">
//                                     <label className="b-lbl">Replace Cover <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional · max 4MB)</span></label>
//                                     {editCoverPreview ? (
//                                         <div className="b-img-prev">
//                                             <img src={editCoverPreview} alt="new cover" />
//                                             <div className="b-img-overlay">
//                                                 <div className="b-prev-badge"><CheckCircle2 size={9} /> New cover</div>
//                                                 <button type="button" className="b-remove-btn" onClick={() => { setEditCoverFile(null); setEditCoverPreview(null); if (editCoverRef.current) editCoverRef.current.value = ""; }}>
//                                                     <X size={9} /> Remove
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <div className="b-upload" style={{ padding: "10px 12px" }}>
//                                             <input type="file" accept="image/*" ref={editCoverRef} onChange={e => handleEditCover(e.target.files[0])} />
//                                             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#0d9488", fontSize: 12, fontWeight: 600 }}><ImagePlus size={14} /> Click to upload new cover</div>
//                                             <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Leave empty to keep existing</p>
//                                         </div>
//                                     )}
//                                 </div>
//                                 {editError && <div className="b-err"><X size={12} style={{ flexShrink: 0, marginTop: 1 }} /><span>{editError}</span></div>}
//                                 {editSuccess && <div className="b-ok"><CheckCircle2 size={12} /> Updated successfully!</div>}
//                                 <div style={{ display: "flex", gap: 10 }}>
//                                     <button type="button" className="b-cancel-btn" onClick={closeEdit}>Cancel</button>
//                                     <button type="submit" className="b-submit" disabled={editLoading} style={{ flex: 2, marginTop: 0, padding: "9px" }}>
//                                         {editLoading ? <><Loader2 size={13} style={{ animation: "b-spin 1s linear infinite" }} /> Saving...</> : <><Save size={13} /> Save Changes</>}
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {success && <div className="b-toast"><CheckCircle2 size={16} /> Blog published successfully!</div>}
//         </>
//     );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
    BookOpen, Type, AlignLeft, CheckCircle2, Loader2,
    Sparkles, X, Trash2, User, ImagePlus, RefreshCw, ArrowLeft,
    ChevronRight, Tag, Pencil, Save, FileText, FileSpreadsheet,
    Download, AlertCircle, Table2, Upload, Eye, Plus,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

const API_AUTH = "http://localhost:4000/api/auth";
const API_BLOGS = "http://localhost:4000/api/blogs";

const BLOG_CATEGORIES = [
    "Health", "Medical Services", "Cardiology", "Neurology",
    "Orthopedics", "Pediatrics", "Dermatology", "Research", "Uncategorized",
];

// ─────────────────────────────────────────
// Parse plain content text → sections[]
// Supports: ## Heading, **Heading**, ALL CAPS
// ─────────────────────────────────────────
function contentToSections(raw) {
    if (!raw || !raw.trim()) return [];
    const lines = raw.split(/\r?\n/);
    const sections = [];
    let current = null;

    const isHeading = (line) => {
        const t = line.trim();
        if (!t) return false;
        if (t.startsWith("## ") || t.startsWith("# ")) return true;
        if (t.startsWith("**") && t.endsWith("**") && t.length > 4) return true;
        if (t.length >= 4 && t === t.toUpperCase() && /[A-Z]/.test(t) && !/[a-z]/.test(t)) return true;
        return false;
    };

    const cleanHeading = (line) => {
        let t = line.trim();
        t = t.replace(/^##?\s*/, "");
        t = t.replace(/^\*\*|\*\*$/g, "");
        return t.trim();
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) { if (current) current.bodyLines.push(""); continue; }
        if (isHeading(trimmed)) {
            if (current) sections.push(current);
            current = { heading: cleanHeading(trimmed), bodyLines: [] };
        } else {
            if (!current) current = { heading: "", bodyLines: [] };
            current.bodyLines.push(trimmed);
        }
    }
    if (current) sections.push(current);

    return sections.map(s => ({
        id: "",
        heading: s.heading,
        subheading: "",
        body: s.bodyLines.join(" ").replace(/\s+/g, " ").trim(),
        items: [],
        divider: false,
    })).filter(s => s.heading || s.body);
}

function sectionsToContent(sections) {
    return sections.map(s => {
        let out = "";
        if (s.heading) out += `## ${s.heading}\n`;
        if (s.body) out += `${s.body}\n`;
        if (s.items && s.items.length) out += s.items.map(i => `- ${i}`).join("\n") + "\n";
        return out.trim();
    }).join("\n\n");
}

const emptySection = () => ({ heading: "", subheading: "", body: "", items: [], _itemsText: "", divider: false });

// ─────────────────────────────────────────
// Excel helpers
// ─────────────────────────────────────────
function findHeaderRow(ws) {
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z100");
    for (let r = range.s.r; r <= Math.min(range.e.r, 10); r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
            const cell = ws[XLSX.utils.encode_cell({ r, c })];
            if (cell && String(cell.v ?? "").toLowerCase().trim() === "title") return r;
        }
    }
    return 0;
}

function parseWorksheet(ws) {
    const headerRow = findHeaderRow(ws);
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1:Z1000");
    const headers = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
        const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c })];
        headers.push(cell ? String(cell.v ?? "").trim() : `col_${c}`);
    }
    let dataStart = headerRow + 1;
    const titleIdx = headers.findIndex(h => h.toLowerCase() === "title");
    if (titleIdx >= 0) {
        const hintCell = ws[XLSX.utils.encode_cell({ r: dataStart, c: titleIdx })];
        const hintVal = hintCell ? String(hintCell.v ?? "").toLowerCase() : "";
        if (hintVal.startsWith("e.g.") || hintVal.includes("cloudinary")) dataStart++;
    }
    const rows = [];
    for (let r = dataStart; r <= range.e.r; r++) {
        const obj = {}; let hasVal = false;
        for (let c = range.s.c; c <= range.e.c; c++) {
            const cell = ws[XLSX.utils.encode_cell({ r, c })];
            const val = cell ? String(cell.v ?? "").trim() : "";
            obj[headers[c] || `col_${c}`] = val;
            if (val) hasVal = true;
        }
        if (hasVal) rows.push(obj);
    }
    return rows;
}

function parseBlogRow(row) {
    const norm = s => s.toLowerCase().replace(/[\s_]+/g, "");
    const get = key => {
        const match = Object.keys(row).find(k => norm(k) === norm(key));
        return match ? String(row[match] ?? "").trim() : "";
    };
    const title = get("title");
    const author = get("author");
    const category = get("category");
    const excerpt = get("excerpt") || get("shortexcerpt");
    const content = get("content") || get("fullcontent");
    const coverImage = get("coverimage") || get("cover") || get("coverurl") || get("imageurl") || "";

    if (title.toLowerCase().startsWith("e.g.") || title.toLowerCase() === "title" || !title) return null;

    const errors = [];
    if (!author) errors.push("Author is required");
    if (!excerpt) errors.push("Excerpt is required");
    if (!content) errors.push("Content is required");
    if (!coverImage || !coverImage.startsWith("http")) errors.push("Cover image URL required (must start with http)");

    const resolvedCat = BLOG_CATEGORIES.includes(category) ? category : "Uncategorized";
    if (category && !BLOG_CATEGORIES.includes(category))
        errors.push(`Unknown category "${category}" — will save as "Uncategorized"`);

    const sections = contentToSections(content);

    return { title, author, category: resolvedCat, excerpt, content, sections, coverImage, errors, valid: errors.length === 0 };
}

// ─────────────────────────────────────────
// Top-level components (must be outside default export)
// ─────────────────────────────────────────
function CatPills({ value, onChange }) {
    return (
        <div className="b-cat-row">
            {BLOG_CATEGORIES.map(cat => (
                <button key={cat} type="button" className={`b-cat-pill ${value === cat ? "sel" : ""}`} onClick={() => onChange(cat)}>{cat}</button>
            ))}
        </div>
    );
}

function SectionsEditor({ arr, setArr }) {
    const updateSection = (idx, key, val) =>
        setArr(arr.map((s, i) => i === idx ? { ...s, [key]: val } : s));
    const addSection = () => setArr([...arr, emptySection()]);
    const removeSection = (idx) => setArr(arr.filter((_, i) => i !== idx));

    return (
        <div className="b-sections">
            {arr.map((sec, idx) => (
                <div key={idx} className="b-sec-card">
                    <div className="b-sec-header">
                        <div className="b-sec-num">{idx + 1}</div>
                        <span className="b-sec-label">Section {idx + 1}</span>
                        <div style={{ flex: 1 }} />
                        {arr.length > 1 && (
                            <button type="button" className="b-sec-del" onClick={() => removeSection(idx)}>
                                <X size={11} />
                            </button>
                        )}
                    </div>
                    <div className="b-field" style={{ marginBottom: 8 }}>
                        <label className="b-lbl">Heading</label>
                        <input type="text" className="b-inp b-inp-plain" placeholder="e.g. The Road to Recovery"
                            value={sec.heading} onChange={e => updateSection(idx, "heading", e.target.value)} />
                    </div>
                    <div className="b-field" style={{ marginBottom: 8 }}>
                        <label className="b-lbl">Body Text</label>
                        <textarea className="b-inp b-inp-plain ta" placeholder="Write paragraph content here..."
                            value={sec.body} onChange={e => updateSection(idx, "body", e.target.value)} style={{ minHeight: 72 }} />
                    </div>
                    <div className="b-field" style={{ marginBottom: 0 }}>
                        <label className="b-lbl">Bullet Points <span style={{ color: "#94a3b8", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>(optional — one per line)</span></label>
                        <textarea className="b-inp b-inp-plain ta" placeholder={"Rest for 24 hours\nApply ice pack\nAvoid heavy lifting"}
                            value={sec._itemsText || ""} onChange={e => updateSection(idx, "_itemsText", e.target.value)} style={{ minHeight: 60 }} />
                    </div>
                </div>
            ))}
            <button type="button" className="b-add-sec" onClick={addSection}>
                <Plus size={13} /> Add Another Section
            </button>
        </div>
    );
}

export default function AdminBlogs() {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [activeTab, setActiveTab] = useState("manual");

    // manual form
    const [form, setForm] = useState({ title: "", author: "", category: "", excerpt: "" });
    const [sections, setSections] = useState([emptySection()]);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const coverRef = useRef(null);

    // bulk
    const [bulkFile, setBulkFile] = useState(null);
    const [bulkRows, setBulkRows] = useState([]);
    const [bulkDragOver, setBulkDragOver] = useState(false);
    const [bulkImporting, setBulkImporting] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0 });
    const [bulkErrors, setBulkErrors] = useState([]);
    const [bulkDone, setBulkDone] = useState(false);
    const [previewRow, setPreviewRow] = useState(null);

    // list
    const [blogs, setBlogs] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // edit
    const [editBlog, setEditBlog] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", author: "", category: "", excerpt: "" });
    const [editSections, setEditSections] = useState([emptySection()]);
    const [editCoverFile, setEditCoverFile] = useState(null);
    const [editCoverPreview, setEditCoverPreview] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState(false);
    const editCoverRef = useRef(null);

    useEffect(() => {
        (async () => {
            try { await axios.get(`${API_AUTH}/me`, { withCredentials: true }); }
            catch { router.push("/admin/auth/login"); }
            finally { setChecking(false); }
        })();
    }, []);

    const fetchBlogs = async () => {
        setListLoading(true);
        try { const res = await axios.get(API_BLOGS, { withCredentials: true }); setBlogs(res.data); }
        catch (err) { console.error("Fetch blogs:", err); }
        finally { setListLoading(false); }
    };
    useEffect(() => { if (!checking) fetchBlogs(); }, [checking]);

    const handleCover = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) { setError("Please select a valid image."); return; }
        if (file.size > 4 * 1024 * 1024) { setError("Image too large — max 4MB."); return; }
        setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); setError("");
    };
    const handleEditCover = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) { setEditError("Please select a valid image."); return; }
        if (file.size > 4 * 1024 * 1024) { setEditError("Image too large — max 4MB."); return; }
        setEditCoverFile(file); setEditCoverPreview(URL.createObjectURL(file)); setEditError("");
    };
    const convertToBase64 = (file) => new Promise((res, rej) => {
        const r = new FileReader(); r.readAsDataURL(file);
        r.onload = () => res(r.result); r.onerror = rej;
    });


    const prepareSections = (arr) => arr.map(s => ({
        heading: s.heading.trim(),
        subheading: s.subheading?.trim() || "",
        body: s.body.trim(),
        items: (s._itemsText || "").split("\n").map(l => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean),
        divider: s.divider || false,
    })).filter(s => s.heading || s.body || s.items.length);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError("");
        try {
            const preparedSections = prepareSections(sections);
            const payload = { ...form, sections: preparedSections, content: sectionsToContent(preparedSections) };
            if (coverFile) payload.coverImage = await convertToBase64(coverFile);
            await axios.post(API_BLOGS, payload, { withCredentials: true, headers: { "Content-Type": "application/json" }, maxBodyLength: Infinity });
            setSuccess(true);
            setForm({ title: "", author: "", category: "", excerpt: "" });
            setSections([emptySection()]);
            setCoverFile(null); setCoverPreview(null);
            if (coverRef.current) coverRef.current.value = "";
            setTimeout(() => setSuccess(false), 3500);
            fetchBlogs();
        } catch (err) {
            setError(err?.response?.data?.message || (err?.response?.status === 413 ? "File too large." : null) || err?.message || "Upload failed.");
        } finally { setLoading(false); }
    };

    const handleExcelFile = (file) => {
        if (!file) return;
        setBulkFile(file); setBulkRows([]); setBulkErrors([]); setBulkDone(false);
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const wb = XLSX.read(ev.target.result, { type: "array" });
                const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes("blog")) || wb.SheetNames[0];
                const ws = wb.Sheets[sheetName];
                const raw = parseWorksheet(ws);
                if (!raw.length) { setBulkErrors(["No data rows found."]); return; }
                const parsed = raw.map(parseBlogRow).filter(Boolean);
                if (!parsed.length) { setBulkErrors(["All rows were skipped — please fill real data."]); return; }
                setBulkRows(parsed);
            } catch (err) { setBulkErrors([`Parse error: ${err.message}`]); }
        };
        reader.readAsArrayBuffer(file);
    };

    const validRows = bulkRows.filter(r => r.valid);
    const invalidRows = bulkRows.filter(r => !r.valid);

    const handleBulkImport = async () => {
        if (!validRows.length) return;
        setBulkImporting(true); setBulkProgress({ done: 0, total: validRows.length });
        const errs = [];
        for (let i = 0; i < validRows.length; i++) {
            const row = validRows[i];
            try {
                await axios.post(API_BLOGS, {
                    title: row.title, author: row.author, category: row.category,
                    excerpt: row.excerpt, content: row.content,
                    sections: row.sections,
                    coverImage: row.coverImage, useUrl: true,
                }, { withCredentials: true, headers: { "Content-Type": "application/json" } });
            } catch (err) {
                errs.push(`Row ${i + 1} ("${row.title}"): ${err?.response?.data?.message || err.message}`);
            }
            setBulkProgress({ done: i + 1, total: validRows.length });
        }
        setBulkErrors(errs); setBulkImporting(false); setBulkDone(true);
        fetchBlogs();
    };

    const resetBulk = () => { setBulkFile(null); setBulkRows([]); setBulkErrors([]); setBulkDone(false); setBulkImporting(false); };

    const downloadTemplate = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([
            ["title", "author", "category", "excerpt", "content", "coverimage"],
            [
                "e.g. 5 Warning Signs of Heart Disease",
                "Dr. Anjali Sharma",
                "Cardiology",
                "Short preview text shown on listing page...",
                "## The Road to Recovery\nSurgery is just the beginning. Here is what to expect.\n\n## First 24 Hours\nRest is paramount. Pain is normal — medication will help.\n\n## Wound Care\nKeep wound dry for 48 hours. Watch for redness or swelling.",
                "https://res.cloudinary.com/your-cloud/image/upload/cover.jpg"
            ],
        ]);
        ws["!cols"] = [{ wch: 42 }, { wch: 22 }, { wch: 18 }, { wch: 48 }, { wch: 80 }, { wch: 60 }];
        XLSX.utils.book_append_sheet(wb, ws, "Blog Import");
        XLSX.writeFile(wb, "blog_bulk_import_template.xlsx");
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this blog post? This cannot be undone.")) return;
        setDeletingId(id);
        try { await axios.delete(`${API_BLOGS}/${id}`, { withCredentials: true }); setBlogs(prev => prev.filter(b => b.id !== id)); }
        catch (err) { alert(err?.response?.data?.message || "Failed to delete."); }
        finally { setDeletingId(null); }
    };

    const openEdit = (blog) => {
        setEditBlog(blog);
        setEditForm({ title: blog.title || "", author: blog.author || "", category: blog.category || "", excerpt: blog.excerpt || "" });
        if (Array.isArray(blog.sections) && blog.sections.length > 0) {
            setEditSections(blog.sections.map(s => ({ ...emptySection(), ...s, _itemsText: Array.isArray(s.items) ? s.items.join("\n") : "" })));
        } else if (blog.content) {
            const parsed = contentToSections(blog.content);
            setEditSections(parsed.length ? parsed.map(s => ({ ...s, _itemsText: s.items?.join("\n") || "" })) : [emptySection()]);
        } else {
            setEditSections([emptySection()]);
        }
        setEditCoverFile(null); setEditCoverPreview(null); setEditError(""); setEditSuccess(false);
    };
    const closeEdit = () => { setEditBlog(null); setEditError(""); setEditSuccess(false); };

    const handleEditSubmit = async (e) => {
        e.preventDefault(); setEditLoading(true); setEditError("");
        try {
            const preparedSections = prepareSections(editSections);
            const payload = { ...editForm, sections: preparedSections, content: sectionsToContent(preparedSections) };
            if (editCoverFile) payload.coverImage = await convertToBase64(editCoverFile);
            await axios.patch(`${API_BLOGS}/${editBlog.id}`, payload, { withCredentials: true, headers: { "Content-Type": "application/json" }, maxBodyLength: Infinity });
            setBlogs(prev => prev.map(b => b.id === editBlog.id ? { ...b, ...editForm } : b));
            setEditSuccess(true);
            setTimeout(() => { setEditSuccess(false); closeEdit(); }, 1800);
        } catch (err) {
            setEditError(err?.response?.data?.message || (err?.response?.status === 413 ? "File too large." : null) || err?.message || "Update failed.");
        } finally { setEditLoading(false); }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

    if (checking) return (
        <div style={{ minHeight: "100vh", background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 style={{ width: 28, height: 28, color: "#14b8a6", animation: "b-spin 1s linear infinite" }} />
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes b-spin  { to { transform: rotate(360deg); } }
                @keyframes b-modal { from { opacity:0; transform:scale(.96) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes b-toast { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
                @keyframes b-fade  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

                .b-root *,.b-root *::before,.b-root *::after { box-sizing:border-box; }
                .b-root { min-height:100vh; background:#f0fdfa; font-family:'Satoshi',system-ui,sans-serif; }

                .b-topbar { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-bottom:1px solid rgba(20,184,166,.12); padding:10px 20px; }
                .b-topbar a { display:flex; align-items:center; gap:5px; font-size:12px; font-weight:600; color:#64748b; text-decoration:none; }
                .b-topbar a:hover { color:#0d9488; }
                .b-topbar-cur { font-size:12px; font-weight:600; color:#0d9488; }

                .b-layout { display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:1100px; margin:0 auto; padding:14px 14px 20px; align-items:start; }
                @media (max-width:820px) { .b-layout { grid-template-columns:1fr; } }

                .b-card { background:white; border-radius:16px; border:1px solid rgba(20,184,166,.12); box-shadow:0 4px 20px rgba(13,148,136,.1); overflow:hidden; display:flex; flex-direction:column; }
                .b-card-hdr { background:linear-gradient(135deg,#064e3b 0%,#0f766e 50%,#14b8a6 100%); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; }
                .b-card-hdr h2 { font-size:14px; font-weight:700; color:white; margin:0; }
                .b-card-hdr p  { font-size:11px; color:rgba(255,255,255,.6); margin:2px 0 0; }
                .b-body { padding:14px 16px 16px; flex:1; overflow-y:auto; }

                .b-tabs { display:flex; border-bottom:2px solid rgba(20,184,166,.1); margin-bottom:14px; }
                .b-tab { flex:1; padding:9px 10px; font-size:12px; font-weight:700; cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; gap:6px; color:#94a3b8; border-bottom:2px solid transparent; margin-bottom:-2px; transition:all .2s; font-family:inherit; }
                .b-tab.active { color:#0d9488; border-bottom-color:#14b8a6; background:linear-gradient(180deg,transparent,rgba(20,184,166,.04)); }
                .b-tab:hover:not(.active) { color:#0d9488; background:rgba(20,184,166,.04); }

                .b-row2 { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                @media (max-width:480px) { .b-row2 { grid-template-columns:1fr; } }
                .b-field { margin-bottom:10px; }
                .b-lbl { display:block; font-size:10px; font-weight:700; letter-spacing:.7px; text-transform:uppercase; color:#0d9488; margin-bottom:4px; }
                .b-inp-wrap { position:relative; }
                .b-inp-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; display:flex; align-items:center; }
                .b-inp-icon.top { top:10px; transform:none; }
                .b-inp-wrap:focus-within .b-inp-icon { color:#14b8a6; }
                .b-inp { width:100%; padding:8px 10px 8px 32px; border:1.5px solid #e2f4f2; border-radius:9px; font-size:13px; color:#0f172a; background:#fafffe; outline:none; transition:border-color .2s,box-shadow .2s; font-family:inherit; }
                .b-inp-plain { padding:8px 10px; }
                .b-inp:focus,.b-inp-plain:focus { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.1); background:white; }
                .b-inp::placeholder,.b-inp-plain::placeholder { color:#b0cec9; }
                .b-inp.ta { min-height:72px; resize:vertical; line-height:1.5; padding-top:9px; }

                /* Sections Editor */
                .b-sections { display:flex; flex-direction:column; gap:10px; }
                .b-sec-card { background:#f8fffd; border:1.5px solid #e2f4f2; border-radius:12px; padding:12px 14px; }
                .b-sec-card:focus-within { border-color:#14b8a6; box-shadow:0 0 0 3px rgba(20,184,166,.08); }
                .b-sec-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
                .b-sec-num { width:20px; height:20px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:900; color:white; flex-shrink:0; }
                .b-sec-label { font-size:11px; font-weight:700; color:#0d9488; }
                .b-sec-del { width:22px; height:22px; border-radius:6px; border:1.5px solid #fecaca; background:#fff5f5; color:#ef4444; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }
                .b-sec-del:hover { background:#ef4444; color:white; }
                .b-add-sec { width:100%; padding:10px; border:1.5px dashed rgba(20,184,166,.4); border-radius:10px; background:transparent; color:#0d9488; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all .2s; font-family:inherit; margin-top:4px; }
                .b-add-sec:hover { background:#f0fdfa; border-color:#14b8a6; border-style:solid; }

                .b-sec-preview { background:#f0fdfa; border-left:3px solid #14b8a6; padding:6px 10px; border-radius:0 6px 6px 0; margin-bottom:5px; font-size:11px; }
                .b-sec-preview-h { font-weight:700; color:#0d9488; }
                .b-sec-preview-b { color:#64748b; margin-top:2px; }

                .b-cat-row { display:flex; gap:5px; flex-wrap:wrap; margin-top:6px; }
                .b-cat-pill { padding:4px 10px; border-radius:100px; font-size:10px; font-weight:700; cursor:pointer; transition:all .15s; border:1.5px solid #e2f4f2; background:#fafffe; color:#64748b; }
                .b-cat-pill.sel { background:#14b8a6; color:white; border-color:#14b8a6; }
                .b-cat-pill:hover:not(.sel) { border-color:#14b8a6; color:#0d9488; }

                .b-upload { border:1.5px dashed rgba(20,184,166,.35); border-radius:10px; padding:14px 10px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; overflow:hidden; }
                .b-upload:hover,.b-upload.drag { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
                .b-upload input[type="file"] { position:absolute; inset:0; opacity:0; cursor:pointer; z-index:2; width:100%; height:100%; }
                .b-upload-t { font-size:12px; font-weight:600; color:#0d9488; margin-top:6px; }
                .b-upload-s { font-size:10px; color:#94a3b8; margin-top:2px; }
                .b-img-prev { position:relative; border-radius:10px; overflow:hidden; }
                .b-img-prev img { width:100%; height:130px; object-fit:cover; display:block; }
                .b-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.45),transparent); display:flex; align-items:flex-end; justify-content:space-between; padding:6px 8px; }
                .b-prev-badge { font-size:10px; font-weight:600; color:white; background:rgba(255,255,255,.2); backdrop-filter:blur(6px); padding:2px 8px; border-radius:100px; display:flex; align-items:center; gap:4px; }
                .b-remove-btn { font-size:10px; font-weight:600; color:white; background:rgba(239,68,68,.85); padding:3px 8px; border-radius:100px; border:none; cursor:pointer; display:flex; align-items:center; gap:3px; }

                .b-divider { height:1px; background:linear-gradient(90deg,transparent,#e2f4f2,transparent); margin:10px 0; }
                .b-submit { width:100%; padding:11px; background:linear-gradient(135deg,#064e3b 0%,#0f766e 40%,#14b8a6 100%); color:white; border:none; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .2s; box-shadow:0 4px 16px rgba(20,184,166,.35); margin-top:10px; font-family:inherit; }
                .b-submit:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 24px rgba(20,184,166,.45); }
                .b-submit:disabled { opacity:.7; cursor:not-allowed; }

                .b-bulk-drop { border:2px dashed rgba(20,184,166,.35); border-radius:14px; padding:28px 20px; text-align:center; background:linear-gradient(135deg,#f0fdfa,#fafffd); cursor:pointer; transition:all .2s; position:relative; }
                .b-bulk-drop.drag,.b-bulk-drop:hover { border-color:#14b8a6; border-style:solid; background:#e6fef9; }
                .b-bulk-drop input { position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%; z-index:2; }
                .b-bulk-drop-icon { width:44px; height:44px; background:linear-gradient(135deg,#064e3b,#14b8a6); border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
                .b-bulk-drop h3 { font-size:14px; font-weight:700; color:#0d9488; margin:0 0 4px; }
                .b-bulk-drop p  { font-size:11px; color:#64748b; margin:0; }
                .b-dl-btn { display:inline-flex; align-items:center; gap:6px; background:white; border:1.5px solid #b2f5ea; color:#0d9488; font-size:11px; font-weight:700; padding:7px 14px; border-radius:8px; cursor:pointer; margin-top:10px; transition:all .2s; font-family:inherit; }
                .b-dl-btn:hover { background:#f0fdfa; border-color:#14b8a6; transform:translateY(-1px); }

                .b-table-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(20,184,166,.15); margin-top:12px; animation:b-fade .3s ease both; }
                .b-table { width:100%; border-collapse:collapse; font-size:11px; }
                .b-table th { background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:7px 10px; text-align:left; font-weight:700; white-space:nowrap; font-size:10px; letter-spacing:.5px; }
                .b-table td { padding:7px 10px; border-bottom:1px solid #f0fdfa; vertical-align:middle; max-width:150px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .b-table tr:last-child td { border-bottom:none; }
                .b-table tr:nth-child(even) td { background:#f8fffd; }
                .b-table tr:hover td { background:#e6fef9; }
                .b-table .err-row td { background:#fff5f5 !important; }
                .b-bdg { display:inline-flex; align-items:center; gap:3px; font-size:9px; font-weight:700; padding:2px 7px; border-radius:100px; white-space:nowrap; }
                .b-bdg.ok  { background:#f0fdfa; color:#0d9488; border:1px solid #b2f5ea; }
                .b-bdg.err { background:#fff5f5; color:#ef4444; border:1px solid #fecaca; }
                .b-url { font-size:9px; color:#14b8a6; text-decoration:none; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:130px; }
                .b-url:hover { text-decoration:underline; }

                .b-bulk-stats { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0; }
                .b-stat-chip { display:flex; align-items:center; gap:5px; padding:5px 11px; border-radius:100px; font-size:11px; font-weight:700; }
                .b-progress-bar { height:6px; background:#e2f4f2; border-radius:100px; overflow:hidden; margin:10px 0; }
                .b-progress-fill { height:100%; background:linear-gradient(90deg,#064e3b,#14b8a6); border-radius:100px; transition:width .3s ease; }

                .b-list-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid rgba(20,184,166,.1); background:linear-gradient(to right,#f0fdfa,white); }
                .b-list-hdr h3 { font-size:13px; font-weight:700; color:#0f172a; margin:0; }
                .b-list-hdr p  { font-size:11px; color:#64748b; margin:2px 0 0; }
                .b-row { display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid #f5fffe; transition:background .15s; }
                .b-row:last-child { border-bottom:none; }
                .b-row:hover { background:#f0fdfa; }
                .b-cover { width:54px; height:40px; border-radius:8px; flex-shrink:0; background:#e8f5f3; overflow:hidden; display:flex; align-items:center; justify-content:center; }
                .b-cover img { width:100%; height:100%; object-fit:cover; display:block; }
                .b-info { flex:1; min-width:0; }
                .b-title { font-size:13px; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .b-cat  { font-size:10px; font-weight:600; color:#14b8a6; margin-top:1px; }
                .b-meta { font-size:10px; color:#94a3b8; margin-top:1px; }
                .b-status-pill { flex-shrink:0; font-size:10px; font-weight:600; padding:2px 8px; border-radius:100px; }
                .b-icon-btn { flex-shrink:0; width:30px; height:30px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:1.5px solid; cursor:pointer; transition:all .18s; background:none; }
                .b-icon-btn:disabled { opacity:.5; cursor:not-allowed; }
                .b-icon-btn.teal { border-color:#b2f5ea; background:#f0fdfa; color:#0d9488; }
                .b-icon-btn.teal:hover { background:#0d9488; color:white; border-color:#0d9488; }
                .b-icon-btn.red  { border-color:#fecaca; background:#fff5f5; color:#ef4444; }
                .b-icon-btn.red:hover  { background:#ef4444; color:white; border-color:#ef4444; }
                .b-refresh-btn { display:flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:#0d9488; background:#f0fdfa; border:1px solid #b2f5ea; padding:5px 10px; border-radius:8px; cursor:pointer; }
                .b-refresh-btn:hover { background:#ccfbf1; }

                .b-backdrop { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; padding:12px; background:rgba(0,0,0,.52); backdrop-filter:blur(7px); }
                .b-modal { background:white; border-radius:18px; width:100%; max-width:580px; max-height:92vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.22); animation:b-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
                .b-preview-modal { background:white; border-radius:18px; width:100%; max-width:480px; max-height:88vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:b-modal .3s cubic-bezier(.34,1.56,.64,1) both; }
                .b-modal-hdr { padding:14px 18px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:5; background:linear-gradient(135deg,#064e3b,#0f766e,#14b8a6); }
                .b-modal-hdr p  { color:rgba(255,255,255,.6); font-size:10px; font-weight:600; letter-spacing:1.2px; text-transform:uppercase; margin:0 0 2px; }
                .b-modal-hdr h2 { font-size:15px; font-weight:700; color:white; margin:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:420px; }
                .b-modal-close { width:28px; height:28px; border-radius:50%; border:none; color:white; cursor:pointer; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.15); flex-shrink:0; }
                .b-modal-close:hover { background:rgba(255,255,255,.28); }
                .b-modal-body { padding:14px 18px 18px; }

                .b-err { display:flex; align-items:flex-start; gap:7px; background:#fff5f5; border:1px solid #fecaca; color:#ef4444; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; line-height:1.5; }
                .b-ok  { display:flex; align-items:center; gap:7px; background:#f0fdfa; border:1px solid #b2f5ea; color:#0d9488; font-size:12px; padding:8px 12px; border-radius:9px; margin-bottom:10px; }
                .b-cancel-btn { flex:1; border:1.5px solid #e2e8f0; background:#f8fafc; color:#64748b; font-weight:600; font-size:13px; padding:9px; border-radius:9px; cursor:pointer; transition:background .2s; font-family:inherit; }
                .b-cancel-btn:hover { background:#f1f5f9; }
                .b-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#064e3b,#0f766e); color:white; padding:10px 22px; border-radius:100px; font-size:13px; font-weight:600; box-shadow:0 8px 30px rgba(13,148,136,.45); z-index:99999; display:flex; align-items:center; gap:7px; white-space:nowrap; animation:b-toast .4s ease both; pointer-events:none; }

                .b-format-hint { background:linear-gradient(135deg,#f0fdfa,#e6fef9); border:1px solid #b2f5ea; border-radius:10px; padding:10px 12px; margin-bottom:12px; font-size:11px; color:#064e3b; line-height:1.75; }
                .b-format-hint code { background:#fff; border:1px solid #b2f5ea; border-radius:4px; padding:1px 5px; font-size:10px; color:#064e3b; font-family:monospace; }

                @media (max-width:480px) { .b-layout { padding:10px; gap:10px; } .b-body { padding:10px 12px 12px; } .b-card-hdr { padding:12px 14px; } }
            `}</style>

            <div className="b-root">
                <div className="b-topbar">
                    <Link href="/admin/auth/dashboard"><ArrowLeft size={13} /> Dashboard</Link>
                    <ChevronRight size={11} style={{ color: "#cbd5e1" }} />
                    <span className="b-topbar-cur">Blogs</span>
                </div>

                <div className="b-layout">
                    {/* ══ LEFT CARD ══ */}
                    <div className="b-card">
                        <div className="b-card-hdr">
                            <div>
                                <h2>{activeTab === "manual" ? "Add Blog Post" : "Bulk Import via Excel"}</h2>
                                <p>{activeTab === "manual" ? "Publish a new article or health tip" : "Import multiple posts at once"}</p>
                            </div>
                            <BookOpen size={16} color="rgba(255,255,255,.7)" />
                        </div>

                        <div className="b-body">
                            <div className="b-tabs">
                                <button className={`b-tab ${activeTab === "manual" ? "active" : ""}`} onClick={() => setActiveTab("manual")}>
                                    <FileText size={13} /> Manual Entry
                                </button>
                                <button className={`b-tab ${activeTab === "bulk" ? "active" : ""}`} onClick={() => setActiveTab("bulk")}>
                                    <FileSpreadsheet size={13} /> Bulk Import
                                </button>
                            </div>

                            {/* ══ MANUAL FORM ══ */}
                            {activeTab === "manual" && (
                                <form onSubmit={handleSubmit}>
                                    <div className="b-row2">
                                        <div className="b-field">
                                            <label className="b-lbl">Blog Title</label>
                                            <div className="b-inp-wrap">
                                                <div className="b-inp-icon"><Type size={13} /></div>
                                                <input type="text" className="b-inp" placeholder="e.g. Heart Health Tips" required
                                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="b-field">
                                            <label className="b-lbl">Author Name</label>
                                            <div className="b-inp-wrap">
                                                <div className="b-inp-icon"><User size={13} /></div>
                                                <input type="text" className="b-inp" placeholder="Dr. Anjali Sharma" required
                                                    value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="b-field">
                                        <label className="b-lbl"><Tag size={10} style={{ display: "inline", marginRight: 4 }} />Category</label>
                                        <CatPills value={form.category} onChange={cat => setForm({ ...form, category: cat })} />
                                    </div>
                                    <div className="b-field">
                                        <label className="b-lbl">Short Excerpt</label>
                                        <div className="b-inp-wrap">
                                            <div className="b-inp-icon top"><FileText size={13} /></div>
                                            <textarea className="b-inp ta" placeholder="Shown as preview on blog listing page..." required
                                                value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="b-divider" />
                                    <div className="b-field" style={{ marginBottom: 6 }}>
                                        <label className="b-lbl" style={{ marginBottom: 8 }}>
                                            📝 Blog Sections
                                            <span style={{ color: "#94a3b8", textTransform: "none", fontWeight: 400, letterSpacing: 0, marginLeft: 6 }}>
                                                — each section = one heading block on the page
                                            </span>
                                        </label>
                                        <SectionsEditor arr={sections} setArr={setSections} />
                                    </div>
                                    <div className="b-divider" />
                                    <div className="b-field" style={{ marginBottom: 0 }}>
                                        <label className="b-lbl"><ImagePlus size={10} style={{ display: "inline", marginRight: 4 }} />Cover Image <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(max 4MB)</span></label>
                                        {!coverPreview ? (
                                            <div className={`b-upload ${dragOver ? "drag" : ""}`}
                                                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                                onDragLeave={() => setDragOver(false)}
                                                onDrop={e => { e.preventDefault(); setDragOver(false); handleCover(e.dataTransfer.files[0]); }}>
                                                <input type="file" accept="image/*" ref={coverRef} onChange={e => handleCover(e.target.files[0])} />
                                                <ImagePlus size={20} color="#14b8a6" />
                                                <div className="b-upload-t">Click or drag cover image</div>
                                                <div className="b-upload-s">JPG · PNG · WebP · max 4MB</div>
                                            </div>
                                        ) : (
                                            <div className="b-img-prev">
                                                <img src={coverPreview} alt="cover" />
                                                <div className="b-img-overlay">
                                                    <div className="b-prev-badge"><CheckCircle2 size={9} /> Cover ready</div>
                                                    <button type="button" className="b-remove-btn" onClick={() => { setCoverFile(null); setCoverPreview(null); if (coverRef.current) coverRef.current.value = ""; }}>
                                                        <X size={9} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {error && <div className="b-err" style={{ marginTop: 10 }}><X size={12} style={{ flexShrink: 0, marginTop: 1 }} /><span>{error}</span></div>}
                                    <button type="submit" className="b-submit" disabled={loading}>
                                        {loading ? <><Loader2 size={15} style={{ animation: "b-spin 1s linear infinite" }} /> Publishing...</> : <><Sparkles size={15} /> Publish Blog</>}
                                    </button>
                                </form>
                            )}

                            {/* ══ BULK IMPORT ══ */}
                            {activeTab === "bulk" && (
                                <div>
                                    <div className="b-format-hint">
                                        <b>📋 Content Column Format — Use ## for headings:</b><br />
                                        <code>## The Road to Recovery</code><br />
                                        <code>Surgery is just the beginning...</code><br />
                                        <code>## First 24 Hours</code><br />
                                        <code>Rest is paramount. Pain is normal...</code><br />
                                        <br />
                                        Har <code>## Heading</code> automatically ek alag section ban jaata hai blog page pe.
                                    </div>

                                    <div style={{ background: "linear-gradient(135deg,#f0fdfa,#e6fef9)", border: "1px solid #b2f5ea", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                            <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>1</span>
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: 12, color: "#0d9488" }}>Download the Template</span>
                                        </div>
                                        <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 4px", lineHeight: 1.6 }}>
                                            Template mein content column ka example <b>## Heading format</b> mein already filled hai.
                                        </p>
                                        <button className="b-dl-btn" onClick={downloadTemplate}><Download size={12} /> Download Excel Template</button>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <div style={{ width: 22, height: 22, background: "linear-gradient(135deg,#064e3b,#14b8a6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>2</span>
                                        </div>
                                        <span style={{ fontWeight: 700, fontSize: 12, color: "#0d9488" }}>Upload Filled Spreadsheet</span>
                                    </div>

                                    {!bulkFile ? (
                                        <div className={`b-bulk-drop ${bulkDragOver ? "drag" : ""}`}
                                            onDragOver={e => { e.preventDefault(); setBulkDragOver(true); }}
                                            onDragLeave={() => setBulkDragOver(false)}
                                            onDrop={e => { e.preventDefault(); setBulkDragOver(false); handleExcelFile(e.dataTransfer.files[0]); }}>
                                            <input type="file" accept=".xlsx,.xls,.csv" onChange={e => handleExcelFile(e.target.files[0])} />
                                            <div className="b-bulk-drop-icon"><FileSpreadsheet size={22} color="white" /></div>
                                            <h3>Drop your Excel file here</h3>
                                            <p>or click to browse · .xlsx · .xls · .csv</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdfa", border: "1px solid #b2f5ea", borderRadius: 9, padding: "8px 12px", marginBottom: 10 }}>
                                                <FileSpreadsheet size={15} color="#0d9488" />
                                                <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bulkFile.name}</span>
                                                <button onClick={resetBulk} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", display: "flex", padding: 0 }}><X size={13} /></button>
                                            </div>
                                            {bulkRows.length > 0 && (
                                                <div className="b-bulk-stats">
                                                    <div className="b-stat-chip" style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #b2f5ea" }}><Table2 size={11} /> {bulkRows.length} rows</div>
                                                    <div className="b-stat-chip" style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #b2f5ea" }}><CheckCircle2 size={11} /> {validRows.length} valid</div>
                                                    {invalidRows.length > 0 && <div className="b-stat-chip" style={{ background: "#fff5f5", color: "#ef4444", border: "1px solid #fecaca" }}><AlertCircle size={11} /> {invalidRows.length} invalid</div>}
                                                </div>
                                            )}
                                            {bulkRows.length > 0 && (
                                                <>
                                                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", color: "#0d9488", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
                                                        <Eye size={11} /> Preview — click row to see sections
                                                    </div>
                                                    <div className="b-table-wrap">
                                                        <table className="b-table">
                                                            <thead><tr><th>#</th><th>Status</th><th>Title</th><th>Author</th><th>Sections</th><th>Cover</th></tr></thead>
                                                            <tbody>
                                                                {bulkRows.map((row, i) => (
                                                                    <tr key={i} className={row.valid ? "" : "err-row"} style={{ cursor: "pointer" }} onClick={() => setPreviewRow(row)}>
                                                                        <td style={{ color: "#94a3b8", fontSize: 10 }}>{i + 1}</td>
                                                                        <td>{row.valid ? <span className="b-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="b-bdg err"><X size={8} /> Error</span>}</td>
                                                                        <td style={{ fontWeight: 600, color: "#0f172a" }}>{row.title}</td>
                                                                        <td style={{ color: "#64748b" }}>{row.author}</td>
                                                                        <td><span className="b-bdg ok">{row.sections?.length || 0} sections</span></td>
                                                                        <td>{row.coverImage ? <a className="b-url" href={row.coverImage} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{row.coverImage}</a> : <span style={{ color: "#fca5a5", fontSize: 10 }}>missing</span>}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {invalidRows.length > 0 && (
                                                        <div style={{ marginTop: 10, background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 9, padding: "10px 12px" }}>
                                                            <div style={{ fontWeight: 700, fontSize: 11, color: "#ef4444", marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={12} /> Validation Issues</div>
                                                            {invalidRows.map((row, i) => (
                                                                <div key={i} style={{ fontSize: 10, color: "#ef4444", marginBottom: 4 }}>
                                                                    <b>"{row.title || "untitled"}":</b> {row.errors.join("; ")}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {bulkErrors.filter(() => !bulkDone).map((err, i) => (
                                                <div key={i} className="b-err" style={{ marginTop: 8 }}><AlertCircle size={12} /> {err}</div>
                                            ))}
                                            {bulkImporting && (
                                                <div style={{ marginTop: 10 }}>
                                                    <div style={{ fontSize: 11, color: "#0d9488", fontWeight: 600, marginBottom: 4 }}>Importing {bulkProgress.done} / {bulkProgress.total}...</div>
                                                    <div className="b-progress-bar"><div className="b-progress-fill" style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} /></div>
                                                </div>
                                            )}
                                            {bulkDone && (
                                                <div className="b-ok" style={{ marginTop: 10 }}>
                                                    <CheckCircle2 size={13} />
                                                    <span>Imported {validRows.length - bulkErrors.length} of {validRows.length} posts!{bulkErrors.length > 0 && ` (${bulkErrors.length} failed)`}</span>
                                                </div>
                                            )}
                                            {!bulkDone && validRows.length > 0 && (
                                                <button className="b-submit" style={{ marginTop: 14 }} disabled={bulkImporting} onClick={handleBulkImport}>
                                                    {bulkImporting ? <><Loader2 size={15} style={{ animation: "b-spin 1s linear infinite" }} /> Importing {bulkProgress.done}/{bulkProgress.total}...</> : <><Upload size={15} /> Import {validRows.length} Post{validRows.length !== 1 ? "s" : ""} <ChevronRight size={13} /></>}
                                                </button>
                                            )}
                                            {bulkDone && <button className="b-submit" style={{ marginTop: 10 }} onClick={resetBulk}><RefreshCw size={14} /> Import Another File</button>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT CARD: BLOGS LIST ══ */}
                    <div className="b-card">
                        <div className="b-list-hdr">
                            <div><h3>All Blog Posts</h3><p>{blogs.length} post{blogs.length !== 1 ? "s" : ""} published</p></div>
                            <button className="b-refresh-btn" onClick={fetchBlogs} disabled={listLoading}>
                                <RefreshCw size={11} style={listLoading ? { animation: "b-spin 1s linear infinite" } : {}} /> Refresh
                            </button>
                        </div>
                        <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}>
                            {listLoading ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 0" }}>
                                    <Loader2 style={{ width: 24, height: 24, color: "#14b8a6", animation: "b-spin 1s linear infinite" }} />
                                </div>
                            ) : blogs.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 12 }}>No blog posts yet.</div>
                            ) : blogs.map(blog => (
                                <div key={blog.id} className="b-row">
                                    <div className="b-cover">
                                        {blog.coverImage ? <img src={`${API_BLOGS}/${blog.id}/cover`} alt={blog.title} onError={e => { e.target.style.display = "none"; }} /> : <BookOpen size={16} color="#0d9488" />}
                                    </div>
                                    <div className="b-info">
                                        <div className="b-title">{blog.title}</div>
                                        <div className="b-cat">{blog.category || "Uncategorized"}</div>
                                        <div className="b-meta">{blog.author && <span>✍️ {blog.author}</span>}{blog.createdAt && <span style={{ marginLeft: 6 }}>📅 {formatDate(blog.createdAt)}</span>}</div>
                                    </div>
                                    <span className="b-status-pill" style={{ background: "#f0fdfa", color: "#0d9488", border: "1px solid #b2f5ea" }}>{blog.status || "draft"}</span>
                                    <button className="b-icon-btn teal" title="Edit" onClick={() => openEdit(blog)}><Pencil size={12} /></button>
                                    <button className="b-icon-btn red" title="Delete" disabled={deletingId === blog.id} onClick={() => handleDelete(blog.id)}>
                                        {deletingId === blog.id ? <Loader2 size={12} style={{ animation: "b-spin 1s linear infinite" }} /> : <Trash2 size={12} />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {/* ══ ROW PREVIEW MODAL ══ */}
            {previewRow && (
                <div className="b-backdrop" onClick={() => setPreviewRow(null)}>
                    <div className="b-preview-modal" onClick={e => e.stopPropagation()}>
                        <div className="b-modal-hdr">
                            <div style={{ minWidth: 0 }}><p>Row Preview</p><h2>{previewRow.title || "Untitled"}</h2></div>
                            <button className="b-modal-close" onClick={() => setPreviewRow(null)}><X size={13} /></button>
                        </div>
                        <div className="b-modal-body">
                            {previewRow.coverImage && <img src={previewRow.coverImage} alt="cover" style={{ width: "100%", height: 130, objectFit: "cover", borderRadius: 10, marginBottom: 10, display: "block" }} onError={e => { e.target.style.display = "none"; }} />}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                                <span className="b-bdg ok">{previewRow.category}</span>
                                <span className="b-bdg ok" style={{ background: "#f0f9ff", color: "#0369a1", borderColor: "#bae6fd" }}>✍️ {previewRow.author}</span>
                                {previewRow.valid ? <span className="b-bdg ok"><CheckCircle2 size={8} /> Valid</span> : <span className="b-bdg err"><X size={8} /> Has errors</span>}
                                <span className="b-bdg ok">{previewRow.sections?.length || 0} sections</span>
                            </div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>Sections (blog pe aise dikhenge):</p>
                            {previewRow.sections?.slice(0, 5).map((s, i) => (
                                <div key={i} className="b-sec-preview">
                                    {s.heading && <div className="b-sec-preview-h">▌ {s.heading}</div>}
                                    {s.body && <div className="b-sec-preview-b">{s.body.slice(0, 120)}{s.body.length > 120 ? "…" : ""}</div>}
                                </div>
                            ))}
                            {(previewRow.sections?.length || 0) > 5 && <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>+ {previewRow.sections.length - 5} more sections</div>}
                            {previewRow.errors.length > 0 && (
                                <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 9, padding: "8px 12px", marginTop: 10 }}>
                                    {previewRow.errors.map((err, i) => <div key={i} style={{ fontSize: 11, color: "#ef4444", display: "flex", alignItems: "center", gap: 5 }}><AlertCircle size={10} /> {err}</div>)}
                                </div>
                            )}
                            <button className="b-cancel-btn" style={{ marginTop: 10, width: "100%" }} onClick={() => setPreviewRow(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══ EDIT MODAL ══ */}
            {editBlog && (
                <div className="b-backdrop" onClick={closeEdit}>
                    <div className="b-modal" onClick={e => e.stopPropagation()}>
                        <div className="b-modal-hdr">
                            <div style={{ minWidth: 0 }}><p>Editing Blog Post</p><h2>{editBlog.title}</h2></div>
                            <button className="b-modal-close" onClick={closeEdit}><X size={13} /></button>
                        </div>
                        <div className="b-modal-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className="b-row2">
                                    <div className="b-field">
                                        <label className="b-lbl">Blog Title</label>
                                        <div className="b-inp-wrap"><div className="b-inp-icon"><Type size={13} /></div>
                                            <input type="text" className="b-inp" required value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="b-field">
                                        <label className="b-lbl">Author Name</label>
                                        <div className="b-inp-wrap"><div className="b-inp-icon"><User size={13} /></div>
                                            <input type="text" className="b-inp" required value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="b-field">
                                    <label className="b-lbl">Category</label>
                                    <CatPills value={editForm.category} onChange={cat => setEditForm({ ...editForm, category: cat })} />
                                </div>
                                <div className="b-field">
                                    <label className="b-lbl">Short Excerpt</label>
                                    <div className="b-inp-wrap"><div className="b-inp-icon top"><FileText size={13} /></div>
                                        <textarea className="b-inp ta" value={editForm.excerpt} onChange={e => setEditForm({ ...editForm, excerpt: e.target.value })} />
                                    </div>
                                </div>
                                <div className="b-divider" />
                                <div className="b-field" style={{ marginBottom: 6 }}>
                                    <label className="b-lbl" style={{ marginBottom: 8 }}>📝 Blog Sections</label>
                                    <SectionsEditor arr={editSections} setArr={setEditSections} />
                                </div>
                                <div className="b-divider" />
                                <div className="b-field">
                                    <label className="b-lbl">Replace Cover <span style={{ color: "#94a3b8", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                                    {editCoverPreview ? (
                                        <div className="b-img-prev">
                                            <img src={editCoverPreview} alt="new cover" />
                                            <div className="b-img-overlay">
                                                <div className="b-prev-badge"><CheckCircle2 size={9} /> New cover</div>
                                                <button type="button" className="b-remove-btn" onClick={() => { setEditCoverFile(null); setEditCoverPreview(null); }}><X size={9} /> Remove</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="b-upload" style={{ padding: "10px 12px" }}>
                                            <input type="file" accept="image/*" ref={editCoverRef} onChange={e => handleEditCover(e.target.files[0])} />
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#0d9488", fontSize: 12, fontWeight: 600 }}><ImagePlus size={14} /> Click to upload new cover</div>
                                            <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>Leave empty to keep existing</p>
                                        </div>
                                    )}
                                </div>
                                {editError && <div className="b-err"><X size={12} style={{ flexShrink: 0 }} /><span>{editError}</span></div>}
                                {editSuccess && <div className="b-ok"><CheckCircle2 size={12} /> Updated successfully!</div>}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button type="button" className="b-cancel-btn" onClick={closeEdit}>Cancel</button>
                                    <button type="submit" className="b-submit" disabled={editLoading} style={{ flex: 2, marginTop: 0, padding: "9px" }}>
                                        {editLoading ? <><Loader2 size={13} style={{ animation: "b-spin 1s linear infinite" }} /> Saving...</> : <><Save size={13} /> Save Changes</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {success && <div className="b-toast"><CheckCircle2 size={16} /> Blog published successfully!</div>}
        </>
    );
}